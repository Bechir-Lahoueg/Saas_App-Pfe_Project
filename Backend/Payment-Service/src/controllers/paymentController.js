const paymentService = require('../services/paymentService');


const completePayment = async (req, res) => {
  try {
    const result = await paymentService.completePayment(req.params.paymentId);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error completing payment:', error);
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
      categoryId,
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
    if (!email || !firstName || !lastName || !password || !businessName || !subdomain || !categoryId) {
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
      categoryId,
      city,
      zipcode,
      country,
    };
    console.log(registrationData)

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

    const paymentResponse = await paymentService.initiatePayment(paymentData);
    res.status(200).json(paymentResponse);
  } catch (error) {
    console.error('Error initiating registration payment:', error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
};

const getPaymentDetails = async (req, res) => {
  try {
    const payment = await paymentService.getPaymentDetails(req.params.orderId);
    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }
    res.status(200).json(payment);
  } catch (error) {
    console.error('Error fetching payment details:', error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
};

module.exports = {

  completePayment,
  getPaymentDetails,
  initiateRegistrationPayment
};