import { createContext, useCallback, useContext, useState } from 'react';
import { Sighting, ThreatLevel } from '@/types';
import { SAMPLE_SIGHTINGS } from '@/data/sightings';

interface SightingsContextValue {
  sightings: Sighting[];
  addSighting: (sighting: Omit<Sighting, 'id'>) => Sighting;
  removeSighting: (id: string) => void;
  filterByThreatLevel: (level: ThreatLevel | 'all') => Sighting[];
}

const SightingsContext = createContext<SightingsContextValue | null>(null);

export function SightingsProvider({ children }: { children: React.ReactNode }) {
  const [sightings, setSightings] = useState<Sighting[]>(SAMPLE_SIGHTINGS);

  const addSighting = useCallback((sighting: Omit<Sighting, 'id'>): Sighting => {
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
    (level: ThreatLevel | 'all'): Sighting[] => {
      if (level === 'all') return sightings;
      return sightings.filter((s) => s.threatLevel === level);
    },
    [sightings]
  );

  return (
    <SightingsContext.Provider
      value={{ sightings, addSighting, removeSighting, filterByThreatLevel }}
    >
      {children}
    </SightingsContext.Provider>
  );
}

export function useSightingsContext(): SightingsContextValue {
  const ctx = useContext(SightingsContext);
  if (!ctx) throw new Error('useSightingsContext must be used inside SightingsProvider');
  return ctx;
}
