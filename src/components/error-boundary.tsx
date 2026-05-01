import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { useAppTheme } from '@/context/theme-context';
import * as Sentry from '@sentry/react-native';
import { Pressable } from 'react-native';
import React from 'react';

interface State {
  hasError: boolean;
  error?: Error;
}

function ErrorDisplay({ error, onReset }: { error?: Error; onReset: () => void }) {
  const { colors } = useAppTheme();

  return (
    <ThemedView variant="background" className="items-center justify-center flex-1 px-8">
      <ThemedText size="4xl" className="mb-4">
        ⚠️
      </ThemedText>
      <ThemedText weight="bold" size="xl" className="mb-2 text-center">
        Something went wrong
      </ThemedText>
      <ThemedText variant="secondary" size="sm" className="mb-8 text-center">
        {error?.message ?? 'An unexpected error occurred.'}
      </ThemedText>
      <Pressable
        onPress={onReset}
        className="px-6 py-3 rounded-full"
        style={{ backgroundColor: colors.primary }}
      >
        <ThemedText weight="semibold" style={{ color: colors.background }}>
          Try Again
        </ThemedText>
      </Pressable>
    </ThemedView>
  );
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  State
> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Send error to Sentry with component stack
    Sentry.captureException(error, {
      contexts: {
        react: {
          componentStack: info.componentStack,
        },
      },
    });
  }

  reset = () => this.setState({ hasError: false, error: undefined });

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return <ErrorDisplay error={this.state.error} onReset={this.reset} />;
    }

    return this.props.children;
  }
}
