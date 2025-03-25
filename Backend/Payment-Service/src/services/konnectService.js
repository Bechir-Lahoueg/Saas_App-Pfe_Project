const axios = require('axios');
const Payment = require('../models/Payment');

const KONNECT_API_URL = process.env.KONNECT_API_URL;
const API_KEY = process.env.KONNECT_API_KEY;

const initiatePayment = async (paymentData) => {
  try {
    // Configuration minimale pour initialiser un paiement
    const payload = {
      receiverWalletId: paymentData.receiverWalletId,
      token: paymentData.token,
      amount: paymentData.amount,
      type: paymentData.type || "immediate",
      description: paymentData.description,
      acceptedPaymentMethods: paymentData.acceptedPaymentMethods || ["wallet", "bank_card", "e-DINAR"],
      lifespan: paymentData.lifespan || 10,
      checkoutForm: true,
      addPaymentFeesToAmount: paymentData.addPaymentFeesToAmount || true,
      webhook: `${process.env.BASE_URL}/api/payments/webhook`,
      silentWebhook: true,
      successUrl: paymentData.successUrl || "https://gateway.sandbox.konnect.network/payment-success",
      failUrl: paymentData.failUrl || "https://gateway.sandbox.konnect.network/payment-success",
      theme: paymentData.theme || "dark"
    };

    console.log('Sending payment data to Konnect:', payload);
    const response = await axios.post(`${KONNECT_API_URL}/payments/init-payment`, payload, {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
      },
    });

    console.log('Konnect API response:', response.data);

    // Sauvegarder les détails minimaux du paiement dans la base de données
    const payment = new Payment({
      orderId: paymentData.orderId,
      amount: paymentData.amount,
      status: 'pending',
      paymentMethod: 'unknown', // Sera mis à jour après completion
      receiverWalletId: paymentData.receiverWalletId,
      customerDetails: {}, // Vide car nous n'avons pas les détails du client à ce stade
      konnectPaymentId: response.data.paymentId,
      konnectPaymentUrl: response.data.payUrl,
    });

    await payment.save();
    return response.data;
  } catch (error) {
    console.error('Error initiating payment:', error.response ? error.response.data : error.message);
    throw error;
  }
};

const verifyPayment = async (paymentId) => {
  try {
    console.log('Verifying payment with ID:', paymentId);
    const response = await axios.get(`${KONNECT_API_URL}/payments/${paymentId}`, {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
      },
    });

    const result = response.data;
    console.log('Konnect API verification response:', result);

    // Vérifier si le tableau des transactions est vide
    if (result.payment.transactions.length === 0) {
      console.warn('No transactions found for this payment.');
    }

    // Vérifier le statut global du paiement
    if (result.payment.status === 'completed') {
      return { success: true, payment: result.payment };
    } else {
      return { success: false, payment: result.payment, reason: `Payment status: ${result.payment.status}` };
    }
  } catch (error) {
    console.error('Error verifying payment:', error.response ? error.response.data : error.message);
    throw error;
  }
};
  
const completePayment = async (paymentId) => {
  try {
    // 1. Vérifier le statut du paiement dans Konnect
    const verificationResponse = await verifyPayment(paymentId);

    // 2. Mettre à jour le paiement dans la base de données
    const payment = await Payment.findOne({ konnectPaymentId: paymentId });

    if (!payment) {
      throw new Error('Payment not found in database');
    }

    if (verificationResponse.success) {
      payment.status = 'completed';
      payment.completionDate = new Date();
      
      // Mettre à jour la méthode de paiement utilisée si disponible dans la réponse
      if (verificationResponse.payment.transactions && 
          verificationResponse.payment.transactions.length > 0 &&
          verificationResponse.payment.transactions[0].paymentMethod) {
        payment.paymentMethod = verificationResponse.payment.transactions[0].paymentMethod;
      }
      
      // Mettre à jour les détails du client si disponibles dans la réponse
      if (verificationResponse.payment.customerDetails) {
        payment.customerDetails = verificationResponse.payment.customerDetails;
      }
      
      payment.metadata.verificationResponse = verificationResponse;
      await payment.save();
      return { success: true, payment };
    } else {
      payment.status = 'failed';
      payment.metadata.verificationResponse = verificationResponse;
      await payment.save();
      return { success: false, payment, reason: verificationResponse.reason };
    }
  } catch (error) {
    console.error('Error completing payment:', error.message);
    throw error;
  }
};

// Fonction pour obtenir les détails d'un paiement depuis notre base de données
const getPaymentDetails = async (orderId) => {
  try {
    const payment = await Payment.findOne({ orderId });
    if (!payment) {
      throw new Error('Payment not found');
    }
    return payment;
  } catch (error) {
    console.error('Error getting payment details:', error.message);
    throw error;
  }
};

module.exports = {
  initiatePayment,
  verifyPayment,
  completePayment,
  getPaymentDetails,
};