// server.js (modification)
require("dotenv").config();
const express = require("express");
const connectDB = require("./src/config/db");
const paymentRoutes = require('./src/routes/paymentRoutes');
const adminRoutes = require('./src/routes/adminRoutes'); // Nouvelle ligne


const eurekaClient = require("./src/utils/eurekaClient");

const app = express();
const PORT = process.env.PORT || 5001;

app.use(express.json());

// Connexion à la base de données
connectDB();


// Routes
app.use('/payment', paymentRoutes);
app.use('/payment/admin', adminRoutes);

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Payment Service running on port ${PORT}`);
  eurekaClient.register();
});