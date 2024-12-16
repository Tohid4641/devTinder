const router = require('express').Router();
const profileController = require('../controllers/profile.controller');

router.get('/view', profileController.getProfile);
router.patch('/update', profileController.updateProfile);

module.exports = router;