import React, { useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity } from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Image } from 'expo-image';
import {
  CornerUpLeft,
  EllipsisVertical,
  Heart,
  MessageCircle,
  Repeat2,
  Bookmark,
  Share2,
  ChevronLeft,
  ChevronRight,
  BadgeCheck,
  Medal,
} from 'lucide-react-native';
import { colors } from '@/theme/colors';
import { Button } from '@/components/ui/Button';
import { mockLifts } from '@/data/mockLifts';


export default function LiftRequestDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Get lift data from mockLifts
  const liftData = mockLifts.find((lift) => lift.id === id);

  if (!liftData) {
    return (
      <SafeAreaView className="flex-1 bg-grey-plain-50">
        <View className="flex-1 items-center justify-center">
          <Text className="text-grey-plain-550">Lift not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Determine media to display
  const media = liftData.images || [];
  const targetAmount = liftData.monetary?.targetAmount || 0;

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) =>
      prev > 0 ? prev - 1 : media.length - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) =>
      prev < media.length - 1 ? prev + 1 : 0
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-grey-plain-50" edges={['top']}>
      {/* Header */}
      <View className="flex-row items-center justify-between border-b border-grey-plain-150 bg-white px-4 py-3">
        <View className="flex-row items-center gap-3">
          <TouchableOpacity onPress={() => router.back()}>
            <CornerUpLeft color={colors['grey-plain']['550']} size={24} />
          </TouchableOpacity>
          <Text className="text-lg font-semibold text-grey-alpha-500">
            Lift request
          </Text>
        </View>
        <TouchableOpacity>
          <EllipsisVertical color={colors['grey-plain']['550']} size={24} />
        </TouchableOpacity>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 120,
        }}
      >
        {/* User Header */}
        <View className="bg-white px-4 py-4">
          <View className="flex-row items-start gap-3">
            <View className="relative h-12 w-12">
              <View className="h-12 w-12 overflow-hidden rounded-full bg-grey-plain-300">
                <Image
                  source={{ uri: liftData.owner.avatar }}
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 24,
                  }}
                  contentFit="cover"
                />
              </View>
              <View
                className="absolute -bottom-0.5 left-0 h-5 w-5 items-center justify-center rounded-full border-2 border-white"
                style={{
                  backgroundColor: colors['primary-tints'].purple['100'],
                }}
              >
                <Medal color={colors.primary.purple} size={12} />
              </View>
            </View>
            <View className="flex-1">
              <View className="flex-row items-center gap-1.5">
                <Text className="text-[15px] font-semibold text-grey-alpha-500">
                  {liftData.owner.name}
                </Text>
                {liftData.owner.verified && (
                  <BadgeCheck color={colors.primary.purple} size={16} />
                )}
              </View>
              <Text className="text-[13px] text-grey-plain-550">
                @{liftData.owner.handle} • {liftData.timestamp}
              </Text>
            </View>
          </View>

          {/* Status Badge */}
          <View className="mt-3">
            <View className="self-start rounded-full bg-orange-100 px-3 py-1">
              <Text className="text-xs font-medium text-orange-600">
                {liftData.status.charAt(0).toUpperCase() + liftData.status.slice(1)}
              </Text>
            </View>
          </View>
        </View>

        {/* Image Carousel */}
        {media.length > 0 && (
          <View className="relative bg-white">
            <Image
              source={{ uri: media[currentImageIndex] }}
              style={{ width: '100%', aspectRatio: 4 / 3 }}
              contentFit="cover"
            />

            {/* Navigation Arrows */}
            {media.length > 1 && (
            <>
              <TouchableOpacity
                onPress={handlePrevImage}
                className="absolute left-4 top-1/2 h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90"
                activeOpacity={0.8}
              >
                <ChevronLeft color={colors['grey-alpha']['500']} size={24} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleNextImage}
                className="absolute right-4 top-1/2 h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90"
                activeOpacity={0.8}
              >
                <ChevronRight color={colors['grey-alpha']['500']} size={24} />
              </TouchableOpacity>
            </>
          )}

            {/* Dot Indicators */}
            {media.length > 1 && (
              <View className="absolute bottom-4 left-0 right-0 flex-row justify-center gap-2">
                {media.map((_, index) => (
                <View
                  key={index}
                  className={`h-2 w-2 rounded-full ${
                    index === currentImageIndex
                      ? 'bg-primary-purple'
                      : 'bg-grey-plain-300'
                  }`}
                />
              ))}
            </View>
          )}
          </View>
        )}

        {/* Category and Time */}
        {(liftData.category || liftData.timeRemaining) && (
          <View className="flex-row items-center justify-between bg-white px-4 py-3">
            {liftData.category && (
              <View className="flex-row items-center gap-2">
                <View className="rounded-full bg-grey-plain-100 px-2 py-1">
                  <Text className="text-xs text-grey-alpha-500">
                    {liftData.category}
                  </Text>
                </View>
              </View>
            )}
            {liftData.timeRemaining && (
              <View className="flex-row items-center gap-1">
                <View className="h-4 w-4 rounded-full bg-grey-plain-100" />
                <Text className="text-sm text-grey-plain-550">
                  {liftData.timeRemaining}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Location */}
        {liftData.location && (
          <View className="bg-white px-4 pb-2">
            <Text className="text-sm text-grey-plain-550">
              {liftData.location}
            </Text>
          </View>
        )}

        {/* Title */}
        <View className="bg-white px-4 pb-2">
          <Text className="text-xl font-bold text-grey-alpha-500">
            {liftData.title}
          </Text>
        </View>

        {/* Description */}
        <View className="bg-white px-4 pb-4">
          <Text className="text-[15px] leading-6 text-grey-alpha-500">
            {liftData.description}{' '}
            <Text className="font-medium text-grey-alpha-500">see more</Text>
          </Text>
        </View>

        {/* Amount */}
        {liftData.monetary && (
          <View className="bg-white px-4 pb-4">
            <Text className="text-3xl font-bold text-grey-alpha-500">
              ₦{targetAmount.toLocaleString()}
            </Text>
          </View>
        )}

        {/* Engagement Stats */}
        <View className="flex-row items-center gap-4 bg-white px-4 pb-4">
          <TouchableOpacity
            className="flex-row items-center gap-1"
            onPress={() => setIsLiked(!isLiked)}
          >
            <Heart
              color={isLiked ? colors.state.red : colors['grey-plain']['550']}
              size={20}
              fill={isLiked ? colors.state.red : 'transparent'}
            />
            <Text className="text-sm text-grey-plain-550">
              {liftData.likes}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-row items-center gap-1">
            <MessageCircle color={colors['grey-plain']['550']} size={20} />
            <Text className="text-sm text-grey-plain-550">
              {liftData.comments}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-row items-center gap-1">
            <Repeat2 color={colors['grey-plain']['550']} size={20} />
            <Text className="text-sm text-grey-plain-550">
              {liftData.shares}
            </Text>
          </TouchableOpacity>
          <View className="flex-1" />
          <TouchableOpacity
            className="flex-row items-center gap-1"
            onPress={() => setIsBookmarked(!isBookmarked)}
          >
            <Bookmark
              color={
                isBookmarked
                  ? colors.primary.purple
                  : colors['grey-plain']['550']
              }
              size={20}
              fill={isBookmarked ? colors.primary.purple : 'transparent'}
            />
          </TouchableOpacity>
          <TouchableOpacity className="flex-row items-center gap-1">
            <Share2 color={colors['grey-plain']['550']} size={20} />
          </TouchableOpacity>
        </View>


        {/* Divider */}
        <View className="h-2 bg-grey-plain-100" />

        {/* Requested By Section */}
        <View className="bg-white px-4 py-4">
          <Text className="mb-4 text-xs font-semibold uppercase tracking-wider text-grey-plain-550">
            Requested by
          </Text>

          <View className="flex-row items-start gap-3">
            <View className="relative h-12 w-12">
              <View className="h-12 w-12 overflow-hidden rounded-full bg-grey-plain-300">
                <Image
                  source={{ uri: liftData.owner.avatar }}
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 24,
                  }}
                  contentFit="cover"
                />
              </View>
              <View
                className="absolute -bottom-0.5 left-0 h-5 w-5 items-center justify-center rounded-full border-2 border-white"
                style={{
                  backgroundColor: colors['primary-tints'].purple['100'],
                }}
              >
                <Medal color={colors.primary.purple} size={12} />
              </View>
            </View>
            <View className="flex-1">
              <View className="flex-row items-center gap-1.5">
                <Text className="text-[15px] font-semibold text-grey-alpha-500">
                  {liftData.owner.name}
                </Text>
                {liftData.owner.verified && (
                  <BadgeCheck color={colors.primary.purple} size={16} />
                )}
              </View>
              <Text className="text-[13px] text-grey-plain-550">
                @{liftData.owner.handle} • {liftData.timestamp}
              </Text>
            </View>
          </View>

          {/* Bio */}
          <View className="mt-3">
            <Text className="text-sm text-grey-alpha-500">
              Healthy Philanthropist. Changing lives, one at a time.
            </Text>
          </View>

          {/* Lift Captain Badge */}
          <View className="mt-3 flex-row items-center gap-2">
            <View
              className="rounded-full px-2 py-1"
              style={{
                backgroundColor: colors['primary-tints'].purple['100'],
              }}
            >
              <View className="flex-row items-center gap-1">
                <Medal color={colors.primary.purple} size={14} />
                <Text className="text-primary-purple text-xs font-medium">
                  Lift Captain
                </Text>
              </View>
            </View>
          </View>

          {/* Stats */}
          <View className="mt-4 flex-row gap-3">
            <View className="flex-1 rounded-lg bg-grey-plain-150 px-1 py-1">
              <Text className="mb-1 px-2 text-xs text-grey-plain-550">
                Total Lifts
              </Text>
              <Text className="rounded bg-white px-2 py-1 text-2xl font-bold text-grey-alpha-500">
                24
              </Text>
            </View>
            <View className="flex-1 rounded-lg bg-grey-plain-150 px-1 py-1">
              <Text className="mb-1 px-2 text-xs text-grey-plain-550">
                Total Lift Offered
              </Text>
              <Text className="rounded bg-white px-2 py-1 text-2xl font-bold text-grey-alpha-500">
                24
              </Text>
            </View>
          </View>

          {/* Followers/Following */}
          <View className="mt-4 flex-row gap-4">
            <Text className="text-sm text-grey-alpha-500">
              <Text className="font-semibold">1,324</Text> Following
            </Text>
            <Text className="text-sm text-grey-alpha-500">
              <Text className="font-semibold">48.2k</Text> Followers
            </Text>
          </View>

          {/* Followed By */}
          <View className="mt-3 flex-row items-center gap-2">
            <View className="flex-row -space-x-2">
              {[1, 2, 3].map((i) => (
                <View
                  key={i}
                  className="h-6 w-6 overflow-hidden rounded-full border-2 border-white bg-grey-plain-300"
                >
                  <Image
                    source={{ uri: `https://i.pravatar.cc/150?img=${i}` }}
                    style={{ width: 24, height: 24 }}
                    contentFit="cover"
                  />
                </View>
              ))}
            </View>
            <Text className="text-xs text-grey-plain-550">
              Followed by dareytemy, donJazzy, Olamibest, and 21 others
            </Text>
          </View>
        </View>

        {/* Divider */}
        <View className="h-2 bg-grey-plain-100" />

        {/* Offered Status - Show offer details */}
        {liftData.status === 'offered' && liftData.offeredData && (
          <View className="bg-white px-4 py-4">
            {/* Date Offered */}
            <View className="mb-3">
              <Text className="mb-1 text-xs font-medium text-grey-plain-550">
                Date offered
              </Text>
              <Text className="text-sm text-grey-alpha-500">
                {liftData.offeredData.dateOffered}
              </Text>
            </View>

            {/* Amount Offered */}
            <View className="mb-3">
              <Text className="mb-1 text-xs font-medium text-grey-plain-550">
                Amount offered
              </Text>
              <Text className="text-lg font-bold text-grey-alpha-500">
                ₦{liftData.offeredData.amountOffered.toLocaleString()}
              </Text>
            </View>

            {/* Uplifting Message */}
            <View>
              <Text className="mb-1 text-xs font-medium text-grey-plain-550">
                Uplifting message
              </Text>
              <Text className="text-sm leading-5 text-grey-alpha-500">
                {liftData.offeredData.upliftingMessage}
              </Text>
            </View>
          </View>
        )}

        {/* Declined Status - Show decline details */}
        {liftData.status === 'declined' && liftData.declinedData && (
          <View className="bg-white px-4 py-4">
            {/* Date Declined */}
            <View className="mb-3">
              <Text className="mb-1 text-xs font-medium text-grey-plain-550">
                Date declined
              </Text>
              <Text className="text-sm text-grey-alpha-500">
                {liftData.declinedData.dateDeclined}
              </Text>
            </View>

            {/* Reason (if provided) */}
            {liftData.declinedData.reason && (
              <View>
                <Text className="mb-1 text-xs font-medium text-grey-plain-550">
                  Reason
                </Text>
                <Text className="text-sm leading-5 text-grey-alpha-500">
                  {liftData.declinedData.reason}
                </Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* Bottom Action Bar */}
      <View
        className="absolute bottom-0 left-0 right-0 border-t border-grey-plain-150 bg-grey-alpha-150 px-4"
        style={{
          paddingBottom: Math.max(insets.bottom, 12),
          paddingTop: 12,
        }}
      >
        <View className="flex-row items-center gap-3">
          {liftData.monetary && (
            <View className="flex-1">
              <Text className="text-2xl font-bold text-grey-alpha-500">
                ₦{targetAmount.toLocaleString()}
              </Text>
            </View>
          )}
          <TouchableOpacity
            className="rounded-full border border-state-red px-6 py-3"
            activeOpacity={0.7}
          >
            <Text className="text-sm font-semibold text-state-red">
              Decline
            </Text>
          </TouchableOpacity>
          <Button onPress={() => console.log('hello world')} variant="primary">
            <Text className="text-sm font-semibold text-white">Offer Lift</Text>
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}
