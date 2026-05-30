import { routeFromNotification } from '@/features/notifications/service';

describe('routeFromNotification', () => {
  it('usa url direta do payload', () => {
    expect(routeFromNotification({ url: '/estante' })).toBe('/estante');
  });

  it('monta a rota do livro a partir de bookSlug', () => {
    expect(routeFromNotification({ bookSlug: 'confissoes' })).toBe('/livro/confissoes');
  });

  it('prioriza url sobre bookSlug', () => {
    expect(routeFromNotification({ url: '/conta', bookSlug: 'x' })).toBe('/conta');
  });

  it('retorna null sem dados de navegação', () => {
    expect(routeFromNotification(undefined)).toBeNull();
    expect(routeFromNotification({})).toBeNull();
    expect(routeFromNotification({ foo: 'bar' })).toBeNull();
  });
});
