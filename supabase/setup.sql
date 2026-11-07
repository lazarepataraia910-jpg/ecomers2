-- Run this once in Supabase → SQL Editor → New query → Run.

-- 1. Recipes table
create table if not exists public.recipes (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  overview text not null,
  servings int not null default 1,
  prep_minutes int not null default 0,
  cook_minutes int not null default 0,
  image_url text not null,
  ingredients text[] not null default '{}',
  instructions text[] not null default '{}',
  created_at timestamptz not null default now()
);

-- 2. Row Level Security: everyone can read, only logged-in admins can change
alter table public.recipes enable row level security;

drop policy if exists "Anyone can read recipes" on public.recipes;
create policy "Anyone can read recipes"
  on public.recipes for select using (true);

drop policy if exists "Admins can insert recipes" on public.recipes;
create policy "Admins can insert recipes"
  on public.recipes for insert to authenticated with check (true);

drop policy if exists "Admins can update recipes" on public.recipes;
create policy "Admins can update recipes"
  on public.recipes for update to authenticated using (true) with check (true);

drop policy if exists "Admins can delete recipes" on public.recipes;
create policy "Admins can delete recipes"
  on public.recipes for delete to authenticated using (true);

-- 3. Public image bucket
insert into storage.buckets (id, name, public)
values ('recipe-images', 'recipe-images', true)
on conflict (id) do nothing;

drop policy if exists "Anyone can view recipe images" on storage.objects;
create policy "Anyone can view recipe images"
  on storage.objects for select using (bucket_id = 'recipe-images');

drop policy if exists "Admins can upload recipe images" on storage.objects;
create policy "Admins can upload recipe images"
  on storage.objects for insert to authenticated with check (bucket_id = 'recipe-images');

drop policy if exists "Admins can delete recipe images" on storage.objects;
create policy "Admins can delete recipe images"
  on storage.objects for delete to authenticated using (bucket_id = 'recipe-images');
