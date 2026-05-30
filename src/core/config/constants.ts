/** Constantes globais do app. Valores de domínio ficam aqui, não espalhados. */

export const APP_NAME = 'INDEX';

/** Player — salvar posição de reprodução no servidor a cada N ms. */
export const PLAYBACK_SYNC_INTERVAL_MS = 30_000;

/** URLs assinadas do R2 expiram em 1h; renovamos com 10min de margem. */
export const SIGNED_URL_TTL_MS = 60 * 60 * 1000;
export const SIGNED_URL_REFRESH_MARGIN_MS = 10 * 60 * 1000;

/** Cache de billing (igual ao web). */
export const BILLING_CACHE_TTL_MS = 60 * 1000;

/**
 * Blurhash neutro usado como placeholder das capas no expo-image (fade-in
 * suave enquanto a imagem carrega). O backend ainda não fornece blurhash por
 * livro; quando fornecer, trocar pelo do próprio book.
 */
export const COVER_BLURHASH = 'LGF5]+Yk^6#M@-5c,1J5@[or[Q6.';
