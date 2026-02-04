# Vercel 환경 변수 설정 가이드

## 🎯 목적

민생카 리드 제출 시 자동으로 SMS를 발송하기 위해 Vercel에 뿌리오 API 환경 변수를 설정합니다.

---

## 📋 필요한 환경 변수

```env
PPURIO_ACCOUNT=whitecube
PPURIO_API_KEY=1a968d318fecb5ce729fddf022448b20748f3f91b8e861bf4eb3235a8440916d
PPURIO_FROM=01035203234
```

---

## 🔧 설정 방법

### 1단계: Vercel 대시보드 접속

1. https://vercel.com/dashboard 접속
2. **minsangcar** 프로젝트 선택

### 2단계: 환경 변수 추가

1. **Settings** 탭 클릭
2. 왼쪽 메뉴에서 **Environment Variables** 클릭
3. 다음 3개 변수를 하나씩 추가:

#### Variable 1
```
Name: PPURIO_ACCOUNT
Value: whitecube
Environment: Production, Preview, Development (모두 체크)
```

#### Variable 2
```
Name: PPURIO_API_KEY
Value: 1a968d318fecb5ce729fddf022448b20748f3f91b8e861bf4eb3235a8440916d
Environment: Production, Preview, Development (모두 체크)
```

#### Variable 3
```
Name: PPURIO_FROM
Value: 01035203234
Environment: Production, Preview, Development (모두 체크)
```

### 3단계: 재배포

환경 변수 추가 후:
1. **Deployments** 탭으로 이동
2. 최신 배포를 **Redeploy** (재배포)
   - 또는 코드를 push하면 자동 배포됨

---

## ✅ 확인 방법

재배포 완료 후:
1. https://minsangcar.vercel.app 접속
2. 상담 신청 폼 작성
3. 제출 후 SMS 수신 확인

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
└─ 📱 SMS 발송 (Vercel Function → 뿌리오 API)
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

3. **재배포**
   - 환경 변수 변경 후 반드시 재배포 필요

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
