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
      checkoutForm: true,
      addPaymentFeesToAmount: paymentData.addPaymentFeesToAmount || true,
      webhook: `${process.env.BASE_URL}/api/payments/webhook`,
      silentWebhook: true,
      successUrl: paymentData.successUrl || "https://gateway.sandbox.konnect.network/payment-success",
      failUrl: paymentData.failUrl || "https://gateway.sandbox.konnect.network/payment-failure",
      theme: paymentData.theme || "dark"
    };

    const response = await axios.post(`${KONNECT_API_URL}/payments/init-payment`, payload, {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
      },
    });

    console.log(`Payment initiated with ID: ${response.data.paymentRef}`);

    const payment = new Payment({
      orderId: paymentData.orderId,
      amount: paymentData.amount,
      status: 'pending',
      paymentMethod: 'unknown',
      receiverWalletId: paymentData.receiverWalletId,
      customerDetails: paymentData.customerDetails || {},
      konnectPaymentId: response.data.paymentRef,
      konnectPaymentUrl: response.data.payUrl,
      metadata: paymentData.metadata || {}
    });

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

    const payment = await Payment.findOne({ konnectPaymentId: paymentRef });
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

    // Only proceed with registration if payment is completed and it's a tenant registration
    if (verificationResponse.payment.status === 'completed' && payment.metadata?.tenantRegistration) {
      try {
        payment.completionDate = new Date();

        // Prepare tenant data from the stored metadata
        const tenantData = {
          email: payment.customerDetails.email,
          firstName: payment.customerDetails.firstName,
          lastName: payment.customerDetails.lastName,
          // This is incorrect - Registration service expects 'phone' not 'phoneNumber'
          phone: payment.customerDetails.phone,
          address: payment.customerDetails.address, // Ensure address is included

          password: payment.metadata.tenantRegistration.password,
          businessName: payment.metadata.tenantRegistration.businessName,
          subdomain: payment.metadata.tenantRegistration.subdomain,

        };

        // Register the tenant synchronously
        const registrationResult = await registerTenant(tenantData);

        // Store registration result in payment metadata
        payment.metadata.registrationResult = registrationResult;
        console.log('Tenant successfully registered with ID:', registrationResult.tenantId);
      } catch (registrationError) {
        console.error('Failed to register tenant:', registrationError);
        payment.metadata.registrationError = registrationError.message;
        // Important: Since this is sync operation, you may want to mark payment as failed
        // if tenant registration fails
        throw new Error(`Payment completed but tenant registration failed: ${registrationError.message}`);
      }
    } else if (verificationResponse.payment.status === 'completed') {
      payment.completionDate = new Date();
    }

    // Update payment metadata
    payment.metadata = {
      ...payment.metadata,
      verificationResponse: verificationResponse.payment
    };

    await payment.save();
    console.log(`Payment ${paymentRef} completed with status: ${payment.status}`);

    return {
      success: verificationResponse.success,
      payment,
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