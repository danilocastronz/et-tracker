import React from 'react';
import { renderHook } from '@testing-library/react-native';
import { SightingsProvider, useSightingsContext } from '@/context/SightingsContext';

const wrapper = ({ children }: { children: React.ReactNode }) =>
  React.createElement(SightingsProvider, { children });

describe('SightingsContext', () => {
  it('provides sightings context', () => {
    const { result } = renderHook(() => useSightingsContext(), { wrapper });

    expect(result.current).toBeDefined();
    expect(result.current.sightings).toBeDefined();
    expect(Array.isArray(result.current.sightings)).toBe(true);
  });

  it('has required context methods', () => {
    const { result } = renderHook(() => useSightingsContext(), { wrapper });

    expect(typeof result.current.addSighting).toBe('function');
    expect(typeof result.current.removeSighting).toBe('function');
    expect(typeof result.current.filterByThreatLevel).toBe('function');
    expect(typeof result.current.resetToMockData).toBe('function');
    expect(typeof result.current.clearAllSightings).toBe('function');
  });

  it('addSighting returns a sighting with an id', () => {
    const { result } = renderHook(() => useSightingsContext(), { wrapper });

    const newSighting = result.current.addSighting({
      title: 'Test Sighting',
      description: 'A test UFO sighting',
      latitude: 37.5,
      longitude: -100,
      threatLevel: 'low',
      reportedAt: new Date().toISOString(),
    });

    expect(newSighting).toBeDefined();
    expect(newSighting.id).toBeDefined();
    expect(newSighting.title).toBe('Test Sighting');
  });

  it('filters sightings by threat level', () => {
    const { result } = renderHook(() => useSightingsContext(), { wrapper });

    const filtered = result.current.filterByThreatLevel('critical');

    expect(Array.isArray(filtered)).toBe(true);
  });
});
