const Anthropic = require('@anthropic-ai/sdk');

const SYSTEM_PROMPT = `당신은 친절한 고객 상담 AI 어시스턴트입니다.

역할:
- 고객의 문의에 친절하고 정확하게 응답합니다
- SMS 응답이므로 간결하게 작성합니다 (최대 160자)
- 한국어로 응답합니다
- 존댓말을 사용합니다

주의사항:
- 확실하지 않은 정보는 확인 후 안내드리겠다고 말합니다
- 복잡한 문의는 담당자 연결을 안내합니다
- 항상 도움이 되고자 하는 자세로 응답합니다`;

// Mock 응답 (API 키 없을 때 사용)
const MOCK_RESPONSES = {
  '영업시간': '안녕하세요! 영업시간은 평일 09:00~18:00입니다. 주말은 휴무입니다. 감사합니다.',
  '가격': '문의하신 상품 가격은 담당자 확인 후 안내드리겠습니다. 잠시만 기다려주세요.',
  '배송': '배송은 결제 완료 후 2-3일 내 출고됩니다. 추가 문의사항 있으시면 말씀해주세요.',
  'default': '안녕하세요! 문의 감사합니다. 담당자가 확인 후 신속히 답변드리겠습니다.'
};

class ClaudeService {
  constructor() {
    this.apiKey = process.env.ANTHROPIC_API_KEY;
    this.mockMode = !this.apiKey || this.apiKey === 'your_anthropic_api_key';

    if (!this.mockMode) {
      this.client = new Anthropic({ apiKey: this.apiKey });
    }

    console.log(`[ClaudeService] Mock 모드: ${this.mockMode}`);
  }

  getMockResponse(message) {
    const lowerMsg = message.toLowerCase();
    for (const [keyword, response] of Object.entries(MOCK_RESPONSES)) {
      if (keyword !== 'default' && lowerMsg.includes(keyword)) {
        return response;
      }
    }
    return MOCK_RESPONSES.default;
  }

  async generateMessage(prompt) {
    if (this.mockMode) {
      console.log('[ClaudeService] Mock 응답 생성');
      return this.getMockResponse(prompt);
    }

    const response = await this.client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    });
    return response.content[0].text;
  }

  async generateSmsContent(context) {
    const prompt = `다음 상황에 맞는 SMS 메시지를 작성해주세요. 160자 이내로 작성해주세요.\n\n상황: ${context}`;
    return this.generateMessage(prompt);
  }

  async generateAutoReply(customerMessage, conversationHistory = []) {
    if (this.mockMode) {
      console.log('[ClaudeService] Mock 자동 응답 생성');
      return this.getMockResponse(customerMessage);
    }

    const messages = [
      ...conversationHistory,
      { role: 'user', content: customerMessage }
    ];

    const response = await this.client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 200,
      system: SYSTEM_PROMPT,
      messages: messages,
    });

    return response.content[0].text;
  }
}

module.exports = new ClaudeService();
