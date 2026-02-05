const axios = require('axios');
const crypto = require('crypto');
const { SmsLog } = require('../models');

const COOLSMS_API_URL = 'https://api.coolsms.co.kr';

class SmsService {
  constructor() {
    this.apiKey = process.env.COOLSMS_API_KEY;
    this.apiSecret = process.env.COOLSMS_API_SECRET;
    this.from = process.env.COOLSMS_FROM;

    // API 키가 없으면 Mock 모드
    this.mockMode = !this.apiKey || !this.apiSecret;
    console.log(`[SmsService] CoolSMS 사용 - Mock 모드: ${this.mockMode}`);
  }

  generateSignature(timestamp, salt) {
    return crypto
      .createHmac('sha256', this.apiSecret)
      .update(timestamp + salt)
      .digest('hex');
  }

  async sendViaCoolSMS(to, message) {
    const phoneNumber = to.replace(/-/g, '');
    const timestamp = new Date().toISOString();
    const salt = crypto.randomBytes(32).toString('hex');
    const signature = this.generateSignature(timestamp, salt);

    const payload = {
      message: {
        to: phoneNumber,
        from: this.from,
        text: message
      }
    };

    console.log('[SmsService] CoolSMS 발송 요청:', { to: phoneNumber, from: this.from });

    const response = await axios.post(
      `${COOLSMS_API_URL}/messages/v4/send`,
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `HMAC-SHA256 apiKey=${this.apiKey}, date=${timestamp}, salt=${salt}, signature=${signature}`
        },
        timeout: 30000,
      }
    );

    return response.data;
  }

  async sendSms(to, message) {
    // Mock 모드
    if (this.mockMode) {
      console.log(`[MOCK SMS] to: ${to}`);
      console.log(`[MOCK SMS] message: ${message}`);

      const log = await SmsLog.create(to, message, 'sent');

      return {
        success: true,
        mock: true,
        to,
        message,
        logId: log.id,
        timestamp: log.created_at,
      };
    }

    // 실제 CoolSMS API 발송
    const log = await SmsLog.create(to, message, 'pending');

    try {
      const result = await this.sendViaCoolSMS(to, message);
      console.log(`[SmsService] CoolSMS 발송 성공: ${to}`, result);

      return {
        success: true,
        mock: false,
        to,
        message,
        logId: log.id,
        groupId: result.groupId,
        timestamp: log.created_at,
      };
    } catch (error) {
      console.error(`[SmsService] CoolSMS 발송 실패: ${to}`, error.response?.data || error.message);

      return {
        success: false,
        mock: false,
        to,
        message,
        logId: log.id,
        error: error.response?.data || error.message,
      };
    }
  }

  async sendBulkSms(recipients, message) {
    const results = [];
    for (const to of recipients) {
      const result = await this.sendSms(to, message);
      results.push(result);
    }
    return {
      success: true,
      count: results.length,
      successCount: results.filter(r => r.success).length,
      failedCount: results.filter(r => !r.success).length,
      results,
    };
  }
}

module.exports = new SmsService();
