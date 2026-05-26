import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import type { Book } from '../types';

export function BookCard({ book }: { book: Book }) {
  return (
    <Link href={`/livro/${book.slug || book.id}`} asChild>
      <Pressable className="mb-4 flex-row gap-3 active:opacity-70">
        <Image
          source={book.coverThumbUrl}
          style={{ width: 64, height: 96, borderRadius: 8, backgroundColor: '#e4e4e7' }}
          contentFit="cover"
          transition={150}
        />
        <View className="flex-1 justify-center gap-1">
          <Text
            className="text-base font-semibold text-zinc-900 dark:text-white"
            numberOfLines={2}>
            {book.title}
          </Text>
          {book.authors.length > 0 ? (
            <Text className="text-sm text-zinc-500" numberOfLines={1}>
              {book.authors.join(', ')}
            </Text>
          ) : null}
          {book.isFree ? <Text className="text-xs font-medium text-brand">Gratuito</Text> : null}
        </View>
      </Pressable>
    </Link>
  );
}
