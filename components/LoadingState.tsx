'use client';
import { useEffect, useState } from 'react';
import { LOADER_MESSAGES } from '@/lib/postes';

interface Props {
  prenom: string;
  error?: string | null;
  onRetry?: () => void;
}

const STEPS = ['Analyse', 'Contexte', 'Instructions', 'Prompt', 'Finalisation'];

export default function LoadingState({ prenom, error, onRetry }: Props) {
  const messages = LOADER_MESSAGES(prenom);
  const [msgIndex, setMsgIndex] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    if (error) return;
    const interval = setInterval(() => {
      setMsgIndex((prev) => {
        const next = Math.min(prev + 1, messages.length - 1);
        setStepIndex(next);
        return next;
      });
    }, 1500);
    return () => clearInterval(interval);
  }, [error, messages.length]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 animate-fade-in text-center">
        <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-5 text-2xl">⚠️</div>
        <p className="text-[var(--text)] font-medium mb-2">Oups, quelque chose s&apos;est passé</p>
        <p className="text-[var(--muted)] text-sm mb-8 max-w-xs">{error}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            aria-label="Réessayer la génération"
            className="min-h-[52px] px-8 bg-[var(--accent-primary)] hover:bg-[#6b7cf8] text-white font-semibold rounded-xl text-base transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            Réessayer
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 animate-fade-in">
      {/* Barre de progression avec étapes nommées */}
      <div className="w-full max-w-sm mb-10">
        <div className="flex justify-between mb-3">
          {STEPS.map((label, i) => (
            <div key={i} className="flex flex-col items-center gap-1.5" style={{ width: '20%' }}>
              <div
                className={`w-2.5 h-2.5 rounded-full transition-all duration-500 ${
                  i <= stepIndex
                    ? 'bg-[var(--accent-primary)] shadow-[0_0_8px_var(--accent-primary)]'
                    : 'bg-[var(--border)]'
                }`}
              />
              <span
                className={`text-[9px] leading-tight text-center transition-colors duration-300 ${
                  i <= stepIndex ? 'text-[var(--accent-primary)]' : 'text-[var(--muted)]'
                }`}
              >
                {label}
              </span>
            </div>
          ))}
        </div>
        <div className="h-1 bg-[var(--border)] rounded-full overflow-hidden">
          <div
            className="h-full bg-[var(--accent-primary)] rounded-full transition-all duration-700 ease-out"
            style={{ width: `${(stepIndex / (STEPS.length - 1)) * 100}%` }}
          />
        </div>
      </div>

      {/* Message rotatif */}
      <p
        key={msgIndex}
        className="text-[var(--text)] text-base font-medium tracking-wide animate-fade-in"
        style={{ animation: 'fadeIn 0.4s ease' }}
      >
        {messages[msgIndex]}
      </p>
    </div>
  );
}
