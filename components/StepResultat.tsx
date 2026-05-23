'use client';
import { useState } from 'react';

interface GenerateResult {
  gem_instructions: string;
  prompt_metier: string;
  poste_label: string;
  poste_icon: string;
}

interface Props {
  prenom: string;
  result: GenerateResult;
  onRestart: () => void;
}

const GUIDE_STEPS = [
  {
    title: 'Ouvre Gemini Gems',
    desc: 'Rends-toi sur gemini.google.com/gems/create',
    link: 'https://gemini.google.com/gems/create',
  },
  { title: 'Crée un nouveau Gem', desc: 'Clique sur "Nouveau Gem"' },
  { title: 'Colle les instructions système', desc: 'Copie le bloc violet ci-dessus dans le champ "Instructions"' },
  { title: 'Nomme ton Gem', desc: 'Ex : "Assistant BeAPI — [ton poste]"' },
  { title: 'Teste avec le prompt métier', desc: 'Copie le bloc orange et colle-le dans la conversation' },
];

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback pour navigateurs qui ne supportent pas l'API clipboard
      const el = document.createElement('textarea');
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={handleCopy}
      aria-label={copied ? 'Texte copié' : 'Copier le texte'}
      className={`
        px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-200
        ${copied
          ? 'border-[var(--accent-success)] bg-[var(--accent-success)]/10 text-[var(--accent-success)]'
          : 'border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] hover:border-[var(--muted)] hover:text-[var(--text)]'
        }
      `}
    >
      {copied ? '✓ Copié' : 'Copier'}
    </button>
  );
}

