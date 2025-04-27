const router = require('express').Router();
const authRouter = require('./auth.routes');
const connRequestRouter = require('./connRequest.routes');
const profileRouter = require('./profile.routes');
const userRouter = require('./user.routes');
const paymentRouter = require('./payment.routes');
const { userAuth } = require('../middlewares/auth');

router.use('/auth', authRouter);
router.use('/request', userAuth, connRequestRouter);
router.use('/profile', userAuth, profileRouter);
router.use('/user', userAuth, userRouter);
router.use('/payment', userAuth, paymentRouter);

module.exports = router;