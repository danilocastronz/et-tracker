import * as FileSystem from 'expo-file-system';

export async function persistImage(tempUri: string): Promise<string> {
  const filename = `sighting-${Date.now()}.jpg`;
  const destination = `${FileSystem.documentDirectory}sightings/${filename}`;

  const dir = `${FileSystem.documentDirectory}sightings/`;
  const dirInfo = await FileSystem.getInfoAsync(dir);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
  }

  await FileSystem.copyAsync({ from: tempUri, to: destination });
  return destination;
}
