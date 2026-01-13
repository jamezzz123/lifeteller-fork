import React, { useRef, useState } from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FeedHeader } from '@/components/feed/FeedHeader';
import { ShareSection } from '@/components/feed/ShareSection';
import { StoriesSection } from '@/components/feed/StoriesSection';
import { FeedFilters } from '@/components/feed/FeedFilters';
import { FeedList } from '@/components/feed/FeedList';
import { FloatingActionButton } from '@/components/feed/FloatingActionButton';
import {
  LiftOptionsBottomSheet,
  LiftOptionsBottomSheetRef,
} from '@/components/feed/LiftOptionsBottomSheet';

export default function HomeScreen() {
  const liftOptionsSheetRef = useRef<LiftOptionsBottomSheetRef>(null);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  const handleFABPress = () => {
    setIsBottomSheetOpen(true);
    // Use setTimeout to ensure the component is rendered before calling open
    setTimeout(() => {
      liftOptionsSheetRef.current?.open();
    }, 0);
  };

  return (
    <SafeAreaView className="flex-1 bg-grey-plain-50" edges={['top']}>
      {/* Fixed Header */}
      <FeedHeader />

      {/* Scrollable Content */}
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100, paddingTop: 8 }}
      >
        <ShareSection />
        <StoriesSection />
        <FeedFilters />
        <FeedList />
      </ScrollView>

      <FloatingActionButton
        onPress={handleFABPress}
        visible={!isBottomSheetOpen}
      />
      {isBottomSheetOpen && (
        <LiftOptionsBottomSheet
          ref={liftOptionsSheetRef}
          onSheetChange={setIsBottomSheetOpen}
        />
      )}
    </SafeAreaView>
  );
}
