# AmaVida — app

App React (Vite + TypeScript + Tailwind v4) com todas as telas do AmaVida. Ver o README na raiz do repositório para contexto do projeto.

## Rodando

```bash
npm install
npm run dev
```

## Build

```bash
npm run build   # tsc -b && vite build
npm run preview # serve o build de produção localmente
```

## Estrutura

```
src/
  state/AppStateContext.tsx   # estado global em memória (perfil, remédios, contatos, check-ins)
  lib/mockData.ts             # unidades de saúde, programa municipal, log do cuidador
  onboarding/                 # wizard de 3 passos (cadastro do cuidador → convite → confirmação do idoso)
  screens/                    # Início, Remédios, Saúde, Família, Emergência
  components/layout/          # ElderShell (guard de onboarding + bottom nav), BottomNav
  components/shared/          # HealthUnitCard, CheckinHighlight, MicButton
  caregiver/CaregiverPanel.tsx
  partner/PartnerPage.tsx
```

## Estado atual

Dados mockados em memória — sem persistência (recarregar a página reseta o onboarding). Sem Supabase, sem autenticação real, sem geolocalização real, conforme escopo do `AmaVida_Prompt_Lovable_Frontend_v2.md`.
