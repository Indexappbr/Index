/**
 * Normaliza URLs de entrada (deep links) antes do Expo Router resolver a rota.
 *
 * O scheme custom (`indexapp://livro/<slug>`) já cai direto nas rotas. Aqui
 * tratamos os casos extras:
 *  - Universal/App Links web (`https://<dominio>/livro/<slug>`): tira a origem
 *    e mantém só o caminho, pra abrir a mesma tela nativa.
 *  - Callbacks de autenticação (OAuth/recuperação) chegam com `access_token`,
 *    `code` ou `error` — esses são tratados pelo fluxo de login (openAuthSession)
 *    e NÃO devem virar navegação; mandamos pra raiz.
 *
 * Tudo dentro de try/catch: qualquer URL inesperada cai no passthrough seguro.
 */
export function redirectSystemPath({
  path,
}: {
  path: string;
  initial: boolean;
}): string {
  try {
    // URL web (universal link): https://dominio/caminho?x=1 -> /caminho?x=1
    if (path.startsWith('http://') || path.startsWith('https://')) {
      const url = new URL(path);
      const normalized = `${url.pathname}${url.search}`;
      return isAuthCallback(url.href) ? '/' : normalized || '/';
    }

    // Deep link com fragmento/credenciais de auth: deixa o login cuidar.
    if (isAuthCallback(path)) return '/';

    return path;
  } catch {
    return '/';
  }
}

/** Detecta retornos de autenticação que não devem virar rota de conteúdo. */
function isAuthCallback(value: string): boolean {
  return (
    value.includes('access_token=') ||
    value.includes('refresh_token=') ||
    value.includes('type=recovery') ||
    /[?&#]code=/.test(value) ||
    value.includes('error_description=')
  );
}
