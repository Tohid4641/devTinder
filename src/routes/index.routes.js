const router = require('express').Router();
const authRouter = require('./auth.routes');
const connRequestRouter = require('./connRequest.routes');
const profileRouter = require('./profile.routes');
const userRouter = require('./user.routes');

router.use('/auth', authRouter);
router.use('/request', connRequestRouter);
router.use('/profile', profileRouter);
router.use('/user', userRouter);

module.exports = router;