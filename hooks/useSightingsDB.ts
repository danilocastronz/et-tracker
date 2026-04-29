import { useCallback, useEffect, useRef, useState } from 'react';
import {
  deleteSighting,
  getSightings,
  insertSighting,
  updateSighting,
} from '@/lib/database';
import { Sighting, ThreatLevel } from '@/types';

export function useSightingsDB() {
  const [sightings, setSightings] = useState<Sighting[]>([]);
  const [loading, setLoading] = useState(true);
  const mountedRef = useRef(true);

  const loadSightings = useCallback(
    async (filter?: { threatLevel?: ThreatLevel }) => {
      const data = await getSightings(filter);
      if (mountedRef.current) setSightings(data);
    },
    []
  );

  useEffect(() => {
    mountedRef.current = true;
    loadSightings().finally(() => {
      if (mountedRef.current) setLoading(false);
    });
    return () => {
      mountedRef.current = false;
    };
  }, [loadSightings]);

  const addSighting = useCallback(
    async (sighting: Omit<Sighting, 'id'>): Promise<Sighting> => {
      const created = await insertSighting(sighting);
      setSightings((prev) => [created, ...prev]);
      return created;
    },
    []
  );

  const removeSighting = useCallback(async (id: string): Promise<void> => {
    await deleteSighting(id);
    setSightings((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const editSighting = useCallback(
    async (id: string, updates: Partial<Omit<Sighting, 'id'>>): Promise<void> => {
      await updateSighting(id, updates);
      setSightings((prev) =>
        prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
      );
    },
    []
  );

  const filterByThreatLevel = useCallback(
    (threatLevel: ThreatLevel | 'all'): Sighting[] => {
      if (threatLevel === 'all') return sightings;
      return sightings.filter((s) => s.threatLevel === threatLevel);
    },
    [sightings]
  );

  return {
    sightings,
    loading,
    loadSightings,
    addSighting,
    removeSighting,
    editSighting,
    filterByThreatLevel,
  };
}
