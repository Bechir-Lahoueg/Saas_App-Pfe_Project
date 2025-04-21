// src/controllers/webhookController.js
const Payment = require('../models/Payment');
const { registerTenant } = require('../services/tenantRegistrationService');

module.exports = async (req, res) => {
    const { paymentId, status } = req.body;
    try {
        const payment = await Payment
            .findOne({ konnectPaymentId: paymentId })
            .select('+tenantRegistrationId');
        if (!payment) return res.status(404).json({ error: 'Payment not found' });

        payment.status = status;
        if (status === 'completed') {
            payment.completionDate = new Date();
            // If this was a tenant signup flow, register them now:
            if (payment.isTenantRegistration && payment.registrationData) {
                const result = await registerTenant(payment.registrationData);
                payment.tenantRegistrationId = result.id;
            }
        }
        await payment.save();
        return res.status(200).json({ message: 'Webhook processed' });
    } catch (err) {
        console.error('Webhook error:', err);
        return res.status(500).json({ error: err.message });
    }
};
