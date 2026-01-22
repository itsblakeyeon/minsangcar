import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const body = await req.json();
        
        const { event } = body;
        
        if (!event || event.type !== 'create') {
            return Response.json({ success: true });
        }

        const consultation = event.data;
        
        if (!consultation) {
            return Response.json({ error: 'Missing consultation data' }, { status: 400 });
        }

        // Format the email message
        const emailBody = `새로운 상담 요청이 들어왔습니다!

고객명: ${consultation.customer_name}
연락처: ${consultation.phone}
${consultation.vehicle_name ? `희망차량: ${consultation.vehicle_name}` : ''}
${consultation.credit_status ? `신용상태: ${consultation.credit_status}` : ''}
${consultation.message ? `추가 요청: ${consultation.message}` : ''}
${consultation.preferred_method ? `선호 상담방식: ${consultation.preferred_method}` : ''}
상담상태: ${consultation.status}`;

        // Send email
        await base44.asServiceRole.integrations.Core.SendEmail({
            to: 'support@minsengcard.com',
            subject: '새로운 상담 요청이 들어왔습니다',
            body: emailBody,
            from_name: '민생지원카'
        });

        return Response.json({ success: true, message: 'Email sent' });
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
});