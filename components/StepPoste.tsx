'use client';
import { POSTES, type Poste } from '@/lib/postes';

interface Props {
  prenom: string;
  selected: Poste | null;
  onSelect: (poste: Poste) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function StepPoste({ prenom, selected, onSelect, onNext, onBack }: Props) {
  return (
    <div className="animate-slide-left">
      {/* Question */}
      <p className="text-[var(--muted)] text-sm mb-1">{prenom},</p>
      <h2
        className="text-2xl md:text-3xl font-bold text-[var(--white)] leading-tight mb-8"
        style={{ fontFamily: 'var(--font-syne)' }}
      >
        Tu travailles sur quoi chez BeAPI ?
      </h2>

      {/* Grille des postes */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
        {POSTES.map((poste) => {
          const isSelected = selected?.id === poste.id;
          return (
            <button
              key={poste.id}
              onClick={() => onSelect(poste)}
              aria-label={`Sélectionner le poste ${poste.label}`}
              aria-pressed={isSelected}
              className={`
                flex flex-col items-start gap-1.5 p-4 rounded-xl border text-left
                transition-all duration-200 min-h-[80px]
                hover:scale-[1.03] active:scale-[0.98]
                ${isSelected
                  ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)]/10 shadow-[0_0_16px_var(--accent-primary)/30]'
                  : 'border-[var(--border)] bg-[var(--card)] hover:border-[var(--accent-primary)]/50'
                }
              `}
            >
              <span className="text-2xl">{poste.icon}</span>
              <span className={`text-sm font-semibold leading-tight ${isSelected ? 'text-[var(--white)]' : 'text-[var(--text)]'}`}>
                {poste.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Boutons navigation */}
      <div className="flex gap-3">
        <button
          onClick={onBack}
          aria-label="Retour à l'étape précédente"
          className="min-h-[52px] px-6 bg-[var(--card)] border border-[var(--border)] hover:border-[var(--muted)] text-[var(--muted)] font-semibold rounded-xl text-base transition-all duration-200"
        >
          ← Retour
        </button>
        <button
          onClick={onNext}
          disabled={!selected}
          aria-label="Passer à l'étape suivante"
          className="flex-1 min-h-[52px] bg-[var(--accent-primary)] hover:bg-[#6b7cf8] disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-xl text-base transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
        >
          Suivant →
        </button>
      </div>
    </div>
  );
}
