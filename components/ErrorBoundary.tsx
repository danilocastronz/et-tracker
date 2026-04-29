import React from 'react';
import { Pressable, View } from 'react-native';
import * as Sentry from '@sentry/react-native';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';

interface State {
  hasError: boolean;
  error?: Error;
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
    Sentry.captureException(error, { extra: { componentStack: info.componentStack } });
  }

  reset = () => this.setState({ hasError: false, error: undefined });

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <ThemedView variant="background" className="flex-1 items-center justify-center px-8">
          <ThemedText size="4xl" className="mb-4">⚠️</ThemedText>
          <ThemedText weight="bold" size="xl" className="text-center mb-2">
            Something went wrong
          </ThemedText>
          <ThemedText variant="secondary" size="sm" className="text-center mb-8">
            {this.state.error?.message ?? 'An unexpected error occurred.'}
          </ThemedText>
          <Pressable onPress={this.reset} className="bg-[#00D4FF] px-6 py-3 rounded-full">
            <ThemedText weight="semibold" style={{ color: '#0A0A1A' }}>
              Try Again
            </ThemedText>
          </Pressable>
        </ThemedView>
      );
    }

    return this.props.children;
  }
}
