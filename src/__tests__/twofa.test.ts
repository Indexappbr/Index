// Evita carregar a cadeia nativa do client real (MMKV/SecureStore/crypto).
jest.mock('@/core/supabase/client', () => ({
  supabase: { functions: { invoke: jest.fn() } },
}));

import { parseSecret } from '@/features/account/services/twofa.service';

describe('parseSecret', () => {
  it('extrai o segredo base32 do otpauth URI', () => {
    const uri = 'otpauth://totp/INDEX:user@x.com?secret=JBSWY3DPEHPK3PXP&issuer=INDEX';
    expect(parseSecret(uri)).toBe('JBSWY3DPEHPK3PXP');
  });

  it('funciona quando secret não é o primeiro parâmetro', () => {
    const uri = 'otpauth://totp/INDEX?issuer=INDEX&secret=ABC123&period=30';
    expect(parseSecret(uri)).toBe('ABC123');
  });

  it('retorna null quando não há secret', () => {
    expect(parseSecret('otpauth://totp/INDEX?issuer=INDEX')).toBeNull();
  });
});
