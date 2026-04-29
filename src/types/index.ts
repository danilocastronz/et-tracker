export type ThreatLevel = 'low' | 'medium' | 'high' | 'critical';
export type AlienCategory = 'friendly' | 'hostile' | 'unknown';
export type ColorScheme = 'dark' | 'light' | 'system';

export interface Sighting {
  id: string;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  photoUri?: string;
  threatLevel: ThreatLevel;
  species?: string;
  reportedAt: string;
  userId?: string;
  reporterName?: string;
}

export interface AlienSpecies {
  id: string;
  name: string;
  slug: string;
  category: AlienCategory;
  description: string;
  origin: string;
  threatLevel: ThreatLevel;
  imageUri?: string | number;
  traits: string[];
  firstSighted: string;
  sightingCount: number;
}

export interface User {
  id: string;
  email: string;
  username: string;
  avatarUri?: string;
  sightingsCount: number;
  joinedAt: string;
}

export interface UserPreferences {
  colorScheme: ColorScheme;
  notificationsEnabled: boolean;
  dailyReminderTime: string;
  defaultThreatFilter: ThreatLevel | 'all';
  showCompactCards: boolean;
  mapFollowsLocation: boolean;
  displayName: string;
  avatarUri?: string;
}

export interface NotificationPayload {
  sightingId?: string;
  species?: string;
  screen?: string;
}
