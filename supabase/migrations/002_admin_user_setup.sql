-- LOCAL DEV QUALITY-OF-LIFE: automatic profile creation and default admin linking
-- This migration ensures that when a user signs up, a corresponding row is
-- created in public.profiles, and if the email matches our default admin
-- account, the user is also added to public.admins.

set search_path = public;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
as $$
begin
  -- Create profile if it does not exist
  insert into public.profiles (id, username)
  values (new.id, split_part(coalesce(new.email, 'user'), '@', 1))
  on conflict (id) do nothing;

  -- Grant admin role for the default admin email in local dev
  if new.email = 'admin@lezzetkesif.com' then
    insert into public.admins (id)
    values (new.id)
    on conflict (id) do nothing;
  end if;

  return new;
end;
$$;

-- Recreate trigger to call the function on new auth users
do $$
begin
  if exists (
    select 1 from pg_trigger t
    join pg_class c on c.oid = t.tgrelid
    join pg_namespace n on n.oid = c.relnamespace
    where t.tgname = 'on_auth_user_created'
      and n.nspname = 'auth'
  ) then
    drop trigger on_auth_user_created on auth.users;
  end if;
end $$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- Backfill: if the default admin already exists in auth, ensure links are present
insert into public.profiles (id, username)
select u.id, 'admin'
from auth.users u
left join public.profiles p on p.id = u.id
where u.email = 'admin@lezzetkesif.com'
  and p.id is null;

insert into public.admins (id)
select u.id
from auth.users u
left join public.admins a on a.id = u.id
where u.email = 'admin@lezzetkesif.com'
  and a.id is null;


