// Sightings context manages the global state of all UFO sightings
// Seeds the app with sample data on first launch for demo/testing purposes
import { createContext, useCallback, useContext, useEffect } from 'react';
import { clearSightings, resetSightings } from '@/lib/storage';
import { useSightingsDB } from '@/hooks/useSightingsDB';
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
  const db = useSightingsDB();

  // Seed sample data on first launch if storage is empty
  useEffect(() => {
    if (db.loading || db.sightings.length > 0) return;
    (async () => {
      await resetSightings(SAMPLE_SIGHTINGS);
      await db.loadSightings();
    })();
  }, [db.loading, db.loadSightings]);

  const addSighting = useCallback(
    (sighting: Omit<Sighting, 'id'>): Promise<Sighting> => db.addSighting(sighting),
    [db.addSighting]
  );

  const resetToMockData = useCallback(async () => {
    await resetSightings(SAMPLE_SIGHTINGS);
    await db.loadSightings();
  }, [db.loadSightings]);

  const clearAllSightings = useCallback(async () => {
    await clearSightings();
    await db.loadSightings();
  }, [db.loadSightings]);

  return (
    <SightingsContext.Provider
      value={{
        sightings: db.sightings,
        loading: db.loading,
        addSighting,
        removeSighting: db.removeSighting,
        filterByThreatLevel: db.filterByThreatLevel,
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
