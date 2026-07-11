# AmaVida

Uma companhia digital para a pessoa idosa — piloto de validação no Pará, núcleo nacional. Voz em primeiro lugar, poucos toques por tarefa, e uma rede de apoio (cuidador) sempre visível.

## O que tem neste repositório

- **`app/`** — o app React funcional: onboarding do cuidador (3 passos), telas do idoso (Início, Remédios, Saúde, Família, Emergência), painel do cuidador e a página institucional "Seja Nosso Parceiro". Dados mockados em memória, sem backend ainda.
- **`amavida-preview.html`** — preview estático de uma página só, usado para validar fluxo e design com stakeholders antes de virar app real.
- **`AmaVida_Prompt_Lovable_Frontend_v2.md`** — especificação do frontend (telas, regras de produto, sistema de design).
- **`AmaVida_Prompt_Lovable_Backend_Supabase.md`** — especificação do schema Supabase, RLS e automações para quando o backend entrar em cena (ainda não implementado).

## Rodando o app

```bash
cd app
npm install
npm run dev
```

## Status

Fase de validação de frontend — sem autenticação real, sem Supabase, sem geolocalização real. Próximo passo: ligar o app ao backend descrito em `AmaVida_Prompt_Lovable_Backend_Supabase.md`.
