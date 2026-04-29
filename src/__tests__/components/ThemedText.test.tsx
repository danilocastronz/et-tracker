import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemeProvider } from '@/context/ThemeContext';

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider>
      {component}
    </ThemeProvider>
  );
};

describe('ThemedText', () => {
  it('renders text content correctly', () => {
    renderWithTheme(<ThemedText>Hello World</ThemedText>);
    expect(screen.getByText('Hello World')).toBeTruthy();
  });

  it('applies weight prop', () => {
    renderWithTheme(<ThemedText weight="bold">Bold Text</ThemedText>);
    expect(screen.getByText('Bold Text')).toBeTruthy();
  });

  it('applies size prop', () => {
    renderWithTheme(<ThemedText size="lg">Large Text</ThemedText>);
    expect(screen.getByText('Large Text')).toBeTruthy();
  });

  it('renders with variant prop', () => {
    renderWithTheme(<ThemedText variant="secondary">Secondary Text</ThemedText>);
    expect(screen.getByText('Secondary Text')).toBeTruthy();
  });
});
