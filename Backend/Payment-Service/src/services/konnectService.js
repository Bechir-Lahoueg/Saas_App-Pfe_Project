// src/services/konnectService.js
const axios = require('axios');
const paymentService = require('./paymentService');

const KONNECT_API_URL = process.env.KONNECT_API_URL;
const API_KEY = process.env.KONNECT_API_KEY;

/**
 * Initialise un paiement via l'API Konnect
 * @param {Object} paymentData - Données du paiement
 */
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
      webhook: `${process.env.BASE_URL || 'http://localhost:5001'}/payments/webhook`,
      silentWebhook: true,
      successUrl: paymentData.successUrl || "http://localhost:5173/paiement?step=3&status=success",
      failUrl: paymentData.failUrl || "http://localhost:5173/paiement?step=3&status=failed",
      theme: paymentData.theme || "dark"
    };

    const response = await axios.post(`${KONNECT_API_URL}/payments/init-payment`, payload, {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
      },
    });

    // Créer l'enregistrement de paiement en utilisant paymentService
    await paymentService.createPayment({
      orderId: paymentData.orderId || `ORDER-${Date.now()}`,
      amount: paymentData.amount,
      status: 'pending',
      paymentMethod: 'unknown',
      receiverWalletId: paymentData.receiverWalletId,
      konnectPaymentId: response.data.paymentRef,
      konnectPaymentUrl: response.data.payUrl,
      registrationData: paymentData.isTenantRegistration ? paymentData.registrationData : undefined
    });

    return response.data;
  } catch (error) {
    console.error('Payment initiation failed:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Vérifie le statut d'un paiement
 * @param {String} paymentRef - ID du paiement
 */
const verifyPayment = async (paymentRef) => {
  try {
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

module.exports = {
  initiatePayment,
  verifyPayment
};