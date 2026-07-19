-- AmaVida — schema inicial + RLS
-- Baseado em AmaVida_Prompt_Lovable_Backend_Supabase.md, com dois acréscimos
-- necessários pro fluxo de onboarding sem senha do idoso: `pending_invites`
-- e a função `confirm_elder_onboarding`.

create extension if not exists pgcrypto;

-- ============================================================
-- ENUMS
-- ============================================================

create type public.user_role as enum ('idoso', 'cuidador', 'admin');
create type public.appointment_status as enum ('encaminhado', 'marcado', 'concluido');
create type public.health_unit_source as enum ('cnes', 'google_places', 'manual');
create type public.verification_status as enum ('pendente', 'verificado');
create type public.sync_job_status as enum ('pendente', 'sucesso', 'falha');
create type public.partner_institution_type as enum ('prefeitura', 'secretaria_saude', 'ong', 'empresa_local', 'outro');
create type public.partner_lead_status as enum ('novo', 'em_contato', 'parceiro_ativo', 'descartado');

-- ============================================================
-- TABELAS
-- ============================================================

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role public.user_role not null default 'idoso',
  nome text,
  municipio text,
  estado text check (char_length(estado) = 2),
  created_at timestamptz not null default now()
);

create table public.caregiver_links (
  id uuid primary key default gen_random_uuid(),
  caregiver_id uuid not null references public.profiles(id) on delete cascade,
  elder_id uuid not null references public.profiles(id) on delete cascade,
  relacao text,
  created_at timestamptz not null default now(),
  unique (caregiver_id, elder_id)
);

create table public.medication_reminders (
  id uuid primary key default gen_random_uuid(),
  elder_id uuid not null references public.profiles(id) on delete cascade,
  nome_remedio text not null,
  horario time not null,
  instrucao text,
  created_at timestamptz not null default now()
);

create table public.medication_confirmations (
  id uuid primary key default gen_random_uuid(),
  reminder_id uuid not null references public.medication_reminders(id) on delete cascade,
  confirmado_em timestamptz not null default now()
);

create table public.health_units (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  endereco text,
  municipio text not null,
  estado text not null check (char_length(estado) = 2),
  codigo_ibge_municipio text,
  latitude double precision,
  longitude double precision,
  fonte public.health_unit_source not null default 'manual',
  status public.verification_status not null default 'pendente',
  contagem_familias integer not null default 0
);

create table public.municipal_programs (
  id uuid primary key default gen_random_uuid(),
  health_unit_id uuid references public.health_units(id) on delete set null,
  nome text not null,
  descricao text,
  dias_horario text,
  municipio text not null,
  estado text not null check (char_length(estado) = 2),
  status public.verification_status not null default 'pendente'
);

create table public.appointments (
  id uuid primary key default gen_random_uuid(),
  elder_id uuid not null references public.profiles(id) on delete cascade,
  health_unit_id uuid references public.health_units(id) on delete set null,
  tipo text not null,
  status public.appointment_status not null default 'encaminhado',
  data_marcada timestamptz
);

create table public.emergency_contacts (
  id uuid primary key default gen_random_uuid(),
  elder_id uuid not null references public.profiles(id) on delete cascade,
  nome text not null,
  telefone text not null,
  relacao text
);

create table public.emergency_events (
  id uuid primary key default gen_random_uuid(),
  elder_id uuid not null references public.profiles(id) on delete cascade,
  acionado_em timestamptz not null default now(),
  confirmado boolean not null default false,
  localizacao text
);

create table public.checkins (
  id uuid primary key default gen_random_uuid(),
  elder_id uuid not null references public.profiles(id) on delete cascade,
  data date not null default current_date,
  status text not null default 'estou bem',
  created_at timestamptz not null default now(),
  unique (elder_id, data)
);

create table public.municipio_sync_log (
  id uuid primary key default gen_random_uuid(),
  municipio text not null,
  estado text not null check (char_length(estado) = 2),
  codigo_ibge text,
  fonte_consultada text,
  status_job public.sync_job_status not null default 'pendente',
  iniciado_em timestamptz not null default now(),
  concluido_em timestamptz
);

create table public.sync_queue (
  id uuid primary key default gen_random_uuid(),
  elder_id uuid not null references public.profiles(id) on delete cascade,
  tipo_acao text not null,
  payload jsonb not null default '{}'::jsonb,
  sincronizado boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.partner_leads (
  id uuid primary key default gen_random_uuid(),
  nome_instituicao text not null,
  municipio text not null,
  estado text not null check (char_length(estado) = 2),
  tipo_instituicao public.partner_institution_type not null,
  email_contato text not null,
  status public.partner_lead_status not null default 'novo',
  created_at timestamptz not null default now()
);

-- Rascunho do cadastro do idoso enquanto o convite não é confirmado.
-- Token = chave de capacidade (UUID aleatório imprevisível). Não existe
-- policy de SELECT público nesta tabela — a leitura por token acontece só
-- via a função `get_pending_invite`, security definer, escopada a 1 linha.
create table public.pending_invites (
  token uuid primary key default gen_random_uuid(),
  caregiver_id uuid not null references public.profiles(id) on delete cascade,
  elder_nome text not null,
  elder_cidade text,
  elder_estado text check (elder_estado is null or char_length(elder_estado) = 2),
  medications jsonb not null default '[]'::jsonb,
  emergency_contacts jsonb not null default '[]'::jsonb,
  consumed_at timestamptz,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '7 days')
);

