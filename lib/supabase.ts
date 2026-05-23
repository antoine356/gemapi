import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Generation {
  id: string;
  created_at: string;
  prenom: string;
  poste_id: string;
  poste_label: string;
  poste_icon: string;
  gem_instructions: string;
  prompt_metier: string;
  tache: string;
  tone: string;
}
