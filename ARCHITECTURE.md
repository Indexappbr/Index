# Arquitetura — Index Mobile

App mobile nativo (Expo SDK 56 + React Native 0.85 + TypeScript strict) que migra o
Index App web (PWA React/Vite), mantendo o backend Supabase/R2. Veja o plano completo
em `web-to-rn_migration_d39c3471.plan`.

## Stack base (instalada)

| Camada | Lib |
|--------|-----|
| Framework | Expo SDK 56 + Dev Client |
| Routing | Expo Router v6 (file-based, `src/app`) |
| Linguagem | TypeScript 6 (`strict: true`) |
| UI | NativeWind v4 + componentes customizados |
| Animações | react-native-reanimated 4 + gesture-handler + worklets |
| Imagens | expo-image |
| Validação | zod |

> Observação: o plano foi escrito para "SDK 52+"; o scaffold veio com **SDK 56**
> (mais novo), React 19.2 e Reanimated 4. Tudo compatível e superior ao plano.

## Pendente de instalar (por fase)

- **Auth:** `react-native-mmkv`, `expo-secure-store`, `expo-auth-session`, `expo-web-browser`, `@supabase/supabase-js`, `@tanstack/react-query`
- **Player:** `react-native-track-player`
- **IAP:** `react-native-purchases` (RevenueCat)
- **Offline:** WatermelonDB, `expo-file-system`, `expo-background-fetch`, `expo-task-manager`, `expo-crypto`
- **Listas/UX:** `@shopify/flash-list`, `react-native-toast-message`, `expo-haptics`
- **Obs:** `@sentry/react-native`, PostHog

## Organização de pastas

```
src/
├── app/            # Rotas (Expo Router). Grupos: (auth) e (app)
├── core/           # Infra transversal — NÃO importa de features/
│   ├── config/     # env.ts (Zod), constants.ts
│   ├── storage/    # keys.ts (MMKV + secure-store); mmkv.ts/secure-storage.ts (fase Auth)
│   ├── supabase/   # client.ts (fase Auth)
│   ├── http/       # api-client.ts — wrapper TanStack Query (fase Auth)
│   └── logger/     # logger central (+ Sentry futuramente)
├── features/       # Módulos por domínio — ilhas isoladas
│   │               # cada feature: hooks/ screens/ components/ services/ store/ types.ts
│   │               # criados sob demanda: auth, player, library, favorites,
│   │               # search, billing, offline, notifications, bible
├── shared/         # UI kit, hooks e utils reutilizáveis
└── providers/      # QueryProvider, AuthProvider, PlayerProvider, ThemeProvider (fases)
```

### Regras de dependência (obrigatórias)

1. `core/` **nunca** importa de `features/`.
2. `features/` podem importar de `shared/` e `core/`.
3. Uma feature **não** importa diretamente de outra feature — passa por `core/` ou `shared/`.
4. State: **Zustand** para Player (reatividade cross-component), **TanStack Query** para
   servidor, **MMKV** para persistência local.

### Convenções

- Alias de import: `@/*` → `src/*` (ver `tsconfig.json`).
- Segredos nunca no bundle: só `EXPO_PUBLIC_*` validados em `core/config/env.ts`;
  resto em EAS Secrets / edge functions.
- Listas longas sempre com `@shopify/flash-list`, nunca `FlatList`/`map`.
