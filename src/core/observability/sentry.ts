import * as Sentry from '@sentry/react-native';

import { env } from '@/core/config/env';
import { setLogReporter } from '@/core/logger';

/** Só ativa quando há DSN configurado (EXPO_PUBLIC_SENTRY_DSN). */
export const sentryEnabled = Boolean(env.sentryDsn);

/**
 * Inicializa o Sentry e liga o logger (warn → message, error → exception).
 * Sem DSN, vira no-op — nada é enviado, nada quebra. Chamar uma vez no boot.
 */
export function initSentry() {
  if (!sentryEnabled) return;

  Sentry.init({
    dsn: env.sentryDsn,
    environment: env.appEnv,
    // Amostra de performance moderada; ajustar conforme volume.
    tracesSampleRate: env.appEnv === 'production' ? 0.2 : 1.0,
    sendDefaultPii: false,
  });

  setLogReporter({
    warn: (args) => {
      Sentry.captureMessage(args.map(String).join(' '), 'warning');
    },
    error: (args) => {
      const err = args.find((a) => a instanceof Error);
      if (err) Sentry.captureException(err);
      else Sentry.captureMessage(args.map(String).join(' '), 'error');
    },
  });
}

/** Envolve o componente raiz para instrumentação de navegação/perf. */
export const wrapWithSentry: typeof Sentry.wrap = (component) =>
  sentryEnabled ? Sentry.wrap(component) : component;
