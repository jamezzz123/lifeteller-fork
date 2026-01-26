import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Dimensions,
  TextInput,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Search, Camera, Folder } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
import { colors } from '@/theme/colors';
import { Button } from '@/components/ui/Button';

export interface MediaItem {
  id: string;
  uri: string;
  type: 'image' | 'video';
  fileName?: string;
}

interface MediaSelectionScreenProps {
  visible: boolean;
  onClose: () => void;
  onProceed: (selectedMedia: MediaItem[]) => void;
  maxSelection?: number;
  initialSelected?: MediaItem[];
  autoProceedOnPick?: boolean;
}

const { width } = Dimensions.get('window');
const PADDING = 16;
const GAP = 4;
const IMAGE_SIZE = (width - PADDING * 2 - GAP * 2) / 3; // 3 columns with padding and gaps
const MAX_MEDIA = 10;

export function MediaSelectionScreen({
  visible,
  onClose,
  onProceed,
  maxSelection = MAX_MEDIA,
  initialSelected,
  autoProceedOnPick = false,
}: MediaSelectionScreenProps) {
  const [selectedMedia, setSelectedMedia] = useState<MediaItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [galleryMedia] = useState<MediaItem[]>([]);

  // Mock gallery media - in production, fetch from device
  useEffect(() => {
    // This would fetch actual media from device in production
    // For now, using empty array - will be populated when user picks from gallery
  }, []);

  useEffect(() => {
    if (!visible || !initialSelected) return;
    setSelectedMedia(initialSelected);
  }, [visible, initialSelected]);

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

      if (selectedMedia.length < maxSelection) {
        const combined = [...selectedMedia, newMedia].slice(0, maxSelection);
        setSelectedMedia(combined);
        if (autoProceedOnPick) onProceed(combined);
      } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        alert(`You can only select up to ${maxSelection} media`);
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
      selectionLimit: maxSelection - selectedMedia.length,
    });

    if (!result.canceled && result.assets.length > 0) {
      const newMedia: MediaItem[] = result.assets.map((asset, index) => ({
        id: `${Date.now()}-${index}`,
        uri: asset.uri,
        type: asset.type === 'video' ? 'video' : 'image',
        fileName: asset.fileName ?? undefined,
      }));

      const combined = [...selectedMedia, ...newMedia].slice(0, maxSelection);
      setSelectedMedia(combined);
      if (autoProceedOnPick && combined.length > 0) onProceed(combined);
    }
  }

  function handleToggleSelection(media: MediaItem) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const isSelected = selectedMedia.some((item) => item.id === media.id);

    if (isSelected) {
      setSelectedMedia(selectedMedia.filter((item) => item.id !== media.id));
    } else {
      if (selectedMedia.length < maxSelection) {
        setSelectedMedia([...selectedMedia, media]);
      } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        alert(`You can only select up to ${maxSelection} media`);
      }
    }
  }

  function handleProceed() {
    if (selectedMedia.length === 0) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onProceed(selectedMedia);
  }

  function getSelectionIndex(mediaId: string): number | null {
    const index = selectedMedia.findIndex((item) => item.id === mediaId);
    return index >= 0 ? index + 1 : null;
  }

  const filteredMedia = galleryMedia.filter((media) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return media.fileName?.toLowerCase().includes(query);
  });

  const renderMediaItem = ({ item }: { item: MediaItem }) => {
    const isSelected = selectedMedia.some(
      (selected) => selected.id === item.id
    );
    const selectionIndex = getSelectionIndex(item.id);

    return (
      <TouchableOpacity
        onPress={() => handleToggleSelection(item)}
        activeOpacity={0.8}
        style={{
          width: IMAGE_SIZE,
          height: IMAGE_SIZE,
        }}
      >
        <View className="relative flex-1">
          <Image
            source={{ uri: item.uri }}
            style={{
              width: '100%',
              height: '100%',
              borderRadius: 8,
            }}
            contentFit="cover"
          />
          {isSelected && selectionIndex && (
            <View
              className="absolute right-2 top-2 size-6 items-center justify-center rounded-full"
              style={{ backgroundColor: colors.primary.purple }}
            >
              <Text className="text-xs font-semibold text-white">
                {selectionIndex}
              </Text>
            </View>
          )}
          {item.type === 'video' && (
            <View className="absolute inset-0 items-center justify-center">
              <View
                className="size-10 items-center justify-center rounded-full"
                style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
              >
                <Text className="text-white">▶</Text>
              </View>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView className="flex-1 bg-white" edges={['top']}>
        {/* Search Bar */}
        <View className="border-b border-grey-plain-150 bg-white px-4 py-3 mt-8">
          <View className="flex-row items-center gap-3 rounded-full border border-grey-plain-300 bg-grey-plain-50 px-4 py-3">
            <Search
              size={20}
              color={colors['grey-alpha']['400']}
              strokeWidth={2}
            />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search for a photo or video"
              placeholderTextColor={colors['grey-alpha']['400']}
              className="flex-1 text-base text-grey-alpha-500"
              style={{ fontSize: 16 }}
            />
          </View>
        </View>

        {/* Selection Limit Info */}
        <View className="bg-white px-4 py-3">
          <Text className="text-sm text-grey-alpha-500">
            You can select up to{' '}
            <Text className="font-semibold">{maxSelection}</Text> media (images
            and videos)
          </Text>
        </View>

        {/* Media Grid */}
        <FlatList
          data={[
            { id: 'camera', type: 'camera' as const },
            { id: 'gallery', type: 'gallery' as const },
            ...filteredMedia,
          ]}
          numColumns={3}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: PADDING, paddingBottom: 100 }}
          columnWrapperStyle={{ gap: GAP, marginBottom: GAP }}
          renderItem={({ item, index }) => {
            if (item.type === 'camera') {
              return (
                <TouchableOpacity
                  onPress={handleTakePhoto}
                  className="items-center justify-center border border-grey-plain-300 bg-grey-plain-100"
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
              );
            }

            if (item.type === 'gallery') {
              return (
                <TouchableOpacity
                  onPress={handlePickFromGallery}
                  className="items-center justify-center border border-grey-plain-300 bg-grey-plain-100"
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
                </TouchableOpacity>
              );
            }

            return renderMediaItem({ item: item as MediaItem });
          }}
          ListEmptyComponent={
            <View className="items-center justify-center py-12">
              <Text className="text-sm text-grey-plain-550">
                No media found. Tap camera or gallery to add media.
              </Text>
            </View>
          }
        />

        {/* Bottom Bar */}
        {selectedMedia.length > 0 && (
          <View className="absolute bottom-0 left-0 right-0 border-t border-grey-plain-150 bg-white px-4 py-4">
            <View className="flex-row items-center justify-between">
              <Text className="text-base font-semibold text-grey-alpha-500">
                {selectedMedia.length} media selected
              </Text>
              <Button
                title="Continue"
                onPress={handleProceed}
                variant="primary"
                size="medium"
              />
            </View>
          </View>
        )}
      </SafeAreaView>
    </Modal>
  );
}
