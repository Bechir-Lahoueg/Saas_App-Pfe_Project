// src/services/konnectApiService.js
const axios = require('axios');

const KONNECT_API_URL = process.env.KONNECT_API_URL;
const API_KEY = process.env.KONNECT_API_KEY;

/**
 * Appelle l'API Konnect pour initialiser un paiement
 */
const initializeKonnectPayment = async (payload) => {
    try {
        const response = await axios.post(`${KONNECT_API_URL}/payments/init-payment`, payload, {
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': API_KEY,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Konnect API error:', error.response?.data || error.message);
        throw error;
    }
};

/**
 * Vérifie le statut d'un paiement via l'API Konnect
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
    initializeKonnectPayment,
    verifyPayment
};