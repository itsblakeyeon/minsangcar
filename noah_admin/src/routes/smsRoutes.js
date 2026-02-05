const express = require('express');
const router = express.Router();
const smsController = require('../controllers/smsController');

router.post('/send', smsController.sendSms);
router.post('/bulk', smsController.sendBulkSms);
router.post('/generate-and-send', smsController.generateAndSend);

// SMS 로그 조회
router.get('/logs', async (req, res) => {
  try {
    const { SmsLog } = require('../models');
    const logs = await SmsLog.findAll(50); // 최근 50개
    res.json(logs);
  } catch (error) {
    console.error('SMS 로그 조회 실패:', error);
    res.status(500).json({ error: error.message });
  }
});

// 자동 응답 관련
router.post('/webhook', smsController.webhook);
router.get('/conversations/:customerId', smsController.getConversations);

module.exports = router;
