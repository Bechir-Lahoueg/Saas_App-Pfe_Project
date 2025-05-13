// src/services/paymentService.js
const axios = require('axios');
const konnectApiService = require("./konnectApiService");
const Payment = require("../models/Payment");
const {registerTenant} = require("./tenantRegistrationService");

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
      successUrl: paymentData.successUrl || "http://localhost:5173/paiement?step=3&status=success",
      failUrl: paymentData.failUrl || "http://localhost:5173/paiement?step=3&status=failed",
      theme: paymentData.theme || "dark"
    };

    const response = await axios.post(`${KONNECT_API_URL}/payments/init-payment`, payload, {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
      },

    },
    );

    // Créer l'enregistrement de paiement en utilisant paymentService
    await createPayment({
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

const completePayment = async (paymentRef) => {
  try {
    const verificationResponse = await konnectApiService.verifyPayment(paymentRef);
    const payment = await Payment.findOne({ konnectPaymentId: paymentRef }).select('+registrationData');

    if (!payment) {
      throw new Error('Payment not found in database');
    }

    payment.status = verificationResponse.payment.status;

    // Extraire la méthode de paiement
    const transactions = verificationResponse.payment.transactions;
    if (transactions?.length > 0) {
      payment.paymentMethod = transactions[0].method || transactions[0].type || 'unknown';
    }

    // Gérer l'enregistrement du locataire si le paiement est complété
    if (verificationResponse.payment.status === 'completed') {
      payment.completionDate = new Date();

      if (payment.registrationData) {
        try {
          const registrationResult = await registerTenant(payment.registrationData);
          payment.tenantRegistrationId = registrationResult.tenantId;

          // Conserver uniquement les données non sensibles
          const { firstName, lastName, phone, email } = payment.registrationData;
          payment.registrationData = { firstName, lastName, phone, email };
        } catch (registrationError) {
          console.error('Failed to register tenant:', registrationError);
          payment.registrationData = undefined;
          throw new Error(`Payment completed but tenant registration failed: ${registrationError.message}`);
        }
      }
    }

    await payment.save();

    const paymentCompletedEvent = {
      paymentId: payment._id.toString(),
      orderId: payment.orderId,
      status: payment.status,
      amount: payment.amount,
      tenantRegistrationId: payment.tenantRegistrationId || null,
      timestamp: new Date().toISOString()
    };

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

const createPayment = async (paymentData) => {
  try {
    const payment = new Payment(paymentData);
    await payment.save();
    return payment;
  } catch (error) {
    console.error('Failed to create payment record:', error);
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
    console.error(`Failed to retrieve payment details:`, error.message);
    throw error;
  }
};

module.exports = {
  initiatePayment,
  completePayment,
  getPaymentDetails
};