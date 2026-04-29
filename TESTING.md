# Testing Guide

This project uses [Jest](https://jestjs.io/) and [React Native Testing Library](https://callstack.github.io/react-native-testing-library/) for unit and component testing.

## Running Tests

```bash
# Run all tests once
npm test

# Run tests in watch mode (re-runs on file changes)
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## Test Structure

Tests are located in the `__tests__` directory, mirroring the source code structure:

```
__tests__/
├── components/     # Component unit tests
├── context/        # Context and hooks tests
├── hooks/          # Custom hook tests
└── lib/            # Utility function tests
```

## Writing Tests

### Testing Components

```typescript
import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { ThemedText } from '@/components/ThemedText';

describe('ThemedText', () => {
  it('renders text content', () => {
    render(<ThemedText>Hello</ThemedText>);
    expect(screen.getByText('Hello')).toBeTruthy();
  });
});
```

### Testing Hooks with Context

```typescript
import { renderHook } from '@testing-library/react-native';
import { useAppTheme } from '@/context/ThemeContext';
import { ThemeProvider } from '@/context/ThemeContext';

const wrapper = ({ children }) =>
  <ThemeProvider>{children}</ThemeProvider>;

describe('useAppTheme', () => {
  it('returns theme context', () => {
    const { result } = renderHook(() => useAppTheme(), { wrapper });
    expect(result.current.colors).toBeDefined();
  });
});
```

### Testing User Interactions

```typescript
import { render, screen, fireEvent } from '@testing-library/react-native';

describe('Button Press', () => {
  it('calls handler on press', () => {
    const handler = jest.fn();
    render(
      <Pressable onPress={handler}>
        <Text>Press Me</Text>
      </Pressable>
    );
    
    fireEvent.press(screen.getByText('Press Me'));
    expect(handler).toHaveBeenCalled();
  });
});
```

## Best Practices

1. **Test behavior, not implementation** — Test what the component does, not how it does it
2. **Use semantic queries** — Prefer `getByText`, `getByTestId` over `getByType`
3. **Mock external dependencies** — Mock API calls, navigation, and heavy modules
4. **Keep tests focused** — One assertion per test is ideal
5. **Use descriptive test names** — Test names should describe the expected behavior

## Mocking

Common mocks are configured in `jest.setup.js`:

- `react-native-maps` — Map rendering
- `expo-router` — Navigation
- `expo-splash-screen` — Splash screen
- `@react-native-async-storage/async-storage` — AsyncStorage

Add additional mocks in test files as needed:

```typescript
jest.mock('@/lib/api', () => ({
  fetchSightings: jest.fn(() => Promise.resolve([])),
}));
```

## Coverage

Check test coverage with:

```bash
npm run test:coverage
```

Coverage reports are generated in the `coverage/` directory. Aim for:

- **Statements**: 80%+
- **Branches**: 75%+
- **Functions**: 80%+
- **Lines**: 80%+

## Resources

- [React Native Testing Library Docs](https://callstack.github.io/react-native-testing-library/)
- [Jest Docs](https://jestjs.io/)
- [Testing Library Best Practices](https://testing-library.com/docs/queries/about)
