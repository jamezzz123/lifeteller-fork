import { useEffect, useState, useCallback, useRef } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Image } from 'expo-image';
import { router, Href } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { ChevronLeft, ChevronRight, Tag, Clock } from 'lucide-react-native';

import { colors } from '@/theme/colors';
import { Button } from '@/components/ui/Button';
import { BottomSheetRef } from '@/components/ui/BottomSheet';
import { RequestSuccessBottomSheet } from '@/components/lift';
import { useRequestLift } from '@/context/request-lift';

// Mock images for carousel
const MOCK_IMAGES = [
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800',
  'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800',
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800',
  'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800',
  'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800',
];

export default function Step4Screen() {
  const {
    liftTitle,
    liftDescription,
    liftType,
    liftAmount,
    liftItems,
    category,
    audienceOfferType,
    setHeaderTitle,
    setNextButtonLabel,
    setCanProceed,
    onNextRef,
  } = useRequestLift();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const successSheetRef = useRef<BottomSheetRef>(null);

  const handleNext = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // Show success bottom sheet instead of navigating
    successSheetRef.current?.expand();
  }, []);

  const handleEditDetails = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  }, []);

  useEffect(() => {
    setHeaderTitle('Preview lift');
    setNextButtonLabel('Request lift');
    setCanProceed(true);
    onNextRef.current = handleNext;
    return () => {
      onNextRef.current = null;
    };
  }, [
    setHeaderTitle,
    setNextButtonLabel,
    setCanProceed,
    handleNext,
    onNextRef,
  ]);

  function handlePreviousImage() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCurrentImageIndex((prev) =>
      prev > 0 ? prev - 1 : MOCK_IMAGES.length - 1
    );
  }

  function handleNextImage() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCurrentImageIndex((prev) =>
      prev < MOCK_IMAGES.length - 1 ? prev + 1 : 0
    );
  }

  function handleGoToFeeds() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    successSheetRef.current?.close();
    router.replace('/(tabs)/home' as Href);
  }

  function handleShareRequest() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // Implement share functionality
    // For now, just close the sheet
    successSheetRef.current?.close();
  }

  const getAudienceLabel = () => {
    switch (audienceOfferType) {
      case 'everyone':
        return 'Everyone';
      case 'friends':
        return 'Friends';
      case 'chat-direct':
        return 'Request via chat/direct message';
      case 'selected-people':
        return 'Selected people';
      case 'my-list':
        return 'My list';
      case 'private':
        return 'Private';
      default:
        return 'Everyone';
    }
  };

  // Mock start date for now
  const startDate = 'Tues, 21/12/2025';
  const liftDuration = '7 days';

  const showAmount = liftType === 'Monetary' || liftType === 'Both';
  const showItems = liftType === 'Non-monetary' || liftType === 'Both';

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Image Carousel */}
        <View className="mb-4 mt-4 px-4">
          <View className="relative">
            <Image
              source={{ uri: MOCK_IMAGES[currentImageIndex] }}
              style={{ width: '100%', height: 224, borderRadius: 16 }}
              contentFit="cover"
            />

            {/* Navigation Arrows */}
            <TouchableOpacity
              onPress={handlePreviousImage}
              className="absolute left-3 top-1/2 size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-sm"
              style={{ transform: [{ translateY: -20 }] }}
            >
              <ChevronLeft
                size={20}
                color={colors['grey-alpha']['500']}
                strokeWidth={2.5}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleNextImage}
              className="absolute right-3 top-1/2 size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-sm"
              style={{ transform: [{ translateY: -20 }] }}
            >
              <ChevronRight
                size={20}
                color={colors['grey-alpha']['500']}
                strokeWidth={2.5}
              />
            </TouchableOpacity>

            {/* Dots Indicator */}
            <View className=" my-5 flex-row items-center justify-center gap-1.5">
              {MOCK_IMAGES.map((_, index) => (
                <View
                  key={index}
                  className="size-2 rounded-full"
                  style={{
                    backgroundColor:
                      index === currentImageIndex
                        ? colors.primary.purple
                        : colors['grey-alpha']['250'],
                  }}
                />
              ))}
            </View>
          </View>
        </View>

        {/* Category and Duration Badges */}
        <View className="mb-3 flex-row items-center justify-between gap-3 px-4">
          <View className="flex-row items-center gap-1.5">
            <Tag size={16} color={colors.primary.purple} strokeWidth={2.5} />
            <Text className="text-sm font-inter-medium text-grey-alpha-500">
              {category}
            </Text>
          </View>
          <View className="flex-row items-center gap-1.5">
            <Clock
              size={16}
              color={colors['grey-alpha']['400']}
              strokeWidth={2.5}
            />
            <Text className="text-sm font-inter-medium text-grey-alpha-500">
              {liftDuration}
            </Text>
          </View>
        </View>

        {/* Title */}
        <Text className="mb-3 px-4 text-xl font-inter-bold text-grey-alpha-500">
          {liftTitle}
        </Text>

        {/* Description */}
        <Text className="mb-6 px-4 text-sm leading-5 text-grey-alpha-500">
          {liftDescription}
        </Text>

        {/* Amount and Items Section */}
        {(showAmount || showItems) && (
          <View
            className="mx-4 mb-6 rounded-2xl border p-4"
            style={{
              backgroundColor: colors['grey-plain']['50'],
              borderColor: colors['grey-alpha']['150'],
            }}
          >
            {showAmount && (
              <Text className="mb-3 text-2xl font-inter-bold text-grey-alpha-500">
                ₦{liftAmount.toLocaleString()}
              </Text>
            )}

            {showItems && liftItems.length > 0 && (
              <View className="mb-3 flex-row flex-wrap gap-2">
                {liftItems.map((item) => (
                  <View
                    key={item.id}
                    className="rounded-full px-3 py-1.5"
                    style={{ backgroundColor: colors['grey-alpha']['150'] }}
                  >
                    <Text className="text-xs font-inter-medium text-grey-alpha-500">
                      {item.name} ({item.quantity})
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {/* Progress Slider */}
            <View className="relative w-full">
              <View className="h-2 w-full overflow-hidden rounded-full bg-grey-alpha-150">
                <View
                  className="h-full rounded-full"
                  style={{
                    width: '0%',
                    backgroundColor: colors.primary.purple,
                  }}
                />
              </View>
              <View className="absolute -top-3 mb-2 w-auto flex-row items-center justify-between rounded-full border border-primary bg-white p-2">
                <Text className="text-xs font-inter-semibold text-grey-alpha-500">
                  0%
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Who can offer you this lift */}
        <View className="mb-4 px-4">
          <Text className="mb-1 text-sm text-grey-alpha-400">
            Who can offer you this lift?
          </Text>
          <Text className="text-base font-inter-semibold text-grey-alpha-500">
            {getAudienceLabel()}
          </Text>
        </View>

        {/* Start date */}
        <View className="mb-6 px-4">
          <Text className="mb-1 text-sm text-grey-alpha-400">Start date</Text>
          <Text className="text-base font-inter-semibold text-grey-alpha-500">
            {startDate}
          </Text>
        </View>
      </ScrollView>

      {/* Bottom Actions - Sticky to bottom */}
      <View className="border-t border-grey-plain-450/20 bg-grey-alpha-150 px-4 pb-6 pt-4">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity onPress={handleEditDetails}>
            <Text className="text-base font-inter-semibold text-grey-alpha-500">
              Edit details
            </Text>
          </TouchableOpacity>

          <Button title="Request lift" onPress={handleNext} variant="primary" />
        </View>
      </View>

      {/* Success Bottom Sheet */}
      <RequestSuccessBottomSheet
        ref={successSheetRef}
        onGoToFeeds={handleGoToFeeds}
        onShareRequest={handleShareRequest}
      />
    </View>
  );
}