-- ============================================================
-- FUNÇÕES DE APOIO (security definer, quebram recursão de RLS)
-- ============================================================

create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

create or replace function public.is_caregiver_of(p_elder_id uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.caregiver_links
    where elder_id = p_elder_id and caregiver_id = auth.uid()
  );
$$;

-- Cria a linha de profiles automaticamente quando um auth.users é criado.
-- Cuidador: signUp normal (is_anonymous = false). Idoso: signInAnonymously()
-- no passo "Sim, sou eu" do onboarding (is_anonymous = true).
create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, role)
  values (new.id, (case when new.is_anonymous then 'idoso' else 'cuidador' end)::public.user_role);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_auth_user();

-- Consome um pending_invite e materializa o cadastro do idoso.
-- Chamada pelo idoso já autenticado anonimamente (auth.uid() = novo elder_id).
create or replace function public.confirm_elder_onboarding(p_token uuid)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_invite public.pending_invites;
  v_elder_id uuid := auth.uid();
  v_med jsonb;
  v_contact jsonb;
begin
  if v_elder_id is null then
    raise exception 'Sessão do idoso não encontrada';
  end if;

  select * into v_invite
  from public.pending_invites
  where token = p_token
    and consumed_at is null
    and expires_at > now();

  if not found then
    raise exception 'Convite inválido ou expirado';
  end if;

  update public.profiles
  set nome = v_invite.elder_nome,
      municipio = v_invite.elder_cidade,
      estado = v_invite.elder_estado
  where id = v_elder_id;

  for v_med in select * from jsonb_array_elements(v_invite.medications)
  loop
    insert into public.medication_reminders (elder_id, nome_remedio, horario, instrucao)
    values (
      v_elder_id,
      v_med->>'nome',
      (v_med->>'horario')::time,
      v_med->>'instrucao'
    );
  end loop;

  for v_contact in select * from jsonb_array_elements(v_invite.emergency_contacts)
  loop
    insert into public.emergency_contacts (elder_id, nome, telefone, relacao)
    values (
      v_elder_id,
      v_contact->>'nome',
      v_contact->>'telefone',
      v_contact->>'relacao'
    );
  end loop;

  insert into public.caregiver_links (caregiver_id, elder_id, relacao)
  values (v_invite.caregiver_id, v_elder_id, 'cuidador')
  on conflict (caregiver_id, elder_id) do nothing;

  update public.pending_invites set consumed_at = now() where token = p_token;

  return v_elder_id;
end;
$$;

-- Leitura pública do convite por token exato — nunca lista, nunca permite
-- SELECT * na tabela. É a única forma do idoso ver o próprio nome antes de
-- confirmar (ele ainda não tem sessão nenhuma nesse momento).
create or replace function public.get_pending_invite(p_token uuid)
returns table (elder_nome text, elder_cidade text, elder_estado text, consumed boolean)
language sql
security definer
stable
set search_path = public
as $$
  select elder_nome, elder_cidade, elder_estado, (consumed_at is not null)
  from public.pending_invites
  where token = p_token and expires_at > now();
$$;

grant execute on function public.get_pending_invite(uuid) to anon, authenticated;
grant execute on function public.confirm_elder_onboarding(uuid) to authenticated;

-- Prova social: soma famílias por unidade de saúde do município do idoso.
create or replace function public.bump_health_unit_families()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_elder public.profiles;
begin
  select * into v_elder from public.profiles where id = new.elder_id;

  if v_elder.municipio is not null and v_elder.estado is not null then
    update public.health_units
    set contagem_familias = contagem_familias + 1
    where municipio = v_elder.municipio and estado = v_elder.estado;
  end if;

  return new;
end;
$$;

create trigger on_caregiver_link_created
  after insert on public.caregiver_links
  for each row execute function public.bump_health_unit_families();

-- Agregado pro Fluxo 3 do n8n (resumo semanal) — roda com a service_role,
-- que já bypassa RLS por padrão nos projetos Supabase.
create or replace function public.weekly_summary()
returns table (
  caregiver_id uuid,
  elder_id uuid,
  elder_nome text,
  doses_confirmadas bigint,
  checkins_confirmados bigint
)
language sql
security definer
stable
set search_path = public
as $$
  select
    cl.caregiver_id,
    cl.elder_id,
    p.nome as elder_nome,
    (
      select count(*) from public.medication_confirmations mc
      join public.medication_reminders mr on mr.id = mc.reminder_id
      where mr.elder_id = cl.elder_id and mc.confirmado_em >= now() - interval '7 days'
    ) as doses_confirmadas,
    (
      select count(*) from public.checkins c
      where c.elder_id = cl.elder_id and c.data >= current_date - 7
    ) as checkins_confirmados
  from public.caregiver_links cl
  join public.profiles p on p.id = cl.elder_id;
