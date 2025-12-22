import React, { useState, useRef } from 'react';
import {
  View,
  TouchableOpacity,
  Dimensions,
  FlatList,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { Image } from 'expo-image';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react-native';
import { colors } from '@/theme/colors';

interface MediaItem {
  id: string;
  type: 'image' | 'video';
  uri: string;
}

interface MediaCarouselProps {
  media: MediaItem[];
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const HORIZONTAL_PADDING = 16;
const PREVIEW_WIDTH = 20;
// Available width after padding: screen width minus left and right padding
const AVAILABLE_WIDTH = SCREEN_WIDTH - HORIZONTAL_PADDING * 2;
// Main image width: available width minus preview strip
const IMAGE_WIDTH = AVAILABLE_WIDTH - PREVIEW_WIDTH;
// Full item width: image + preview (consistent for all items)
const ITEM_WIDTH = AVAILABLE_WIDTH; // IMAGE_WIDTH + PREVIEW_WIDTH
const IMAGE_HEIGHT = SCREEN_WIDTH;

export function MediaCarousel({ media }: MediaCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const goToPrevious = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      flatListRef.current?.scrollToIndex({ index: newIndex, animated: true });
    } else {
      flatListRef.current?.scrollToIndex({
        index: media.length - 1,
        animated: true,
      });
    }
  };

  const goToNext = () => {
    if (currentIndex < media.length - 1) {
      const newIndex = currentIndex + 1;
      flatListRef.current?.scrollToIndex({ index: newIndex, animated: true });
    } else {
      flatListRef.current?.scrollToIndex({ index: 0, animated: true });
    }
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / ITEM_WIDTH);
    if (index !== currentIndex && index >= 0 && index < media.length) {
      setCurrentIndex(index);
    }
  };

  const renderItem = ({ item, index }: { item: MediaItem; index: number }) => {
    const isActive = index === currentIndex;
    const isLast = index === media.length - 1;
    const nextIndex = index < media.length - 1 ? index + 1 : 0;
    const showPreview = isActive && !isLast;

    // For inactive items, image fills full width. For active items, image + preview
    const imageWidth = showPreview ? IMAGE_WIDTH : ITEM_WIDTH;

    return (
      <View
        className="relative flex-row"
        style={{
          width: ITEM_WIDTH,
        }}
      >
        {/* Main Image/Video */}
        <View
          className="relative overflow-hidden"
          style={{
            width: imageWidth,
            height: IMAGE_HEIGHT,
          }}
        >
          <Image
            source={{ uri: item.uri }}
            style={{ width: '100%', height: '100%' }}
            contentFit="cover"
          />
          {item.type === 'video' && (
            <View className="absolute inset-0 items-center justify-center bg-black/20">
              <View className="h-16 w-16 items-center justify-center rounded-full border-2 border-white bg-white/20">
                <Play
                  color={colors['grey-plain']['50']}
                  size={24}
                  fill={colors['grey-plain']['50']}
                />
              </View>
            </View>
          )}
        </View>

        {/* Next Image Preview - Only show on active item */}
        {showPreview && (
          <View
            className="overflow-hidden"
            style={{
              width: PREVIEW_WIDTH,
              height: IMAGE_HEIGHT,
            }}
          >
            <Image
              source={{ uri: media[nextIndex].uri }}
              style={{ width: '100%', height: '100%' }}
              contentFit="cover"
            />
          </View>
        )}
      </View>
    );
  };

  if (media.length === 0) return null;

  return (
    <View className="relative">
      {/* Swipeable Carousel */}
      <FlatList
        ref={flatListRef}
        data={media}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled={false}
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        getItemLayout={(_, index) => ({
          length: ITEM_WIDTH,
          offset: index * ITEM_WIDTH,
          index,
        })}
        snapToInterval={ITEM_WIDTH}
        snapToAlignment="start"
        decelerationRate="fast"
        contentContainerStyle={{
          paddingRight: HORIZONTAL_PADDING,
        }}
      />

      {/* Navigation Arrows */}
      {media.length > 1 && (
        <>
          <TouchableOpacity
            onPress={goToPrevious}
            className="absolute left-7 top-1/2 z-10 h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm"
            style={{ marginTop: -20 }}
            activeOpacity={0.7}
          >
            <ChevronLeft color={colors['grey-alpha']['500']} size={20} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={goToNext}
            className="absolute right-7 top-1/2 z-10 h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm"
            style={{ marginTop: -20 }}
            activeOpacity={0.7}
          >
            <ChevronRight color={colors['grey-alpha']['500']} size={20} />
          </TouchableOpacity>
        </>
      )}

      {/* Pagination Dots - Below images */}
      {media.length > 1 && (
        <View className="mt-4 flex-row items-center justify-center gap-2">
          {media.map((_, index) => (
            <View
              key={index}
              className={`h-2 w-2 rounded-full ${
                index === currentIndex ? 'bg-primary' : 'bg-grey-plain-300'
              }`}
            />
          ))}
        </View>
      )}
    </View>
  );
}
