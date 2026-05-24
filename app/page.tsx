'use client';
import { useState } from 'react';
import StepAccueil from '@/components/StepAccueil';
import StepPoste from '@/components/StepPoste';
import StepQuotidien from '@/components/StepQuotidien';
import LoadingState from '@/components/LoadingState';
import StepResultat from '@/components/StepResultat';
import { POSTES, type Poste } from '@/lib/postes';

interface GenerateResult {
  gem_instructions: string;
  prompt_metier: string;
  poste_label: string;
  poste_icon: string;
}

function StepIndicator({ step }: { step: number }) {
  const labels = ['Poste', 'Quotidien', 'Résultat'];
  const activeIndex = step - 1;
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {labels.map((label, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <div
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i < activeIndex
                  ? 'bg-[var(--accent-success)]'
                  : i === activeIndex
                  ? 'bg-[var(--accent-primary)]'
                  : 'bg-[var(--border)]'
              }`}
            />
            <span
              className={`text-xs transition-colors duration-300 ${
                i < activeIndex
                  ? 'text-[var(--accent-success)]'
                  : i === activeIndex
                  ? 'text-[var(--text)]'
                  : 'text-[var(--muted)]'
              }`}
            >
              {label}
            </span>
          </div>
          {i < labels.length - 1 && (
            <div
              className={`w-8 h-px transition-colors duration-300 ${
                i < activeIndex ? 'bg-[var(--accent-success)]' : 'bg-[var(--border)]'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

export default function GemForgePage() {
  const [step, setStep] = useState<0 | 1 | 2 | 3>(0);
  const [prenom, setPrenom] = useState('');
  const [selectedPoste, setSelectedPoste] = useState<Poste | null>(null);
  const [tache, setTache] = useState('');
  const [contexte, setContexte] = useState('');
  const [tone, setTone] = useState('direct');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GenerateResult | null>(null);

  const generate = async () => {
    if (!selectedPoste) return;
    setLoading(true);
    setError(null);
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 60000);
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prenom: prenom.trim(),
          poste_id: selectedPoste.id,
          tache: tache.trim(),
          contexte: contexte.trim(),
          tone,
        }),
        signal: controller.signal,
      });
      clearTimeout(timeout);
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || 'Génération échouée. Réessaie.');
      }
      const data = await response.json();
      setResult(data);
      setStep(3);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.name === 'AbortError' ? 'Génération trop longue, réessaie.' : err.message);
      } else {
        setError('Erreur inattendue. Réessaie.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = () => {
    setStep(2);
    generate();
  };

  const handleRestart = () => {
    setStep(0);
    setPrenom('');
    setSelectedPoste(null);
    setTache('');
    setContexte('');
    setTone('direct');
    setResult(null);
    setError(null);
    setLoading(false);
  };

  const showLoading = step === 2 && (loading || error !== null);

  return (
    <main
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'var(--bg)' }}
    >
      <div className="w-full max-w-lg">
        {!showLoading && step > 0 && step < 3 && <StepIndicator step={step} />}

        {step === 0 && (
          <StepAccueil prenom={prenom} setPrenom={setPrenom} onNext={() => setStep(1)} />
        )}

        {step === 1 && (
          <StepPoste
            prenom={prenom}
            selected={selectedPoste}
            onSelect={setSelectedPoste}
            onNext={() => setStep(2)}
            onBack={() => setStep(0)}
          />
        )}

        {step === 2 && !showLoading && (
          <StepQuotidien
            poste={selectedPoste ?? POSTES[0]}
            tache={tache}
            setTache={setTache}
            contexte={contexte}
            setContexte={setContexte}
            tone={tone}
            setTone={setTone}
            onGenerate={handleGenerate}
            onBack={() => setStep(1)}
          />
        )}

        {showLoading && (
          <LoadingState
            prenom={prenom}
            error={error}
            onRetry={error ? generate : undefined}
          />
        )}

        {step === 3 && result && (
          <StepResultat prenom={prenom} result={result} onRestart={handleRestart} />
        )}
      </div>
    </main>
  );
}
