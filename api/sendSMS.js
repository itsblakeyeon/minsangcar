// Vercel Serverless Function - CoolSMS 발송
// https://minsangcar.vercel.app/api/sendSMS

import crypto from 'crypto';

const COOLSMS_API_URL = 'https://api.coolsms.co.kr';

export default async function handler(req, res) {
  // CORS 설정
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { to, message, customerName } = req.body;

    if (!to || !message) {
      return res.status(400).json({ error: 'to와 message는 필수입니다' });
    }

    // 환경 변수 확인
    const apiKey = process.env.COOLSMS_API_KEY;
    const apiSecret = process.env.COOLSMS_API_SECRET;
    const from = process.env.COOLSMS_FROM;

    if (!apiKey || !apiSecret || !from) {
      console.error('CoolSMS 환경 변수가 설정되지 않았습니다');
      console.error('apiKey:', apiKey ? 'OK' : 'MISSING');
      console.error('apiSecret:', apiSecret ? 'OK' : 'MISSING');
      console.error('from:', from ? 'OK' : 'MISSING');
      return res.status(500).json({
        error: '서버 설정 오류',
        mock: true
      });
    }

    // CoolSMS 인증 정보 생성
    const timestamp = Date.now().toString();
    const salt = crypto.randomBytes(32).toString('hex');
    const signature = crypto
      .createHmac('sha256', apiSecret)
      .update(timestamp + salt)
      .digest('hex');

    // SMS 발송
    const phoneNumber = to.replace(/-/g, '');

    const smsPayload = {
      message: {
        to: phoneNumber,
        from: from,
        text: message
      }
    };

    console.log('📱 CoolSMS 발송 시도:', { to: phoneNumber, from });

    const response = await fetch(`${COOLSMS_API_URL}/messages/v4/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `HMAC-SHA256 apiKey=${apiKey}, date=${timestamp}, salt=${salt}, signature=${signature}`
      },
      body: JSON.stringify(smsPayload)
    });

    const responseText = await response.text();
    console.log('CoolSMS 응답:', responseText);

    let result;
    try {
      result = JSON.parse(responseText);
    } catch (parseError) {
      console.error('JSON 파싱 실패:', parseError);
      throw new Error(`응답 파싱 실패: ${responseText}`);
    }

    if (!response.ok) {
      console.error('SMS 발송 실패:', result);
      throw new Error(`SMS 발송 실패: ${result.errorMessage || result.message || 'Unknown error'}`);
    }

    console.log(`✅ SMS 발송 성공: ${customerName} (${to})`);

    return res.status(200).json({
      success: true,
      to,
      message,
      customerName,
      messageId: result.groupId,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('SMS 발송 에러:', error);
    return res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}
