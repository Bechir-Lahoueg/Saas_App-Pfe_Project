const Payment = require('../models/Payment');
const konnect = require('./konnectService');
const { registerTenant } = require('./tenantRegistrationService');

async function createPaymentRecord(orderId, amount, receiverWalletId, ref, url, isTenantReg=false) {
    const p = new Payment({
        orderId,
        amount,
        status: 'pending',
        receiverWalletId,
        konnectPaymentId: ref,
        konnectPaymentUrl: url
    });
    await p.save();
    return p;
}

async function initiatePayment(data) {
    const res = await konnect.initiatePayment(data);
    await createPaymentRecord(
        data.orderId, data.amount, data.receiverWalletId,
        res.paymentRef, res.payUrl,
        data.isTenantRegistration
    );
    return res;
}

async function completePayment(paymentRef) {
    const { success, payment: remote } = await konnect.verifyPayment(paymentRef);
    const local = await Payment.findOne({ konnectPaymentId: paymentRef }).select('+tenantRegistrationId');
    if (!local) throw new Error('Local payment record not found');

    local.status = remote.status;
    local.paymentMethod = remote.transactions?.[0]?.method ?? local.paymentMethod;
    local.completionDate = new Date();

    // If it was a tenant‐registration payment, now register the tenant:
    if (local.status === 'completed' && remote.isTenantRegistration) {
        const result = await registerTenant(remote.registrationData);
        local.tenantRegistrationId = result.id;
    }

    await local.save();
    return local;
}

// at bottom of src/services/paymentService.js
module.exports = {
    initiatePayment,
    completePayment,
};

