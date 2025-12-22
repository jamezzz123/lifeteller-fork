import { LiftHeader } from '@/components/lift/LiftHeader';
import { FilterTabs } from '@/components/ui/FilterTabs';
import { LiftCard } from '@/components/lift';
import { mockLifts } from '@/data/mockLifts';
import React, { useRef, useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronDown } from 'lucide-react-native';
import { colors } from '@/theme/colors';
import { FloatingActionButton } from '@/components/feed/FloatingActionButton';
import {
  LiftOptionsBottomSheet,
  LiftOptionsBottomSheetRef,
} from '@/components/feed/LiftOptionsBottomSheet';
import { router } from 'expo-router';

export default function LiftsScreen() {
  const customFilters = [
    { id: 'all', label: 'All', count: 10 },
    { id: 'pending', label: 'Pending', count: 3 },
    // { id: 'clips', label: 'Clips', count: 9 },
    { id: 'offered', label: 'Offered', count: 9 },
  ];
  const [activeFilter, setActiveFilter] = React.useState('all');
  const [likedItems, setLikedItems] = React.useState<Set<string>>(new Set());

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

  const liftOptionsSheetRef = useRef<LiftOptionsBottomSheetRef>(null);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const handleFABPress = () => {
    liftOptionsSheetRef.current?.open();
  };

  const handleLoadMore = () => {
    // TODO: Implement pagination/load more logic here
    setIsLoadingMore(true);
    setTimeout(() => {
      setIsLoadingMore(false);
      console.log('Load more lifts');
    }, 1000);
  };

  const renderFooter = () => (
    <TouchableOpacity
      onPress={handleLoadMore}
      disabled={isLoadingMore}
      className="items-center justify-center py-6"
      activeOpacity={0.7}
    >
      <Text className="text-[15px] font-medium text-grey-plain-550">
        {isLoadingMore ? 'Loading...' : 'Load more...'}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-grey-plain-50" edges={['top']}>
      <LiftHeader />
      <FlatList
        data={allLifts}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <>
            {/* Filter Tabs */}
            <FilterTabs
              filters={customFilters}
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
              showCounts={true}
              scrollable={true}
              contentContainerClassName="py-3"
            />

            {/* Sort Selector */}
            <View className="mb-4 px-1 py-2">
              <TouchableOpacity
                className="flex-row items-center gap-1"
                activeOpacity={0.7}
                onPress={() => {
                  // No functionality needed - UI only
                }}
              >
                <Text className="text-[15px] font-medium text-grey-plain-550">
                Most recent
                </Text>
                <ChevronDown size={20} color={colors['grey-plain']['550']} />
              </TouchableOpacity>
            </View>
          </>
        }
        ListFooterComponent={renderFooter}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 16,
          paddingBottom: 100,
        }}
        renderItem={({ item }) => (
          <LiftCard
            lift={item}
            isLiked={likedItems.has(item.id)}
            onLike={() => handleLike(item.id)}
            onOfferLift={() => router.push(`/lift-request/${item.id}` as any)}
            onDecline={() => console.log('Decline:', item.id)}
            onAccept={() => console.log('Accept:', item.id)}
            onComment={() => console.log('Comment:', item.id)}
            onShare={() => console.log('Share:', item.id)}
            onCardPress={() => router.push(`/lift-request/${item.id}` as any)}
          />
        )}
        showsVerticalScrollIndicator={false}
      />

      <FloatingActionButton
        onPress={handleFABPress}
        visible={!isBottomSheetOpen}
      />
      <LiftOptionsBottomSheet
        ref={liftOptionsSheetRef}
        onSheetChange={setIsBottomSheetOpen}
      />
    </SafeAreaView>
  );
}
