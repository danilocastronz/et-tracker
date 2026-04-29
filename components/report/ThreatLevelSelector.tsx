import { Pressable, View } from 'react-native';
import { ThreatLevel } from '@/types';
import { getThreatColor, getThreatEmoji, getThreatLabel } from '@/utils/threatLevel';
import { ThemedText } from '../ThemedText';

const THREAT_LEVELS: ThreatLevel[] = ['low', 'medium', 'high', 'critical'];

interface ThreatLevelSelectorProps {
  value: ThreatLevel;
  onChange: (level: ThreatLevel) => void;
}

export function ThreatLevelSelector({ value, onChange }: ThreatLevelSelectorProps) {
  return (
    <View className="flex-row gap-2">
      {THREAT_LEVELS.map((level) => {
        const isSelected = value === level;
        const color = getThreatColor(level);

        return (
          <Pressable
            key={level}
            onPress={() => onChange(level)}
            className="flex-1 items-center py-2 rounded-lg"
            style={{
              backgroundColor: isSelected ? `${color}33` : '#1A1A35',
              borderWidth: isSelected ? 1.5 : 1,
              borderColor: isSelected ? color : '#2A2A4A',
            }}
          >
            <ThemedText size="base">{getThreatEmoji(level)}</ThemedText>
            <ThemedText
              size="xs"
              weight={isSelected ? 'semibold' : 'normal'}
              style={{ color: isSelected ? color : '#8888AA', marginTop: 2 }}
            >
              {getThreatLabel(level)}
            </ThemedText>
          </Pressable>
        );
      })}
    </View>
  );
}
