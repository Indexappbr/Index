import { FlashList } from '@shopify/flash-list';
import { useCallback } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BookCard } from '@/features/library/components/BookCard';
import { useBooks } from '@/features/library/hooks/use-books';
import type { Book } from '@/features/library/types';

export default function HomeScreen() {
  const { data: books, isLoading, error } = useBooks();

  const renderItem = useCallback(({ item }: { item: Book }) => <BookCard book={item} />, []);

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-black" edges={['top']}>
      <View className="px-5 pb-3 pt-2">
        <Text className="text-2xl font-bold text-zinc-900 dark:text-white">INDEX</Text>
        <Text className="text-sm text-zinc-500">Biblioteca de áudio</Text>
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator />
        </View>
      ) : error ? (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-center text-red-500">
            Erro ao carregar a biblioteca: {(error as Error).message}
          </Text>
        </View>
      ) : (
        <FlashList
          data={books ?? []}
          keyExtractor={(b) => b.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24 }}
          ListEmptyComponent={
            <Text className="px-1 text-zinc-500">Nenhum livro publicado ainda.</Text>
          }
        />
      )}
    </SafeAreaView>
  );
}
