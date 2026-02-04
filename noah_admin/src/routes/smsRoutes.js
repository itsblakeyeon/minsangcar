const express = require('express');
const router = express.Router();
const smsController = require('../controllers/smsController');

router.post('/send', smsController.sendSms);
router.post('/bulk', smsController.sendBulkSms);
router.post('/generate-and-send', smsController.generateAndSend);

// 자동 응답 관련
router.post('/webhook', smsController.webhook);
router.get('/conversations/:customerId', smsController.getConversations);

module.exports = router;
