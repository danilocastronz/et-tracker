/**
 * Sanitize user input by removing HTML tags and limiting length
 */
export function sanitizeText(text: string, maxLength: number = 500): string {
  return text
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/[<>]/g, '') // Remove any remaining angle brackets
    .trim()
    .slice(0, maxLength);
}

/**
 * Validate and sanitize coordinates to ensure they're within Earth bounds
 */
export function validateCoordinates(lat: number, lng: number): boolean {
  return (
    typeof lat === 'number' &&
    typeof lng === 'number' &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180 &&
    !isNaN(lat) &&
    !isNaN(lng)
  );
}
