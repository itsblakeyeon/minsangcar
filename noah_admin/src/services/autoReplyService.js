const { Customer, Conversation } = require('../models');
const claudeService = require('./claudeService');
const smsService = require('./smsService');

class AutoReplyService {
  async processIncomingMessage(phone, message, customerName = null) {
    // 1. 고객 조회 또는 생성
    let customer = await Customer.findByPhone(phone);
    if (!customer) {
      customer = await Customer.create(
        customerName || '미등록 고객',
        phone,
        'active'
      );
      console.log(`[AutoReply] 새 고객 등록: ${phone}`);
    }

    // 2. 고객 메시지 저장
    await Conversation.create(customer.id, message, 'customer');
    console.log(`[AutoReply] 고객 메시지 수신: ${message}`);

    // 3. 대화 히스토리 조회
    const history = await Conversation.getRecentHistory(customer.id, 10);

    // 4. AI 응답 생성
    const aiResponse = await claudeService.generateAutoReply(message, history.slice(0, -1));
    console.log(`[AutoReply] AI 응답 생성: ${aiResponse}`);

    // 5. AI 응답 저장
    await Conversation.create(customer.id, aiResponse, 'ai');

    // 6. SMS 발송
    const smsResult = await smsService.sendSms(phone, aiResponse);

    return {
      customer,
      customerMessage: message,
      aiResponse,
      smsResult,
    };
  }

  async getConversationHistory(customerId) {
    const customer = await Customer.findById(customerId);
    if (!customer) {
      throw new Error('고객을 찾을 수 없습니다');
    }
    const conversations = await Conversation.findByCustomerId(customerId, 50);
    return { customer, conversations };
  }
}

module.exports = new AutoReplyService();
