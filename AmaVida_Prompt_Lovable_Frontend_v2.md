# Prompt para o Lovable — AmaVida (Frontend v2)

> Copie e cole este prompt completo. Se já existe um projeto AmaVida no Lovable a partir do prompt v1, cole como uma nova mensagem pedindo para ajustar o projeto existente — não recrie do zero.
> Escopo: **somente frontend** (React + Tailwind), dados mockados em memória. Sem Supabase, sem autenticação real nesta etapa.

---

## 1. Contexto (o que muda do v1 para o v2)

O produto deixou de ser paraense-only: o núcleo é nacional, com Pará como piloto de validação (dados locais, como unidade de saúde e programas municipais, variam por região — mas isso é problema de dado/backend, não de UI). Nesta v2, quatro melhorias de produto entram na interface:

1. **Onboarding é do cuidador, não do idoso** — o cuidador cria o perfil; o idoso só confirma.
2. **Prova social** — mostrar quantas famílias já usam o app em cada unidade de saúde.
3. **Gancho emocional** — a notificação de check-in diário é o momento mais importante do produto; deve ter destaque visual próprio.
4. **Seja Nosso Parceiro** — uma página institucional (fora do app do idoso) para prefeituras, secretarias de saúde e ONGs.

Mantenha tudo o que já foi construído no v1 (Início, Remédios, Saúde, Família, Emergência, Modo Fácil, painel do cuidador). As instruções abaixo são adições e ajustes, não uma reconstrução.

## 2. Sistema de design (sem mudanças — reforçando)

| Nome | Hex | Uso |
|---|---|---|
| Rio Profundo | `#163B33` | textos principais, navegação, títulos |
| Verde Mata | `#2F7A5E` | ação primária |
| Ouro Amazônico | `#D9A23B` | destaques, badges neutros |
| Urucum | `#C1442E` | emergência e alertas — só para isso |
| Açaí | `#5B3568` | módulo Família/contatos |
| Papel | `#FBF7EF` | fundo padrão |
| Papel 2 | `#F3EEE1` | fundo de cartões secundários |

Tipografia: **Fraunces** (títulos) + **Atkinson Hyperlegible** (corpo/interface, escolhida por legibilidade para baixa visão).

## 3. Ajuste — Onboarding conduzido pelo cuidador

Substituir o fluxo de cadastro atual (se existir) por este, em 3 telas de um assistente (wizard):

1. **Tela "Quem você está cadastrando"** — formulário simples preenchido pelo cuidador: nome do idoso, remédios (pode adicionar mais de um, com horário e instrução), contatos de emergência, e localização (cidade/estado — armazenar como texto por enquanto, sem geolocalização real).
2. **Tela "Convide [nome do idoso]"** — gera um cartão visual com um QR code mockado (pode ser uma imagem estática de placeholder) e um botão **"Enviar link por WhatsApp"** (sem integração real, só a interface e um texto de confirmação ao clicar).
3. **Tela "Confirmação do idoso"** — simula o que o idoso vê ao abrir o link: nome já preenchido, um único botão grande **"Sim, sou eu"** (ou botão de voz equivalente) que finaliza o cadastro. Não pedir senha nem digitação nesta tela.

Este wizard é o novo ponto de entrada do app (antes da tela Início). Depois de completo, cai na experiência do v1 normalmente.

## 4. Ajuste — Prova social nos cartões de unidade de saúde

No componente reutilizável de "cartão de unidade de saúde" (tela Saúde), adicionar uma linha de prova social entre o endereço e o botão de ação, ex.: **"👥 127 famílias em [cidade] já usam o AmaVida com esta unidade"**. Deixar esse número como uma prop/variável fácil de trocar por dado real depois. Manter isso só em unidades já com status "verificado" (ver seção 6) — nunca mostrar número de adesão em algo ainda não confirmado.

## 5. Ajuste — Gancho emocional (notificação de check-in)

Criar um componente visual de "notificação" no estilo de card de app (não precisa ser uma notificação push real do sistema operacional) para ser usado em duas situações:

- Como destaque na tela inicial do **painel do cuidador**, no topo, acima dos três cartões de status já existentes.
- Como elemento isolado reutilizável, para eventualmente aparecer em material de divulgação/landing page fora do app.

Conteúdo do card: ícone de check verde, nome do idoso, texto curto (ex. "Confirmou: está tudo bem hoje. Já tomou a Losartana das 8h."), horário. Estilo: fundo claro, ícone verde Mata, tipografia de título em Fraunces itálico como legenda opcional ("É alívio, não vigilância").

## 6. Nova página — Seja Nosso Parceiro

Criar uma rota separada, ex. `/parceiros`, fora da navegação do app do idoso (é uma página institucional/pública, não uma tela do app):

- **Título**: "Mais que dado: um canal para chegar aos idosos que a UBS não visita toda semana."
- **Texto de apoio**: explicando que prefeituras, secretarias de saúde e ONGs podem indicar unidades e programas oficiais do município, e que o agente de saúde pode entregar o cadastro (QR code) presencialmente na visita domiciliar.
- **Lista de 3 benefícios** (ícone numerado): prioridade na fila de revisão de dados; agente de saúde entrega o QR code na visita; custo zero para prefeituras e ONGs no piloto.
- **Formulário** (sem envio real, só validação de campos e mensagem de confirmação): nome da instituição, município, estado, tipo de instituição (select: Prefeitura / Secretaria de Saúde / ONG-Associação / Empresa local / Outro), e-mail de contato. Botão **"Quero ser parceiro"**.

Este formulário deve, no futuro (próximo prompt, backend), gravar em uma tabela de leads de parceiros — por ora, é só interface com estado local de "enviado com sucesso".

## 7. Preparar terreno para multi-região (sem implementar agora)

Não é para implementar detecção de localização nesta etapa — só garantir que os componentes já aceitem esses dados como variáveis, para não precisar reescrever depois:

- O componente de cartão de unidade de saúde deve aceitar um status (`verificado` / `pendente`) e exibir um selo diferente para cada um.
- O texto "Mais próxima" no cartão de unidade deve vir de dado (não fixo no componente), já que no futuro isso varia por município.

## 8. O que continua fora de escopo nesta etapa

- Autenticação, login ou cadastro real de credenciais.
- Conexão com Supabase, qualquer API externa, WhatsApp real ou envio de e-mail real.
- Reconhecimento de voz real.
- Geolocalização real (usar campo de texto para cidade/estado por enquanto).

## 9. Responsividade

Prioridade absoluta em celular (~360–420px de largura). A página `/parceiros` pode assumir um layout mais largo (é acessada por instituições, provavelmente em desktop), mas sem quebrar em mobile.

---

**Próximo passo depois deste prompt**: com o frontend v2 validado, o prompt de backend trata do schema Supabase completo — incluindo as tabelas de cache geográfico (`health_units`, `municipio_sync_log`), a tabela de leads de parceiros, e o vínculo cuidador↔idoso criado no onboarding.
