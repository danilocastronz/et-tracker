import { capitalize } from '@/utils/capitalize';

describe('capitalize utility', () => {
  it('capitalizes lowercase string', () => {
    expect(capitalize('hello')).toBe('Hello');
  });

  it('handles already capitalized strings', () => {
    expect(capitalize('Hello')).toBe('Hello');
  });

  it('handles all uppercase strings', () => {
    expect(capitalize('HELLO')).toBe('HELLO');
  });

  it('handles empty string', () => {
    expect(capitalize('')).toBe('');
  });

  it('handles single character', () => {
    expect(capitalize('a')).toBe('A');
  });

  it('handles strings with spaces', () => {
    expect(capitalize('hello world')).toBe('Hello world');
  });

  it('handles strings with special characters', () => {
    expect(capitalize('123hello')).toBe('123hello');
  });

  it('handles numbers as first character', () => {
    expect(capitalize('9lives')).toBe('9lives');
  });

  it('handles hyphenated strings', () => {
    expect(capitalize('hello-world')).toBe('Hello-world');
  });

  it('preserves case of remaining characters', () => {
    expect(capitalize('hELLO')).toBe('HELLO');
  });
});
