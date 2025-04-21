// src/controllers/webhookController.js
const Payment = require('../models/Payment');
const { registerTenant } = require('../services/tenantRegistrationService');

const handleKonnectWebhook = async (req, res) => {
    const { paymentId, status } = req.body;

    try {
        console.log('Webhook received:', req.body);

        const payment = await Payment.findOne({ konnectPaymentId: paymentId }).select('+registrationData');

        if (!payment) {
            return res.status(404).json({ error: 'Payment not found' });
        }

        // Mettre à jour le statut du paiement
        payment.status = status;

        // Traiter le paiement complété
        if (status === 'completed') {
            payment.completionDate = new Date();

            // Si c'est un paiement d'enregistrement, traiter l'enregistrement
            if (payment.registrationData) {
                try {
                    const registrationResult = await registerTenant(payment.registrationData);
                    payment.tenantRegistrationId = registrationResult.tenantId;
                    payment.registrationData = undefined;
                } catch (registrationError) {
                    console.error('Failed to register tenant via webhook:', registrationError);
                    payment.registrationData = undefined;
                }
            }
        }

        await payment.save();
        res.status(200).json({ message: 'Webhook processed successfully' });
    } catch (error) {
        console.error('Webhook error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = { handleKonnectWebhook };