-- Additive updates for existing databases that already ran 001_schema.sql.

alter table public.topics
  add column if not exists parent_id uuid references public.topics (id) on delete cascade;

create index if not exists topics_parent_id_idx on public.topics (parent_id);

create or replace function public.protect_profile_admin_flag()
returns trigger
language plpgsql
as $$
begin
  if tg_op = 'UPDATE' and new.is_admin is distinct from old.is_admin then
    if auth.role() is distinct from 'service_role' and not public.is_admin() then
      raise exception 'cannot change admin flag';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists protect_profile_admin_flag on public.profiles;
create trigger protect_profile_admin_flag
  before update on public.profiles
  for each row execute function public.protect_profile_admin_flag();
