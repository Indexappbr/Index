import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { COVER_BLURHASH } from '@/core/config/constants';
import { useBiblia } from '@/features/biblia/hooks/use-biblia';
import type { BibliaSection } from '@/features/biblia/types';
import type { Book } from '@/features/library/types';

function Cover({ book }: { book: Book }) {
  return (
    <Link href={`/livro/${book.slug || book.id}`} asChild>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Abrir ${book.title}`}
        className="mr-3 w-[104px] active:opacity-70">
        <Image
          source={book.coverThumbUrl}
          placeholder={{ blurhash: COVER_BLURHASH }}
          style={{ width: 104, height: 156, borderRadius: 8, backgroundColor: '#e4e4e7' }}
          contentFit="cover"
          transition={150}
        />
        <Text
          className="pt-1.5 text-xs font-medium text-zinc-800 dark:text-zinc-100"
          numberOfLines={2}>
          {book.title}
        </Text>
      </Pressable>
    </Link>
  );
}

function Section({ section }: { section: BibliaSection }) {
  return (
    <View className="gap-3">
      <Text className="border-l-4 border-brand pl-2.5 text-lg font-bold text-zinc-900 dark:text-white">
        {section.title}
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {section.books.map((b) => (
          <Cover key={b.id} book={b} />
        ))}
      </ScrollView>
    </View>
  );
}

export default function BibliaScreen() {
  const { data, isLoading, error } = useBiblia();
  const [testament, setTestament] = useState<'old' | 'new'>('old');

  const sections = testament === 'old' ? data?.oldTestament : data?.newTestament;
  const isEmpty =
    !isLoading &&
    !error &&
    (data?.oldTestament.length ?? 0) === 0 &&
    (data?.newTestament.length ?? 0) === 0;

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-black" edges={['top']}>
      <View className="px-5 pb-3 pt-2">
        <Text className="text-2xl font-bold text-zinc-900 dark:text-white">Bíblia Sagrada</Text>
        <Text className="text-sm text-zinc-500">A Palavra de Deus em áudio</Text>
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
      ) : isEmpty ? (
        <View className="flex-1 items-center justify-center px-8">
          <Text className="text-5xl">📖</Text>
          <Text className="pt-4 text-center text-base font-medium text-zinc-700 dark:text-zinc-200">
            Em breve disponível
          </Text>
          <Text className="pt-1 text-center text-sm text-zinc-500">
            Estamos preparando os livros da Bíblia Sagrada para você ouvir.
          </Text>
        </View>
      ) : (
        <>
          {/* Segmentado Antigo / Novo Testamento */}
          <View className="mx-5 mb-2 flex-row rounded-xl bg-zinc-100 p-1 dark:bg-zinc-900">
            {(
              [
                ['old', 'Antigo Testamento'],
                ['new', 'Novo Testamento'],
              ] as const
            ).map(([value, label]) => {
              const active = testament === value;
              return (
                <Pressable
                  key={value}
                  onPress={() => setTestament(value)}
                  accessibilityRole="tab"
                  accessibilityState={{ selected: active }}
                  accessibilityLabel={label}
                  className={`flex-1 items-center rounded-lg py-2 ${
                    active ? 'bg-white dark:bg-zinc-700' : ''
                  }`}>
                  <Text
                    className={
                      active
                        ? 'text-sm font-semibold text-zinc-900 dark:text-white'
                        : 'text-sm text-zinc-500'
                    }>
                    {label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <ScrollView contentContainerStyle={{ padding: 20, gap: 24 }}>
            {sections && sections.length > 0 ? (
              sections.map((s) => <Section key={s.slug} section={s} />)
            ) : (
              <Text className="text-center text-zinc-500">
                Nenhum livro disponível neste testamento.
              </Text>
            )}
          </ScrollView>
        </>
      )}
    </SafeAreaView>
  );
}
