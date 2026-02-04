const smsService = require('../services/smsService');
const claudeService = require('../services/claudeService');
const autoReplyService = require('../services/autoReplyService');
const { Customer, Conversation } = require('../models');

const sendSms = async (req, res) => {
  try {
    const { to, message, customerName } = req.body;
    const result = await smsService.sendSms(to, message);

    // 고객이 없으면 자동 등록, 있으면 조회
    if (result.success) {
      let customer = await Customer.findByPhone(to);
      if (!customer) {
        customer = await Customer.create(customerName || '미등록고객', to, 'new');
      }
      // 대화 내역에 저장
      await Conversation.create(customer.id, message, 'ai');
      result.customerId = customer.id;
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const sendBulkSms = async (req, res) => {
  try {
    const { recipients, message } = req.body;
    const results = await smsService.sendBulkSms(recipients, message);

    // 각 수신자에 대해 대화 내역 저장
    for (const r of results.results) {
      if (r.success) {
        let customer = await Customer.findByPhone(r.to);
        if (!customer) {
          customer = await Customer.create('미등록고객', r.to, 'new');
        }
        await Conversation.create(customer.id, message, 'ai');
      }
    }

    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const generateAndSend = async (req, res) => {
  try {
    const { to, context } = req.body;
    const message = await claudeService.generateSmsContent(context);
    const result = await smsService.sendSms(to, message);
    res.json({ ...result, generatedMessage: message });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 고객 문자 수신 웹훅 (자동 응답)
const webhook = async (req, res) => {
  try {
    const { from, message, customerName } = req.body;
    if (!from || !message) {
      return res.status(400).json({ error: 'from과 message는 필수입니다' });
    }
    const result = await autoReplyService.processIncomingMessage(from, message, customerName);
    res.json(result);
  } catch (error) {
    console.error('[Webhook Error]', error);
    res.status(500).json({ error: error.message });
  }
};

// 대화 내역 조회
const getConversations = async (req, res) => {
  try {
    const { customerId } = req.params;
    const result = await autoReplyService.getConversationHistory(parseInt(customerId));
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  sendSms,
  sendBulkSms,
  generateAndSend,
  webhook,
  getConversations,
};
