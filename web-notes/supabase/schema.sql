-- Enable extensions commonly available in Supabase
create extension if not exists pgcrypto;

-- FOLDERS
create table if not exists public.folders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  parent_id uuid references public.folders(id) on delete set null,
  title text not null,
  position int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists folders_user_id_idx on public.folders(user_id);
create index if not exists folders_user_updated_idx on public.folders(user_id, updated_at desc);

alter table public.folders enable row level security;

create policy if not exists "folders_owner_select" on public.folders
for select using (auth.uid() = user_id);

create policy if not exists "folders_owner_mod" on public.folders
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger folders_set_updated_at
before update on public.folders
for each row execute function public.set_updated_at();

-- NOTES
create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  folder_id uuid references public.folders(id) on delete set null,
  title text not null default 'Untitled',
  content_md text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists notes_user_id_idx on public.notes(user_id);
create index if not exists notes_user_updated_idx on public.notes(user_id, updated_at desc);

alter table public.notes enable row level security;

create policy if not exists "notes_owner_select" on public.notes
for select using (auth.uid() = user_id);

create policy if not exists "notes_owner_mod" on public.notes
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create trigger notes_set_updated_at
before update on public.notes
for each row execute function public.set_updated_at();
