-- Apply once to a Supabase project. Every operation is scoped to the verified
-- Supabase Auth user; the site's local username/password cannot grant access.
create table if not exists public.yuetread_scripts (
  user_id uuid not null references auth.users(id) on delete cascade,
  id text not null check (char_length(id) between 1 and 80),
  title text not null check (char_length(title) between 1 and 80),
  source text not null check (char_length(source) between 1 and 20000),
  converted text not null default '' check (char_length(converted) <= 20000),
  saved_at timestamptz not null default now(),
  deleted_at timestamptz,
  primary key (user_id, id)
);
alter table public.yuetread_scripts enable row level security;
revoke all on public.yuetread_scripts from anon, authenticated;
grant select, insert, update on public.yuetread_scripts to authenticated;

create policy "Read own scripts" on public.yuetread_scripts
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "Create own scripts" on public.yuetread_scripts
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Update own scripts" on public.yuetread_scripts
  for update to authenticated using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- Deletion is a tombstone update. No client can permanently delete a document.
create index if not exists yuetread_scripts_user_saved
  on public.yuetread_scripts(user_id, saved_at desc) where deleted_at is null;

-- An old offline device must never resurrect an already-deleted document.
create or replace function public.yuetread_preserve_deleted_script()
returns trigger language plpgsql set search_path = '' as $$
begin
  if old.deleted_at is not null then
    new.deleted_at := old.deleted_at;
  end if;
  return new;
end;
$$;
create trigger yuetread_script_tombstone before update on public.yuetread_scripts
  for each row execute function public.yuetread_preserve_deleted_script();
