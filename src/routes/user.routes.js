const router = require('express').Router();
const userController = require('../controllers/user.controller');

router.get('/requests/received', userController.getReceievedConnections)
router.get('/connections', userController.getConnections)
router.get('/feed', userController.getFeeds)

module.exports = router