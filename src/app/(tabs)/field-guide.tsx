import { useMemo, useRef, useState } from 'react';
import { TextInput, View } from 'react-native';
import { cn } from '@/lib/utils';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlashList, type FlashListRef } from '@shopify/flash-list';
import { AlienCard } from '@/components/AlienCard';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useAppTheme } from '@/context/ThemeContext';
import { SAMPLE_ALIENS } from '@/data/aliens';
import { AlienCategory, AlienSpecies } from '@/types';

type CategoryFilter = AlienCategory | 'all';
const CATEGORY_FILTERS: CategoryFilter[] = ['all', 'friendly', 'hostile', 'unknown'];

export default function FieldGuideScreen() {
  const { colors } = useAppTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const listRef = useRef<FlashListRef<AlienSpecies>>(null);

  const filtered = useMemo(() => {
    return SAMPLE_ALIENS.filter((alien) => {
      const matchesCategory = categoryFilter === 'all' || alien.category === categoryFilter;
      const matchesSearch =
        !searchQuery ||
        alien.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        alien.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
        alien.traits.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, categoryFilter]);

  return (
    <ThemedView variant="background" className="flex-1">
      <SafeAreaView className="flex-1" edges={['top']}>
        <View className="px-4 pt-3 pb-2">
          <ThemedText weight="bold" size="xl" className="mb-3">Field Guide</ThemedText>

          {/* Search */}
          <View className="flex-row items-center bg-card dark:bg-card-dark border border-border dark:border-border-dark rounded-xl px-3 mb-3">
            <ThemedText className="mr-2">🔍</ThemedText>
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search species, origin, traits…"
              placeholderTextColor={colors.textMuted}
              className="flex-1 py-3"
              style={{ color: colors.textPrimary, fontSize: 15 }}
              returnKeyType="search"
              autoCorrect={false}
            />
          </View>

          {/* Category Filter */}
          <View className="flex-row gap-2">
            {CATEGORY_FILTERS.map((cat) => (
              <View
                key={cat}
                onTouchEnd={() => {
                  setCategoryFilter(cat);
                  listRef.current?.scrollToOffset({ offset: 0, animated: true });
                }}
                className={cn(
                  'px-3 py-1.5 rounded-full border',
                  categoryFilter === cat
                    ? 'bg-primary/10 dark:bg-primary-dark/10 border-primary dark:border-primary-dark'
                    : 'bg-card dark:bg-card-dark border-border dark:border-border-dark'
                )}
              >
                <ThemedText
                  size="sm"
                  weight={categoryFilter === cat ? 'semibold' : 'normal'}
                  variant={categoryFilter === cat ? 'accent' : 'muted'}
                >
                  {cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                </ThemedText>
              </View>
            ))}
          </View>
        </View>

        <FlashList
          ref={listRef}
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <AlienCard species={item} searchQuery={searchQuery} />
          )}
          contentContainerStyle={{ padding: 16, paddingTop: 8 }}
          ListEmptyComponent={
            <View className="items-center mt-12">
              <ThemedText size="4xl" className="mb-3">🔭</ThemedText>
              <ThemedText variant="secondary" className="text-center">
                No species matching your search.
              </ThemedText>
            </View>
          }
        />
      </SafeAreaView>
    </ThemedView>
  );
}
