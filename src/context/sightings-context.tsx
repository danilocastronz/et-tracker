// Sightings context manages the global state of all UFO sightings
// Seeds the app with sample data on first launch for demo/testing purposes
import { createContext, useCallback, useContext, useEffect } from 'react';
import { clearSightings, resetSightings } from '@/lib/storage';
import { useSightingsDB } from '@/hooks/use-sightings-db';
import { SAMPLE_SIGHTINGS } from '@/data/sightings';
import { Sighting, ThreatLevel } from '@/types';

interface SightingsContextValue {
  sightings: Sighting[];
  loading: boolean;
  addSighting: (sighting: Omit<Sighting, 'id'>) => Promise<Sighting>;
  removeSighting: (id: string) => void;
  filterByThreatLevel: (level: ThreatLevel | 'all') => Sighting[];
  resetToMockData: () => Promise<void>;
  clearAllSightings: () => Promise<void>;
}

const SightingsContext = createContext<SightingsContextValue | null>(null);

export function SightingsProvider({ children }: { children: React.ReactNode }) {
  const {
    loading,
    sightings,
    loadSightings,
    addSighting: dbAddSighting,
    removeSighting,
    filterByThreatLevel,
  } = useSightingsDB();

  // Seed sample data on first launch if storage is empty
  useEffect(() => {
    if (loading || sightings.length > 0) return;
    (async () => {
      await resetSightings(SAMPLE_SIGHTINGS);
      await loadSightings();
    })();
  }, [loading, sightings, loadSightings]);

  const addSighting = useCallback(
    (sighting: Omit<Sighting, 'id'>): Promise<Sighting> => dbAddSighting(sighting),
    [dbAddSighting]
  );

  const resetToMockData = useCallback(async () => {
    await resetSightings(SAMPLE_SIGHTINGS);
    await loadSightings();
  }, [loadSightings]);

  const clearAllSightings = useCallback(async () => {
    await clearSightings();
    await loadSightings();
  }, [loadSightings]);

  return (
    <SightingsContext.Provider
      value={{
        sightings,
        loading,
        addSighting,
        removeSighting,
        filterByThreatLevel,
        resetToMockData,
        clearAllSightings,
      }}
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
