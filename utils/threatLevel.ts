import { ThreatLevel } from '@/types';
import { COLORS } from '@/constants/theme';

export function getThreatColor(level: ThreatLevel): string {
  switch (level) {
    case 'low': return COLORS.threatLow;
    case 'medium': return COLORS.threatMedium;
    case 'high': return COLORS.threatHigh;
    case 'critical': return COLORS.threatCritical;
  }
}

export function getThreatLabel(level: ThreatLevel): string {
  switch (level) {
    case 'low': return 'Low';
    case 'medium': return 'Medium';
    case 'high': return 'High';
    case 'critical': return 'Critical';
  }
}

export function getThreatEmoji(level: ThreatLevel): string {
  switch (level) {
    case 'low': return '🟢';
    case 'medium': return '🟡';
    case 'high': return '🔴';
    case 'critical': return '☢️';
  }
}
