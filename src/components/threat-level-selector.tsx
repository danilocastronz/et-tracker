import { getThreatColor, getThreatEmoji, getThreatLabel } from '@/utils/threat-level';
import { ThemedText } from '@/components/themed-text';
import { useAppTheme } from '@/context/theme-context';
import { Pressable, View } from 'react-native';
import { ThreatLevel } from '@/types';

const THREAT_LEVELS: ThreatLevel[] = ['low', 'medium', 'high', 'critical'];

interface ThreatLevelSelectorProps {
  value: ThreatLevel;
  onChange: (level: ThreatLevel) => void;
}

export function ThreatLevelSelector({ value, onChange }: ThreatLevelSelectorProps) {
  const { colors } = useAppTheme();

  return (
    <View className="flex-row gap-2">
      {THREAT_LEVELS.map((level) => {
        const isSelected = value === level;
        const color = getThreatColor(level);

        return (
          <Pressable
            key={level}
            onPress={() => onChange(level)}
            className="items-center flex-1 py-2 rounded-lg"
            style={{
              backgroundColor: isSelected ? `${color}33` : colors.card,
              borderWidth: isSelected ? 1.5 : 1,
              borderColor: isSelected ? color : colors.border,
            }}
          >
            <ThemedText size="base">{getThreatEmoji(level)}</ThemedText>
            <ThemedText
              size="xs"
              weight={isSelected ? 'semibold' : 'normal'}
              style={{ color: isSelected ? color : colors.textSecondary, marginTop: 2 }}
            >
              {getThreatLabel(level)}
            </ThemedText>
          </Pressable>
        );
      })}
    </View>
  );
}
