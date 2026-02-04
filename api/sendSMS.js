// Vercel Serverless Function - 뿌리오 SMS 발송
// https://minsangcar.vercel.app/api/sendSMS

import crypto from 'crypto';

const PPURIO_API_URL = 'https://message.ppurio.com';

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

    // Vercel IP 확인
    let vercelIP = 'unknown';
    try {
      const ipResponse = await fetch('https://api.ipify.org?format=json');
      const ipData = await ipResponse.json();
      vercelIP = ipData.ip;
      console.log('🌐 Vercel Function IP:', vercelIP);
    } catch (ipError) {
      console.error('IP 확인 실패:', ipError);
    }

    // 환경 변수 확인
    const account = process.env.PPURIO_ACCOUNT;
    const apiKey = process.env.PPURIO_API_KEY;
    const from = process.env.PPURIO_FROM;

    if (!account || !apiKey || !from) {
      console.error('뿌리오 환경 변수가 설정되지 않았습니다');
      console.error('account:', account ? 'OK' : 'MISSING');
      console.error('apiKey:', apiKey ? 'OK' : 'MISSING');
      console.error('from:', from ? 'OK' : 'MISSING');
      return res.status(500).json({
        error: '서버 설정 오류',
        mock: true
      });
    }

    // 1. 뿌리오 토큰 발급
    const credentials = `${account}:${apiKey}`;
    const auth = Buffer.from(credentials).toString('base64');

    const tokenResponse = await fetch(`${PPURIO_API_URL}/v1/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${auth}`,
      },
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text();
      console.error('토큰 발급 실패:', errorData);
      console.error('Status:', tokenResponse.status);
      console.error('Account:', account);
      console.error('API Key length:', apiKey?.length);
      throw new Error(`토큰 발급 실패: ${tokenResponse.status} - ${errorData} (Vercel IP: ${vercelIP})`);
    }

    const tokenText = await tokenResponse.text();
    console.log('토큰 응답 원본:', tokenText);

    let token;
    try {
      const tokenData = JSON.parse(tokenText);
      token = tokenData.token;
      console.log('✅ 토큰 발급 성공');
    } catch (parseError) {
      console.error('JSON 파싱 실패:', parseError);
      throw new Error(`토큰 응답 JSON 파싱 실패: ${tokenText}`);
    }

    // 2. SMS 발송
    const phoneNumber = to.replace(/-/g, '');
    const refKey = crypto.randomBytes(16).toString('hex');

    const smsPayload = {
      account,
      messageType: 'SMS',
      from,
      content: message,
      duplicateFlag: 'Y',
      targetCount: 1,
      targets: [{ to: phoneNumber }],
      refKey,
    };

    const smsResponse = await fetch(`${PPURIO_API_URL}/v1/message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(smsPayload),
    });

    if (!smsResponse.ok) {
      const errorData = await smsResponse.json();
      console.error('SMS 발송 실패:', errorData);
      throw new Error(`SMS 발송 실패: ${errorData.description || 'Unknown error'}`);
    }

    const result = await smsResponse.json();

    console.log(`✅ SMS 발송 성공: ${customerName} (${to})`);

    return res.status(200).json({
      success: true,
      to,
      message,
      customerName,
      messageKey: result.messageKey,
      refKey,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('SMS 발송 에러:', error);
    return res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
}
