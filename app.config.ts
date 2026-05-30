import type { ConfigContext, ExpoConfig } from 'expo/config';

/**
 * Config dinâmico, ciente do ambiente (development | preview | production).
 * O ambiente vem de EXPO_PUBLIC_APP_ENV, definido por perfil no eas.json.
 * Cada variante tem bundle id e scheme próprios → dá pra instalar dev + prod
 * lado a lado no mesmo aparelho.
 */
type AppEnv = 'development' | 'preview' | 'production';

const APP_ENV = (process.env.EXPO_PUBLIC_APP_ENV as AppEnv) ?? 'development';

const variants: Record<AppEnv, { name: string; bundleId: string; scheme: string }> = {
  development: { name: 'INDEX (Dev)', bundleId: 'com.indexapp.dev', scheme: 'indexappdev' },
  preview: { name: 'INDEX (Preview)', bundleId: 'com.indexapp.preview', scheme: 'indexapppreview' },
  production: { name: 'INDEX', bundleId: 'com.indexapp', scheme: 'indexapp' },
};

export default ({ config }: ConfigContext): ExpoConfig => {
  const v = variants[APP_ENV] ?? variants.development;

  return {
    ...config,
    name: v.name,
    slug: 'index-mobile',
    owner: 'index.app',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: v.scheme,
    userInterfaceStyle: 'automatic',
    ios: {
      bundleIdentifier: v.bundleId,
      icon: './assets/expo.icon',
      supportsTablet: true,
      // Background audio é requisito do player (RNTP) — habilitar quando
      // o player entrar (fase Player): infoPlist.UIBackgroundModes = ['audio']
    },
    android: {
      package: v.bundleId,
      adaptiveIcon: {
        backgroundColor: '#E6F4FE',
        foregroundImage: './assets/images/android-icon-foreground.png',
        backgroundImage: './assets/images/android-icon-background.png',
        monochromeImage: './assets/images/android-icon-monochrome.png',
      },
      predictiveBackGestureEnabled: false,
    },
    web: {
      // SPA (sem SSR): o app é mobile-first; storage/Supabase carregam só no
      // cliente. 'static' tentaria prerender no Node e quebra ao tocar storage.
      output: 'single',
      favicon: './assets/images/favicon.png',
    },
    plugins: [
      'expo-router',
      'expo-secure-store',
      // Observabilidade: source maps + symbolication no build (DSN via env em runtime).
      '@sentry/react-native/expo',
      [
        // Áudio em background + controles de lock screen. Sem microfone (não gravamos).
        'expo-audio',
        { microphonePermission: false, recordAudioAndroid: false },
      ],
      [
        // Push notifications (APNs/FCM). O envio real no iOS depende da
        // credencial Apple (aps-environment via EAS) — aqui fica a base do cliente.
        'expo-notifications',
        { color: '#208AEF' },
      ],
      [
        // Seleção de foto de perfil. Declara a permissão de galeria no iOS.
        'expo-image-picker',
        {
          photosPermission:
            'O INDEX precisa acessar suas fotos para você definir uma foto de perfil.',
        },
      ],
      [
        'expo-splash-screen',
        {
          backgroundColor: '#208AEF',
          android: {
            image: './assets/images/splash-icon.png',
            imageWidth: 76,
          },
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
      reactCompiler: true,
    },
    extra: {
      appEnv: APP_ENV,
      eas: {
        projectId: '574f3ee8-6671-4dbc-9826-2ccaa982db26',
      },
    },
  };
};
