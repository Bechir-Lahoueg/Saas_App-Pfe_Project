const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
        orderId: {
            type: String,
            required: true,
            unique: true
        },
        amount: {
            type: Number,
            required: true
        },
        status: {
            type: String,
            enum: ['pending', 'completed', 'failed', 'refunded'],
            default: 'pending'
        },
        paymentMethod: {
            type: String,
            default: 'unknown'
        },
        receiverWalletId: {
            type: String,
            required: true
        },
        konnectPaymentId: String,
        konnectPaymentUrl: String,
        paymentDate: {
            type: Date,
            default: Date.now
        },
        completionDate: Date,
        registrationData: {
            type: Object,
            select: false
        },
        tenantRegistrationId: String
    },
    { timestamps: true }
);

const Payment = mongoose.model('Payment', paymentSchema);
module.exports = Payment;