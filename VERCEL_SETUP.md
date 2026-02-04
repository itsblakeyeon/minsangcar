# Vercel 환경 변수 설정 가이드 (CoolSMS)

## 🎯 목적

민생카 리드 제출 시 자동으로 SMS를 발송하기 위해 Vercel에 CoolSMS API 환경 변수를 설정합니다.

---

## 📋 CoolSMS 설정

### 1단계: CoolSMS 계정 준비

1. https://coolsms.co.kr 회원가입
2. 대시보드 로그인
3. **설정 > API Key 관리**에서 다음 정보 확인:
   - API Key
   - API Secret
4. **발신번호 관리**에서 발신번호 등록 (01035203234)

---

## 🔧 Vercel 환경 변수 설정

### 필요한 환경 변수

```env
COOLSMS_API_KEY=your_api_key_here
COOLSMS_API_SECRET=your_api_secret_here
COOLSMS_FROM=01035203234
```

### 설정 방법

1. https://vercel.com/dashboard 접속
2. **minsangcar** 프로젝트 선택
3. **Settings** → **Environment Variables**
4. 다음 3개 변수 추가:

#### Variable 1
```
Name: COOLSMS_API_KEY
Value: [CoolSMS 대시보드에서 확인한 API Key]
Environment: Production, Preview, Development (모두 체크)
```

#### Variable 2
```
Name: COOLSMS_API_SECRET
Value: [CoolSMS 대시보드에서 확인한 API Secret]
Environment: Production, Preview, Development (모두 체크)
```

#### Variable 3
```
Name: COOLSMS_FROM
Value: 01035203234
Environment: Production, Preview, Development (모두 체크)
```

### 재배포

환경 변수 추가 후:
1. **Deployments** 탭으로 이동
2. 최신 배포를 **Redeploy** (재배포)

---

## ✅ 테스트 방법

재배포 완료 후:

```bash
curl -X POST https://minsangcar.vercel.app/api/sendSMS \
  -H "Content-Type: application/json" \
  -d '{"to":"010-3520-3234","message":"테스트 메시지","customerName":"테스트"}'
```

성공 응답:
```json
{
  "success": true,
  "to": "010-3520-3234",
  "message": "테스트 메시지",
  "customerName": "테스트",
  "messageId": "...",
  "timestamp": "..."
}
```

---

## 🔍 SMS 발송 플로우

```
유저 리드 제출
    ↓
Supabase에 저장 ✅
    ↓
3가지 동시 실행:
├─ 💬 Slack 알림
├─ 📊 Google Sheets 기록
└─ 📱 SMS 발송 (Vercel Function → CoolSMS API)
    ↓
완료! ✅
```

---

## 🚨 트러블슈팅

### SMS가 발송되지 않는 경우

1. **Vercel 로그 확인**
   - Deployments → 최신 배포 → Functions 로그
   - `/api/sendSMS` 함수 에러 확인

2. **환경 변수 확인**
   - Settings → Environment Variables
   - 3개 변수가 모두 설정되어 있는지 확인

3. **CoolSMS 크레딧 확인**
   - CoolSMS 대시보드에서 잔액 확인
   - 발신번호가 승인되었는지 확인

4. **재배포**
   - 환경 변수 변경 후 반드시 재배포 필요

---

## 💰 CoolSMS 요금

- SMS(단문): 건당 약 9~15원
- LMS(장문): 건당 약 30~50원
- 선불 충전 방식

---

## 📞 SMS 메시지 내용

현재 발송되는 메시지:
```
안녕하세요 {고객명}님! 민생카입니다. 문의 주셔서 감사합니다. 곧 연락드리겠습니다!
```

메시지 수정 방법:
- `src/api/entities/consultations.js` 파일의 `sendSMS` 함수에서 `message` 변수 수정

---

## 🎉 완료!

설정이 완료되면 리드 제출 시 자동으로 SMS가 발송됩니다!

## ⚡ CoolSMS 장점

- ✅ IP 제한 없음 (뿌리오와 다르게!)
- ✅ 간단한 REST API
- ✅ 좋은 문서화
- ✅ 안정적인 서비스
- ✅ 합리적인 가격
