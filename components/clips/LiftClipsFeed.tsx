import React, { useRef, useState, useCallback } from 'react';
import {
  FlatList,
  ViewToken,
  ViewabilityConfig,
  Dimensions,
} from 'react-native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { LiftClipItem, LiftClipData } from './LiftClipItem';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface LiftClipsFeedProps {
  clips: LiftClipData[];
  isTabFocused?: boolean;
  onLike?: (clipId: string) => void;
  onComment?: (clipId: string) => void;
  onShare?: (clipId: string) => void;
  onSave?: (clipId: string) => void;
  onJoinLift?: (clipId: string) => void;
  onViewLiftDetails?: (clipId: string) => void;
  onOpenClipOptions?: (clipId: string) => void;
}

export function LiftClipsFeed({
  clips,
  isTabFocused = true,
  onLike,
  onComment,
  onShare,
  onSave,
  onJoinLift,
  onViewLiftDetails,
  onOpenClipOptions,
}: LiftClipsFeedProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const tabBarHeight = useBottomTabBarHeight();
  const clipHeight = SCREEN_HEIGHT - tabBarHeight;

  // Viewability configuration for auto-play
  const viewabilityConfig = useRef<ViewabilityConfig>({
    itemVisiblePercentThreshold: 50, // Item is considered visible when 50% is shown
    minimumViewTime: 300, // Wait 300ms before triggering
  }).current;

  // Handle viewable items change for auto-play
  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index !== null) {
        setActiveIndex(viewableItems[0].index);
      }
    }
  ).current;

  const renderItem = useCallback(
    ({ item, index }: { item: LiftClipData; index: number }) => (
      <LiftClipItem
        clip={item}
        isActive={index === activeIndex && isTabFocused}
        clipHeight={clipHeight}
        onLike={() => onLike?.(item.id)}
        onComment={() => onComment?.(item.id)}
        onShare={() => onShare?.(item.id)}
        onSave={() => onSave?.(item.id)}
        onJoinLift={() => onJoinLift?.(item.id)}
        onViewLiftDetails={() => onViewLiftDetails?.(item.id)}
        onOpenClipOptions={() => onOpenClipOptions?.(item.id)}
      />
    ),
    [
      activeIndex,
      isTabFocused,
      clipHeight,
      onLike,
      onComment,
      onShare,
      onSave,
      onJoinLift,
      onViewLiftDetails,
      onOpenClipOptions,
    ]
  );

  const getItemLayout = useCallback(
    (_: any, index: number) => {
      return {
        length: clipHeight,
        offset: clipHeight * index,
        index,
      };
    },
    [clipHeight]
  );

  return (
    <FlatList
      ref={flatListRef}
      data={clips}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      pagingEnabled
      showsVerticalScrollIndicator={false}
      snapToInterval={clipHeight}
      snapToAlignment="start"
      decelerationRate="fast"
      viewabilityConfig={viewabilityConfig}
      onViewableItemsChanged={onViewableItemsChanged}
      getItemLayout={getItemLayout}
      removeClippedSubviews
      maxToRenderPerBatch={2}
      windowSize={3}
      initialNumToRender={1}
    />
  );
}
