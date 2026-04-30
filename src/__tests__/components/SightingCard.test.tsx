import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { SightingCard } from '@/components/SightingCard';
import { ThemeProvider } from '@/context/ThemeContext';
import { Sighting } from '@/types';

const mockSighting: Sighting = {
  id: '1',
  title: 'Downtown Sighting',
  species: 'grey',
  latitude: 40.7128,
  longitude: -74.006,
  reportedAt: '2024-01-15T10:00:00Z',
  threatLevel: 'medium',
  description: 'Spotted near downtown',
  photoUri: undefined,
};

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider>
      {component}
    </ThemeProvider>
  );
};

describe('SightingCard', () => {
  it('renders sighting information', () => {
    renderWithTheme(<SightingCard sighting={mockSighting} />);
    expect(screen.getByText(/grey/i)).toBeTruthy();
  });

  it('displays threat level', () => {
    renderWithTheme(<SightingCard sighting={mockSighting} />);
    expect(screen.getByText(/medium/i)).toBeTruthy();
  });

  it('displays formatted date', () => {
    renderWithTheme(<SightingCard sighting={mockSighting} />);
    expect(screen.getByText(/2024/)).toBeTruthy();
  });

  it('handles low threat level', () => {
    const lowThreatSighting: Sighting = { ...mockSighting, threatLevel: 'low' };
    renderWithTheme(<SightingCard sighting={lowThreatSighting} />);
    expect(screen.getByText(/low/i)).toBeTruthy();
  });

  it('handles high threat level', () => {
    const highThreatSighting: Sighting = { ...mockSighting, threatLevel: 'high' };
    renderWithTheme(<SightingCard sighting={highThreatSighting} />);
    expect(screen.getByText(/high/i)).toBeTruthy();
  });

  it('handles critical threat level', () => {
    const criticalThreatSighting: Sighting = { ...mockSighting, threatLevel: 'critical' };
    renderWithTheme(<SightingCard sighting={criticalThreatSighting} />);
    expect(screen.getByText(/critical/i)).toBeTruthy();
  });
});
