import { Directory, File, Paths } from 'expo-file-system';

export function persistImage(tempUri: string): string {
  const filename = `sighting-${Date.now()}.jpg`;
  const dir = new Directory(Paths.document, 'sightings');

  if (!dir.exists) {
    dir.create();
  }

  const destination = new File(dir, filename);
  new File(tempUri).copy(destination);

  return destination.uri;
}
