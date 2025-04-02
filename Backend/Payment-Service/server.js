require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./src/config/db");
const paymentRoutes = require('./src/routes/paymentRoutes');
const Payment = require('./src/models/Payment');
const registerWithEureka = require("./src/config/eurekaClient");

const app = express();
const PORT = process.env.PORT;

// Middleware
app.use(express.json());
app.use(cors());

// Database connection
connectDB();

// Routes
app.use('/api/payments', paymentRoutes);

// Webhook endpoint for Konnect
app.post('/api/payments/webhook', async (req, res) => {
  const { paymentId, status } = req.body;

  try {
    console.log('Webhook received:', req.body);

    const payment = await Payment.findOne({ konnectPaymentId: paymentId });

    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    // Mettre à jour le statut du paiement
    payment.status = status;
    await payment.save();

    console.log(`Payment ${paymentId} updated to status: ${status}`);
    res.status(200).json({ message: 'Webhook received and processed' });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  registerWithEureka();
});