const router = require('express').Router();
const paymentController = require('../controllers/payment.controller');

router.post('/create', paymentController.createPaymentOrder);
router.post('/webhook', paymentController.paymentWebhook);
router.get('/verify', paymentController.verifyPayment);

module.exports = router;