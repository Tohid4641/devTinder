const router = require('express').Router();
const chatController = require('../controllers/chat.controller.js');

router.get('/:targetUserId', chatController.getChats);

module.exports = router;