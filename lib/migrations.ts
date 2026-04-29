import * as SQLite from 'expo-sqlite';

const MIGRATIONS = [
  // v1 — initial schema
  `CREATE TABLE IF NOT EXISTS sightings (
    id TEXT PRIMARY KEY NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    latitude REAL NOT NULL,
    longitude REAL NOT NULL,
    photo_uri TEXT,
    threat_level TEXT NOT NULL DEFAULT 'low',
    species TEXT,
    reported_at TEXT NOT NULL,
    user_id TEXT,
    reporter_name TEXT
  );`,
  // v2 — future migrations go here
];

export async function runMigrations(db: SQLite.SQLiteDatabase): Promise<void> {
  const result = await db.getFirstAsync<{ user_version: number }>(
    'PRAGMA user_version'
  );
  const currentVersion = result?.user_version ?? 0;

  for (let i = currentVersion; i < MIGRATIONS.length; i++) {
    await db.execAsync(MIGRATIONS[i]);
    await db.execAsync(`PRAGMA user_version = ${i + 1}`);
  }
}
