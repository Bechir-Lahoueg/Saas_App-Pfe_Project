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
    required: true
  },
  receiverWalletId: {
    type: String,
    required: true
  },
  customerDetails: {
    firstName: String,
    lastName: String,
    email: String,
    phoneNumber: String,
    address: String,
    city: String,
    state: String,
    postalCode: String
  },
  konnectPaymentId: String,
  konnectPaymentUrl: String,
  paymentDate: {
    type: Date,
    default: Date.now
  },
  completionDate: Date,
  metadata: {
    type: Object,
    default: {}
  }
}, { timestamps: true });

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;