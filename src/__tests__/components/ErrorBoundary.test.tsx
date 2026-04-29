import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { Text } from 'react-native';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { ThemeProvider } from '@/context/ThemeContext';

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider>
      {component}
    </ThemeProvider>
  );
};

// Mock component that throws an error
function ThrowError(): React.ReactElement {
  throw new Error('Test error message');
}

describe('ErrorBoundary', () => {
  beforeEach(() => {
    // Suppress console.error for this test
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders children when no error occurs', () => {
    renderWithTheme(
      <ErrorBoundary>
        <Text>Safe Content</Text>
      </ErrorBoundary>
    );
    expect(screen.getByText('Safe Content')).toBeTruthy();
  });

  it('renders error fallback when child component throws', () => {
    renderWithTheme(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );
    // Check for error message in the fallback UI
    expect(screen.getByText(/Something went wrong/i)).toBeTruthy();
  });

  it('displays error details', () => {
    renderWithTheme(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );
    expect(screen.getByText(/error/i)).toBeTruthy();
  });

  it('renders multiple children safely', () => {
    renderWithTheme(
      <ErrorBoundary>
        <Text>First</Text>
        <Text>Second</Text>
        <Text>Third</Text>
      </ErrorBoundary>
    );
    expect(screen.getByText('First')).toBeTruthy();
    expect(screen.getByText('Second')).toBeTruthy();
    expect(screen.getByText('Third')).toBeTruthy();
  });
});
