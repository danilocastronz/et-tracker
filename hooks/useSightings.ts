import { useCallback, useState } from 'react';
import { Sighting, ThreatLevel } from '@/types';
import { SAMPLE_SIGHTINGS } from '@/data/sightings';

export function useSightings() {
  const [sightings, setSightings] = useState<Sighting[]>(SAMPLE_SIGHTINGS);

  const addSighting = useCallback((sighting: Omit<Sighting, 'id'>) => {
    const newSighting: Sighting = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      ...sighting,
    };
    setSightings((prev) => [newSighting, ...prev]);
    return newSighting;
  }, []);

  const removeSighting = useCallback((id: string) => {
    setSightings((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const filterByThreatLevel = useCallback(
    (threatLevel: ThreatLevel | 'all') => {
      if (threatLevel === 'all') return sightings;
      return sightings.filter((s) => s.threatLevel === threatLevel);
    },
    [sightings]
  );

  return { sightings, addSighting, removeSighting, filterByThreatLevel };
}
