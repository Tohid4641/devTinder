const router = require('express').Router();
const authController = require('../controllers/auth.controller');

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.patch('/forgot-password', authController.updatePassword);

module.exports = router;