const axios = require('axios');
const Payment = require('../models/Payment');
const { registerTenant } = require('./tenantRegistrationService');

const KONNECT_API_URL = process.env.KONNECT_API_URL;
const API_KEY = process.env.KONNECT_API_KEY;

const initiatePayment = async (paymentData) => {
  try {
    const payload = {
      receiverWalletId: paymentData.receiverWalletId,
      token: paymentData.token,
      amount: paymentData.amount,
      type: paymentData.type || "immediate",
      description: paymentData.description,
      acceptedPaymentMethods: paymentData.acceptedPaymentMethods || ["wallet", "bank_card", "e-DINAR"],
      lifespan: paymentData.lifespan || 10,
      addPaymentFeesToAmount: paymentData.addPaymentFeesToAmount || true,
      webhook: `${process.env.BASE_URL}/api/payments/webhook`,
      silentWebhook: true,
      successUrl: "http://localhost:5173/paiement?step=3&status=success",
      failUrl: "http://localhost:5173/paiement?step=3&status=failed",
      theme: paymentData.theme || "dark"
    };

    const response = await axios.post(`${KONNECT_API_URL}/payments/init-payment`, payload, {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
      },
    });

    console.log(`Payment initiated with ID: ${response.data.paymentRef}`);

    // Créer l'enregistrement de paiement
    const payment = new Payment({
      orderId: paymentData.orderId,
      amount: paymentData.amount,
      status: 'pending',
      paymentMethod: 'unknown',
      receiverWalletId: paymentData.receiverWalletId,
      konnectPaymentId: response.data.paymentRef,
      konnectPaymentUrl: response.data.payUrl
    });

    // Si c'est un paiement d'enregistrement, stocker temporairement les données d'enregistrement
    if (paymentData.isTenantRegistration) {
      payment.registrationData = paymentData.registrationData;
    }

    await payment.save();
    return response.data;
  } catch (error) {
    console.error('Payment initiation failed:', error.response?.data || error.message);
    throw error;
  }
};

const verifyPayment = async (paymentRef) => {
  try {
    console.log(`Verifying payment: ${paymentRef}`);
    const response = await axios.get(`${KONNECT_API_URL}/payments/${paymentRef}`, {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
      },
    });

    const result = response.data;
    return {
      success: result.payment.status === 'completed',
      payment: result.payment,
      status: result.payment.status
    };
  } catch (error) {
    console.error('Payment verification failed:', error.response?.data || error.message);
    throw error;
  }
};

const completePayment = async (paymentRef) => {
  try {
    console.log(`Completing payment: ${paymentRef}`);
    const verificationResponse = await verifyPayment(paymentRef);

    // Inclure explicitement le champ registrationData qui est défini avec select: false
    const payment = await Payment.findOne({ konnectPaymentId: paymentRef }).select('+registrationData');

    if (!payment) {
      throw new Error('Payment not found in database');
    }

    payment.status = verificationResponse.payment.status;

    // Handle transaction data for payment method only
    const transactions = verificationResponse.payment.transactions;
    if (transactions && transactions.length > 0) {
      if (transactions[0].method) {
        payment.paymentMethod = transactions[0].method;
      } else if (transactions[0].type) {
        payment.paymentMethod = transactions[0].type;
      }
    }

    // Si le paiement est complété et que nous avons des données d'enregistrement
    if (verificationResponse.payment.status === 'completed' && payment.registrationData) {
      try {
        payment.completionDate = new Date();

        // Enregistrer le locataire avec les données stockées temporairement
        const registrationResult = await registerTenant(payment.registrationData);

        // Stocker l'ID d'enregistrement du locataire
        payment.tenantRegistrationId = registrationResult.tenantId;

        // Nettoyer les données d'enregistrement après utilisation
        const { firstName, lastName, phone, email } = payment.registrationData || {};
        payment.registrationData = { firstName, lastName, phone, email };

        console.log('Tenant successfully registered with ID:', registrationResult.tenantId);
      } catch (registrationError) {
        console.error('Failed to register tenant:', registrationError);
        // Même en cas d'erreur, nous nettoyons les données
        payment.registrationData = undefined;
        throw new Error(`Payment completed but tenant registration failed: ${registrationError.message}`);
      }
    } else if (verificationResponse.payment.status === 'completed') {
      payment.completionDate = new Date();
    }

    await payment.save();
    console.log(`Payment ${paymentRef} completed with status: ${payment.status}`);

    return {
      success: verificationResponse.success,
      payment: {
        _id: payment._id,
        orderId: payment.orderId,
        amount: payment.amount,
        status: payment.status,
        paymentMethod: payment.paymentMethod,
        receiverWalletId: payment.receiverWalletId,
        konnectPaymentId: payment.konnectPaymentId,
        konnectPaymentUrl: payment.konnectPaymentUrl,
        paymentDate: payment.paymentDate,
        completionDate: payment.completionDate,
        tenantRegistrationId: payment.tenantRegistrationId,
        createdAt: payment.createdAt,
        updatedAt: payment.updatedAt
      },
      status: verificationResponse.payment.status
    };
  } catch (error) {
    console.error('Payment completion failed:', error.message);
    throw error;
  }
};

const getPaymentDetails = async (orderId) => {
  try {
    const payment = await Payment.findOne({ orderId });
    if (!payment) {
      throw new Error('Payment not found');
    }
    return payment;
  } catch (error) {
    console.error(`Failed to retrieve payment details for order ${orderId}:`, error.message);
    throw error;
  }
};

module.exports = {
  initiatePayment,
  verifyPayment,
  completePayment,
  getPaymentDetails,
};