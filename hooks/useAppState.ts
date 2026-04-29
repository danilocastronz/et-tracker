import { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';

export function useAppState(callbacks: {
  onForeground?: () => void;
  onBackground?: () => void;
}) {
  const appState = useRef<AppStateStatus>(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState) => {
      if (appState.current.match(/inactive|background/) && nextState === 'active') {
        callbacks.onForeground?.();
      } else if (nextState.match(/inactive|background/)) {
        callbacks.onBackground?.();
      }
      appState.current = nextState;
    });

    return () => subscription.remove();
  }, [callbacks]);
}
