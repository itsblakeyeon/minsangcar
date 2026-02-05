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

-- RLS (Row Level Security) 정책 - 모든 사용자가 읽기 가능
ALTER TABLE sms_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON sms_logs
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for all users" ON sms_logs
  FOR INSERT WITH CHECK (true);
