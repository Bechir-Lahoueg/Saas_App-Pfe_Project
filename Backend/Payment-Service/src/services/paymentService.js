// src/services/paymentService.js
const Payment = require('../models/Payment');
const konnectApiService = require('./konnectApiService');
const { registerTenant } = require('./tenantRegistrationService');

/**
 * Crée un nouvel enregistrement de paiement dans la base de données
 * @param {Object} paymentData - Les données du paiement à créer
 */
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

/**
 * Récupère les détails d'un paiement par orderId
 * @param {String} orderId - ID de la commande
 */
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

/**
 * Complète un paiement et gère l'enregistrement du locataire si nécessaire
 * @param {String} paymentRef - ID du paiement
 */
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

module.exports = {
    createPayment,
    getPaymentDetails,
    completePayment
};