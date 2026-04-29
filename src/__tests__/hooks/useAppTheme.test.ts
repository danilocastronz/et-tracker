import { renderHook, act } from '@testing-library/react-native';
import { ThemeProvider, useAppTheme } from '@/context/ThemeContext';
import React from 'react';

// Wrapper component to provide context
const wrapper = ({ children }: { children: React.ReactNode }) =>
  React.createElement(ThemeProvider, { children });

describe('useAppTheme hook', () => {
  it('returns theme context value', () => {
    const { result } = renderHook(() => useAppTheme(), { wrapper });

    expect(result.current).toBeDefined();
    expect(result.current.colors).toBeDefined();
    expect(result.current.isDark).toBeDefined();
    expect(result.current.setColorScheme).toBeDefined();
  });

  it('has valid color properties', () => {
    const { result } = renderHook(() => useAppTheme(), { wrapper });

    expect(result.current.colors.primary).toBeDefined();
    expect(result.current.colors.background).toBeDefined();
    expect(result.current.colors.textPrimary).toBeDefined();
  });

  it('isDark is a boolean', () => {
    const { result } = renderHook(() => useAppTheme(), { wrapper });

    expect(typeof result.current.isDark).toBe('boolean');
  });

  it('setColorScheme is a function', () => {
    const { result } = renderHook(() => useAppTheme(), { wrapper });

    expect(typeof result.current.setColorScheme).toBe('function');
  });
});