async function exportPDF(data: {
  prenom: string;
  poste_label: string;
  gem_instructions: string;
  prompt_metier: string;
}) {
  const { default: jsPDF } = await import('jspdf');
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  const margin = 18;
  const pageW = 210;
  const contentW = pageW - margin * 2;
  let y = 18;

  const addText = (
    text: string,
    opts: { size?: number; bold?: boolean; color?: [number, number, number] } = {}
  ) => {
    const { size = 10, bold = false, color = [40, 40, 60] } = opts;
    doc.setFontSize(size);
    doc.setFont('helvetica', bold ? 'bold' : 'normal');
    doc.setTextColor(...color);
    const lines = doc.splitTextToSize(text, contentW);
    const lineH = size * 0.38;
    if (y + lines.length * lineH > 275) {
      doc.addPage();
      y = 18;
    }
    doc.text(lines, margin, y);
    y += lines.length * lineH + 3;
  };

  const addSep = (light = false) => {
    doc.setDrawColor(light ? 220 : 180, light ? 220 : 180, light ? 235 : 200);
    doc.line(margin, y, pageW - margin, y);
    y += 6;
  };

  // Essayer de charger le logo
  try {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error('Logo indisponible'));
      img.src = '/logo-beapi.png';
      setTimeout(reject, 3000);
    });
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(img, 0, 0);
    const imgData = canvas.toDataURL('image/png');
    const h = 10;
    const w = (img.naturalWidth / img.naturalHeight) * h;
    doc.addImage(imgData, 'PNG', margin, y, w, h);
    y += h + 4;
  } catch {
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(91, 106, 245);
    doc.text('BeAPI', margin, y + 7);
    y += 14;
  }

  addText('GemForge · Formation IA · Cap IA × DataBird', { size: 8, color: [120, 120, 140] });
  y += 2;
  addText(`${data.prenom} — ${data.poste_label}`, { size: 18, bold: true, color: [20, 20, 35] });
  y += 2;
  addSep();

  addText('INSTRUCTIONS SYSTÈME — GEM GEMINI', { size: 9, bold: true, color: [91, 74, 245] });
  y += 1;
  addText(data.gem_instructions, { size: 9.5, color: [50, 50, 70] });
  y += 4;
  addSep(true);

  addText('PROMPT MÉTIER À TESTER', { size: 9, bold: true, color: [180, 120, 10] });
  y += 1;
  addText(data.prompt_metier, { size: 9.5, color: [50, 50, 70] });
  y += 4;
  addSep(true);

  addText('COMMENT CRÉER TON GEM DANS GEMINI', { size: 9, bold: true, color: [30, 150, 100] });
  y += 1;
  GUIDE_STEPS.forEach((step, i) => {
    addText(`${i + 1}. ${step.title} — ${step.desc}`, { size: 9.5, color: [50, 50, 70] });
  });
  y += 4;
  addSep(true);

  addText('Formé par Cap IA × DataBird · 8 juin 2026 · cap-ia.pro', { size: 8, color: [130, 130, 150] });

  const slug = (s: string) => s.toLowerCase().replace(/[\s'/]+/g, '-').replace(/[^a-z0-9-]/g, '');
  doc.save(`gem-${slug(data.prenom)}-${slug(data.poste_label)}.pdf`);
}

export default function StepResultat({ prenom, result, onRestart }: Props) {
  const [guideOpen, setGuideOpen] = useState(false);
  const [showEmail, setShowEmail] = useState(false);
  const [email, setEmail] = useState('');
  const [emailSending, setEmailSending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [pdfLoading, setPdfLoading] = useState(false);

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handlePDF = async () => {
    setPdfLoading(true);
    try {
      await exportPDF({
        prenom,
        poste_label: result.poste_label,
        gem_instructions: result.gem_instructions,
        prompt_metier: result.prompt_metier,
      });
    } finally {
      setPdfLoading(false);
    }
  };

  const handleEmail = async () => {
    if (!emailValid) return;
    setEmailSending(true);
    setEmailError(null);
    try {
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          prenom,
          poste_label: result.poste_label,
          gem_instructions: result.gem_instructions,
          prompt_metier: result.prompt_metier,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Erreur lors de l\'envoi');
      }
      setEmailSent(true);
    } catch (err) {
      setEmailError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setEmailSending(false);
    }
  };

  return (
    <div className="animate-slide-left space-y-4">
      {/* En-tête résultat */}
      <div className="text-center mb-6" style={{ animation: 'fadeUp 0.5s ease forwards' }}>
        <div className="text-3xl mb-2">{result.poste_icon}</div>
        <h2
          className="text-xl font-bold text-[var(--white)]"
          style={{ fontFamily: 'var(--font-syne)' }}
        >
          Ton Gem est prêt, {prenom} !
        </h2>
        <p className="text-[var(--muted)] text-sm mt-1">{result.poste_label}</p>
      </div>

      {/* Carte 1 — Instructions Gem */}
      <div
        className="rounded-2xl border border-[var(--accent-gem)]/30 bg-[var(--card)] overflow-hidden"
        style={{ animation: 'fadeUp 0.5s ease 0.1s both' }}
      >
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[var(--accent-gem)]/20">
          <div className="flex items-center gap-2">
            <span className="text-[var(--accent-gem)] text-lg">✦</span>
            <span className="text-[var(--accent-gem)] text-xs font-bold tracking-widest uppercase">
              Instructions système — Gem Gemini
            </span>
          </div>
          <CopyButton text={result.gem_instructions} />
        </div>
        <div className="px-5 py-4 max-h-64 overflow-y-auto">
          <p
            className="text-sm leading-relaxed whitespace-pre-wrap text-[var(--text)]"
            style={{ fontFamily: 'var(--font-dm-mono)', fontStyle: 'italic' }}
          >
            {result.gem_instructions}
          </p>
        </div>
      </div>

      {/* Carte 2 — Prompt métier */}
      <div
        className="rounded-2xl border border-[var(--accent-prompt)]/30 bg-[var(--card)] overflow-hidden"
        style={{ animation: 'fadeUp 0.5s ease 0.2s both' }}
      >
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[var(--accent-prompt)]/20">
          <div className="flex items-center gap-2">
            <span className="text-[var(--accent-prompt)] text-base">◆</span>
            <span className="text-[var(--accent-prompt)] text-xs font-bold tracking-widest uppercase">
              Prompt métier à tester
            </span>
          </div>
          <CopyButton text={result.prompt_metier} />
        </div>
        <div className="px-5 py-4 max-h-52 overflow-y-auto">
          <p
            className="text-sm leading-relaxed whitespace-pre-wrap text-[var(--text)]"
            style={{ fontFamily: 'var(--font-dm-mono)' }}
          >
            {result.prompt_metier}
          </p>
        </div>
      </div>

      {/* Guide d'utilisation (accordéon) */}
      <div
        className="rounded-2xl border border-[var(--border)] bg-[var(--card)] overflow-hidden"
        style={{ animation: 'fadeUp 0.5s ease 0.3s both' }}
      >
        <button
          onClick={() => setGuideOpen((v) => !v)}
          aria-expanded={guideOpen}
          aria-label="Afficher le guide de création du Gem"
          className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-[var(--surface)] transition-colors"
        >
          <span className="text-[var(--accent-success)] text-sm font-semibold">
            📖 Comment créer ton Gem dans Gemini
          </span>
          <span className={`text-[var(--muted)] transition-transform duration-200 ${guideOpen ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </button>
        {guideOpen && (
          <div className="px-5 pb-5 border-t border-[var(--border)]">
            <ol className="space-y-4 mt-4">
              {GUIDE_STEPS.map((step, i) => (
                <li key={i} className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--accent-primary)] text-white text-xs font-bold flex items-center justify-center mt-0.5">
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-[var(--text)] text-sm font-semibold">{step.title}</p>
                    <p className="text-[var(--muted)] text-xs mt-0.5">
                      {step.link ? (
                        <a
                          href={step.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[var(--accent-gem)] underline"
                          aria-label="Ouvrir Gemini Gems dans un nouvel onglet"
                        >
                          {step.link}
                        </a>
                      ) : (
                        step.desc
                      )}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>

      {/* Boutons d'action */}
      <div className="grid grid-cols-2 gap-3" style={{ animation: 'fadeUp 0.5s ease 0.4s both' }}>
        <button
          onClick={handlePDF}
          disabled={pdfLoading}
          aria-label="Télécharger le Gem en PDF"
          className="min-h-[52px] bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--muted)] text-[var(--text)] font-semibold rounded-xl text-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60"
        >
          {pdfLoading ? '⏳ Génération...' : '⬇ PDF'}
        </button>

        <button
          onClick={() => setShowEmail((v) => !v)}
          aria-label="Recevoir le Gem par email"
          aria-expanded={showEmail}
          className={`min-h-[52px] border font-semibold rounded-xl text-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${
            showEmail
              ? 'bg-[var(--accent-primary)]/15 border-[var(--accent-primary)] text-[var(--accent-gem)]'
              : 'bg-[var(--surface)] border-[var(--border)] hover:border-[var(--muted)] text-[var(--text)]'
          }`}
        >
          ✉ Email
        </button>
      </div>

      {/* Formulaire email inline */}
      {showEmail && (
        <div
          className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 animate-fade-in"
          style={{ animation: 'fadeUp 0.3s ease forwards' }}
        >
          {emailSent ? (
            <p className="text-[var(--accent-success)] text-sm font-semibold text-center py-2">
              ✓ Email envoyé ! Vérifie ta boîte mail.
            </p>
          ) : (
            <div className="flex gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && emailValid) handleEmail(); }}
                placeholder="ton@email.com"
                aria-label="Ton adresse email"
                className="flex-1 bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] placeholder-[var(--muted)] rounded-xl px-4 py-3 text-sm outline-none focus:border-[var(--accent-primary)] transition-colors"
              />
              <button
                onClick={handleEmail}
                disabled={!emailValid || emailSending}
                aria-label="Envoyer le Gem par email"
                className="px-4 min-h-[48px] bg-[var(--accent-primary)] hover:bg-[#6b7cf8] disabled:opacity-40 text-white font-semibold rounded-xl text-sm transition-all duration-200"
              >
                {emailSending ? '...' : 'Envoyer'}
              </button>
            </div>
          )}
          {emailError && (
            <p className="text-red-400 text-xs mt-2">{emailError}</p>
          )}
        </div>
      )}

      {/* Boutons secondaires */}
      <div className="flex gap-3 pt-2" style={{ animation: 'fadeUp 0.5s ease 0.5s both' }}>
        <a
          href="/wall"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Voir les Gems de toute l'équipe BeAPI"
          className="flex-1 min-h-[52px] flex items-center justify-center bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--muted)] text-[var(--muted)] hover:text-[var(--text)] font-semibold rounded-xl text-sm transition-all duration-200"
        >
          🧱 Voir les Gems de l&apos;équipe
        </a>
        <button
          onClick={onRestart}
          aria-label="Recommencer depuis le début"
          className="min-h-[52px] px-5 bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--muted)] text-[var(--muted)] font-semibold rounded-xl text-sm transition-all duration-200"
        >
          ↺
        </button>
      </div>
    </div>
  );
}
