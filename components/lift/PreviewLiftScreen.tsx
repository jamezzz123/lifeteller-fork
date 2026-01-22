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
import { LiftProgressBar } from '@/components/ui/LiftProgressBar';
import { router, Href } from 'expo-router';
import { RequestSuccessBottomSheet } from '@/components/lift';
import { useCallback, useRef, useState } from 'react';
import { BottomSheetRef } from '@/components/ui/BottomSheet';
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import { useLiftDraft, LiftType } from '@/context/LiftDraftContext';

interface PreviewLiftScreenProps {
  onSuccess?: () => void;
  onEdit?: () => void;
  successRoute?: Href;
}

export default function PreviewLiftScreen({
  onSuccess,
  onEdit,
  successRoute = '/(tabs)/home' as Href,
}: PreviewLiftScreenProps) {
  const {
    selectedMedia,
    category,
    title,
    description,
    liftAmount,
    audienceType,
    liftType,
    liftItems,
  } = useLiftDraft();

  function handleGoToFeeds() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    successSheetRef.current?.close();
    if (onSuccess) {
      onSuccess();
    } else {
      router.replace(successRoute);
    }
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
    if (onEdit) {
      onEdit();
    } else {
      router.back();
    }
  }, [onEdit]);

  const successSheetRef = useRef<BottomSheetRef>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Use selectedMedia from context, fallback to mock images if empty
  const MOCK_IMAGES = [
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800',
    'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800',
    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800',
    'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800',
    'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800',
  ];

  const images =
    selectedMedia.length > 0
      ? selectedMedia.map((media) => media.uri)
      : MOCK_IMAGES;

  function handlePreviousImage() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  }

  function handleNextImage() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCurrentImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  }

  // Format audience type for display
  const getAudienceDisplayText = () => {
    switch (audienceType) {
      case 'everyone':
        return 'Everyone';
      case 'friends':
        return 'Friends';
      // case 'close-friends':
      //   return 'Close friends';
      default:
        return 'Everyone';
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
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
            <Text className="text-lg font-medium text-grey-alpha-500">
              Preview lift
            </Text>
          </View>
        </View>

        {/* Image Carousel */}
        {images.length > 0 && (
          <View className="mb-4 mt-4 px-4">
            <View className="relative">
              <View className="flex-row overflow-hidden">
                <Image
                  source={{ uri: images[currentImageIndex] }}
                  style={{ width: '90%', height: 280, borderRadius: 16 }}
                  contentFit="cover"
                />
                <Image
                  source={{
                    uri: images[(currentImageIndex + 1) % images.length],
                  }}
                  style={{
                    width: '10%',
                    height: 280,
                    borderRadius: 16,
                    position: 'absolute',
                    marginLeft: '93%',
                  }}
                  contentFit="cover"
                />
              </View>

              {/* Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <TouchableOpacity
                    onPress={handlePreviousImage}
                    className="absolute left-3 top-1/2 -mt-4 size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-sm"
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
                    className="absolute right-3 top-1/2 -mt-4 mr-[10%] size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-sm"
                    style={{ transform: [{ translateY: -20 }] }}
                  >
                    <ChevronRight
                      size={20}
                      color={colors['grey-alpha']['500']}
                      strokeWidth={2.5}
                    />
                  </TouchableOpacity>
                </>
              )}

              {/* Dots Indicator */}
              {images.length > 1 && (
                <View className="my-5 flex-row items-center justify-center gap-1.5">
                  {images.map((_, index) => (
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
              )}
            </View>
          </View>
        )}

        {/* Category and Duration Badges */}
        <View className="mb-3 flex-row items-center justify-between gap-3 px-4">
          {category && (
            <View className="flex-row items-center gap-1.5">
              <Tag size={16} color={colors.primary.purple} strokeWidth={2.5} />
              <Text className="text-sm font-medium text-grey-alpha-500">
                {category}
              </Text>
            </View>
          )}
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

        <View className=" px-4">
          {/* Title */}
          <Text className="mb-3 text-xl font-bold text-grey-alpha-500">
            {title || 'Untitled Lift'}
          </Text>

          {/* Description */}
          <Text className="mb-6 text-sm leading-5 text-grey-alpha-500">
            {description || 'No description provided.'}
          </Text>
        </View>

        <View className="my-5 border-y border-grey-plain-300 px-4 py-6">
          {/* Amount and Items Section */}
          {liftType === LiftType.Monetary && (
            <View
              className="mx-4  rounded-2xl border p-4"
              style={{
                backgroundColor: colors['grey-plain']['50'],
                borderColor: colors['grey-plain']['300'],
              }}
            >
              <Text className="mb-3 text-2xl font-bold text-grey-alpha-500">
                ₦{(liftAmount || '0').toLocaleString()}
              </Text>

              {/* Progress Bar */}
              <LiftProgressBar
                currentAmount={500}
                targetAmount={Number(liftAmount)}
                showAmount={false}
              />
            </View>
          )}
          {liftType === LiftType.NonMonetary && (
            <View
              className="mx-4  rounded-2xl border p-4"
              style={{
                backgroundColor: colors['grey-plain']['50'],
                borderColor: colors['grey-plain']['300'],
              }}
            >
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
              {/* Progress Bar */}
              <LiftProgressBar
                currentAmount={1}
                targetAmount={2}
                showAmount={false}
              />
            </View>
          )}
        </View>

        {/* Who can offer you this lift */}
        <View className="mb-4 px-4">
          <Text className="mb-1 text-sm text-grey-alpha-400">
            Who can offer you this lift?
          </Text>
          <Text className="text-base font-semibold text-grey-alpha-500">
            {getAudienceDisplayText()}
          </Text>
        </View>

        {/* Start date */}
        <View className="mb-6 px-4">
          <Text className="mb-1 text-sm text-grey-alpha-400">Start date</Text>
          <Text className="text-base font-semibold text-grey-alpha-500">
            {new Date().toLocaleDateString('en-US', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </Text>
        </View>
      </ScrollView>

      {/* Bottom Actions - Sticky to bottom */}
      <View className="border-t border-grey-plain-300 bg-grey-alpha-100 px-4 py-6">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity onPress={handleEditDetails}>
            <Text className="text-base text-grey-alpha-500">Edit details</Text>
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
