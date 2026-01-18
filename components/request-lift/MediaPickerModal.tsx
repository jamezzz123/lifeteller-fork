import { useState, forwardRef } from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from 'react-native';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import { Camera, Folder, X } from 'lucide-react-native';

import { colors } from '@/theme/colors';
import { Button } from '@/components/ui/Button';
import { BottomSheetComponent, BottomSheetRef } from '@/components/ui/BottomSheet';
import { MediaItem } from '@/context/request-lift';

const MAX_MEDIA = 10;
const { width } = Dimensions.get('window');
const IMAGE_SIZE = (width - 48) / 3; // 3 columns with padding

type MediaPickerBottomSheetProps = {
  currentMedia: MediaItem[];
  onDone: (media: MediaItem[]) => void;
};

export const MediaPickerBottomSheet = forwardRef<
  BottomSheetRef,
  MediaPickerBottomSheetProps
>(({ currentMedia, onDone }, ref) => {
  const [selectedMedia, setSelectedMedia] = useState<MediaItem[]>(currentMedia);

  async function requestPermissions() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return false;
    }
    return true;
  }

  async function handleTakePhoto() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const newMedia: MediaItem = {
        id: Date.now().toString(),
        uri: result.assets[0].uri,
        type: result.assets[0].type === 'video' ? 'video' : 'image',
        fileName: result.assets[0].fileName ?? undefined,
      };

      if (selectedMedia.length < MAX_MEDIA) {
        setSelectedMedia([...selectedMedia, newMedia]);
      } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      }
    }
  }

  async function handlePickFromGallery() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsMultipleSelection: true,
      quality: 0.8,
      selectionLimit: MAX_MEDIA - selectedMedia.length,
    });

    if (!result.canceled && result.assets.length > 0) {
      const newMedia: MediaItem[] = result.assets.map((asset, index) => ({
        id: `${Date.now()}-${index}`,
        uri: asset.uri,
        type: asset.type === 'video' ? 'video' : 'image',
        fileName: asset.fileName ?? undefined,
      }));

      const combined = [...selectedMedia, ...newMedia].slice(0, MAX_MEDIA);
      setSelectedMedia(combined);
    }
  }

  function handleRemoveMedia(id: string) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedMedia(selectedMedia.filter((item) => item.id !== id));
  }

  function handleProceed() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onDone(selectedMedia);
    if (typeof ref !== 'function' && ref?.current) {
      ref.current.close();
    }
  }

  return (
    <BottomSheetComponent ref={ref} snapPoints={['85%']}>
      <View className="px-4">
        {/* Header */}
        <View className="mb-4">
          <Text className="text-center text-base font-inter-semibold text-grey-alpha-500">
            Select Media
          </Text>
        </View>

        {/* Info Text */}
        <View className="mb-4">
          <Text className="text-sm text-grey-alpha-500">
            You can select up to <Text className="font-inter-semibold">10</Text>{' '}
            media (images and videos)
          </Text>
        </View>

        {/* Media Grid */}
        <BottomSheetScrollView
          contentContainerStyle={{ paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-row flex-wrap gap-1">
            {/* Camera Button */}
            <TouchableOpacity
              onPress={handleTakePhoto}
              className="items-center justify-center border border-grey-alpha-250 bg-grey-plain-100"
              style={{
                width: IMAGE_SIZE,
                height: IMAGE_SIZE,
                borderRadius: 8,
              }}
            >
              <Camera
                size={32}
                color={colors.primary.purple}
                strokeWidth={2}
              />
            </TouchableOpacity>

            {/* Gallery Button */}
            <TouchableOpacity
              onPress={handlePickFromGallery}
              className="items-center justify-center border border-grey-alpha-250 bg-grey-plain-100"
              style={{
                width: IMAGE_SIZE,
                height: IMAGE_SIZE,
                borderRadius: 8,
              }}
            >
              <Folder
                size={32}
                color={colors.primary.purple}
                strokeWidth={2}
              />
              <Text className="mt-2 text-xs text-grey-alpha-500">
                From Gallery
              </Text>
            </TouchableOpacity>

            {/* Selected Media */}
            {selectedMedia.map((item, index) => (
              <View
                key={item.id}
                className="relative"
                style={{
                  width: IMAGE_SIZE,
                  height: IMAGE_SIZE,
                }}
              >
                <Image
                  source={{ uri: item.uri }}
                  style={{
                    width: IMAGE_SIZE,
                    height: IMAGE_SIZE,
                    borderRadius: 8,
                  }}
                  contentFit="cover"
                />
                {/* Selection Badge */}
                <View
                  className="absolute right-2 top-2 size-6 items-center justify-center rounded-full"
                  style={{ backgroundColor: colors.primary.purple }}
                >
                  <Text className="text-xs font-inter-semibold text-white">
                    {index + 1}
                  </Text>
                </View>
                {/* Remove Button */}
                <TouchableOpacity
                  onPress={() => handleRemoveMedia(item.id)}
                  className="absolute left-2 top-2 size-6 items-center justify-center rounded-full bg-black/50"
                  hitSlop={8}
                >
                  <X size={14} color="#FFFFFF" strokeWidth={3} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </BottomSheetScrollView>

        {/* Bottom Bar */}
        <View className="absolute bottom-0 left-0 right-0 border-t border-grey-plain-450/40 bg-grey-plain-50 px-4 py-4">
          <View className="flex-row items-center justify-between">
            <Text className="text-base font-inter-semibold text-grey-alpha-500">
              {selectedMedia.length} media selected
            </Text>
            <Button
              title="Proceed"
              onPress={handleProceed}
              variant="primary"
              size="medium"
              disabled={selectedMedia.length === 0}
            />
          </View>
        </View>
      </View>
    </BottomSheetComponent>
  );
});

MediaPickerBottomSheet.displayName = 'MediaPickerBottomSheet';
