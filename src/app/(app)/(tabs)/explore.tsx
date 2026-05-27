import { FlashList } from '@shopify/flash-list';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BookCard } from '@/features/library/components/BookCard';
import { useBooks } from '@/features/library/hooks/use-books';
import type { Book } from '@/features/library/types';
import { useSearchBooks } from '@/features/search/hooks/use-search';
import { TextField } from '@/shared/components/TextField';
import { useDebounce } from '@/shared/hooks/use-debounce';

export default function BibliotecaScreen() {
  const [query, setQuery] = useState('');
  const debounced = useDebounce(query, 350);
  const isSearching = debounced.trim().length >= 2;

  const allBooks = useBooks();
  const search = useSearchBooks(debounced);

  const active = isSearching ? search : allBooks;
  const books = active.data ?? [];

  const renderItem = useCallback(({ item }: { item: Book }) => <BookCard book={item} />, []);

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-black" edges={['top']}>
      <View className="gap-3 px-5 pb-3 pt-2">
        <Text className="text-2xl font-bold text-zinc-900 dark:text-white">Biblioteca</Text>
        <TextField
          value={query}
          onChangeText={setQuery}
          placeholder="Buscar título, autor…"
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
        />
      </View>

      {active.isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator />
        </View>
      ) : active.error ? (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-center text-red-500">{(active.error as Error).message}</Text>
        </View>
      ) : (
        <FlashList
          data={books}
          keyExtractor={(b) => b.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24 }}
          keyboardDismissMode="on-drag"
          ListEmptyComponent={
            <Text className="px-1 text-zinc-500">
              {isSearching ? 'Nenhum resultado para a busca.' : 'Nenhum livro disponível.'}
            </Text>
          }
        />
      )}
    </SafeAreaView>
  );
}
