import { redirectSystemPath } from '@/app/+native-intent';

describe('redirectSystemPath', () => {
  it('mantém caminhos internos de conteúdo', () => {
    expect(redirectSystemPath({ path: '/livro/confissoes', initial: true })).toBe(
      '/livro/confissoes',
    );
  });

  it('normaliza URL web (universal link) para o caminho', () => {
    expect(
      redirectSystemPath({ path: 'https://login.indexapp.com.br/livro/confissoes', initial: false }),
    ).toBe('/livro/confissoes');
  });

  it('blinda callback de auth com access_token → raiz', () => {
    expect(
      redirectSystemPath({ path: 'indexapp://auth#access_token=abc&refresh_token=def', initial: true }),
    ).toBe('/');
  });

  it('blinda callback OAuth com code → raiz', () => {
    expect(redirectSystemPath({ path: 'indexapp://auth?code=xyz', initial: true })).toBe('/');
  });

  it('blinda URL web de recovery → raiz', () => {
    expect(
      redirectSystemPath({ path: 'https://login.indexapp.com.br/reset#type=recovery', initial: true }),
    ).toBe('/');
  });

  it('cai no passthrough seguro em entrada inesperada', () => {
    expect(redirectSystemPath({ path: '/estante', initial: false })).toBe('/estante');
  });
});
