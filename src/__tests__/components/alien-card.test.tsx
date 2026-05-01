import { render, screen } from '@testing-library/react-native';
import { ThemeProvider } from '@/context/theme-context';
import { AlienCard } from '@/components/alien-card';
import { AlienSpecies } from '@/types';
import React from 'react';

const mockAlien: AlienSpecies = {
  id: '1',
  slug: 'grey',
  name: 'Greys',
  category: 'hostile',
  origin: 'Zeta Reticuli',
  description: 'Small gray humanoids with large eyes',
  traits: ['telepathic', 'advanced technology', 'abduction capable'],
  threatLevel: 'high',
  firstSighted: '1950-01-01',
  sightingCount: 5,
};

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider>{component}</ThemeProvider>);
};

describe('AlienCard', () => {
  it('renders alien name', () => {
    renderWithTheme(<AlienCard species={mockAlien} searchQuery="" />);
    expect(screen.getByText('Greys')).toBeTruthy();
  });

  it('renders origin information', () => {
    renderWithTheme(<AlienCard species={mockAlien} searchQuery="" />);
    expect(screen.getByText(/Origin: Zeta Reticuli/)).toBeTruthy();
  });

  it('renders category badge', () => {
    renderWithTheme(<AlienCard species={mockAlien} searchQuery="" />);
    expect(screen.getByText(/hostile/i)).toBeTruthy();
  });

  it('renders description', () => {
    renderWithTheme(<AlienCard species={mockAlien} searchQuery="" />);
    expect(screen.getByText(/Small gray humanoids/)).toBeTruthy();
  });

  it('renders trait count', () => {
    renderWithTheme(<AlienCard species={mockAlien} searchQuery="" />);
    expect(screen.getByText(/known traits/)).toBeTruthy();
  });

  it('handles friendly category', () => {
    const friendlyAlien: AlienSpecies = { ...mockAlien, category: 'friendly' };
    renderWithTheme(<AlienCard species={friendlyAlien} searchQuery="" />);
    expect(screen.getByText(/friendly/i)).toBeTruthy();
  });

  it('handles unknown category', () => {
    const unknownAlien: AlienSpecies = { ...mockAlien, category: 'unknown' };
    renderWithTheme(<AlienCard species={unknownAlien} searchQuery="" />);
    expect(screen.getByText(/unknown/i)).toBeTruthy();
  });
});
