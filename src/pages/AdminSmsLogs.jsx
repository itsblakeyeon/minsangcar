import { useState, useEffect } from 'react';
import { supabase } from '@/api/supabaseClient';

export default function AdminSmsLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadLogs();
    // 30초마다 자동 새로고침
    const interval = setInterval(loadLogs, 30000);
    return () => clearInterval(interval);
  }, []);

  async function loadLogs() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('sms_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      setLogs(data || []);
      setError(null);
    } catch (err) {
      console.error('SMS 로그 조회 실패:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  function formatPhone(phone) {
    if (!phone) return '-';
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 11) {
      return cleaned.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
    } else if (cleaned.length === 10) {
      return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
    }
    return phone;
  }

  if (loading && logs.length === 0) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <div style={{ fontSize: '18px', color: '#666' }}>로딩 중...</div>
      </div>
    );
  }

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px'
      }}>
        <h1 style={{ fontSize: '24px', fontWeight: '600', color: '#333' }}>
          📱 SMS 발송 로그 (Supabase)
        </h1>
        <button
          onClick={loadLogs}
          style={{
            padding: '10px 20px',
            background: '#4880EE',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '600'
          }}
        >
          새로고침
        </button>
      </div>

      {error && (
        <div style={{
          background: '#f8d7da',
          color: '#721c24',
          padding: '12px',
          borderRadius: '6px',
          marginBottom: '20px'
        }}>
          ❌ {error}
        </div>
      )}

      <div style={{
        background: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse'
        }}>
          <thead>
            <tr style={{ background: '#f8f9fa' }}>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#333', borderBottom: '1px solid #eee' }}>
                발송 시간
              </th>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#333', borderBottom: '1px solid #eee' }}>
                고객명
              </th>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#333', borderBottom: '1px solid #eee' }}>
                받는 사람
              </th>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#333', borderBottom: '1px solid #eee' }}>
                메시지
              </th>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#333', borderBottom: '1px solid #eee' }}>
                상태
              </th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: '#999' }}>
                  발송 내역이 없습니다
                </td>
              </tr>
            ) : (
              logs.map(log => {
                const statusColor = log.status === 'sent' ? '#28a745' :
                                  log.status === 'pending' ? '#ffc107' : '#dc3545';
                const statusText = log.status === 'sent' ? '발송 완료' :
                                 log.status === 'pending' ? '발송 중' : '실패';

                return (
                  <tr key={log.id}>
                    <td style={{ padding: '12px', borderBottom: '1px solid #eee', fontSize: '14px' }}>
                      {formatDate(log.created_at)}
                    </td>
                    <td style={{ padding: '12px', borderBottom: '1px solid #eee', fontSize: '14px' }}>
                      {log.customer_name || '-'}
                    </td>
                    <td style={{ padding: '12px', borderBottom: '1px solid #eee', fontSize: '14px' }}>
                      {formatPhone(log.recipient)}
                    </td>
                    <td style={{
                      padding: '12px',
                      borderBottom: '1px solid #eee',
                      fontSize: '14px',
                      maxWidth: '300px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }} title={log.message}>
                      {log.message}
                    </td>
                    <td style={{
                      padding: '12px',
                      borderBottom: '1px solid #eee',
                      fontSize: '14px',
                      color: statusColor,
                      fontWeight: '600'
                    }}>
                      {statusText}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: '20px', fontSize: '14px', color: '#666', textAlign: 'center' }}>
        총 {logs.length}개 • 30초마다 자동 새로고침
      </div>
    </div>
  );
}
