// AsyncStorage persistence layer for sightings data
// Version key suffix (v1) allows for future schema migrations without losing old data
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Sighting } from '@/types';

export const SIGHTINGS_KEY = 'sightings_v1';

export async function getSightings(filter?: { threatLevel?: string }): Promise<Sighting[]> {
  try {
    const raw = await AsyncStorage.getItem(SIGHTINGS_KEY);
    const all: Sighting[] = raw ? JSON.parse(raw) : [];
    if (!filter?.threatLevel) return all;
    return all.filter((s) => s.threatLevel === filter.threatLevel);
  } catch {
    return [];
  }
}

export async function getSightingById(id: string): Promise<Sighting | null> {
  try {
    const all = await getSightings();
    return all.find((s) => s.id === id) ?? null;
  } catch {
    return null;
  }
}

export async function insertSighting(sighting: Omit<Sighting, 'id'>): Promise<Sighting> {
  const all = await getSightings();
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  const created: Sighting = { ...sighting, id };
  await AsyncStorage.setItem(SIGHTINGS_KEY, JSON.stringify([created, ...all]));
  return created;
}

export async function updateSighting(
  id: string,
  updates: Partial<Omit<Sighting, 'id'>>
): Promise<void> {
  const all = await getSightings();
  const updated = all.map((s) => (s.id === id ? { ...s, ...updates } : s));
  await AsyncStorage.setItem(SIGHTINGS_KEY, JSON.stringify(updated));
}

export async function deleteSighting(id: string): Promise<void> {
  const all = await getSightings();
  await AsyncStorage.setItem(SIGHTINGS_KEY, JSON.stringify(all.filter((s) => s.id !== id)));
}

export async function resetSightings(seed: Sighting[]): Promise<void> {
  await AsyncStorage.setItem(SIGHTINGS_KEY, JSON.stringify(seed));
}

export async function clearSightings(): Promise<void> {
  await AsyncStorage.removeItem(SIGHTINGS_KEY);
}
