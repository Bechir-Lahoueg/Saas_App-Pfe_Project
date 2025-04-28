// src/controllers/paymentController.js
const konnectService = require('../services/konnectService');
const paymentService = require('../services/paymentService');
const Payment = require('../models/Payment');

const initiatePayment = async (req, res) => {
  try {
    const paymentResponse = await konnectService.initiatePayment(req.body);
    res.status(200).json(paymentResponse);
  } catch (error) {
    console.error('Error in paymentController:', error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const verificationResult = await konnectService.verifyPayment(req.params.paymentId);
    res.status(200).json(verificationResult);
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
};

const completePayment = async (req, res) => {
  try {
    const result = await paymentService.completePayment(req.params.paymentId);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error completing payment:', error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
};

const getPaymentDetails = async (req, res) => {
  try {
    const payment = await paymentService.getPaymentDetails(req.params.orderId);
    res.status(200).json(payment);
  } catch (error) {
    console.error('Error getting payment details:', error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
};

const getPaymentsByStatus = async (req, res) => {
  try {
    const payments = await Payment.find({ status: req.params.status });
    res.status(200).json(payments);
  } catch (error) {
    console.error('Error getting payments by status:', error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
};

const initiateRegistrationPayment = async (req, res) => {
  try {
    const {
      receiverWalletId,
      token,
      amount,
      firstName,
      lastName,
      email,
      phone,
      address,
      city,
      zipcode,
      country,
      businessName,
      subdomain,
      password,
      successUrl,
      failUrl,
      theme
    } = req.body;

    // Vérifier les champs requis
    if (!email || !firstName || !lastName || !password || !businessName || !subdomain) {
      return res.status(400).json({
        error: 'Missing required tenant registration fields'
      });
    }

    const registrationData = {
      email,
      firstName,
      lastName,
      phone,
      address,
      password,
      businessName,
      subdomain,
      city,
      zipcode,
      country,
    };

    const paymentData = {
      receiverWalletId,
      token,
      amount,
      description: `Tenant registration for ${businessName}`,
      orderId: `REG-${Date.now()}`,
      successUrl,
      failUrl,
      theme,
      isTenantRegistration: true,
      registrationData
    };

    const paymentResponse = await konnectService.initiatePayment(paymentData);
    res.status(200).json(paymentResponse);
  } catch (error) {
    console.error('Error initiating registration payment:', error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
};

module.exports = {
  initiatePayment,
  verifyPayment,
  completePayment,
  getPaymentDetails,
  getPaymentsByStatus,
  initiateRegistrationPayment
};