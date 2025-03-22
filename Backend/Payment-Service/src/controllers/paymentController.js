const konnectService = require('../services/konnectService');
const Payment = require('../models/Payment');

const initiatePayment = async (req, res) => {
  const {
    receiverWalletId,
    token,
    amount,
    type,
    description,
    acceptedPaymentMethods,
    lifespan,
    checkoutForm,
    addPaymentFeesToAmount,
    firstName,
    lastName,
    phoneNumber,
    email,
    orderId,
    webhook,
    silentWebhook,
    successUrl,
    failUrl,
    theme,
    address,
    city,
    state,
    postalCode,
  } = req.body;

  const paymentData = {
    receiverWalletId,
    token,
    amount,
    type,
    description,
    acceptedPaymentMethods: ["wallet"], // Utiliser uniquement le portefeuille
    lifespan,
    checkoutForm,
    addPaymentFeesToAmount,
    firstName,
    lastName,
    phoneNumber,
    email,
    orderId,
    webhook,
    silentWebhook,
    successUrl,
    failUrl,
    theme,
    address,
    city,
    state,
    postalCode,
  };

  try {
    const paymentResponse = await konnectService.initiatePayment(paymentData);
    res.status(200).json(paymentResponse);
  } catch (error) {
    console.error('Error in paymentController:', error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
};

const verifyPayment = async (req, res) => {
  const { paymentId } = req.params;

  try {
    const verificationResult = await konnectService.verifyPayment(paymentId);
    res.status(200).json(verificationResult);
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
};

const completePayment = async (req, res) => {
  const { paymentId } = req.params;

  try {
    const result = await konnectService.completePayment(paymentId);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error completing payment:', error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
};

const getPaymentDetails = async (req, res) => {
  const { orderId } = req.params;

  try {
    const payment = await konnectService.getPaymentDetails(orderId);
    res.status(200).json(payment);
  } catch (error) {
    console.error('Error getting payment details:', error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
};

const getPaymentsByStatus = async (req, res) => {
  const { status } = req.params;

  try {
    const payments = await Payment.find({ status });
    res.status(200).json(payments);
  } catch (error) {
    console.error('Error getting payments by status:', error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
};

module.exports = {
  initiatePayment,
  verifyPayment,
  completePayment,
  getPaymentDetails,
  getPaymentsByStatus,
};