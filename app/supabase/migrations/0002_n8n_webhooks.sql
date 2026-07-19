-- Database Webhooks pro n8n, via pg_net (assíncrono, não trava a transação
-- que fez o insert). URL do túnel é temporária (cloudflared quick tunnel,
-- válida só durante a sessão de desenvolvimento) — trocar quando o n8n
-- tiver um host permanente. Ver README para instruções de atualização.
--
-- A URL fica em public.app_config (não numa GUC — o role "postgres" do
-- Supabase não tem permissão pra ALTER DATABASE SET parâmetro customizado).

create extension if not exists pg_net with schema extensions;

create table if not exists public.app_config (
  key text primary key,
  value text
);
alter table public.app_config enable row level security;
drop policy if exists "app_config_admin_only" on public.app_config;
create policy "app_config_admin_only" on public.app_config for all
  using (is_admin()) with check (is_admin());

create or replace function public.notify_n8n()
returns trigger
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_base_url text;
  v_path text;
begin
  select value into v_base_url from public.app_config where key = 'n8n_webhook_base_url';

  if v_base_url is null or v_base_url = '' then
    -- URL não configurada; não bloqueia o insert, só não notifica.
    return new;
  end if;

  v_path := case tg_table_name
    when 'checkins' then '/webhook/checkin-confirmado'
    when 'emergency_events' then '/webhook/emergencia-confirmada'
    when 'partner_leads' then '/webhook/novo-lead-parceiro'
    else null
  end;

  if v_path is not null then
    perform net.http_post(
      url := v_base_url || v_path,
      body := jsonb_build_object('type', 'INSERT', 'table', tg_table_name, 'record', to_jsonb(new)),
      headers := jsonb_build_object('Content-Type', 'application/json')
    );
  end if;

  return new;
end;
$$;

drop trigger if exists notify_n8n_on_checkin on public.checkins;
create trigger notify_n8n_on_checkin
  after insert on public.checkins
  for each row execute function public.notify_n8n();

drop trigger if exists notify_n8n_on_emergency_event on public.emergency_events;
create trigger notify_n8n_on_emergency_event
  after insert on public.emergency_events
  for each row execute function public.notify_n8n();

drop trigger if exists notify_n8n_on_partner_lead on public.partner_leads;
create trigger notify_n8n_on_partner_lead
  after insert on public.partner_leads
  for each row execute function public.notify_n8n();

-- Configurar/atualizar a URL do n8n com:
--   insert into public.app_config (key, value) values ('n8n_webhook_base_url', 'https://sua-url')
--   on conflict (key) do update set value = excluded.value;
