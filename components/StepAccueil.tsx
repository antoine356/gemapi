'use client';
import { useState } from 'react';

interface Props {
  prenom: string;
  setPrenom: (v: string) => void;
  onNext: () => void;
}

export default function StepAccueil({ prenom, setPrenom, onNext }: Props) {
  const [logoError, setLogoError] = useState(false);
  const isValid = prenom.trim().length >= 2;

  return (
    <div className="animate-slide-left">
      {/* Logo BeAPI */}
      <div className="mb-10">
        {logoError ? (
          <span
            className="text-[var(--accent-primary)] font-bold text-xl tracking-wider"
            style={{ fontFamily: 'var(--font-syne)' }}
          >
            BeAPI
          </span>
        ) : (
          <img
            src="/logo-beapi.png"
            alt="BeAPI"
            className="h-10 object-contain"
            onError={() => setLogoError(true)}
          />
        )}
      </div>

      {/* Titre principal */}
      <h1
        className="text-3xl md:text-4xl font-extrabold text-[var(--white)] leading-tight mb-3"
        style={{ fontFamily: 'var(--font-syne)' }}
      >
        Crée ton assistant IA<br />en 3 minutes
      </h1>
      <p className="text-[var(--muted)] text-base mb-10 leading-relaxed">
        Personnalisé pour ton poste chez BeAPI
      </p>

      {/* Champ prénom */}
      <div className="mb-6" style={{ animationDelay: '100ms' }}>
        <label htmlFor="prenom" className="block text-[var(--text)] text-sm font-medium mb-2">
          Ton prénom
        </label>
        <input
          id="prenom"
          type="text"
          value={prenom}
          onChange={(e) => setPrenom(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && isValid) onNext(); }}
          placeholder="Ex : Marie"
          maxLength={50}
          autoFocus
          autoComplete="given-name"
          aria-label="Ton prénom"
          className="w-full bg-[var(--card)] border border-[var(--border)] text-[var(--text)] placeholder-[var(--muted)] rounded-xl px-4 py-3.5 text-base outline-none focus:border-[var(--accent-primary)] transition-colors duration-200"
        />
      </div>

      <button
        onClick={onNext}
        disabled={!isValid}
        aria-label="Commencer la configuration du Gem"
        className="w-full min-h-[52px] bg-[var(--accent-primary)] hover:bg-[#6b7cf8] disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-xl text-base transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
        style={{ animationDelay: '200ms' }}
      >
        Commencer →
      </button>
    </div>
  );
}
