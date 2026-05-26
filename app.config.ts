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
      output: 'static',
      favicon: './assets/images/favicon.png',
    },
    plugins: [
      'expo-router',
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
    },
  };
};
