-- ComparteTuPiso.es — esquema completo para Supabase (PostgreSQL)
-- Sustituye por completo a Base44: auth.users ya lo gestiona Supabase Auth,
-- aquí se define el resto (perfiles, anuncios, solicitudes, radar) + RLS.
--
-- Cómo aplicarlo: pega este archivo entero en el SQL Editor de tu proyecto
-- de Supabase y ejecútalo una vez (orden: tipos -> tablas -> triggers -> RLS).

-- ============================================================
-- 1. TIPOS ENUM
-- ============================================================
create type listing_type_enum as enum ('casa_completa', 'plaza_alojamiento', 'companero_piso', 'grupo_alquiler');
create type listing_status_enum as enum ('active', 'paused', 'rented');
create type tipo_vivienda_enum as enum ('casa_ciudad', 'casa_rustica', 'piso_ciudad', 'piso_rustico');
create type plazo_alquiler_enum as enum ('indefinido', 'anual', 'curso_academico', 'otro');
create type uso_habitacion_enum as enum ('individual', 'compartida');
create type sexo_permitido_enum as enum ('solo_hombres', 'solo_mujeres', 'indiferente');
create type actividad_permitida_enum as enum ('solo_estudiantes', 'solo_trabajo', 'indiferente');
create type sexo_enum as enum ('hombre', 'mujer');
create type actividad_enum as enum ('estudiante', 'trabajo', 'otro');
create type contact_status_enum as enum ('pending', 'accepted', 'rejected');
create type user_role_enum as enum ('admin', 'user');

-- ============================================================
-- 2. PROFILES (datos propios de usuario; auth.users ya trae email)
-- ============================================================
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  role user_role_enum not null default 'user',
  created_date timestamptz not null default now(),
  updated_date timestamptz not null default now()
);

-- Crea automáticamente el perfil (rol "user" por defecto) al registrarse,
-- copiando email y nombre desde auth.users (que el cliente no puede leer
-- directamente). Para hacer admin a una cuenta, actualiza su fila manualmente
-- desde el SQL Editor: update public.profiles set role = 'admin' where id = '<uuid>';
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- 3. LISTINGS (anuncios)
-- ============================================================
create table public.listings (
  id uuid primary key default gen_random_uuid(),
  created_by_id uuid not null references auth.users(id) on delete cascade,
  title text,
  listing_type listing_type_enum not null,
  status listing_status_enum not null default 'active',
  description text,
  images text[] default '{}',

  provincia text,
  localidad text,
  codigo_postal text,
  direccion text,
  tipo_vivienda tipo_vivienda_enum,

  precio_mensual numeric,
  fianza_meses numeric,
  plazo_alquiler plazo_alquiler_enum,
  plazo_meses numeric,
  gastos_agua boolean default false,
  gastos_luz boolean default false,
  gastos_internet boolean default false,

  num_dormitorios numeric,
  num_dormitorios_individuales numeric,
  num_dormitorios_compartidos numeric,
  num_banos numeric,
  num_plazas numeric,
  plazas_habitacion numeric,
  uso_habitacion uso_habitacion_enum,
  bano_propio boolean default false,

  calefaccion boolean default false,
  aire_acondicionado boolean default false,
  parking boolean default false,
  parking_plazas numeric,

  sexo_permitido sexo_permitido_enum,
  actividad_permitida actividad_permitida_enum,
  mascotas boolean default false,
  fumar boolean default false,

  dist_autobus numeric,
  dist_metro numeric,
  dist_ferrocarril numeric,
  dist_tranvia numeric,

  contacto_nombre text,
  contacto_edad numeric,
  contacto_sexo sexo_enum,
  contacto_actividad actividad_enum,
  contacto_email text,
  contacto_telefono text,

  created_date timestamptz not null default now(),
  updated_date timestamptz not null default now()
);

create index on public.listings (status);
create index on public.listings (created_by_id);

-- ============================================================
-- 4. CONTACT_REQUESTS (solicitudes de contacto)
-- ============================================================
create table public.contact_requests (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings(id) on delete cascade,
  requester_id uuid not null references auth.users(id) on delete cascade,
  requester_name text,
  requester_message text,
  requester_edad numeric,
  requester_sexo sexo_enum,
  requester_actividad actividad_enum,
  owner_id uuid not null references auth.users(id) on delete cascade,
  status contact_status_enum not null default 'pending',
  created_date timestamptz not null default now(),
  updated_date timestamptz not null default now()
);

create index on public.contact_requests (owner_id);
create index on public.contact_requests (requester_id);

