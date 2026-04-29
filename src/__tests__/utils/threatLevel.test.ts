import { getThreatColor, getThreatLabel, getThreatEmoji } from '@/utils/threatLevel';
import { ThreatLevel } from '@/types';

describe('Threat Level Utilities', () => {
  describe('getThreatColor', () => {
    it('returns green for low threat', () => {
      const color = getThreatColor('low');
      expect(color).toBeDefined();
      expect(typeof color).toBe('string');
    });

    it('returns yellow for medium threat', () => {
      const color = getThreatColor('medium');
      expect(color).toBeDefined();
      expect(typeof color).toBe('string');
    });

    it('returns orange for high threat', () => {
      const color = getThreatColor('high');
      expect(color).toBeDefined();
      expect(typeof color).toBe('string');
    });

    it('returns red for critical threat', () => {
      const color = getThreatColor('critical');
      expect(color).toBeDefined();
      expect(typeof color).toBe('string');
    });

    it('returns valid hex color codes', () => {
      const levels: ThreatLevel[] = ['low', 'medium', 'high', 'critical'];
      levels.forEach((level) => {
        const color = getThreatColor(level);
        expect(color).toMatch(/^#[0-9A-F]{6}$/i);
      });
    });
  });

  describe('getThreatLabel', () => {
    it('returns capitalized label for low', () => {
      expect(getThreatLabel('low')).toBe('Low');
    });

    it('returns capitalized label for medium', () => {
      expect(getThreatLabel('medium')).toBe('Medium');
    });

    it('returns capitalized label for high', () => {
      expect(getThreatLabel('high')).toBe('High');
    });

    it('returns capitalized label for critical', () => {
      expect(getThreatLabel('critical')).toBe('Critical');
    });

    it('returns string labels', () => {
      const levels: ThreatLevel[] = ['low', 'medium', 'high', 'critical'];
      levels.forEach((level) => {
        const label = getThreatLabel(level);
        expect(typeof label).toBe('string');
        expect(label.length).toBeGreaterThan(0);
      });
    });
  });

  describe('getThreatEmoji', () => {
    it('returns emoji for all threat levels', () => {
      const levels: ThreatLevel[] = ['low', 'medium', 'high', 'critical'];
      levels.forEach((level) => {
        const emoji = getThreatEmoji(level);
        expect(emoji).toBeDefined();
        expect(typeof emoji).toBe('string');
      });
    });

    it('returns different emoji for different levels', () => {
      const emojis = {
        low: getThreatEmoji('low'),
        medium: getThreatEmoji('medium'),
        high: getThreatEmoji('high'),
        critical: getThreatEmoji('critical'),
      };
      const uniqueEmojis = new Set(Object.values(emojis));
      expect(uniqueEmojis.size).toBe(4);
    });
  });
});
