import { createContext, useCallback, useContext, useEffect } from 'react';
import { Sighting, ThreatLevel } from '@/types';
import { useSightingsDB } from '@/hooks/useSightingsDB';
import { getSightings, insertSighting } from '@/lib/database';
import { SAMPLE_SIGHTINGS } from '@/data/sightings';

interface SightingsContextValue {
  sightings: Sighting[];
  loading: boolean;
  addSighting: (sighting: Omit<Sighting, 'id'>) => Sighting;
  removeSighting: (id: string) => void;
  filterByThreatLevel: (level: ThreatLevel | 'all') => Sighting[];
}

const SightingsContext = createContext<SightingsContextValue | null>(null);

export function SightingsProvider({ children }: { children: React.ReactNode }) {
  const db = useSightingsDB();

  // Seed sample data on first launch if the DB is empty
  useEffect(() => {
    if (db.loading) return;
    if (db.sightings.length > 0) return;
    (async () => {
      const existing = await getSightings();
      if (existing.length > 0) return;
      for (const s of SAMPLE_SIGHTINGS) {
        const { id, ...rest } = s;
        await insertSighting(rest);
      }
      db.loadSightings();
    })();
  }, [db.loading]);

  // Wrap async ops as sync-looking for backwards-compatible callers
  const addSighting = useCallback(
    (sighting: Omit<Sighting, 'id'>): Sighting => {
      const optimisticId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      const optimistic: Sighting = { id: optimisticId, ...sighting };
      db.addSighting(sighting);
      return optimistic;
    },
    [db.addSighting]
  );

  const removeSighting = useCallback(
    (id: string) => { db.removeSighting(id); },
    [db.removeSighting]
  );

  const filterByThreatLevel = useCallback(
    (level: ThreatLevel | 'all') => db.filterByThreatLevel(level),
    [db.filterByThreatLevel]
  );

  return (
    <SightingsContext.Provider
      value={{
        sightings: db.sightings,
        loading: db.loading,
        addSighting,
        removeSighting,
        filterByThreatLevel,
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
