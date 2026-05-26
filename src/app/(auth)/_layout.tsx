import { Stack } from 'expo-router';

/** Fluxo de autenticação (não autenticado). */
export default function AuthLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
