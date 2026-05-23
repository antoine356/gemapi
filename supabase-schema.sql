-- Créer la table generations dans Supabase
create table generations (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  prenom text not null,
  poste_id text not null,
  poste_label text not null,
  poste_icon text not null,
  gem_instructions text not null,
  prompt_metier text not null,
  tache text not null,
  tone text not null
);

-- Activer Realtime sur cette table (faire aussi dans le dashboard Supabase)
alter publication supabase_realtime add table generations;
