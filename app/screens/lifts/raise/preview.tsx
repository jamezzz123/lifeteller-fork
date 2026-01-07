import {
  ChevronLeft,
  ChevronRight,
  Clock,
  CornerUpLeft,
  Tag,
} from 'lucide-react-native';
import { TouchableOpacity, View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/theme/colors';
import { Button } from '@/components/ui/Button';
import { router, Href } from 'expo-router';
import { RequestSuccessBottomSheet } from '@/components/lift';
import { useCallback, useRef, useState } from 'react';
import { BottomSheetRef } from '@/components/ui/BottomSheet';
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';

export default function PreviewLift() {
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
  const handleNext = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // Show success bottom sheet instead of navigating
    successSheetRef.current?.expand();
  }, []);

  const handleEditDetails = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  }, []);
  const successSheetRef = useRef<BottomSheetRef>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const MOCK_IMAGES = [
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800',
    'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800',
    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800',
    'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800',
    'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800',
  ];

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
  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'bottom']}>
      <ScrollView>
        {/* Header */}
        <View className="flex-row items-center justify-between border-b border-grey-plain-150 bg-white px-4 py-3">
          <View className="flex-row items-center gap-3">
            <TouchableOpacity onPress={() => router.back()}>
              <CornerUpLeft
                color={colors['grey-plain']['550']}
                size={24}
                strokeWidth={2}
              />
            </TouchableOpacity>
            <Text className="text-lg font-semibold text-grey-alpha-500">
              Preview
            </Text>
          </View>
        </View>
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
            <Text className="text-sm font-medium text-grey-alpha-500">
              {/* {category} */}
              Financial
            </Text>
          </View>
          <View className="flex-row items-center gap-1.5">
            <Clock
              size={16}
              color={colors['grey-alpha']['400']}
              strokeWidth={2.5}
            />
            <Text className="text-sm font-medium text-grey-alpha-500">
              7 days
            </Text>
          </View>
        </View>

        <View className=" border-b border-grey-plain-150 px-4">
          {/* Title */}
          <Text className="mb-3 text-xl font-bold text-grey-alpha-500">
            {/* {liftTitle} */}
            School Fees Loan Payment
          </Text>

          {/* Description */}
          <Text className="mb-6  text-sm leading-5 text-grey-alpha-500">
            {/* {liftDescription} */}
            Our local community garden is expanding, but we desperately need a
            simple online presence to organize volunteers, share meeting dates,
            and collect sign-ups. Right now, we&apos;re relying on paper sign-up
            sheets, which is chaotic.
          </Text>
        </View>

        {/* Amount and Items Section */}
        <View
          className="mx-4 mb-6 rounded-2xl border p-4"
          style={{
            backgroundColor: colors['grey-plain']['50'],
            borderColor: colors['grey-alpha']['150'],
          }}
        >
          <Text className="mb-3 text-2xl font-bold text-grey-alpha-500">
            ₦{'10000'.toLocaleString()}
          </Text>

          {/* {showItems && liftItems.length > 0 && (
              <View className="mb-3 flex-row flex-wrap gap-2">
                {liftItems.map((item) => (
                  <View
                    key={item.id}
                    className="rounded-full px-3 py-1.5"
                    style={{ backgroundColor: colors['grey-alpha']['150'] }}
                  >
                    <Text className="text-xs font-medium text-grey-alpha-500">
                      {item.name} ({item.quantity})
                    </Text>
                  </View>
                ))}
              </View>
            )} */}

          {/* Progress Slider */}
          <View className="relative w-full">
            <View className="h-2 w-full overflow-hidden rounded-full bg-grey-alpha-150">
              <View
                className="h-full rounded-full"
                style={{
                  width: '50%',
                  backgroundColor: colors.primary.purple,
                }}
              />
            </View>
            <View className="absolute -top-3 mb-2 w-auto flex-row items-center justify-between rounded-full border border-primary bg-white p-2">
              <Text className="text-xs font-semibold text-grey-alpha-500">
                10%
              </Text>
            </View>
          </View>
        </View>

        {/* Who can offer you this lift */}
        <View className="mb-4 px-4">
          <Text className="mb-1 text-sm text-grey-alpha-400">
            Who can offer you this lift?
          </Text>
          <Text className="text-base font-semibold text-grey-alpha-500">
            {'Everyone'}
          </Text>
        </View>

        {/* Start date */}
        <View className="mb-6 px-4">
          <Text className="mb-1 text-sm text-grey-alpha-400">Start date</Text>
          <Text className="text-base font-semibold text-grey-alpha-500">
            {'25th June, 2024'}
          </Text>
        </View>
      </ScrollView>
      {/* Bottom Actions - Sticky to bottom */}
      <View className="border-t border-grey-plain-450/20 bg-grey-alpha-150 p-4">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity onPress={handleEditDetails}>
            <Text className="text-base  text-grey-alpha-500">Edit details</Text>
          </TouchableOpacity>

          <Button title="Raise lift" onPress={handleNext} variant="primary" />
        </View>
      </View>
      <RequestSuccessBottomSheet
        ref={successSheetRef}
        onGoToFeeds={handleGoToFeeds}
        onShareRequest={handleShareRequest}
      />
    </SafeAreaView>
  );
}
