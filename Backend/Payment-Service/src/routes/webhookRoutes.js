// src/routes/webhookRoutes.js
const express = require('express');
const router = express.Router();
const webhookController = require('../controllers/webhookController');

// Webhook pour Konnect
router.post('/webhook', webhookController.handleKonnectWebhook);

module.exports = router;