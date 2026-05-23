'use client';
import { TONES, type Poste } from '@/lib/postes';

interface Props {
  poste: Poste;
  tache: string;
  setTache: (v: string) => void;
  contexte: string;
  setContexte: (v: string) => void;
  tone: string;
  setTone: (v: string) => void;
  onGenerate: () => void;
  onBack: () => void;
}

const MIN_TACHE = 20;

export default function StepQuotidien({
  poste,
  tache,
  setTache,
  contexte,
  setContexte,
  tone,
  setTone,
  onGenerate,
  onBack,
}: Props) {
  const tacheLen = tache.trim().length;
  const tacheValid = tacheLen >= MIN_TACHE;

  return (
    <div className="animate-slide-left">
      {/* Question */}
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xl">{poste.icon}</span>
        <span className="text-[var(--muted)] text-sm">{poste.label}</span>
      </div>
      <h2
        className="text-2xl md:text-3xl font-bold text-[var(--white)] leading-tight mb-8"
        style={{ fontFamily: 'var(--font-syne)' }}
      >
        C&apos;est quoi ta tâche<br />la plus chronophage ?
      </h2>

      {/* Textarea tâche */}
      <div className="mb-5">
        <div className="flex justify-between items-center mb-2">
          <label htmlFor="tache" className="text-[var(--text)] text-sm font-medium">
            Ta tâche principale <span className="text-red-400">*</span>
          </label>
          <span className={`text-xs transition-colors ${tacheValid ? 'text-[var(--accent-success)]' : 'text-[var(--muted)]'}`}>
            {tacheLen}/{MIN_TACHE} min
          </span>
        </div>
        <textarea
          id="tache"
          value={tache}
          onChange={(e) => setTache(e.target.value)}
          placeholder="Ex : Rédiger les comptes-rendus de réunion client et envoyer les CR à l'équipe..."
          rows={4}
          maxLength={500}
          aria-label="Ta tâche principale la plus chronophage"
          className="w-full bg-[var(--card)] border border-[var(--border)] text-[var(--text)] placeholder-[var(--muted)] rounded-xl px-4 py-3.5 text-base outline-none focus:border-[var(--accent-primary)] transition-colors duration-200 resize-none"
        />
      </div>

      {/* Champ contexte optionnel */}
      <div className="mb-6">
        <label htmlFor="contexte" className="block text-[var(--text)] text-sm font-medium mb-2">
          Un contexte particulier ? <span className="text-[var(--muted)] font-normal">(optionnel)</span>
        </label>
        <input
          id="contexte"
          type="text"
          value={contexte}
          onChange={(e) => setContexte(e.target.value)}
          placeholder={poste.placeholder_contexte}
          maxLength={200}
          aria-label="Contexte particulier optionnel"
          className="w-full bg-[var(--card)] border border-[var(--border)] text-[var(--text)] placeholder-[var(--muted)] rounded-xl px-4 py-3.5 text-base outline-none focus:border-[var(--accent-primary)] transition-colors duration-200"
        />
      </div>

      {/* Sélecteur de ton */}
      <div className="mb-8">
        <p className="text-[var(--text)] text-sm font-medium mb-3">Ton de communication souhaité</p>
        <div className="flex flex-wrap gap-2">
          {TONES.map((t) => (
            <button
              key={t.id}
              onClick={() => setTone(t.id)}
              aria-label={`Sélectionner le ton ${t.label}`}
              aria-pressed={tone === t.id}
              className={`
                px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200
                ${tone === t.id
                  ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)]/15 text-[var(--accent-gem)]'
                  : 'border-[var(--border)] bg-[var(--card)] text-[var(--muted)] hover:border-[var(--accent-primary)]/50 hover:text-[var(--text)]'
                }
              `}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Boutons navigation */}
      <div className="flex gap-3">
        <button
          onClick={onBack}
          aria-label="Retour à la sélection du poste"
          className="min-h-[52px] px-6 bg-[var(--card)] border border-[var(--border)] hover:border-[var(--muted)] text-[var(--muted)] font-semibold rounded-xl text-base transition-all duration-200"
        >
          ← Retour
        </button>
        <button
          onClick={onGenerate}
          disabled={!tacheValid}
          aria-label="Générer mon Gem Gemini personnalisé"
          className="
            flex-1 min-h-[52px] text-white font-semibold rounded-xl text-base
            disabled:opacity-40 disabled:cursor-not-allowed
            transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]
            relative overflow-hidden
            bg-[var(--accent-primary)]
            hover:bg-[#6b7cf8]
          "
          style={{
            background: !tacheValid ? undefined : undefined,
          }}
        >
          ✦ Générer mon Gem
        </button>
      </div>
    </div>
  );
}
