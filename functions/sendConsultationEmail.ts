import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const body = await req.json();
        
        const { data: consultation } = body;
        
        if (!consultation) {
            return Response.json({ error: 'Missing consultation data' }, { status: 400 });
        }

        // Format the email
        const message = `새로운 상담 요청이 들어왔습니다!

고객명: ${consultation.customer_name}
연락처: ${consultation.phone}
${consultation.vehicle_name ? `희망차량: ${consultation.vehicle_name}` : ''}
${consultation.credit_status ? `신용상태: ${consultation.credit_status}` : ''}
${consultation.message ? `추가 요청: ${consultation.message}` : ''}
상담상태: ${consultation.status}`;

        // Send email to support email
        await base44.asServiceRole.integrations.Core.SendEmail({
            to: 'noah@whitecube.co.kr',
            subject: `[새 상담 요청] ${consultation.customer_name} - ${consultation.phone}`,
            body: message,
            from_name: '민생지원카'
        });

        return Response.json({ success: true, message: 'Email sent' });
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
});