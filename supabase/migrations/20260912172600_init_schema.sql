-- Initial schema for the family-law-study app.
-- Defines content tables (topics, lessons, questions), per-user tables
-- (attempts, review_cards), a content-moderation table (content_updates),
-- then enables Row Level Security and adds policies.

-- =========================================================================
-- Tables
-- =========================================================================

create table topics (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid references topics(id) on delete cascade,
  title text not null,
  slug text unique not null,
  description text,
  sort_order int not null default 0,
  created_at timestamptz default now()
);

create table lessons (
  id uuid primary key default gen_random_uuid(),
  topic_id uuid not null references topics(id) on delete cascade,
  title text not null,
  body_md text,
  sources jsonb default '[]',
  status text not null default 'draft',
  version int not null default 1,
  sort_order int not null default 0,
  updated_at timestamptz default now(),
  created_at timestamptz default now()
);

create table questions (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references lessons(id) on delete cascade,
  type text not null default 'mcq',
  prompt text not null,
  options jsonb default '[]',
  correct_index int,
  correct_bool boolean,
  explanation text,
  difficulty int not null default 2,
  status text not null default 'draft',
  created_at timestamptz default now()
);

create table attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  question_id uuid not null references questions(id) on delete cascade,
  is_correct boolean not null,
  answered_at timestamptz default now()
);

create table review_cards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  question_id uuid not null references questions(id) on delete cascade,
  ease_factor numeric not null default 2.5,
  interval_days int not null default 0,
  repetitions int not null default 0,
  due_date date not null default current_date,
  last_reviewed_at timestamptz,
  unique (user_id, question_id)
);

create table content_updates (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null,
  entity_id uuid,
  topic_id uuid references topics(id),
  proposed jsonb not null,
  source text,
  status text not null default 'pending',
  created_at timestamptz default now()
);

-- Helpful indexes for foreign keys / common lookups.
create index topics_parent_id_idx on topics(parent_id);
create index lessons_topic_id_idx on lessons(topic_id);
create index questions_lesson_id_idx on questions(lesson_id);
create index attempts_user_id_idx on attempts(user_id);
create index attempts_question_id_idx on attempts(question_id);
create index review_cards_user_id_idx on review_cards(user_id);
create index review_cards_due_date_idx on review_cards(due_date);
create index content_updates_status_idx on content_updates(status);

-- =========================================================================
-- Row Level Security
-- =========================================================================

alter table topics enable row level security;
alter table lessons enable row level security;
alter table questions enable row level security;
alter table attempts enable row level security;
alter table review_cards enable row level security;
alter table content_updates enable row level security;

-- -------------------------------------------------------------------------
-- Content tables: readable by any authenticated user.
-- No INSERT/UPDATE/DELETE policies are defined, so writes are only possible
-- through the service_role key (which bypasses RLS).
-- -------------------------------------------------------------------------

create policy "Authenticated users can read topics"
  on topics for select
  to authenticated
  using (true);

create policy "Authenticated users can read lessons"
  on lessons for select
  to authenticated
  using (true);

create policy "Authenticated users can read questions"
  on questions for select
  to authenticated
  using (true);

-- -------------------------------------------------------------------------
-- Per-user tables: a user can read and write only their own rows.
-- -------------------------------------------------------------------------

create policy "Users can read their own attempts"
  on attempts for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can insert their own attempts"
  on attempts for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update their own attempts"
  on attempts for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own attempts"
  on attempts for delete
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can read their own review_cards"
  on review_cards for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can insert their own review_cards"
  on review_cards for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update their own review_cards"
  on review_cards for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own review_cards"
  on review_cards for delete
  to authenticated
  using (auth.uid() = user_id);

-- -------------------------------------------------------------------------
-- content_updates: no policies for regular users. RLS is enabled with no
-- permissive policy, so anon/authenticated roles have no access at all;
-- the table is managed exclusively through the service_role key, which
-- bypasses RLS.
-- -------------------------------------------------------------------------
