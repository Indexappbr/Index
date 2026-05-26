import { FlashList } from '@shopify/flash-list';
import { Image } from 'expo-image';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useCallback } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useBook, useChapters } from '@/features/library/hooks/use-books';
import type { Book, Chapter } from '@/features/library/types';
import { formatDuration } from '@/shared/utils/format';

function BookHeader({ book }: { book: Book }) {
  return (
    <View className="gap-4 pb-4">
      <View className="flex-row gap-4">
        <Image
          source={book.coverUrl}
          style={{ width: 110, height: 165, borderRadius: 12, backgroundColor: '#e4e4e7' }}
          contentFit="cover"
          transition={150}
        />
        <View className="flex-1 justify-center gap-1.5">
          <Text className="text-xl font-bold text-zinc-900 dark:text-white">{book.title}</Text>
          {book.subtitle ? <Text className="text-sm text-zinc-500">{book.subtitle}</Text> : null}
          {book.authors.length > 0 ? (
            <Text className="text-sm text-zinc-600 dark:text-zinc-300">
              {book.authors.join(', ')}
            </Text>
          ) : null}
          {book.durationSeconds > 0 ? (
            <Text className="text-xs text-zinc-400">{formatDuration(book.durationSeconds)}</Text>
          ) : null}
        </View>
      </View>
      {book.description ? (
        <Text className="text-sm leading-5 text-zinc-600 dark:text-zinc-300">
          {book.description}
        </Text>
      ) : null}
      <Text className="pt-2 text-base font-semibold text-zinc-900 dark:text-white">Capítulos</Text>
    </View>
  );
}

function ChapterRow({ chapter }: { chapter: Chapter }) {
  // TODO(player): tornar pressable e iniciar reprodução (passo 7 — RNTP).
  return (
    <View className="flex-row items-center gap-3 border-b border-zinc-100 py-3 dark:border-zinc-800">
      <Text className="w-6 text-sm text-zinc-400">{chapter.orderIndex + 1}</Text>
      <Text className="flex-1 text-base text-zinc-800 dark:text-zinc-100" numberOfLines={1}>
        {chapter.title}
      </Text>
      <Text className="text-xs text-zinc-400">{formatDuration(chapter.lengthSeconds)}</Text>
    </View>
  );
}

export default function BookDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: book, isLoading } = useBook(id);
  const { data: chapters } = useChapters(book?.id);

  const renderItem = useCallback(
    ({ item }: { item: Chapter }) => <ChapterRow chapter={item} />,
    [],
  );

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-black">
        <ActivityIndicator />
      </View>
    );
  }

  if (!book) {
    return (
      <View className="flex-1 items-center justify-center bg-white px-6 dark:bg-black">
        <Text className="text-center text-zinc-500">Livro não encontrado.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-black" edges={['bottom']}>
      <Stack.Screen options={{ headerShown: true, title: book.title }} />
      <FlashList
        data={chapters ?? []}
        keyExtractor={(c) => c.id}
        ListHeaderComponent={<BookHeader book={book} />}
        renderItem={renderItem}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24, paddingTop: 12 }}
        ListEmptyComponent={<Text className="text-zinc-500">Nenhum capítulo disponível.</Text>}
      />
    </SafeAreaView>
  );
}
