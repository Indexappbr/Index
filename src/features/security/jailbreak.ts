import { File } from 'expo-file-system';
import { Platform } from 'react-native';

/**
 * Detecção heurística de jailbreak (iOS) / root (Android) sem módulo nativo:
 * checa a existência de caminhos típicos de aparelhos comprometidos. É uma
 * primeira camada — não é à prova de bypass; um hardening completo usaria um
 * módulo nativo (ex: jail-monkey) numa fase com teste em device. Conforme o
 * plano (§8), a política é AVISAR, não bloquear (evita falso-positivo).
 */

const IOS_PATHS = [
  '/Applications/Cydia.app',
  '/Library/MobileSubstrate/MobileSubstrate.dylib',
  '/bin/bash',
  '/usr/sbin/sshd',
  '/etc/apt',
  '/private/var/lib/apt/',
  '/usr/bin/ssh',
];

const ANDROID_PATHS = [
  '/system/app/Superuser.apk',
  '/system/bin/su',
  '/system/xbin/su',
  '/sbin/su',
  '/data/local/xbin/su',
  '/data/local/bin/su',
  '/system/sd/xbin/su',
  '/data/local/su',
  '/su/bin/su',
];

function pathExists(path: string): boolean {
  try {
    return new File(`file://${path}`).exists;
  } catch {
    // Sandbox pode lançar ao stat de caminho proibido — tratamos como ausente.
    return false;
  }
}

/** Retorna true se houver sinais de jailbreak/root. Nunca lança. */
export function isDeviceCompromised(): boolean {
  if (Platform.OS === 'ios') return IOS_PATHS.some(pathExists);
  if (Platform.OS === 'android') return ANDROID_PATHS.some(pathExists);
  return false;
}
