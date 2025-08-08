insert into restaurants (name, description, address, phone, latitude, longitude, image_url, cuisine_type, district, features)
values
('Trilye Restaurant', 'Şık balık restoranı', 'Haşim İşcan Cd. No:30, 06700 Çankaya/Ankara', '+903124471200', 39.9097, 32.8627, 'https://placehold.co/600x400', 'Deniz Ürünleri', 'Çankaya', ARRAY['Şık Atmosfer', 'Geniş Şarap Menüsü', 'Valet Park']),
('Aspava', 'Meşhur kebapçı', 'Çankaya, Esat', '+903124470000', 39.9200, 32.8500, 'https://placehold.co/600x400', 'Kebap', 'Çankaya', ARRAY['Geleneksel']),
('Liva Pastacılık', 'Pastane ve kafe', 'Bahçelievler', '+903124473333', 39.9300, 32.8200, 'https://placehold.co/600x400', 'Kafe', 'Bahçelievler', ARRAY['Tatlı', 'Kahve']);

-- LOCAL-ONLY DEFAULT ADMIN USER (for E2E / development)
-- Credentials are documented in README. Do NOT use in production.
-- The password is bcrypt-hashed via extensions.crypt/ gen_salt('bf').

-- Ensure pgcrypto functions are available via the extensions schema
create extension if not exists pgcrypto with schema extensions;

-- Deterministic IDs for easier references in tests
-- Change these if they ever collide in your environment
-- Insert user into auth.users (email provider)
insert into auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  confirmation_sent_at,
  confirmation_token,
  recovery_token,
  email_change_token_new,
  email_change,
  email_change_token_current,
  phone,
  phone_change,
  phone_change_token,
  reauthentication_token,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  aud,
  role,
  is_super_admin,
  created_at,
  updated_at,
  is_sso_user,
  is_anonymous
)
values (
  '11111111-1111-1111-1111-111111111111'::uuid,
  '00000000-0000-0000-0000-000000000000'::uuid,
  'admin@lezzetkesif.com',
  extensions.crypt('Admin123!ChangeMe', extensions.gen_salt('bf')),
  now(),
  now(),
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  now(),
  '{"provider":"email","providers":["email"]}',
  '{}'::jsonb,
  'authenticated',
  'authenticated',
  false,
  now(),
  now(),
  false,
  false
)
on conflict (id) do nothing;

-- Insert matching identity into auth.identities
insert into auth.identities (
  id,
  user_id,
  identity_data,
  provider,
  provider_id,
  last_sign_in_at,
  created_at,
  updated_at
)
values (
  '22222222-2222-2222-2222-222222222222'::uuid,
  '11111111-1111-1111-1111-111111111111'::uuid,
  jsonb_build_object('email', 'admin@lezzetkesif.com'),
  'email',
  'admin@lezzetkesif.com',
  now(),
  now(),
  now()
)
on conflict (id) do nothing;

-- Link to public.profiles (will also be handled by trigger in 002 migration)
insert into public.profiles (id, username)
values ('11111111-1111-1111-1111-111111111111'::uuid, 'admin')
on conflict (id) do nothing;

-- Add to public.admins (id references profiles)
insert into public.admins (id)
values ('11111111-1111-1111-1111-111111111111'::uuid)
on conflict (id) do nothing;
