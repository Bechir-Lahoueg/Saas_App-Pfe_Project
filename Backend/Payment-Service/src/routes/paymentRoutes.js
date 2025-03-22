const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// Initier un paiement
router.post('/initiate-payment', paymentController.initiatePayment);

// Vérifier le statut d'un paiement
router.get('/verify/:paymentId', paymentController.verifyPayment);

// Compléter un paiement (à appeler après vérification)
router.post('/complete/:paymentId', paymentController.completePayment);

// Obtenir les détails d'un paiement par orderId
router.get('/details/:orderId', paymentController.getPaymentDetails);

// Obtenir les paiements par statut
router.get('/status/:status', paymentController.getPaymentsByStatus);

module.exports = router;