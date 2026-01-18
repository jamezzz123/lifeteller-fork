import { useState } from 'react';
import { View, TouchableOpacity, Text, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { X, Search, Trash2, CircleCheck } from 'lucide-react-native';

import { colors } from '@/theme/colors';
import { LiftCard } from '@/components/lift';
import { mockLifts } from '@/data/mockLifts';

export default function LinkClipScreen() {
  const params = useLocalSearchParams();
  const selectedLiftId = params.selectedLiftId as string | undefined;

  const [likedItems, setLikedItems] = useState<Set<string>>(new Set());
  const PAGE_SIZE = 4;

  const handleLike = (id: string) => {
    setLikedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  // Use mock data (replace with your API data later)
  const allLifts = mockLifts;
  const [visibleLifts, setVisibleLifts] = useState(() =>
    allLifts.slice(0, PAGE_SIZE)
  );

  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const hasMoreLifts = visibleLifts.length < allLifts.length;

  const handleLoadMore = () => {
    if (isLoadingMore || !hasMoreLifts) {
      return;
    }

    setIsLoadingMore(true);
    setTimeout(() => {
      setVisibleLifts((currentLifts) => {
        const nextCount = Math.min(
          allLifts.length,
          currentLifts.length + PAGE_SIZE
        );
        return allLifts.slice(0, nextCount);
      });
      setIsLoadingMore(false);
    }, 800);
  };

  const handleUnlinkLift = () => {
    router.back();
    setTimeout(() => {
      router.setParams({ liftId: '', name: '' });
    }, 100);
  };

  const handleSelectLift = (liftId: string, liftTitle: string) => {
    router.back();
    setTimeout(() => {
      router.setParams({ liftId, name: liftTitle });
    }, 100);
  };

  const renderFooter = () => (
    <TouchableOpacity
      onPress={handleLoadMore}
      disabled={isLoadingMore || !hasMoreLifts}
      className="items-center justify-center py-6"
      activeOpacity={0.7}
    >
      <Text className="text-[15px] font-medium text-grey-plain-550">
        {isLoadingMore
          ? 'Loading...'
          : hasMoreLifts
            ? 'Load more...'
            : 'No more lifts'}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-grey-plain-50" edges={['top']}>
      {/* Header */}
      <View className="flex-row items-center justify-between border-b border-grey-plain-150 bg-white px-4 py-3">
        <View className="flex-row items-center gap-3">
          <TouchableOpacity onPress={() => router.back()}>
            <X color={colors['grey-plain']['550']} size={24} />
          </TouchableOpacity>
          <Text className="text-lg font-medium text-grey-plain-550">
            Select a lift to link
          </Text>
        </View>
        <TouchableOpacity>
          <Search color={colors['grey-plain']['550']} size={24} />
        </TouchableOpacity>
      </View>

      {/* Unlink Button - Only show when a lift is selected */}
      {selectedLiftId && (
        <TouchableOpacity
          onPress={handleUnlinkLift}
          className="flex-row items-center gap-2 bg-white px-4 py-3"
        >
          <Trash2 color={colors.state.red} size={20} />
          <Text className="text-base font-medium text-state-red">
            Unlink Lift from Clip
          </Text>
        </TouchableOpacity>
      )}

      {/* Lifts List */}
      <FlatList
        data={visibleLifts}
        keyExtractor={(item) => item.id}
        ListFooterComponent={renderFooter}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 16,
          paddingBottom: 100,
          gap: 16,
        }}
        renderItem={({ item }) => {
          const isSelected = selectedLiftId === item.id;
          return (
            <View className="relative">
              <LiftCard
                lift={item}
                highlighted={isSelected}
                isLiked={likedItems.has(item.id)}
                onLike={() => handleLike(item.id)}
                onOfferLift={() => handleSelectLift(item.id, item.title)}
                onDecline={() => console.log('Decline:', item.id)}
                onAccept={() => console.log('Accept:', item.id)}
                onComment={() => console.log('Comment:', item.id)}
                onShare={() => console.log('Share:', item.id)}
                onCardPress={() => handleSelectLift(item.id, item.title)}
              />
              {/* Green checkmark for selected lift */}
              {isSelected && (
                <View
                  className="absolute right-6 top-16 h-8 w-8 items-center justify-center rounded-full"
                  // style={{ backgroundColor: colors.state.green }}
                >
                  <CircleCheck
                    color="#fff"
                    size={25}
                    fill={colors.state.green}
                  />
                </View>
              )}
              {/* Purple border for selected lift */}
              {isSelected && (
                <View
                  className="pointer-events-none absolute inset-0 rounded-xl border-2"
                  style={{ borderColor: colors.primary.purple }}
                />
              )}
            </View>
          );
        }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}
