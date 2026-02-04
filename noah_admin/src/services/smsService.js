const axios = require('axios');
const crypto = require('crypto');
const { SmsLog } = require('../models');

const PPURIO_API_URL = 'https://message.ppurio.com';

class SmsService {
  constructor() {
    this.account = process.env.PPURIO_ACCOUNT;
    this.apiKey = process.env.PPURIO_API_KEY;
    this.from = process.env.PPURIO_FROM;
    this.token = null;
    this.tokenExpiry = null;

    // API 키가 없으면 Mock 모드
    this.mockMode = !this.apiKey || this.apiKey === 'your_ppurio_api_key';
    console.log(`[SmsService] Mock 모드: ${this.mockMode}`);
  }

  generateRefKey() {
    return crypto.randomBytes(16).toString('hex'); // 32자 랜덤 문자열
  }

  async getToken() {
    // 토큰이 유효하면 재사용
    if (this.token && this.tokenExpiry && Date.now() < this.tokenExpiry) {
      return this.token;
    }

    const credentials = `${this.account}:${this.apiKey}`;
    const auth = Buffer.from(credentials).toString('base64');

    const response = await axios.post(
      `${PPURIO_API_URL}/v1/token`,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${auth}`,
        },
        timeout: 30000,
      }
    );

    this.token = response.data.token;
    this.tokenExpiry = Date.now() + 23 * 60 * 60 * 1000; // 23시간

    console.log('[SmsService] 뿌리오 토큰 발급 완료');
    return this.token;
  }

  async sendViaPpurio(to, message) {
    const token = await this.getToken();
    const phoneNumber = to.replace(/-/g, '');

    const payload = {
      account: this.account,
      messageType: 'SMS',
      from: this.from,
      content: message,
      duplicateFlag: 'Y',
      targetCount: 1,
      targets: [{ to: phoneNumber }],
      refKey: this.generateRefKey(),
    };

    console.log('[SmsService] 발송 요청:', { to: phoneNumber, message });

    const response = await axios.post(
      `${PPURIO_API_URL}/v1/message`,
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
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

    // 실제 뿌리오 API 발송
    const log = await SmsLog.create(to, message, 'pending');

    try {
      const result = await this.sendViaPpurio(to, message);
      console.log(`[SmsService] 발송 성공: ${to}`, result);

      return {
        success: true,
        mock: false,
        to,
        message,
        logId: log.id,
        messageKey: result.messageKey,
        refKey: result.refKey,
        timestamp: log.created_at,
      };
    } catch (error) {
      console.error(`[SmsService] 발송 실패: ${to}`, error.response?.data || error.message);

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
