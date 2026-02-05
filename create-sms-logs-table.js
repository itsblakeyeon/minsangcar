// Supabase SMS 로그 테이블 확인 및 생성 가이드
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('\n❌ 환경 변수가 설정되지 않았습니다.');
  console.error('VITE_SUPABASE_URL:', supabaseUrl ? 'OK' : 'MISSING');
  console.error('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'OK' : 'MISSING');
  console.log('\nVercel 환경 변수를 확인해주세요.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const createTableSQL = `
-- SMS 발송 로그 테이블 생성
CREATE TABLE IF NOT EXISTS sms_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  recipient TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  customer_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성 (조회 성능 향상)
CREATE INDEX IF NOT EXISTS idx_sms_logs_created_at ON sms_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sms_logs_recipient ON sms_logs(recipient);

-- RLS (Row Level Security) 정책 - 모든 사용자가 읽기/쓰기 가능
ALTER TABLE sms_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Enable read access for all users" ON sms_logs
  FOR SELECT USING (true);

CREATE POLICY IF NOT EXISTS "Enable insert for all users" ON sms_logs
  FOR INSERT WITH CHECK (true);
`;

async function checkAndCreateTable() {
  console.log('\n📦 Supabase SMS 로그 테이블 확인 중...\n');

  try {
    // 테이블 존재 여부 확인
    const { data, error } = await supabase
      .from('sms_logs')
      .select('id')
      .limit(1);

    if (error) {
      if (error.message.includes('relation') && error.message.includes('does not exist')) {
        console.log('❌ sms_logs 테이블이 존재하지 않습니다.\n');
        console.log('📝 Supabase 대시보드 > SQL Editor에서 아래 SQL을 실행해주세요:');
        console.log('='.repeat(60));
        console.log(createTableSQL);
        console.log('='.repeat(60));
        console.log('\n또는 누군가에게 Supabase 대시보드 접근 권한을 요청하세요.\n');
      } else {
        console.error('❌ 오류:', error.message);
        console.log('\n권한 문제일 수 있습니다. RLS 정책을 확인해주세요.');
      }
      process.exit(1);
    }

    console.log('✅ sms_logs 테이블이 이미 존재합니다!');
    console.log('✅ SMS 발송 로그 기능이 정상적으로 작동합니다.\n');

    // 샘플 데이터 확인
    const { data: logs, error: logsError } = await supabase
      .from('sms_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);

    if (!logsError && logs && logs.length > 0) {
      console.log(`📊 최근 SMS 로그 ${logs.length}개:`);
      logs.forEach(log => {
        console.log(`  - ${log.recipient} | ${log.status} | ${new Date(log.created_at).toLocaleString('ko-KR')}`);
      });
    } else {
      console.log('📭 아직 SMS 발송 로그가 없습니다.');
    }

  } catch (error) {
    console.error('\n❌ 예상치 못한 오류:', error.message);
    console.log('\n📝 테이블을 수동으로 생성해야 합니다:');
    console.log('='.repeat(60));
    console.log(createTableSQL);
    console.log('='.repeat(60));
  }
}

checkAndCreateTable();
