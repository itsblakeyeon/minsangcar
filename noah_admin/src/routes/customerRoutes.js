const express = require('express');
const multer = require('multer');
const router = express.Router();
const customerController = require('../controllers/customerController');

const upload = multer({ storage: multer.memoryStorage() });

router.post('/', customerController.createCustomer);
router.post('/upload', upload.single('file'), customerController.uploadCSV);
router.post('/send-by-status', customerController.sendByStatus);
router.get('/', customerController.getCustomers);
router.get('/:id', customerController.getCustomerById);
router.put('/:id', customerController.updateCustomer);
router.delete('/:id', customerController.deleteCustomer);

// 🆕 랜딩페이지에서 고객 등록 + 자동 SMS 발송
router.post('/from-landing', async (req, res) => {
  try {
    const { name, phone, notes } = req.body;
    
    // 1. DB에 저장
    const result = await pool.query(
      'INSERT INTO customers (name, phone, status, notes) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, phone, 'new', notes]
    );
    
    const customer = result.rows[0];
    
    // 2. 즉시 SMS 발송
    const smsService = require('../services/smsService');
    await smsService.sendMessage(phone, `안녕하세요 ${name}님! 민생카입니다. 문의 주셔서 감사합니다. 곧 연락드리겠습니다!`);
    
    res.json({ success: true, customer });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
