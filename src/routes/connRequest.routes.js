const router = require('express').Router();
const connRequestController = require('../controllers/connRequest.controller');

router.get('/review', connRequestController.getConnRequests);
router.post('/send/:status/:toUserId', connRequestController.sendConnRequest);
router.post('/review/:status/:requestId', connRequestController.acknowlageConnRequest);

module.exports = router;