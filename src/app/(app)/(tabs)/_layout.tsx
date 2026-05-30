import { View } from 'react-native';

import AppTabs from '@/components/app-tabs';
import { GlobalPlayerBar } from '@/features/player/components/GlobalPlayerBar';

/** Navegação por tabs nativas (Home / Biblioteca / Estante / Conta). */
export default function TabsLayout() {
  return (
    <View style={{ flex: 1 }}>
      <AppTabs />
      <GlobalPlayerBar />
    </View>
  );
}
