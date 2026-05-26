/** Constantes globais do app. Valores de domínio ficam aqui, não espalhados. */

export const APP_NAME = 'INDEX';

/** Player — salvar posição de reprodução no servidor a cada N ms. */
export const PLAYBACK_SYNC_INTERVAL_MS = 30_000;

/** URLs assinadas do R2 expiram em 1h; renovamos com 10min de margem. */
export const SIGNED_URL_TTL_MS = 60 * 60 * 1000;
export const SIGNED_URL_REFRESH_MARGIN_MS = 10 * 60 * 1000;

/** Cache de billing (igual ao web). */
export const BILLING_CACHE_TTL_MS = 60 * 1000;
