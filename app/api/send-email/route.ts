import { NextRequest, NextResponse } from 'next/server';

interface SendEmailBody {
  email: string;
  prenom: string;
  poste_label: string;
  gem_instructions: string;
  prompt_metier: string;
}

// Encode le texte pour un affichage safe dans le HTML de l'email
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n/g, '<br>');
}

function buildEmailHtml(body: SendEmailBody): string {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://gemforge-beapi.vercel.app';

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Ton Gem Gemini — BeAPI Formation IA</title>
</head>
<body style="margin:0;padding:0;background:#0f0f14;font-family:'Courier New',monospace;color:#e8e8f0;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f0f14;padding:32px 16px;">
    <tr>
      <td>
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;margin:0 auto;">

          <!-- En-tête -->
          <tr>
            <td style="background:#16161f;border-radius:12px 12px 0 0;padding:24px 32px;border-bottom:1px solid #252535;">
              <img src="${appUrl}/logo-beapi.png" alt="BeAPI" height="40" style="display:block;margin-bottom:16px;" onerror="this.style.display='none'">
              <p style="margin:0;font-family:Arial,sans-serif;font-size:12px;color:#6b7280;letter-spacing:0.1em;text-transform:uppercase;">GemForge · Formation IA · Cap IA × DataBird</p>
              <h1 style="margin:8px 0 0;font-family:Arial,sans-serif;font-size:22px;font-weight:800;color:#ffffff;">
                Ton Gem Gemini — ${escapeHtml(body.poste_label)}
              </h1>
              <p style="margin:8px 0 0;font-family:Arial,sans-serif;font-size:14px;color:#6b7280;">
                Bonjour ${escapeHtml(body.prenom)}, voici ton assistant IA personnalisé pour BeAPI.
              </p>
            </td>
          </tr>

          <!-- Bloc 1 : Instructions Gem -->
          <tr>
            <td style="background:#16161f;padding:24px 32px;">
              <p style="margin:0 0 12px;font-family:Arial,sans-serif;font-size:11px;font-weight:700;color:#818cf8;letter-spacing:0.15em;text-transform:uppercase;">
                ✦ Instructions système — Gem Gemini
              </p>
              <div style="background:#1a1a26;border-left:3px solid #818cf8;border-radius:0 8px 8px 0;padding:20px;font-size:13px;line-height:1.7;color:#e8e8f0;font-style:italic;">
                ${escapeHtml(body.gem_instructions)}
              </div>
            </td>
          </tr>

          <!-- Bloc 2 : Prompt métier -->
          <tr>
            <td style="background:#16161f;padding:0 32px 24px;">
              <p style="margin:0 0 12px;font-family:Arial,sans-serif;font-size:11px;font-weight:700;color:#f59e0b;letter-spacing:0.15em;text-transform:uppercase;">
                ◆ Prompt métier à tester
              </p>
              <div style="background:#1a1a26;border-left:3px solid #f59e0b;border-radius:0 8px 8px 0;padding:20px;font-size:13px;line-height:1.7;color:#e8e8f0;">
                ${escapeHtml(body.prompt_metier)}
              </div>
            </td>
          </tr>

          <!-- Bloc 3 : Guide 5 étapes -->
          <tr>
            <td style="background:#16161f;padding:0 32px 24px;">
              <div style="background:#1a1a26;border-radius:8px;padding:20px;">
                <p style="margin:0 0 16px;font-family:Arial,sans-serif;font-size:13px;font-weight:700;color:#34d399;">
                  Comment créer ton Gem dans Gemini
                </p>
                <table cellpadding="0" cellspacing="0" width="100%">
                  ${[
                    ['1', 'Ouvre Gemini Gems', 'Rends-toi sur <a href="https://gemini.google.com/gems/create" style="color:#818cf8;">gemini.google.com/gems/create</a>'],
                    ['2', 'Crée un nouveau Gem', 'Clique sur "Nouveau Gem"'],
                    ['3', 'Colle les instructions système', 'Copie le bloc violet ci-dessus dans le champ "Instructions"'],
                    ['4', 'Donne un nom à ton Gem', 'Ex : "Assistant BeAPI ' + body.poste_label + '"'],
                    ['5', 'Teste avec le prompt métier', 'Copie le bloc orange et colle-le dans la conversation pour tester'],
                  ].map(([num, title, desc]) => `
                  <tr>
                    <td style="width:32px;vertical-align:top;padding-bottom:12px;">
                      <span style="display:inline-block;width:24px;height:24px;background:#5b6af5;border-radius:50%;text-align:center;line-height:24px;font-family:Arial,sans-serif;font-size:12px;font-weight:700;color:#fff;">${num}</span>
                    </td>
                    <td style="padding-bottom:12px;padding-left:8px;vertical-align:top;">
                      <p style="margin:0;font-family:Arial,sans-serif;font-size:13px;font-weight:600;color:#e8e8f0;">${title}</p>
                      <p style="margin:4px 0 0;font-family:Arial,sans-serif;font-size:12px;color:#6b7280;">${desc}</p>
                    </td>
                  </tr>`).join('')}
                </table>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#16161f;border-radius:0 0 12px 12px;padding:20px 32px;border-top:1px solid #252535;text-align:center;">
              <p style="margin:0;font-family:Arial,sans-serif;font-size:11px;color:#6b7280;">
                Formé par Cap IA × DataBird · 8 juin 2026 · cap-ia.pro
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function POST(request: NextRequest) {
  let body: SendEmailBody;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Corps de la requête invalide' }, { status: 400 });
  }

  const { email, prenom, poste_label, gem_instructions, prompt_metier } = body;

  // Validation basique de l'email côté serveur
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return NextResponse.json({ error: 'Adresse email invalide' }, { status: 400 });
  }

  if (!prenom || !poste_label || !gem_instructions || !prompt_metier) {
    return NextResponse.json({ error: 'Données manquantes' }, { status: 400 });
  }

  const htmlContent = buildEmailHtml(body);

  let brevoResponse: Response;
  try {
    brevoResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': process.env.BREVO_API_KEY!,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        sender: {
          name: 'GemForge · Cap IA',
          email: process.env.BREVO_SENDER_EMAIL,
        },
        to: [{ email, name: prenom }],
        subject: `Ton Gem Gemini ${poste_label} — BeAPI Formation IA`,
        htmlContent,
      }),
    });
  } catch {
    return NextResponse.json(
      { error: 'Erreur réseau lors de l\'envoi. Vérifie ta connexion.' },
      { status: 500 }
    );
  }

  if (!brevoResponse.ok) {
    const errorData = await brevoResponse.json().catch(() => ({}));
    console.error('[Brevo] Erreur envoi email :', errorData);
    return NextResponse.json(
      { error: 'Échec de l\'envoi de l\'email. Contacte le formateur.' },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
