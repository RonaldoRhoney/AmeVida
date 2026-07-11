# Prompt para o Lovable — AmaVida (Backend / Supabase)

> Copie e cole como uma nova mensagem no mesmo projeto Lovable, depois que o frontend v2 estiver validado.
> Este prompt conecta a interface já construída a um backend Supabase real: autenticação, schema, RLS e as automações essenciais. Siga o padrão RhoneyInc já usado em FinWise, MeuPet e MontaMovel: RLS em todas as tabelas sensíveis, com função `is_admin()` security-definer.

---

## 1. Autenticação

- Dois papéis de usuário: **idoso** e **cuidador**. Um `admin` adicional para a equipe RhoneyInc.
- Login por e-mail/senha para o cuidador (é quem faz o cadastro). O idoso não precisa de login próprio nesta fase — o acesso dele é via o link/QR code gerado pelo cuidador, associado ao perfil já existente.
- Usar Supabase Auth padrão; o campo `role` fica na tabela `profiles`, não no JWT.

## 2. Schema — tabelas principais

### `profiles`
- `id` (uuid, referencia `auth.users`)
- `role` (enum: `idoso`, `cuidador`, `admin`)
- `nome` (text)
- `municipio` (text)
- `estado` (text, 2 caracteres)
- `created_at`

### `caregiver_links`
- `id`
- `caregiver_id` (referencia `profiles`)
- `elder_id` (referencia `profiles`)
- `relacao` (text — ex. "filha", "neto")
- `created_at`

### `medication_reminders`
- `id`
- `elder_id` (referencia `profiles`)
- `nome_remedio` (text)
- `horario` (time)
- `instrucao` (text — ex. "em jejum")
- `created_at`

### `medication_confirmations`
- `id`
- `reminder_id` (referencia `medication_reminders`)
- `confirmado_em` (timestamptz)

*(separar confirmação do lembrete em vez de um campo booleano único — preserva histórico para o painel do cuidador)*

### `appointments`
- `id`
- `elder_id`
- `health_unit_id` (referencia `health_units`)
- `tipo` (text — ex. "Avaliação Multidimensional")
- `status` (enum: `encaminhado`, `marcado`, `concluido`)
- `data_marcada` (timestamptz, opcional)

### `health_units`
- `id`
- `nome` (text)
- `endereco` (text)
- `municipio` (text)
- `estado` (text)
- `codigo_ibge_municipio` (text)
- `latitude`, `longitude` (float, opcionais)
- `fonte` (enum: `cnes`, `google_places`, `manual`)
- `status` (enum: `pendente`, `verificado`)
- `contagem_familias` (int, default 0) — alimenta a prova social; atualizado por trigger quando um novo `caregiver_links`/perfil se associa a essa unidade

### `municipal_programs`
- `id`
- `health_unit_id` (referencia `health_units`, opcional)
- `nome` (text — ex. "Mexa-se pela Vida")
- `descricao` (text)
- `dias_horario` (text)
- `municipio`, `estado`
- `status` (enum: `pendente`, `verificado`) — sempre cadastro manual, nunca vem de importação automática

### `emergency_contacts`
- `id`
- `elder_id`
- `nome`, `telefone`, `relacao`

### `emergency_events`
- `id`
- `elder_id`
- `acionado_em` (timestamptz)
- `confirmado` (boolean) — se foi engano/cancelado ou se seguiu adiante
- `localizacao` (text ou point, opcional)

### `checkins`
- `id`
- `elder_id`
- `data` (date)
- `status` (text — ex. "estou bem")
- `created_at`

### `municipio_sync_log`
- `id`
- `municipio`, `estado`, `codigo_ibge`
- `fonte_consultada` (text)
- `status_job` (enum: `pendente`, `sucesso`, `falha`)
- `iniciado_em`, `concluido_em`

### `sync_queue`
- `id`
- `elder_id`
- `tipo_acao` (text)
- `payload` (jsonb)
- `sincronizado` (boolean, default false)
- `created_at`

*(fila local para o modo offline — o frontend grava aqui quando sem internet, e um processo consome quando a conexão volta)*

### `partner_leads`
- `id`
- `nome_instituicao` (text)
- `municipio`, `estado`
- `tipo_instituicao` (enum: `prefeitura`, `secretaria_saude`, `ong`, `empresa_local`, `outro`)
- `email_contato` (text)
- `status` (enum: `novo`, `em_contato`, `parceiro_ativo`, `descartado`)
- `created_at`

## 3. Segurança e RLS

- Habilitar RLS em **todas** as tabelas acima.
- Criar função `is_admin()` security-definer, no mesmo padrão dos outros produtos RhoneyInc, checando `profiles.role = 'admin'`.
- Políticas por tabela:
  - `profiles`: usuário só lê/edita o próprio registro; cuidador também lê os perfis de idosos vinculados via `caregiver_links`; admin lê tudo.
  - `medication_reminders`, `medication_confirmations`, `appointments`, `emergency_contacts`, `emergency_events`, `checkins`, `sync_queue`: acesso restrito ao `elder_id` correspondente e ao(s) `caregiver_id` vinculado(s) via `caregiver_links`; admin lê tudo.
  - `health_units`, `municipal_programs`: leitura pública apenas dos registros com `status = 'verificado'`; escrita e leitura de `pendente` restritas a admin.
  - `municipio_sync_log`: leitura e escrita restritas a admin.
  - `partner_leads`: escrita pública (via formulário, sem necessidade de login), leitura restrita a admin.
- Nenhuma tabela deve permitir leitura pública irrestrita de dado de saúde do idoso — mesmo agregados como `contagem_familias` devem vir de uma view ou função que exponha só o número, nunca os registros individuais.

## 4. Triggers e funções

- Trigger em `caregiver_links` (insert): quando um novo vínculo é criado associado a uma `health_units.id` (via o município do idoso), incrementar `health_units.contagem_familias`.
- Trigger em `medication_confirmations` (insert): opcionalmente disparar uma entrada de notificação para o cuidador (via automação n8n — ver seção 5), correspondente ao gancho emocional do check-in.
- Função `is_admin()` conforme já usada nos demais produtos.

## 5. Automação (n8n)

- Fluxo 1: quando `checkins` recebe um novo registro do dia, montar e enviar a notificação de "check-in confirmado" para o cuidador vinculado (push notification + fallback WhatsApp).
- Fluxo 2: quando `emergency_events` é criado com `confirmado = true`, notificar todos os `emergency_contacts` do idoso imediatamente, com prioridade máxima.
- Fluxo 3 (semanal): gerar um resumo agregado (remédios confirmados, check-ins do período) e enviar ao cuidador.
- Fluxo 4: quando um `partner_leads` novo é criado, notificar a equipe RhoneyInc por e-mail/Slack para contato manual.

## 6. O que não fazer nesta etapa

- Não implementar o job de importação automática do CNES/OpenDataSUS em si (isso é um serviço à parte, fora do escopo deste prompt de Lovable) — apenas garantir que o schema de `health_units` e `municipio_sync_log` já comporte esse fluxo quando ele existir.
- Não expor nenhuma tabela de dado de saúde individual publicamente, mesmo que pareça inofensivo.

---

**Depois deste prompt**: revisar as políticas de RLS geradas com uma leitura manual (Supabase permite visualizar policies aplicadas), e testar o fluxo completo — cuidador cria perfil → idoso confirma → lembrete confirmado → notificação aparece no painel do cuidador — de ponta a ponta antes de considerar o piloto do Pará pronto para usuários reais.
