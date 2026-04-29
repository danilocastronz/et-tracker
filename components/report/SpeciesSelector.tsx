import { Pressable, ScrollView, View } from 'react-native';
import { SAMPLE_ALIENS } from '@/data/aliens';
import { ThemedText } from '../ThemedText';

const SPECIES_OPTIONS = [
  { slug: '', label: 'Unknown' },
  ...SAMPLE_ALIENS.map((a) => ({ slug: a.slug, label: a.name })),
];

interface SpeciesSelectorProps {
  value: string;
  onChange: (species: string) => void;
}

export function SpeciesSelector({ value, onChange }: SpeciesSelectorProps) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View className="flex-row gap-2 pb-1">
        {SPECIES_OPTIONS.map((option) => {
          const isSelected = value === option.slug;
          return (
            <Pressable
              key={option.slug}
              onPress={() => onChange(option.slug)}
              className="px-3 py-2 rounded-full"
              style={{
                backgroundColor: isSelected ? '#00D4FF22' : '#1A1A35',
                borderWidth: 1,
                borderColor: isSelected ? '#00D4FF' : '#2A2A4A',
              }}
            >
              <ThemedText
                size="sm"
                style={{ color: isSelected ? '#00D4FF' : '#8888AA' }}
                weight={isSelected ? 'semibold' : 'normal'}
              >
                {option.label}
              </ThemedText>
            </Pressable>
          );
        })}
      </View>
    </ScrollView>
  );
}
