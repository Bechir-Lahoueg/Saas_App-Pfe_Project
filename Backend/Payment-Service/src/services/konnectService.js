const axios = require('axios');
const Payment = require('../models/Payment');

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

    // Store original customer details
    const originalCustomerDetails = { ...payment.customerDetails };
    console.log('Original customer details:', originalCustomerDetails);

    payment.status = verificationResponse.payment.status;

    // Handle transaction data if available
    const transactions = verificationResponse.payment.transactions;
    if (transactions && transactions.length > 0) {
      // Prefer method over type for payment method identification
      if (transactions[0].method) {
        payment.paymentMethod = transactions[0].method;
      } else if (transactions[0].type) {
        payment.paymentMethod = transactions[0].type;
      }

      // Only use transaction owner data if original customer details is empty
      const hasOriginalCustomerDetails = originalCustomerDetails &&
          (originalCustomerDetails.firstName ||
              originalCustomerDetails.lastName ||
              originalCustomerDetails.email ||
              originalCustomerDetails.phoneNumber);

      if (!hasOriginalCustomerDetails && transactions[0].senderWallet?.owner) {
        const owner = transactions[0].senderWallet.owner;
        payment.customerDetails = {
          firstName: owner.firstName || '',
          lastName: owner.lastName || '',
          email: owner.email || '',
          phoneNumber: owner.phoneNumber || '',
        };
        console.log('Using owner details from transaction');
      } else {
        // Keep original customer details
        payment.customerDetails = originalCustomerDetails;
        console.log('Keeping original customer details');
      }
    }

    if (verificationResponse.payment.status === 'completed') {
      payment.completionDate = new Date();
    }

    payment.metadata = {
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