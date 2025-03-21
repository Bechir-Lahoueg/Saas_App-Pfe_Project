require("dotenv").config();
const mongoose = require('mongoose');
const express = require("express");
const cors = require("cors");
const connectDB = require("./src/config/db");
const registerWithEureka = require("./src/config/eurekaClient");
const calendarRoutes = require("./src/routes/calendarRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());
app.use("/api/calendar", calendarRoutes);



// Database connection
connectDB();

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
    registerWithEureka();
});