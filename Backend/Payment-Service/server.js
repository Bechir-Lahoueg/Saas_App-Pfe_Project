require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./src/config/db");
const paymentRoutes = require('./src/routes/paymentRoutes');
const Payment = require('./src/models/Payment');

const eurekaClient = require("./src/utils/eurekaClient");

const app = express();
const PORT = process.env.PORT;

// Middleware
app.use(express.json());
app.use(cors());

// Database connection
connectDB();

// Routes
app.use('/payment', paymentRoutes);

// Webhook endpoint for Konnect
app.post('/payments/webhook', async (req, res) => {
  const { paymentId, status } = req.body;

  try {
    console.log('Webhook received:', req.body);

    // Inclure le champ registrationData dans la requête
    const payment = await Payment.findOne({ konnectPaymentId: paymentId }).select('+registrationData');

    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    // Mettre à jour le statut du paiement
    payment.status = status;

    // Si le paiement est complété, définir la date de complétion
    if (status === 'completed') {
      payment.completionDate = new Date();

      // Si c'est un paiement d'enregistrement, traiter l'enregistrement du locataire
      if (payment.registrationData) {
        try {
          const registrationResult = await registerTenant(payment.registrationData);
          payment.tenantRegistrationId = registrationResult.tenantId;
          // Nettoyer les données d'enregistrement après utilisation
          payment.registrationData = undefined;
        } catch (registrationError) {
          console.error('Failed to register tenant via webhook:', registrationError);
          payment.registrationData = undefined;
        }
      }
    }

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
  eurekaClient.register();

});