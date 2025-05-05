const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

router.post('/complete/:paymentId', paymentController.completePayment);
router.post('/tenant-registration', paymentController.initiateRegistrationPayment);
router.get('/details/:orderId', paymentController.getPaymentDetails);
module.exports = router;