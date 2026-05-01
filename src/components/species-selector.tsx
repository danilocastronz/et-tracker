import { Pressable, ScrollView, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { useAppTheme } from '@/context/theme-context';
import { SAMPLE_ALIENS } from '@/data/aliens';

const SPECIES_OPTIONS = [
  { slug: '', label: 'Unknown' },
  ...SAMPLE_ALIENS.map((a) => ({ slug: a.slug, label: a.name })),
];

interface SpeciesSelectorProps {
  value: string;
  onChange: (species: string) => void;
}

export function SpeciesSelector({ value, onChange }: SpeciesSelectorProps) {
  const { colors } = useAppTheme();

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
                backgroundColor: isSelected ? `${colors.primary}22` : colors.card,
                borderWidth: 1,
                borderColor: isSelected ? colors.primary : colors.border,
              }}
            >
              <ThemedText
                size="sm"
                style={{ color: isSelected ? colors.primary : colors.textSecondary }}
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
