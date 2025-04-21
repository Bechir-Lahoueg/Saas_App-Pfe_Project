// src/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Routes pour le tableau de bord administratif
router.get('/stats', adminController.getPaymentStats);
router.get('/payments', adminController.getAllPayments);
router.get('/stats/period/:period', adminController.getPaymentStatsByPeriod);
router.get('/stats/payment-methods', adminController.getPaymentMethodStats);
router.get('/stats/tenant-registrations', adminController.getTenantRegistrationStats);
// Ajouter cette ligne à src/routes/adminRoutes.js
router.get('/payments/export', adminController.exportPayments);

module.exports = router;