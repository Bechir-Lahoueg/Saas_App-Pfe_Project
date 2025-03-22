const axios = require('axios');
const Payment = require('../models/Payment');

const KONNECT_API_URL = process.env.KONNECT_API_URL;
const API_KEY = process.env.KONNECT_API_KEY;

const initiatePayment = async (paymentData) => {
  try {
    const webhookUrl = `${process.env.BASE_URL}/api/payments/webhook`; // URL du webhook
    const payload = {
      ...paymentData,
      webhook: webhookUrl, // Ajoutez l'URL du webhook
      silentWebhook: true, // Konnect enverra des notifications silencieuses
    };

    console.log('Sending payment data to Konnect:', payload);
    const response = await axios.post(`${KONNECT_API_URL}/payments/init-payment`, payload, {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
      },
    });

    console.log('Konnect API response:', response.data);

    // Sauvegarder les détails du paiement dans la base de données
    const payment = new Payment({
      orderId: paymentData.orderId,
      amount: paymentData.amount,
      status: 'pending',
      paymentMethod: 'wallet', // Utiliser uniquement le portefeuille
      receiverWalletId: paymentData.receiverWalletId,
      customerDetails: {
        firstName: paymentData.firstName,
        lastName: paymentData.lastName,
        email: paymentData.email,
        phoneNumber: paymentData.phoneNumber,
        address: paymentData.address,
        city: paymentData.city,
        state: paymentData.state,
        postalCode: paymentData.postalCode,
      },
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