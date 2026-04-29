import * as SQLite from 'expo-sqlite';
import { Sighting, ThreatLevel } from '@/types';
import { runMigrations } from './migrations';

let db: SQLite.SQLiteDatabase | null = null;

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (!db) {
    db = await SQLite.openDatabaseAsync('et-tracker.db');
    await db.execAsync('PRAGMA journal_mode = WAL;');
    await runMigrations(db);
  }
  return db;
}

export async function insertSighting(
  sighting: Omit<Sighting, 'id'>
): Promise<Sighting> {
  const database = await getDatabase();
  const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  await database.runAsync(
    `INSERT INTO sightings (id, title, description, latitude, longitude, photo_uri, threat_level, species, reported_at, user_id, reporter_name)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      sighting.title,
      sighting.description,
      sighting.latitude,
      sighting.longitude,
      sighting.photoUri ?? null,
      sighting.threatLevel,
      sighting.species ?? null,
      sighting.reportedAt,
      sighting.userId ?? null,
      sighting.reporterName ?? null,
    ]
  );

  return { id, ...sighting };
}

export async function getSightings(filter?: {
  threatLevel?: ThreatLevel;
}): Promise<Sighting[]> {
  const database = await getDatabase();

  const query = filter?.threatLevel
    ? 'SELECT * FROM sightings WHERE threat_level = ? ORDER BY reported_at DESC'
    : 'SELECT * FROM sightings ORDER BY reported_at DESC';

  const params = filter?.threatLevel ? [filter.threatLevel] : [];
  const rows = await database.getAllAsync<Record<string, unknown>>(query, params);

  return rows.map(rowToSighting);
}

export async function getSightingById(id: string): Promise<Sighting | null> {
  const database = await getDatabase();
  const row = await database.getFirstAsync<Record<string, unknown>>(
    'SELECT * FROM sightings WHERE id = ?',
    [id]
  );
  return row ? rowToSighting(row) : null;
}

export async function updateSighting(
  id: string,
  updates: Partial<Omit<Sighting, 'id'>>
): Promise<void> {
  const database = await getDatabase();
  await database.runAsync(
    `UPDATE sightings SET
       title = COALESCE(?, title),
       description = COALESCE(?, description),
       latitude = COALESCE(?, latitude),
       longitude = COALESCE(?, longitude),
       photo_uri = COALESCE(?, photo_uri),
       threat_level = COALESCE(?, threat_level),
       species = COALESCE(?, species),
       reporter_name = COALESCE(?, reporter_name)
     WHERE id = ?`,
    [
      updates.title ?? null,
      updates.description ?? null,
      updates.latitude ?? null,
      updates.longitude ?? null,
      updates.photoUri ?? null,
      updates.threatLevel ?? null,
      updates.species ?? null,
      updates.reporterName ?? null,
      id,
    ]
  );
}

export async function deleteSighting(id: string): Promise<void> {
  const database = await getDatabase();
  await database.runAsync('DELETE FROM sightings WHERE id = ?', [id]);
}

function rowToSighting(row: Record<string, unknown>): Sighting {
  return {
    id: String(row.id),
    title: String(row.title),
    description: String(row.description),
    latitude: Number(row.latitude),
    longitude: Number(row.longitude),
    photoUri: row.photo_uri ? String(row.photo_uri) : undefined,
    threatLevel: String(row.threat_level) as ThreatLevel,
    species: row.species ? String(row.species) : undefined,
    reportedAt: String(row.reported_at),
    userId: row.user_id ? String(row.user_id) : undefined,
    reporterName: row.reporter_name ? String(row.reporter_name) : undefined,
  };
}