-- ============================================================
-- 5. SAVED_SEARCHES (Mi Radar)
-- ============================================================
create table public.saved_searches (
  id uuid primary key default gen_random_uuid(),
  created_by_id uuid not null references auth.users(id) on delete cascade,
  name text,
  search_type listing_type_enum,
  filters jsonb default '{}'::jsonb,
  notify boolean default true,
  new_matches_count numeric default 0,
  created_date timestamptz not null default now(),
  updated_date timestamptz not null default now()
);

create index on public.saved_searches (created_by_id);

-- ============================================================
-- 6. updated_date automático en cada UPDATE
-- ============================================================
create function public.set_updated_date()
returns trigger as $$
begin
  new.updated_date = now();
  return new;
end;
$$ language plpgsql;

create trigger set_updated_date before update on public.profiles
  for each row execute procedure public.set_updated_date();
create trigger set_updated_date before update on public.listings
  for each row execute procedure public.set_updated_date();
create trigger set_updated_date before update on public.contact_requests
  for each row execute procedure public.set_updated_date();
create trigger set_updated_date before update on public.saved_searches
  for each row execute procedure public.set_updated_date();

-- ============================================================
-- 7. RLS — Row Level Security
-- ============================================================
alter table public.profiles enable row level security;
alter table public.listings enable row level security;
alter table public.contact_requests enable row level security;
alter table public.saved_searches enable row level security;

-- Helper: ¿el usuario actual es admin?
create function public.is_admin()
returns boolean as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  );
$$ language sql security definer stable;

-- --- profiles ---
create policy "profiles: ver el propio o admin ve todos"
  on public.profiles for select
  using (auth.uid() = id or public.is_admin());

create policy "profiles: solo admin actualiza (incluye el rol)"
  on public.profiles for update
  using (public.is_admin());

-- --- listings ---
create policy "listings: cualquiera ve los activos"
  on public.listings for select
  using (status = 'active' or auth.uid() = created_by_id or public.is_admin());

create policy "listings: usuario autenticado crea los suyos"
  on public.listings for insert
  with check (auth.uid() = created_by_id);

create policy "listings: dueño o admin actualiza"
  on public.listings for update
  using (auth.uid() = created_by_id or public.is_admin());

create policy "listings: dueño o admin elimina"
  on public.listings for delete
  using (auth.uid() = created_by_id or public.is_admin());

-- --- contact_requests ---
create policy "contact_requests: implicados o admin ven"
  on public.contact_requests for select
  using (auth.uid() = requester_id or auth.uid() = owner_id or public.is_admin());

create policy "contact_requests: usuario autenticado crea la suya"
  on public.contact_requests for insert
  with check (auth.uid() = requester_id);

create policy "contact_requests: propietario o admin actualiza (aceptar/rechazar)"
  on public.contact_requests for update
  using (auth.uid() = owner_id or public.is_admin());

create policy "contact_requests: admin elimina"
  on public.contact_requests for delete
  using (public.is_admin());

-- --- saved_searches ---
create policy "saved_searches: dueño o admin ve"
  on public.saved_searches for select
  using (auth.uid() = created_by_id or public.is_admin());

create policy "saved_searches: usuario autenticado crea la suya"
  on public.saved_searches for insert
  with check (auth.uid() = created_by_id);

create policy "saved_searches: dueño o admin actualiza"
  on public.saved_searches for update
  using (auth.uid() = created_by_id or public.is_admin());

create policy "saved_searches: dueño o admin elimina"
  on public.saved_searches for delete
  using (auth.uid() = created_by_id or public.is_admin());

-- ============================================================
-- 8. STORAGE — bucket público para fotos de anuncios
-- ============================================================
insert into storage.buckets (id, name, public)
values ('listing-images', 'listing-images', true)
on conflict (id) do nothing;

create policy "listing-images: lectura pública"
  on storage.objects for select
  using (bucket_id = 'listing-images');

create policy "listing-images: usuario autenticado sube"
  on storage.objects for insert
  with check (bucket_id = 'listing-images' and auth.uid() is not null);

create policy "listing-images: dueño del archivo borra"
  on storage.objects for delete
  using (bucket_id = 'listing-images' and auth.uid() = owner);

-- ============================================================
-- 9. Hacerte admin a ti mismo (ejecuta esto TÚ, tras registrarte)
-- ============================================================
-- update public.profiles set role = 'admin' where id = (
--   select id from auth.users where email = 'tu-email@ejemplo.com'
-- );