$$;

grant execute on function public.weekly_summary() to service_role;

-- ============================================================
-- RLS
-- ============================================================

alter table public.profiles enable row level security;
alter table public.caregiver_links enable row level security;
alter table public.medication_reminders enable row level security;
alter table public.medication_confirmations enable row level security;
alter table public.appointments enable row level security;
alter table public.health_units enable row level security;
alter table public.municipal_programs enable row level security;
alter table public.emergency_contacts enable row level security;
alter table public.emergency_events enable row level security;
alter table public.checkins enable row level security;
alter table public.municipio_sync_log enable row level security;
alter table public.sync_queue enable row level security;
alter table public.partner_leads enable row level security;
alter table public.pending_invites enable row level security;

-- profiles
create policy "profiles_select" on public.profiles for select
  using (id = auth.uid() or is_caregiver_of(id) or is_admin());
create policy "profiles_update_self" on public.profiles for update
  using (id = auth.uid() or is_admin());

-- caregiver_links
create policy "caregiver_links_select" on public.caregiver_links for select
  using (caregiver_id = auth.uid() or elder_id = auth.uid() or is_admin());
create policy "caregiver_links_insert" on public.caregiver_links for insert
  with check (caregiver_id = auth.uid() or is_admin());

-- medication_reminders
create policy "medication_reminders_select" on public.medication_reminders for select
  using (elder_id = auth.uid() or is_caregiver_of(elder_id) or is_admin());
create policy "medication_reminders_write" on public.medication_reminders for all
  using (is_caregiver_of(elder_id) or is_admin())
  with check (is_caregiver_of(elder_id) or is_admin());

-- medication_confirmations
create policy "medication_confirmations_select" on public.medication_confirmations for select
  using (
    exists (
      select 1 from public.medication_reminders mr
      where mr.id = reminder_id
        and (mr.elder_id = auth.uid() or is_caregiver_of(mr.elder_id) or is_admin())
    )
  );
create policy "medication_confirmations_insert" on public.medication_confirmations for insert
  with check (
    exists (
      select 1 from public.medication_reminders mr
      where mr.id = reminder_id
        and (mr.elder_id = auth.uid() or is_caregiver_of(mr.elder_id))
    )
  );

-- appointments
create policy "appointments_select" on public.appointments for select
  using (elder_id = auth.uid() or is_caregiver_of(elder_id) or is_admin());
create policy "appointments_write" on public.appointments for all
  using (is_caregiver_of(elder_id) or is_admin())
  with check (is_caregiver_of(elder_id) or is_admin());

-- health_units — leitura pública só de verificadas; admin vê/edita tudo
create policy "health_units_public_read" on public.health_units for select
  using (status = 'verificado' or is_admin());
create policy "health_units_admin_write" on public.health_units for all
  using (is_admin()) with check (is_admin());

-- municipal_programs — mesma regra
create policy "municipal_programs_public_read" on public.municipal_programs for select
  using (status = 'verificado' or is_admin());
create policy "municipal_programs_admin_write" on public.municipal_programs for all
  using (is_admin()) with check (is_admin());

-- emergency_contacts
create policy "emergency_contacts_select" on public.emergency_contacts for select
  using (elder_id = auth.uid() or is_caregiver_of(elder_id) or is_admin());
create policy "emergency_contacts_write" on public.emergency_contacts for all
  using (is_caregiver_of(elder_id) or is_admin())
  with check (is_caregiver_of(elder_id) or is_admin());

-- emergency_events — só o próprio idoso aciona
create policy "emergency_events_select" on public.emergency_events for select
  using (elder_id = auth.uid() or is_caregiver_of(elder_id) or is_admin());
create policy "emergency_events_insert" on public.emergency_events for insert
  with check (elder_id = auth.uid());

-- checkins — só o próprio idoso confirma
create policy "checkins_select" on public.checkins for select
  using (elder_id = auth.uid() or is_caregiver_of(elder_id) or is_admin());
create policy "checkins_insert" on public.checkins for insert
  with check (elder_id = auth.uid());

-- municipio_sync_log — admin only
create policy "municipio_sync_log_admin" on public.municipio_sync_log for all
  using (is_admin()) with check (is_admin());

-- sync_queue
create policy "sync_queue_select" on public.sync_queue for select
  using (elder_id = auth.uid() or is_caregiver_of(elder_id) or is_admin());
create policy "sync_queue_insert" on public.sync_queue for insert
  with check (elder_id = auth.uid() or is_caregiver_of(elder_id));

-- partner_leads — insert público (formulário sem login), leitura só admin
create policy "partner_leads_public_insert" on public.partner_leads for insert
  with check (true);
create policy "partner_leads_admin_select" on public.partner_leads for select
  using (is_admin());

-- pending_invites — só o cuidador dono; leitura pública passa pela função
-- get_pending_invite (security definer), nunca por SELECT direto.
create policy "pending_invites_owner" on public.pending_invites for all
  using (caregiver_id = auth.uid() or is_admin())
  with check (caregiver_id = auth.uid() or is_admin());
