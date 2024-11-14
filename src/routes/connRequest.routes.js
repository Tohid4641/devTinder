const router = require('express').Router();
const connRequestController = require('../controllers/connRequest.controller');
const { userAuth } = require('../middlewares/auth');

router.post('/request/send-connection-req', userAuth, connRequestController.sendConnRequest);

module.exports = router;