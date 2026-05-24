'use client';
import { useEffect, useState } from 'react';
import { supabase, type Generation } from '@/lib/supabase';

// Carte individuelle d'un Gem
function GemCard({ gen, index, isNew }: { gen: Generation; index: number; isNew?: boolean }) {
  return (
    <div
      className={`rounded-2xl border bg-[var(--card)] p-5 animate-fly-in transition-colors duration-700 ${
        isNew ? 'border-[var(--accent-primary)] shadow-[0_0_20px_rgba(91,106,245,0.35)]' : 'border-[var(--border)]'
      }`}
      style={{ animationDelay: `${Math.min(index * 80, 600)}ms` }}
    >
      <div className="flex items-start gap-3 mb-3">
        <span className="text-3xl flex-shrink-0">{gen.poste_icon}</span>
        <div className="min-w-0">
          <p
            className="text-[var(--white)] font-bold text-base leading-tight truncate"
            style={{ fontFamily: 'var(--font-syne)' }}
          >
            {gen.prenom}
          </p>
          <p className="text-[var(--accent-gem)] text-xs mt-0.5 truncate">{gen.poste_label}</p>
        </div>
      </div>
      <p className="text-[var(--muted)] text-xs leading-relaxed line-clamp-3">
        {gen.tache}
      </p>
    </div>
  );
}

// Écran de saisie du mot de passe
function PasswordGate({ onUnlock }: { onUnlock: () => void }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = () => {
    const expected = process.env.NEXT_PUBLIC_FORMATEUR_PASSWORD;
    if (password === expected) {
      onUnlock();
    } else {
      setError(true);
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--bg)' }}>
      <div className="w-full max-w-sm text-center">
        <div className="text-4xl mb-4">🔒</div>
        <h1
          className="text-2xl font-bold text-[var(--white)] mb-2"
          style={{ fontFamily: 'var(--font-syne)' }}
        >
          Mur collectif
        </h1>
        <p className="text-[var(--muted)] text-sm mb-8">BeAPI Formation IA · Accès formateur</p>
        <div className="flex gap-3">
          <input
            type="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(false); }}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit(); }}
            placeholder="Mot de passe"
            autoFocus
            aria-label="Mot de passe formateur"
            className={`flex-1 bg-[var(--card)] border text-[var(--text)] placeholder-[var(--muted)] rounded-xl px-4 py-3.5 text-base outline-none focus:border-[var(--accent-primary)] transition-colors ${
              error ? 'border-red-500' : 'border-[var(--border)]'
            }`}
          />
          <button
            onClick={handleSubmit}
            aria-label="Valider le mot de passe"
            className="min-h-[52px] px-5 bg-[var(--accent-primary)] hover:bg-[#6b7cf8] text-white font-semibold rounded-xl text-base transition-all duration-200"
          >
            →
          </button>
        </div>
        {error && <p className="text-red-400 text-xs mt-3">Mot de passe incorrect</p>}
      </div>
    </div>
  );
}

// Mur principal
function Wall({ generations, total, setTotal, newIds }: {
  generations: Generation[];
  total: number | null;
  setTotal: (n: number | null) => void;
  newIds: Set<string>;
}) {
  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      {/* En-tête */}
      <header className="sticky top-0 z-10 border-b border-[var(--border)] bg-[var(--bg)]/90 backdrop-blur px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1
              className="text-xl font-bold text-[var(--white)]"
              style={{ fontFamily: 'var(--font-syne)' }}
            >
              GemForge — Mur collectif
            </h1>
            <p className="text-[var(--muted)] text-xs mt-0.5">
              BeAPI Formation IA · 8 juin 2026
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Indicateur temps réel */}
            <span className="flex items-center gap-1.5 text-[var(--accent-success)] text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-[var(--accent-success)] animate-pulse" />
              Live
            </span>
            {/* Compteur */}
            <span
              className="text-[var(--accent-primary)] font-bold text-lg"
              style={{ fontFamily: 'var(--font-syne)' }}
            >
              {generations.length}
              {total !== null && <span className="text-[var(--muted)] font-normal text-base">/{total}</span>}
            </span>
            <span className="text-[var(--muted)] text-sm">
              {generations.length <= 1 ? 'Gem généré' : 'Gems générés'}
            </span>
            <input
              type="number"
              min={1}
              max={50}
              value={total ?? ''}
              onChange={(e) => setTotal(e.target.value ? Number(e.target.value) : null)}
              placeholder="/ ?"
              aria-label="Nombre de participants attendus"
              className="w-14 bg-[var(--card)] border border-[var(--border)] text-[var(--muted)] text-xs text-center rounded-lg px-2 py-1 outline-none focus:border-[var(--accent-primary)] transition-colors"
            />
          </div>
        </div>
      </header>

      {/* Grille des Gems */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {generations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="text-5xl mb-4">⏳</div>
            <p className="text-[var(--muted)] text-lg">En attente des premières générations…</p>
            <p className="text-[var(--muted)] text-sm mt-2">Les Gems apparaîtront ici en temps réel</p>
          </div>
        ) : (
          <div
            className="columns-1 sm:columns-2 lg:columns-3 gap-4"
            style={{ columnFill: 'balance' }}
          >
            {generations.map((gen, i) => (
              <div key={gen.id} className="break-inside-avoid mb-4">
                <GemCard gen={gen} index={i} isNew={newIds.has(gen.id)} />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default function WallPage() {
  const [unlocked, setUnlocked] = useState(false);
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [total, setTotal] = useState<number | null>(null);
  const [newIds, setNewIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!unlocked) return;

    // Chargement initial des générations existantes (ordre antéchronologique)
    supabase
      .from('generations')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        if (data) setGenerations(data as Generation[]);
      });

    // Abonnement Realtime — les nouvelles générations apparaissent en tête
    const channel = supabase
      .channel('generations-wall')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'generations' },
        (payload) => {
          const newGen = payload.new as Generation;
          setGenerations((prev) => [newGen, ...prev]);
          setNewIds((prev) => new Set([...prev, newGen.id]));
          setTimeout(() => {
            setNewIds((prev) => { const next = new Set(prev); next.delete(newGen.id); return next; });
          }, 4000);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [unlocked]);

  if (!unlocked) {
    return <PasswordGate onUnlock={() => setUnlocked(true)} />;
  }

  return <Wall generations={generations} total={total} setTotal={setTotal} newIds={newIds} />;
}
