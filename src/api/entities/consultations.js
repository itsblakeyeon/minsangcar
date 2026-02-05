import { supabase } from '../supabaseClient';

const SLACK_WEBHOOK_URL = import.meta.env.VITE_SLACK_WEBHOOK_URL;
const GOOGLE_SHEET_WEBHOOK_URL = import.meta.env.VITE_GOOGLE_SHEET_WEBHOOK_URL;

export const consultationsApi = {
  async create(data) {
    const consultationData = {
      customer_name: data.customer_name,
      phone: data.phone,
      vehicle_name: data.vehicle_name || null,
      preferred_method: data.preferred_method || '상관없음',
      message: data.message || null,
      status: data.status || '대기중'
    };

    const { error } = await supabase
      .from('consultations')
      .insert([consultationData]);

    if (error) {
      console.error('상담 신청 실패:', error);
      throw error;
    }

    // 뿌리오 SMS 발송 (Vercel Function 사용)
    sendSMS(consultationData).catch((err) => {
      console.error('SMS 발송 실패:', err);
    });

    // Slack 알림 전송 (실패해도 상담 신청은 성공으로 처리)
    if (SLACK_WEBHOOK_URL) {
      sendSlackNotification(consultationData).catch((err) => {
        console.error('Slack 알림 전송 실패:', err);
      });
    }

    // Google Sheets 전송 (실패해도 상담 신청은 성공으로 처리)
    if (GOOGLE_SHEET_WEBHOOK_URL) {
      sendToGoogleSheet(consultationData).catch((err) => {
        console.error('Google Sheets 전송 실패:', err);
      });
    }

    return consultationData;
  }
};

async function sendSlackNotification(consultation) {
  if (!SLACK_WEBHOOK_URL) return;

  const response = await fetch(SLACK_WEBHOOK_URL, {
    method: 'POST',
    mode: 'no-cors',
    body: JSON.stringify({
      text: '🤑 [민생카] 새로운 상담 요청',
      blocks: [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: '🤑 [민생카] 새로운 상담 요청이 접수되었습니다!',
            emoji: true
          }
        },
        {
          type: 'section',
          fields: [
            { type: 'mrkdwn', text: `*고객명:*\n${consultation.customer_name}` },
            { type: 'mrkdwn', text: `*연락처:*\n${consultation.phone}` },
            { type: 'mrkdwn', text: `*희망차량:*\n${consultation.vehicle_name || '미정'}` },
            { type: 'mrkdwn', text: `*선호 상담방식:*\n${consultation.preferred_method || '상관없음'}` }
          ]
        },
        ...(consultation.message ? [{
          type: 'section',
          text: { type: 'mrkdwn', text: `*추가 요청:*\n${consultation.message}` }
        }] : []),
        {
          type: 'context',
          elements: [
            { type: 'mrkdwn', text: '담당자: <@U0972DTPAPJ>' }
          ]
        }
      ]
    })
  });

  // no-cors 모드에서는 응답 확인 불가
  // 실패해도 상담 신청은 성공으로 처리됨
}

async function sendToGoogleSheet(consultation) {
  if (!GOOGLE_SHEET_WEBHOOK_URL) return;

  await fetch(GOOGLE_SHEET_WEBHOOK_URL, {
    method: 'POST',
    mode: 'no-cors',
    body: JSON.stringify({
      customer_name: consultation.customer_name,
      phone: consultation.phone,
      vehicle_name: consultation.vehicle_name || '',
      preferred_method: consultation.preferred_method || '',
      message: consultation.message || ''
    })
  });
}

// CoolSMS MMS 발송 (Vercel Serverless Function)
async function sendSMS(consultation) {
  try {
    const message = `안녕하세요!! ${consultation.customer_name}님!
저신용 테슬라 신차렌트 관심있다고 하셔서
연락남겨드립니다!

무심사 테슬라 쪽에서는
전국에서 제일 낮은 조건으로 알아봐 드리겠습니다!

궁금하신 부분은 다 여쭤봐 주세요!!!`;

    const response = await fetch('/api/sendSMS', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: consultation.phone,
        message: message,
        customerName: consultation.customer_name
        // MMS 이미지는 CoolSMS 파일 업로드 API를 먼저 사용해야 함
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'SMS 발송 실패');
    }

    const result = await response.json();
    console.log('✅ SMS 발송 성공:', result);
    return result;
  } catch (error) {
    console.error('❌ SMS 발송 실패:', error);
    throw error;
  }
}
