import { useMemo, useRef, useState } from 'react';
import { TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlashList } from '@shopify/flash-list';
import { AlienCard } from '@/components/AlienCard';
import { AlienCardSkeleton } from '@/components/AlienCardSkeleton';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { SAMPLE_ALIENS } from '@/data/aliens';
import { AlienCategory, AlienSpecies } from '@/types';

type CategoryFilter = AlienCategory | 'all';
const CATEGORY_FILTERS: CategoryFilter[] = ['all', 'friendly', 'hostile', 'unknown'];

export default function FieldGuideScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [loading] = useState(false);
  const listRef = useRef<FlashList<AlienSpecies>>(null);

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
          <View className="flex-row items-center bg-[#1A1A35] rounded-xl px-3 mb-3 border border-[#2A2A4A]">
            <ThemedText className="mr-2">🔍</ThemedText>
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search species, origin, traits…"
              placeholderTextColor="#555577"
              className="flex-1 py-3"
              style={{ color: '#E8E8FF', fontSize: 15 }}
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
                className="px-3 py-1.5 rounded-full"
                style={{
                  backgroundColor: categoryFilter === cat ? '#00D4FF22' : '#1A1A35',
                  borderWidth: 1,
                  borderColor: categoryFilter === cat ? '#00D4FF' : '#2A2A4A',
                }}
              >
                <ThemedText
                  size="sm"
                  style={{ color: categoryFilter === cat ? '#00D4FF' : '#555577' }}
                  weight={categoryFilter === cat ? 'semibold' : 'normal'}
                >
                  {cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                </ThemedText>
              </View>
            ))}
          </View>
        </View>

        {loading ? (
          <View className="px-4">
            {[1, 2, 3].map((i) => <AlienCardSkeleton key={i} />)}
          </View>
        ) : (
          <FlashList
            ref={listRef}
            data={filtered}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <AlienCard species={item} searchQuery={searchQuery} />
            )}
            estimatedItemSize={160}
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
        )}
      </SafeAreaView>
    </ThemedView>
  );
}
