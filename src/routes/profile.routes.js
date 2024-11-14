const router = require('express').Router();
const profileController = require('../controllers/profile.controller');
const { userAuth } = require('../middlewares/auth');

router.get('/profile', userAuth, profileController.getProfile);

module.exports = router;