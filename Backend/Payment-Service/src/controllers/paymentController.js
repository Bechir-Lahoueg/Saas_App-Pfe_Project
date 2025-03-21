const konnectService = require('../services/konnectService');

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
    theme
  } = req.body;

  const paymentData = {
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
    theme
  };

  try {
    const paymentResponse = await konnectService.initiatePayment(paymentData);
    res.status(200).json(paymentResponse);
  } catch (error) {
    console.error('Error in paymentController:', error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
};

module.exports = {
  initiatePayment
};