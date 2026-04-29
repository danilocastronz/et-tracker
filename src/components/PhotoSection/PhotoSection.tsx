import { ActionSheetIOS, Alert, Platform, Pressable } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { persistImage } from '@/utils/persistImage';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';

interface PhotoSectionProps {
  photoUri: string | null;
  onPhotoSelected: (uri: string) => void;
}

async function pickFromCamera(): Promise<string | null> {
  const { status } = await ImagePicker.requestCameraPermissionsAsync();
  if (status !== 'granted') return null;

  const result = await ImagePicker.launchCameraAsync({
    mediaTypes: ['images'],
    quality: 0.8,
    allowsEditing: true,
    aspect: [4, 3],
  });
  if (result.canceled) return null;
  return persistImage(result.assets[0].uri);
}

async function pickFromLibrary(): Promise<string | null> {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted') return null;

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    quality: 0.8,
    allowsEditing: true,
    aspect: [4, 3],
  });
  if (result.canceled) return null;
  return persistImage(result.assets[0].uri);
}

export function PhotoSection({ photoUri, onPhotoSelected }: PhotoSectionProps) {
  function showPicker() {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancel', 'Take Photo', 'Choose from Library'],
          cancelButtonIndex: 0,
        },
        async (buttonIndex) => {
          if (buttonIndex === 1) {
            const uri = await pickFromCamera();
            if (uri) onPhotoSelected(uri);
          } else if (buttonIndex === 2) {
            const uri = await pickFromLibrary();
            if (uri) onPhotoSelected(uri);
          }
        }
      );
    } else {
      Alert.alert('Add Photo', 'Choose a source', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Camera',
          onPress: async () => {
            const uri = await pickFromCamera();
            if (uri) onPhotoSelected(uri);
          },
        },
        {
          text: 'Library',
          onPress: async () => {
            const uri = await pickFromLibrary();
            if (uri) onPhotoSelected(uri);
          },
        },
      ]);
    }
  }

  if (photoUri) {
    return (
      <Pressable onPress={showPicker}>
        <Image
          source={{ uri: photoUri }}
          style={{ width: '100%', height: 200, borderRadius: 12 }}
          contentFit="cover"
        />
        <ThemedText variant="accent" size="sm" className="mt-2 text-center">
          Tap to change photo
        </ThemedText>
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={showPicker}
      className="border border-dashed border-[#2A2A4A] rounded-xl items-center justify-center py-10"
    >
      <ThemedText size="3xl" className="mb-2">
        📷
      </ThemedText>
      <ThemedText variant="secondary" size="sm">
        Add Photo Evidence
      </ThemedText>
      <ThemedText variant="muted" size="xs" className="mt-1">
        Optional but encouraged
      </ThemedText>
    </Pressable>
  );
}
