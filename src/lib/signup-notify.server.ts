const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
const OWNER_EMAIL = 'princeadilehou@gmail.com';

// Owner-only notification; never blocks or fails the action that triggered it.
async function sendOwnerEmail(title: string, subject: string, rows: [string, string][]) {
  try {
    const lovableKey = process.env['LOVABLE_API_KEY'];
    const resendKey = process.env['RESEND_API_KEY'];
    if (!lovableKey || !resendKey) return console.error('Owner notify: missing email keys');
    const html = `<div style="font-family:Arial,sans-serif;color:#123">
<h2 style="color:#0f766e">${esc(title)}</h2>
<table style="border-collapse:collapse">${rows.map(([k, v]) => `<tr><td style="padding:6px 14px 6px 0;color:#567;vertical-align:top"><b>${k}</b></td><td style="padding:6px 0">${esc(v ?? "").replace(/\n/g, '<br>')}</td></tr>`).join('')}</table></div>`;
    const res = await fetch('https://connector-gateway.lovable.dev/resend/emails', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${lovableKey}`, 'X-Connection-Api-Key': resendKey },
      body: JSON.stringify({ from: 'Résonance <onboarding@resend.dev>', to: [OWNER_EMAIL], subject, html }),
    });
    if (!res.ok) console.error(`Owner notify failed [${res.status}]: ${await res.text()}`);
  } catch (e) {
    console.error('Owner notify error', e);
  }
}

export async function notifyOwnerOfSignup(d: { email: string; whatsapp: string; goal: string; obstacle: string; kind: string; position: number }) {
  const label = d.kind === 'beta' ? `Membre bêta n°${d.position} / 50` : 'Liste prioritaire';
  await sendOwnerEmail('Nouvelle inscription Résonance', `Nouvelle inscription — ${label}`, [['Type', label], ['E-mail', d.email], ['WhatsApp', d.whatsapp || '—'], ['Objectif', d.goal], ['Principal blocage', d.obstacle || '—'], ['Date', new Date().toLocaleString('fr-FR', { timeZone: 'Africa/Lagos' })]]);
}

export async function notifyOwnerOfContact(d: { name: string; email: string; message: string }) {
  await sendOwnerEmail('Nouveau message de contact Résonance', `Nouveau message de contact — ${d.name}`, [['Nom', d.name], ['E-mail', d.email], ['Message', d.message], ['Date', new Date().toLocaleString('fr-FR', { timeZone: 'Africa/Lagos' })]]);
}
