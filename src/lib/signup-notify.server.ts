const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

// Owner-only notification; never blocks or fails the signup itself.
export async function notifyOwnerOfSignup(d: { email: string; whatsapp: string; goal: string; obstacle: string; kind: string; position: number }) {
  try {
    const lovableKey = process.env['LOVABLE_API_KEY'];
    const resendKey = process.env['RESEND_API_KEY'];
    if (!lovableKey || !resendKey) return console.error('Signup notify: missing email keys');
    const label = d.kind === 'beta' ? `Membre bêta n°${d.position} / 50` : 'Liste prioritaire';
    const rows = [['Type', label], ['E-mail', d.email], ['WhatsApp', d.whatsapp || '—'], ['Objectif', d.goal], ['Principal blocage', d.obstacle || '—'], ['Date', new Date().toLocaleString('fr-FR', { timeZone: 'Africa/Lagos' })]];
    const html = `<div style="font-family:Arial,sans-serif;color:#123">
<h2 style="color:#0f766e">Nouvelle inscription Résonance</h2>
<table style="border-collapse:collapse">${rows.map(([k, v]) => `<tr><td style="padding:6px 14px 6px 0;color:#567"><b>${k}</b></td><td style="padding:6px 0">${esc(v)}</td></tr>`).join('')}</table></div>`;
    const res = await fetch('https://connector-gateway.lovable.dev/resend/emails', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${lovableKey}`, 'X-Connection-Api-Key': resendKey },
      body: JSON.stringify({ from: 'Résonance <onboarding@resend.dev>', to: ['princeadilehou@gmail.com'], subject: `Nouvelle inscription — ${label}`, html }),
    });
    if (!res.ok) console.error(`Signup notify failed [${res.status}]: ${await res.text()}`);
  } catch (e) {
    console.error('Signup notify error', e);
  }
}
