import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Dimensions,
  FlatList,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Send, Smile } from 'lucide-react-native';
import { colors } from '@/theme/colors';
import { MediaItem } from './MediaSelectionScreen';

interface MediaPreviewScreenProps {
  visible: boolean;
  media: MediaItem[];
  onClose: () => void;
  onSend: (caption: string) => void;
}

const { width, height } = Dimensions.get('window');

export function MediaPreviewScreen({
  visible,
  media,
  onClose,
  onSend,
}: MediaPreviewScreenProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [caption, setCaption] = useState('');
  const flatListRef = useRef<FlatList>(null);

  // Reset caption when media changes or screen becomes visible
  useEffect(() => {
    if (visible && media.length > 0) {
      setCaption('');
      setCurrentIndex(0);
    }
  }, [visible, media.length]);

  function handleSend() {
    if (caption.trim() || media.length > 0) {
      onSend(caption);
      setCaption('');
    }
  }

  function handleScroll(event: any) {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / width);
    setCurrentIndex(index);
  }

  const renderMediaItem = ({ item }: { item: MediaItem }) => {
    return (
      <View
        style={{
          width,
          height: height * 0.7,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {item.type === 'image' ? (
          <Image
            source={{ uri: item.uri }}
            style={{
              width: '100%',
              height: '100%',
            }}
            contentFit="contain"
          />
        ) : (
          <View className="flex-1 items-center justify-center bg-black">
            <Text className="text-white">Video preview not implemented</Text>
          </View>
        )}
      </View>
    );
  };

  // Don't render if no media
  if (media.length === 0) {
    return null;
  }

  return (
    <Modal
      visible={visible && media.length > 0}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-grey-alpha-550">
        <SafeAreaView className="flex-1" edges={['top']}>
          {/* Cancel Bar - White bar below status bar */}
          <View className="bg-white px-6 py-4">
            <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
              <Text className="text-base font-medium text-grey-alpha-500">
                Cancel
              </Text>
            </TouchableOpacity>
          </View>

          {/* Media Preview Area */}
          <View className="flex-1">
            <FlatList
              ref={flatListRef}
              data={media}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.id}
              renderItem={renderMediaItem}
              onMomentumScrollEnd={handleScroll}
              getItemLayout={(data, index) => ({
                length: width,
                offset: width * index,
                index,
              })}
            />

            {/* Media Counter Badge */}
            {media.length > 1 && (
              <View
                className="absolute right-4 top-4 rounded-lg px-3 py-1.5"
                style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
              >
                <Text className="text-sm font-medium text-white">
                  {currentIndex + 1} of {media.length}
                </Text>
              </View>
            )}
          </View>

          {/* Caption Input Section */}
          <View className="border-t border-grey-plain-300 bg-white px-4 py-3">
            <View className="flex-row items-end gap-3">
              <TouchableOpacity className="p-1">
                <Smile color={colors['grey-plain']['550']} size={24} />
              </TouchableOpacity>

              <View className="flex-1 flex-row items-center rounded-full border border-grey-plain-300 bg-grey-plain-50 px-4 py-2">
                <TextInput
                  value={caption}
                  onChangeText={setCaption}
                  placeholder="Add caption"
                  placeholderTextColor={colors['grey-alpha']['400']}
                  className="flex-1 text-base text-grey-alpha-500"
                  style={{
                    fontSize: 16,
                    textAlignVertical: 'center',
                    paddingVertical: 0,
                    minHeight: 20,
                  }}
                  multiline
                  maxLength={500}
                />
              </View>

              <TouchableOpacity
                onPress={handleSend}
                className="items-center justify-center rounded-full"
                style={{
                  width: 48,
                  height: 48,
                  backgroundColor: colors.primary.purple,
                }}
                disabled={!caption.trim() && media.length === 0}
              >
                <Send color={colors['grey-plain']['50']} size={24} />
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
}
