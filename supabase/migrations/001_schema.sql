-- Family law study schema
-- Run in the Supabase SQL editor or via the CLI.

create extension if not exists "pgcrypto";

do $$ begin
  create type public.content_status as enum ('draft', 'review', 'published');
exception
  when duplicate_object then null;
end $$;

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.topics (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  description text not null,
  sort_order int not null default 0
);

create table if not exists public.lessons (
  id uuid primary key default gen_random_uuid(),
  topic_id uuid not null references public.topics (id) on delete cascade,
  title text not null,
  intro text not null,
  estimated_minutes int not null check (estimated_minutes between 1 and 15),
  sources text not null,
  status public.content_status not null default 'draft',
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.questions (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references public.lessons (id) on delete cascade,
  prompt text not null,
  options jsonb not null,
  correct_option_id text not null,
  explanation text not null,
  sort_order int not null default 0
);

create table if not exists public.cases (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references public.lessons (id) on delete cascade,
  title text not null,
  facts text not null,
  question text not null,
  discussion text not null,
  sources text not null,
  status public.content_status not null default 'draft'
);

create table if not exists public.review_cards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  question_id uuid not null references public.questions (id) on delete cascade,
  easiness numeric not null default 2.5,
  interval_days int not null default 0,
  repetitions int not null default 0,
  next_review_at timestamptz not null default now(),
  last_reviewed_at timestamptz,
  unique (user_id, question_id)
);

create table if not exists public.lesson_progress (
  user_id uuid not null references public.profiles (id) on delete cascade,
  lesson_id uuid not null references public.lessons (id) on delete cascade,
  completed_at timestamptz,
  last_visited_at timestamptz not null default now(),
  primary key (user_id, lesson_id)
);

create table if not exists public.attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  question_id uuid not null references public.questions (id) on delete cascade,
  selected_option_id text not null,
  is_correct boolean not null,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select coalesce(
    (
      select p.is_admin
      from public.profiles p
      where p.id = auth.uid()
    ),
    false
  );
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, is_admin)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1)),
    false
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists lessons_updated_at on public.lessons;
create trigger lessons_updated_at
  before update on public.lessons
  for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.topics enable row level security;
alter table public.lessons enable row level security;
alter table public.questions enable row level security;
alter table public.cases enable row level security;
alter table public.review_cards enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.attempts enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select using (id = auth.uid() or public.is_admin());

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (id = auth.uid())
  with check (id = auth.uid());

drop policy if exists "topics_read" on public.topics;
create policy "topics_read" on public.topics
  for select using (auth.uid() is not null);

drop policy if exists "topics_admin_write" on public.topics;
create policy "topics_admin_write" on public.topics
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "lessons_read" on public.lessons;
create policy "lessons_read" on public.lessons
  for select using (status = 'published' or public.is_admin());

drop policy if exists "lessons_admin_write" on public.lessons;
create policy "lessons_admin_write" on public.lessons
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "questions_read" on public.questions;
create policy "questions_read" on public.questions
  for select using (
    exists (
      select 1 from public.lessons l
      where l.id = lesson_id and (l.status = 'published' or public.is_admin())
    )
  );

drop policy if exists "questions_admin_write" on public.questions;
create policy "questions_admin_write" on public.questions
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "cases_read" on public.cases;
create policy "cases_read" on public.cases
  for select using (status = 'published' or public.is_admin());

drop policy if exists "cases_admin_write" on public.cases;
create policy "cases_admin_write" on public.cases
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "review_cards_own" on public.review_cards;
create policy "review_cards_own" on public.review_cards
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists "lesson_progress_own" on public.lesson_progress;
create policy "lesson_progress_own" on public.lesson_progress
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists "attempts_own" on public.attempts;
create policy "attempts_own" on public.attempts
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());
