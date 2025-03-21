const axios = require('axios');

const KONNECT_API_URL = process.env.KONNECT_API_URL;
const API_KEY = process.env.KONNECT_API_KEY;

const initiatePayment = async (paymentData) => {
  try {
    console.log('Sending payment data to Konnect:', paymentData);
    const response = await axios.post(`${KONNECT_API_URL}/payments/init-payment`, paymentData, {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY // Utilisation de x-api-key
      }
    });
    console.log('Konnect API response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error initiating payment:', error.response ? error.response.data : error.message);
    throw error;
  }
};

module.exports = {
  initiatePayment
};