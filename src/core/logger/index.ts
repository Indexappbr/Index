/**
 * Logger central. Em dev imprime no console; warn/error também são repassados
 * a um "reporter" opcional (ligado ao Sentry no bootstrap). O logger NÃO importa
 * o SDK do Sentry — a observabilidade se pluga via setLogReporter, mantendo o
 * logger leve e sem dependências nativas (testes não carregam o Sentry).
 */
const isDev = typeof __DEV__ !== 'undefined' ? __DEV__ : false;

export interface LogReporter {
  warn?: (args: unknown[]) => void;
  error?: (args: unknown[]) => void;
}

let reporter: LogReporter | null = null;

/** Liga um destino externo (ex: Sentry) para warn/error. */
export function setLogReporter(next: LogReporter | null) {
  reporter = next;
}

export const logger = {
  debug: (...args: unknown[]) => {
    if (isDev) console.log('[debug]', ...args);
  },
  info: (...args: unknown[]) => {
    if (isDev) console.info('[info]', ...args);
  },
  warn: (...args: unknown[]) => {
    console.warn('[warn]', ...args);
    reporter?.warn?.(args);
  },
  error: (...args: unknown[]) => {
    console.error('[error]', ...args);
    reporter?.error?.(args);
  },
};
