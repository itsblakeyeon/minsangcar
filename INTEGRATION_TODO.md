# 🔄 Noah 프로젝트 통합 작업 계획

**작성일:** 2026-02-04
**상태:** 대기 중

---

## 📋 현황 파악

### 발견된 프로젝트들

1. **minsangcar/** (현재 프로젝트)
   - 깃헙에서 가져온 최신 민생카 랜딩페이지
   - Vite + React + Supabase
   - SMS 연동 없음

2. **noah_admin/**
   - SMS 자동화 백엔드 시스템
   - Express + PostgreSQL + Claude AI + 뿌리오 SMS API
   - Railway 배포: `https://faraday-minsang-project-production.up.railway.app`
   - 고객 관리 + SMS 발송 + AI 자동 응답

3. **noah_client/**
   - v0.app 기본 Next.js 템플릿 (거의 비어있음)
   - 내부에 `무제/minsangcar/` 폴더에 민생카 코드 복사본 있음
   - **중요**: SMS 시스템 연동 코드가 추가되어 있음

---

## 🎯 통합 목표

noah_admin의 SMS 자동화 시스템을 현재 민생카 랜딩페이지와 연동하여,
상담 신청 시 자동으로 고객 정보가 저장되고 SMS가 발송되도록 구성

---

## ✅ 통합 작업 체크리스트

### 1단계: 코드 변경사항 반영

- [ ] `noah_client/무제/minsangcar/src/api/entities/consultations.js` 파일 열기
- [ ] `src/api/entities/consultations.js` 파일과 비교
- [ ] 차이점 확인 및 SMS 연동 코드 복사

**변경할 파일:** `src/api/entities/consultations.js`

**추가할 코드:**

```javascript
// consultations.js의 create 함수 내부에 추가 (line 40 근처)

    // 🆕 SMS 시스템 전송 (실패해도 상담 신청은 성공으로 처리)
    sendToFaradaySMS(consultationData).catch((err) => {
      console.error('SMS 시스템 전송 실패:', err);
    });
```

**파일 끝부분에 새 함수 추가:**

```javascript
// 🆕 Faraday SMS 시스템 전송
async function sendToFaradaySMS(consultation) {
  try {
    await fetch('https://faraday-minsang-project-production.up.railway.app/api/customers/from-landing', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: consultation.customer_name,
        phone: consultation.phone,
        notes: `차량: ${consultation.vehicle_name || '미정'}, 방식: ${consultation.preferred_method}`
      })
    });
    console.log('✅ SMS 시스템 전송 성공!');
  } catch (error) {
    console.error('❌ SMS 시스템 전송 실패:', error);
    throw error;
  }
}
```

### 2단계: noah_admin 백엔드 확인

- [ ] noah_admin이 Railway에 정상 배포되어 있는지 확인
- [ ] `/api/customers/from-landing` 엔드포인트 테스트
- [ ] PostgreSQL 데이터베이스 연결 확인
- [ ] 뿌리오 SMS API 키 설정 확인

**필요한 환경 변수 (noah_admin/.env):**
```
PPURIO_ACCOUNT=계정명
PPURIO_API_KEY=API키
PPURIO_FROM=발신번호
DB_HOST=데이터베이스호스트
DB_NAME=faraday_sms
DB_USER=유저명
DB_PASSWORD=비밀번호
ANTHROPIC_API_KEY=Claude_API_키 (선택)
```

### 3단계: 테스트

- [ ] 로컬에서 민생카 랜딩페이지 실행 (`npm run dev`)
- [ ] 상담 신청 폼 작성 후 제출
- [ ] Supabase `consultations` 테이블에 데이터 저장 확인
- [ ] noah_admin PostgreSQL `customers` 테이블에 데이터 저장 확인
- [ ] SMS 발송 여부 확인 (뿌리오 대시보드 또는 로그)
- [ ] Slack 알림 정상 작동 확인
- [ ] Google Sheets 연동 확인

### 4단계: 정리

- [ ] noah_client 폴더 삭제 (또는 백업 후 삭제)
  ```bash
  # 백업 원할 경우
  mv noah_client noah_client_backup

  # 완전 삭제
  rm -rf noah_client
  ```

- [ ] noah_admin 프로젝트를 별도 저장소로 분리 (선택)
  ```bash
  cd noah_admin
  git remote add origin <새-저장소-URL>
  git push -u origin main
  ```

---

## 🔍 주요 차이점 상세

### consultations.js 비교

**현재 minsangcar (line 35-42):**
```javascript
const consultationData = await supabase
  .from('consultations')
  .insert([data])
  .select()
  .single();

// Slack, Google Sheets 전송만 있음
```

**noah_client/무제/minsangcar (line 35-44):**
```javascript
const consultationData = await supabase
  .from('consultations')
  .insert([data])
  .select()
  .single();

// 🆕 SMS 시스템 전송 추가
sendToFaradaySMS(consultationData).catch((err) => {
  console.error('SMS 시스템 전송 실패:', err);
});

// Slack, Google Sheets 전송
```

---

## 📚 관련 파일 위치

### 수정 필요
- `src/api/entities/consultations.js` - SMS 연동 코드 추가

### 참고용
- `noah_client/무제/minsangcar/src/api/entities/consultations.js` - 변경사항 확인
- `noah_admin/src/routes/customerRoutes.js` - 백엔드 엔드포인트
- `noah_admin/src/services/smsService.js` - SMS 발송 로직
- `noah_admin/src/services/claudeService.js` - AI 자동 응답
- `noah_admin/database/init.sql` - 데이터베이스 스키마

---

## 🚨 주의사항

1. **비동기 처리**: SMS 전송은 실패해도 상담 신청 자체는 성공으로 처리되도록 `.catch()` 사용
2. **Railway 배포 URL**: 하드코딩되어 있으므로 변경 시 수정 필요
3. **환경 변수**: noah_admin의 뿌리오 API 키가 제대로 설정되어 있는지 확인
4. **Mock 모드**: API 키 없을 경우 Mock 모드로 작동 (실제 SMS 발송 안됨)

---

## 🎉 완료 후

- [ ] git commit으로 변경사항 저장
  ```bash
  git add src/api/entities/consultations.js
  git commit -m "feat: Faraday SMS 시스템 연동 추가"
  ```

- [ ] 배포 환경에서도 테스트
- [ ] 이 문서를 아카이브하거나 삭제

---

## 📞 문제 발생 시

- noah_admin 로그 확인: Railway 대시보드 → Logs
- 네트워크 오류: CORS 설정 확인
- SMS 미발송: 뿌리오 API 키 및 계정 잔액 확인
- DB 연결 오류: PostgreSQL 연결 정보 확인
