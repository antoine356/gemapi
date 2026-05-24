export const maxDuration = 60;

import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { supabase } from '@/lib/supabase';
import { SYSTEM_PROMPT, buildUserPrompt } from '@/lib/prompts';
import { POSTES } from '@/lib/postes';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

interface GenerateBody {
  prenom: string;
  poste_id: string;
  tache: string;
  contexte?: string;
  tone: string;
}

interface GemResult {
  gem_instructions: string;
  prompt_metier: string;
}

// Extrait et parse le JSON depuis la réponse Claude (avec nettoyage si nécessaire)
function parseGemResult(text: string): GemResult | null {
  try {
    const trimmed = text.trim();
    // Chercher le JSON même si Claude a ajouté du texte autour
    const jsonMatch = trimmed.match(/\{[\s\S]*"gem_instructions"[\s\S]*"prompt_metier"[\s\S]*\}/);
    if (!jsonMatch) return null;
    const parsed = JSON.parse(jsonMatch[0]);
    if (
      typeof parsed.gem_instructions === 'string' &&
      typeof parsed.prompt_metier === 'string' &&
      parsed.gem_instructions.length > 50 &&
      parsed.prompt_metier.length > 50
    ) {
      return parsed as GemResult;
    }
    return null;
  } catch {
    return null;
  }
}

async function callClaude(userPrompt: string): Promise<string> {
  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2000,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: userPrompt }],
  });

  const content = message.content[0];
  if (content.type !== 'text') throw new Error('Réponse inattendue de Claude');
  return content.text;
}

export async function POST(request: NextRequest) {
  let body: GenerateBody;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: 'Corps de la requête invalide' },
      { status: 400 }
    );
  }

  const { prenom, poste_id, tache, contexte, tone } = body;

  // Validation des champs obligatoires
  if (!prenom?.trim() || prenom.trim().length < 2) {
    return NextResponse.json({ error: 'Prénom invalide' }, { status: 400 });
  }
  if (!poste_id) {
    return NextResponse.json({ error: 'Poste non sélectionné' }, { status: 400 });
  }
  if (!tache?.trim() || tache.trim().length < 20) {
    return NextResponse.json({ error: 'Tâche trop courte (minimum 20 caractères)' }, { status: 400 });
  }

  const poste = POSTES.find((p) => p.id === poste_id);
  if (!poste) {
    return NextResponse.json({ error: 'Poste introuvable' }, { status: 400 });
  }

  const userPrompt = buildUserPrompt({
    prenom: prenom.trim(),
    poste_desc: poste.desc,
    tache: tache.trim(),
    contexte: contexte?.trim(),
    tone,
  });

  let result: GemResult | null = null;

  // Appel principal + un retry si le JSON est malformé
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const rawText = await callClaude(userPrompt);
      result = parseGemResult(rawText);
      if (result) break;
      // Si le parsing échoue et qu'on a encore un essai, on relance
      if (attempt === 2) {
        return NextResponse.json(
          { error: 'La génération a produit un résultat invalide. Réessaie.' },
          { status: 500 }
        );
      }
    } catch (err) {
      const error = err as Error & { status?: number };

      if (error.status === 529 || error.message?.includes('overloaded')) {
        return NextResponse.json(
          { error: 'Trop de requêtes simultanées, attends 10 secondes puis réessaie.' },
          { status: 429 }
        );
      }

      if (error.status === 401 || error.message?.includes('authentication')) {
        return NextResponse.json(
          { error: 'Problème de configuration, contacte le formateur.' },
          { status: 500 }
        );
      }

      if (attempt === 2) {
        return NextResponse.json(
          { error: 'Génération trop longue ou erreur réseau. Réessaie.' },
          { status: 500 }
        );
      }
    }
  }

  if (!result) {
    return NextResponse.json(
      { error: 'Génération échouée. Réessaie.' },
      { status: 500 }
    );
  }

  // Sauvegarde dans Supabase (non bloquant — on renvoie le résultat même en cas d'échec Supabase)
  supabase.from('generations').insert({
    prenom: prenom.trim(),
    poste_id: poste.id,
    poste_label: poste.label,
    poste_icon: poste.icon,
    gem_instructions: result.gem_instructions,
    prompt_metier: result.prompt_metier,
    tache: tache.trim(),
    tone,
  }).then(({ error: dbError }) => {
    if (dbError) {
      console.error('[Supabase] Erreur de sauvegarde :', dbError.message);
    }
  });

  return NextResponse.json({
    gem_instructions: result.gem_instructions,
    prompt_metier: result.prompt_metier,
    poste_label: poste.label,
    poste_icon: poste.icon,
  });
}
