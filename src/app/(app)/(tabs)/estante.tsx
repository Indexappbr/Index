import { FlashList } from '@shopify/flash-list';
import { useCallback } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BookCard } from '@/features/library/components/BookCard';
import type { Book } from '@/features/library/types';
import { useFavoritedBooks } from '@/features/favorites/hooks/use-favorited-books';

export default function EstanteScreen() {
  const { data: books, isLoading, error } = useFavoritedBooks();

  const renderItem = useCallback(({ item }: { item: Book }) => <BookCard book={item} />, []);

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-black" edges={['top']}>
      <View className="px-5 pb-3 pt-2">
        <Text className="text-2xl font-bold text-zinc-900 dark:text-white">Estante</Text>
        <Text className="text-sm text-zinc-500">Seus livros favoritos</Text>
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator />
        </View>
      ) : error ? (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-center text-red-500">
            Erro ao carregar: {(error as Error).message}
          </Text>
        </View>
      ) : (
        <FlashList
          data={books}
          keyExtractor={(b) => b.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24 }}
          ListEmptyComponent={
            <View className="items-center px-6 pt-16">
              <Text className="text-5xl">🤍</Text>
              <Text className="pt-4 text-center text-base font-medium text-zinc-700 dark:text-zinc-200">
                Sua estante está vazia
              </Text>
              <Text className="pt-1 text-center text-sm text-zinc-500">
                Toque no coração em um livro para guardá-lo aqui.
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}
