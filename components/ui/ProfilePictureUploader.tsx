import { useState } from 'react';
import { View, Text, Pressable, Alert, Platform } from 'react-native';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
import { Camera, Info, AlertTriangle } from 'lucide-react-native';
import { colors } from '@/theme/colors';

interface ProfilePictureUploaderProps {
  initialName?: string;
  onImageSelected?: (uri: string) => void;
  className?: string;
}

export function ProfilePictureUploader({
  initialName = '',
  onImageSelected,
  className = '',
}: ProfilePictureUploaderProps) {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Get initials from name
  const getInitials = (name: string): string => {
    if (!name.trim()) return 'TD'; // Default initials
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const initials = getInitials(initialName);

  async function requestPermissions() {
    if (Platform.OS !== 'web') {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Sorry, we need camera roll permissions to upload your profile picture!'
        );
        return false;
      }
    }
    return true;
  }

  async function handleImagePicker() {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];

        // Check file size (1MB = 1048576 bytes)
        if (asset.fileSize && asset.fileSize > 1048576) {
          setError('Image size should be 1mb or less.');
          return;
        }

        setImageUri(asset.uri);
        setError(null);
        onImageSelected?.(asset.uri);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  }

  return (
    <View className={className}>
      {/* Profile Picture */}
      <View className="mb-4 items-start">
        <Pressable
          onPress={handleImagePicker}
          className="relative"
          accessibilityLabel="Select profile picture"
          accessibilityRole="button"
        >
          <View
            className="size-32 items-center justify-center rounded-full"
            style={{
              backgroundColor: imageUri
                ? 'transparent'
                : colors['primary-tints'].purple['100'],
              borderWidth: error ? 2 : 0,
              borderColor: error ? colors.state.red : 'transparent',
            }}
          >
            {imageUri ? (
              <Image
                source={{ uri: imageUri }}
                style={{
                  width: 128,
                  height: 128,
                  borderRadius: 64,
                }}
                contentFit="cover"
              />
            ) : (
              <Text
                style={{
                  fontSize: 48,
                  fontWeight: 'bold',
                  color: colors.primary.purple,
                }}
              >
                {initials}
              </Text>
            )}
          </View>

          {/* Edit Button */}
          <View
            className="absolute bottom-0 right-0 h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-white"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
            }}
          >
            <Camera
              size={16}
              color={colors['grey-alpha']['500']}
              strokeWidth={2.5}
            />
          </View>
        </Pressable>
      </View>

      {/* Error Message */}
      {error && (
        <View className="mt-4 flex-row items-start gap-2 rounded-lg bg-red-50 p-3">
          <Info size={16} color={colors.state.red} strokeWidth={2} />
          <Text
            className="flex-1 text-sm"
            style={{
              color: colors.state.red,
            }}
          >
            {error}
          </Text>
        </View>
      )}

      {/* Tip Message */}
      <View className="mt-4 flex-row items-center gap-2 rounded-lg bg-grey-plain-150 p-3">
        <AlertTriangle
          size={16}
          color={colors['grey-alpha']['500']}
          strokeWidth={2}
        />
        <Text className="flex-1 text-sm text-grey-alpha-500">
          Users who use their face as their profile picture get more clicks and
          engagements.
        </Text>
      </View>

      {/* Choose Another Link */}
      {imageUri && (
        <Pressable onPress={handleImagePicker} className="mt-4 self-start">
          <Text className="text-sm font-medium text-primary">
            Choose another profile picture
          </Text>
        </Pressable>
      )}
    </View>
  );
}
