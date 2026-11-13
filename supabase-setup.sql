-- My Budget: database setup (already run once on Nov 13, 2026 — you don't need to run it again).
drop table if exists public."User_budgets";
create table if not exists public.user_budgets (
  user_id uuid primary key references auth.users(id) on delete cascade,
  budget_data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
alter table public.user_budgets enable row level security;
grant select, insert, update on public.user_budgets to authenticated;
drop policy if exists "Read own budget" on public.user_budgets;
create policy "Read own budget" on public.user_budgets
  for select to authenticated using ((select auth.uid()) = user_id);
drop policy if exists "Insert own budget" on public.user_budgets;
create policy "Insert own budget" on public.user_budgets
  for insert to authenticated with check ((select auth.uid()) = user_id);
drop policy if exists "Update own budget" on public.user_budgets;
create policy "Update own budget" on public.user_budgets
  for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
