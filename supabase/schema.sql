create table if not exists public.career_profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  profile jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.career_profiles enable row level security;

create policy "Users can read their own career profile"
  on public.career_profiles for select
  using (auth.uid() = user_id);

create policy "Users can create their own career profile"
  on public.career_profiles for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own career profile"
  on public.career_profiles for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);