require("dotenv").config();
const mongoose = require('mongoose');
const express = require("express");
const cors = require("cors");
const connectDB = require("./src/config/db");
const app = express();
const PORT = process.env.PORT;
const registerWithEureka = require("./src/config/eurekaClient");
const paymentRoutes = require('./src/routes/paymentRoutes');

// Middleware
app.use(express.json());
app.use(cors());

// Database connection
connectDB();

// Routes
app.use('/api/payments', paymentRoutes);

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    registerWithEureka();
});