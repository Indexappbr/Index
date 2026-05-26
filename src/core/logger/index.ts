/**
 * Logger central. Em dev imprime no console; em produção os métodos warn/error
 * são os pontos de integração com Sentry (a adicionar na fase de observabilidade).
 */
const isDev = typeof __DEV__ !== 'undefined' ? __DEV__ : false;

export const logger = {
  debug: (...args: unknown[]) => {
    if (isDev) console.log('[debug]', ...args);
  },
  info: (...args: unknown[]) => {
    if (isDev) console.info('[info]', ...args);
  },
  warn: (...args: unknown[]) => {
    console.warn('[warn]', ...args);
    // TODO(obs): Sentry.captureMessage(level: 'warning')
  },
  error: (...args: unknown[]) => {
    console.error('[error]', ...args);
    // TODO(obs): Sentry.captureException
  },
};
