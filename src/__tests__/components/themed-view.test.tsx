import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { Text } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemeProvider } from '@/context/theme-context';

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider>
      {component}
    </ThemeProvider>
  );
};

describe('ThemedView', () => {
  it('renders content correctly', () => {
    renderWithTheme(
      <ThemedView>
        <Text>Test Content</Text>
      </ThemedView>
    );
    expect(screen.getByText('Test Content')).toBeTruthy();
  });

  it('applies background variant', () => {
    renderWithTheme(
      <ThemedView variant="background">
        <Text>Background Variant</Text>
      </ThemedView>
    );
    expect(screen.getByText('Background Variant')).toBeTruthy();
  });

  it('applies surface variant', () => {
    renderWithTheme(
      <ThemedView variant="surface">
        <Text>Surface Variant</Text>
      </ThemedView>
    );
    expect(screen.getByText('Surface Variant')).toBeTruthy();
  });

  it('applies card variant', () => {
    renderWithTheme(
      <ThemedView variant="card">
        <Text>Card Variant</Text>
      </ThemedView>
    );
    expect(screen.getByText('Card Variant')).toBeTruthy();
  });

  it('accepts className prop', () => {
    renderWithTheme(
      <ThemedView className="p-4">
        <Text>Styled View</Text>
      </ThemedView>
    );
    expect(screen.getByText('Styled View')).toBeTruthy();
  });
});
