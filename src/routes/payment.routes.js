const router = require('express').Router();
const paymentController = require('../controllers/payment.controller');
const { userAuth } = require('../middlewares/auth');

router.post('/create', userAuth, paymentController.createPaymentOrder);
router.post('/webhook', paymentController.paymentWebhook);
router.get('/verify', userAuth, paymentController.verifyPayment);

module.exports = router;