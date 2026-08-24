export type ContactPayload = {
  name: string;
  email: string;
  company: string;
  phone: string;
  subject: string;
  message: string;
  website: string;
};

const allowedSubjects = new Set([
  '',
  'Minør- og sprængningsarbejde',
  'Jord- og terrænarbejde',
  'Andet',
]);

function stringField(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function hasHeaderBreak(value: string) {
  return value.includes('\r') || value.includes('\n');
}

export function validateContactPayload(value: unknown):
  | { success: true; data: ContactPayload }
  | { success: false } {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return { success: false };
  }

  const input = value as Record<string, unknown>;
  const data: ContactPayload = {
    name: stringField(input.name),
    email: stringField(input.email).toLowerCase(),
    company: stringField(input.company),
    phone: stringField(input.phone),
    subject: stringField(input.subject),
    message: stringField(input.message),
    website: stringField(input.website),
  };

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const valid =
    data.name.length >= 2 &&
    data.name.length <= 100 &&
    !hasHeaderBreak(data.name) &&
    data.email.length <= 254 &&
    emailPattern.test(data.email) &&
    !hasHeaderBreak(data.email) &&
    data.company.length <= 120 &&
    data.phone.length <= 40 &&
    data.message.length >= 10 &&
    data.message.length <= 3000 &&
    allowedSubjects.has(data.subject) &&
    data.website.length <= 200;

  return valid ? { success: true, data } : { success: false };
}

function escapeHtml(value: string) {
  return value.replace(
    /[&<>'"]/g,
    (character) =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#039;',
        '"': '&quot;',
      })[character] ?? character,
  );
}

export function buildContactEmail(data: ContactPayload) {
  const rows = [
    ['Navn', data.name],
    ['E-mail', data.email],
    ['Firma', data.company || 'Ikke oplyst'],
    ['Telefon', data.phone || 'Ikke oplyst'],
    ['Opgavetype', data.subject || 'Ikke oplyst'],
  ];

  const htmlRows = rows
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding:10px 18px 10px 0;color:#6b6b65;vertical-align:top;white-space:nowrap">${escapeHtml(label)}</td>
          <td style="padding:10px 0;color:#151614;font-weight:600">${escapeHtml(value)}</td>
        </tr>`,
    )
    .join('');

  const html = `<!doctype html>
    <html lang="da">
      <body style="margin:0;background:#f3f0e9;font-family:Arial,Helvetica,sans-serif;color:#151614">
        <div style="max-width:680px;margin:0 auto;padding:32px 18px">
          <div style="background:#ffdd11;height:8px"></div>
          <div style="background:#ffffff;padding:34px">
            <p style="margin:0 0 8px;color:#6b6b65;font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase">Larsen &amp; Co. · Hjemmesiden</p>
            <h1 style="margin:0 0 26px;font-size:28px;line-height:1.15">Ny forespørgsel</h1>
            <table role="presentation" style="border-collapse:collapse;width:100%;font-size:15px">${htmlRows}</table>
            <div style="margin-top:28px;padding-top:24px;border-top:1px solid #dedbd3">
              <p style="margin:0 0 10px;color:#6b6b65;font-size:13px;font-weight:700;text-transform:uppercase">Besked</p>
              <p style="margin:0;white-space:pre-wrap;font-size:16px;line-height:1.65">${escapeHtml(data.message)}</p>
            </div>
          </div>
        </div>
      </body>
    </html>`;

  const text = [
    'Ny forespørgsel via Larsen & Co.s hjemmeside',
    '',
    ...rows.map(([label, value]) => `${label}: ${value}`),
    '',
    'Besked:',
    data.message,
  ].join('\n');

  return { html, text };
}
