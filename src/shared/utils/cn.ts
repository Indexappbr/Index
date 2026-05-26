/**
 * Concatena classes utilitárias do NativeWind condicionalmente.
 * Ex: cn('px-4', isActive && 'bg-brand', error ? 'text-red-500' : null)
 */
export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}
