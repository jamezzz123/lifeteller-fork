import React, { useState, useRef } from 'react';
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
  Repeat2,
  Bookmark,
  Share2,
  BadgeCheck,
  Medal,
  MessageCircleMore,
  ThumbsDown,
  HandMetal,
  CircleCheck,
  Info,
  Tag,
  Flag,
  Ban,
  ClockFading,
} from 'lucide-react-native';
import { colors } from '@/theme/colors';
import { Button } from '@/components/ui/Button';
import { mockLifts } from '@/data/mockLifts';
import { ProfileStack } from '@/components/ui/ProfileStack';
import { MediaCarousel } from '@/components/lift/MediaCarousel';
import { RaiseLiftList } from '@/components/lift/RaiseLiftList';
import { MinimalLiftCard } from '@/components/lift/MinimalLiftCard';
import { Avatar } from '@/components/ui/Avatar';
import {
  BottomSheetComponent,
  BottomSheetRef,
} from '@/components/ui/BottomSheet';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { ConfirmationModal } from '@/components/ui/ConfirmationModal';
import { PasscodeBottomSheet } from '@/components/ui/PasscodeBottomSheet';
import {
  PaymentBottomSheet,
  RequestSuccessBottomSheet,
} from '@/components/lift';

export default function LiftRequestDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const moreOptionsSheetRef = useRef<BottomSheetRef>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // Offer Lift flow state
  const paymentSheetRef = useRef<BottomSheetRef>(null);
  const passcodeBottomSheetRef = useRef<BottomSheetRef>(null);
  const successSheetRef = useRef<BottomSheetRef>(null);
  const [showOfferConfirmationModal, setShowOfferConfirmationModal] =
    useState(false);

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

  const mediaImage = media.map((item, index) => ({
    id: index.toString(),
    uri: item,
    type: 'image' as const,
  }));

  function handleReportLift() {
    moreOptionsSheetRef.current?.close();
    // TODO: Navigate to report screen or show report modal
    console.log('Report lift');
  }

  function handleReportAndBlockUser() {
    moreOptionsSheetRef.current?.close();
    // TODO: Navigate to report screen or show report modal with block option
    console.log('Report lift and block user');
  }

  // Offer Lift flow handlers
  const handleOfferLift = () => {
    paymentSheetRef.current?.expand();
  };

  const handlePaymentProceed = () => {
    paymentSheetRef.current?.close();
    setTimeout(() => {
      setShowOfferConfirmationModal(true);
    }, 300);
  };

  const handleConfirmOffer = () => {
    setShowOfferConfirmationModal(false);
    setTimeout(() => {
      passcodeBottomSheetRef.current?.expand();
    }, 300);
  };

  const handleCancelOffer = () => {
    setShowOfferConfirmationModal(false);
  };

  const handlePasscodeComplete = () => {
    passcodeBottomSheetRef.current?.close();
    setTimeout(() => {
      successSheetRef.current?.expand();
    }, 500);
  };

  const handleGoToFeeds = () => {
    successSheetRef.current?.close();
    router.replace('/(tabs)');
  };

  const handleShareOffer = async () => {
    console.log('Share offer');
  };

  const getStatusConfig = () => {
    switch (liftData.status) {
      case 'pending':
        return {
          bg: colors['yellow-tint']['50'],
          text: colors.yellow['50'],
          label: 'Pending',
          icon: <Info size={16} color={colors.yellow['50']}></Info>,
        };
      case 'request-sent':
        return {
          bg: colors['primary-tints'].purple['50'],
          text: colors.primary.purple,
          label: 'Request sent',
          icon: <HandMetal size={16} color={colors.primary.purple}></HandMetal>,
        };
      case 'offered':
        return {
          bg: colors['primary-tints'].purple['100'],
          text: colors.primary.purple,
          label: 'Offered',
          icon: <HandMetal size={16} color={colors.primary.purple}></HandMetal>,
        };
      case 'accepted':
        return {
          bg: '#E7F5E9',
          text: '#22874E',
          label: 'Accepted',
          icon: <CircleCheck size={16} color={'#22874E'}></CircleCheck>,
        };
      case 'declined':
        return {
          bg: '#FEE9E9',
          text: colors.state.red,
          label: 'Declined',
          icon: <ThumbsDown size={16} color={colors.state.red}></ThumbsDown>,
        };
      case 'active':
        return {
          bg: colors['primary-tints'].purple['50'],
          text: colors.primary.purple,
          label: 'Active',
          icon: <HandMetal size={16} color={colors.primary.purple}></HandMetal>,
        };
      case 'completed':
        return {
          bg: '#E7F5E9',
          text: '#22874E',
          label: 'Completed',
          icon: <CircleCheck size={16} color={'#22874E'}></CircleCheck>,
        };
      case 'closed':
        return {
          bg: colors['grey-plain']['300'],
          text: colors['grey-plain']['550'],
          label: 'Closed',
          icon: <ThumbsDown size={16} color={colors.state.red}></ThumbsDown>,
        };
      default:
        return {
          bg: colors['yellow-tint']['50'],
          text: colors.yellow['50'],
          label: 'Pending',
          icon: <Info size={16} color={colors.yellow['50']}></Info>,
        };
    }
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
        <TouchableOpacity onPress={() => moreOptionsSheetRef.current?.expand()}>
          <EllipsisVertical color={colors['grey-plain']['550']} size={24} />
        </TouchableOpacity>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: liftData.status === 'in-progress' ? 20 : 120,
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
                className="absolute -bottom-0.5 left-3 h-5 w-5 items-center justify-center rounded-full border-2 border-white"
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
          <View className="mt-5">
            <View
              className="flex-row items-center gap-1.5 self-start rounded-full px-3 py-1"
              style={{ backgroundColor: getStatusConfig().bg }}
            >
              {getStatusConfig().icon}
              <Text
                className="text-xs font-medium"
                style={{ color: getStatusConfig().text }}
              >
                {getStatusConfig().label}
              </Text>
            </View>
          </View>
        </View>

        {/* Media Carousel */}
        <View className="flex-1 bg-white">
          <MediaCarousel media={mediaImage} />
        </View>

        {/* Category and Time */}
        {(liftData.category || liftData.timeRemaining) && (
          <View className="flex-row items-center justify-between bg-white px-4 py-3">
            {liftData.category && (
              <View className="flex-row items-center gap-2">
                <View className="flex-row items-center gap-2 rounded-full px-2 py-1">
                  <Tag size={14} color={colors['primary']['purple']} />
                  <Text className="text-sm text-grey-alpha-500">
                    {liftData.category}
                  </Text>
                </View>
              </View>
            )}
            {liftData.timeRemaining && (
              <View className="flex-row items-center gap-1">
                <ClockFading size={14} />
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
          <Text className="text-xl font-bold text-grey-alpha-550">
            {liftData.title}
          </Text>
        </View>

        {/* Description */}
        <View className="bg-white px-4 pb-4">
          <Text className="text-[15px] font-normal leading-6 text-grey-alpha-500">
            {liftData.description}{' '}
            <Text className="font-bold text-grey-alpha-500">see more</Text>
          </Text>
        </View>

        {liftData.status === 'in-progress' && (
          <MinimalLiftCard currentAmount={4000} targetAmount={6000} />
        )}
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
            <MessageCircleMore color={colors['grey-plain']['550']} size={20} />
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
              {/* <View className="h-12 w-12 overflow-hidden rounded-full bg-grey-plain-300">
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
                className="absolute -bottom-0.5 left-3 h-5 w-5 items-center justify-center rounded-full border-2 border-white"
                style={{
                  backgroundColor: colors['primary-tints'].purple['100'],
                }}
              >
                <Medal color={colors.primary.purple} size={12} />
              </View> */}
              <Avatar size={40} profileImage={liftData.owner.avatar} />
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
              <ProfileStack
                profiles={[1, 2, 3].map(
                  (i) => `https://i.pravatar.cc/150?img=${i}`
                )}
                maxVisible={3}
                size={32}
                overlap={16}
              />
            </View>
            <Text className="text-[13px] text-grey-plain-550">
              Followed by <Text className="font-semibold">Seyi Makinde</Text>{' '}
              and <Text className="font-semibold">21 others</Text>
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

        {/* In Progress Status - Show requested from and lifted by */}
        {liftData.status === 'in-progress' && (
          <>
            {/* Requested From Section */}
            <View className="bg-white px-4 py-4">
              <Text className="mb-2 text-xs font-semibold uppercase tracking-wider text-grey-plain-550">
                REQUESTED FROM
              </Text>
              <Text className="text-base font-semibold text-grey-alpha-500">
                EVERYONE
              </Text>
            </View>

            {/* Divider */}
            <View className="h-2 bg-grey-plain-100" />

            {/* Lifted By Section */}
            <View className="bg-white px-4 py-4">
              {/* Header */}
              <View className="mb-4 flex-row items-center justify-between">
                <Text className="text-xs font-semibold uppercase tracking-wider text-grey-alpha-500">
                  LIFTED BY{' '}
                  <Text className="font-normal">
                    ({liftData.monetary?.coRaisers?.length || 0})
                  </Text>
                </Text>
                <TouchableOpacity
                  onPress={() => router.push(`/lifted-by/${id}` as any)}
                >
                  <Text className="text-primary-purple text-[13px] font-medium">
                    See more
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Contributors List */}
              <RaiseLiftList
                onPress={(contributor) =>
                  router.push(
                    `/lifter-details/${contributor.id}?liftId=${id}` as any
                  )
                }
                contributors={
                  liftData.monetary?.coRaisers?.slice(0, 5).map((raiser) => ({
                    id: raiser.id,
                    username: raiser.name,
                    handle: raiser.name.toLowerCase().replace(/\s+/g, ''),
                    timestamp: '10 seconds ago',
                    profileImage: raiser.avatar,
                    amount: raiser.amount || 0,
                  })) || []
                }
              />
            </View>
          </>
        )}
      </ScrollView>

      {/* Bottom Action Bar - Only show when status is not "in-progress" */}
      {liftData.status !== 'in-progress' && (
        <View
          className="absolute bottom-0 left-0 right-0 border-t border-grey-plain-150 bg-grey-alpha-150 px-4"
          style={{
            paddingBottom: Math.max(insets.bottom, 12),
            paddingTop: 12,
          }}
        >
          <View className="flex-row items-center justify-between gap-3">
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
              onPress={() => setShowConfirmDialog(true)}
            >
              <Text className="text-sm font-semibold text-state-red">
                Decline
              </Text>
            </TouchableOpacity>
            <Button onPress={handleOfferLift} variant="primary">
              <Text className="text-sm font-semibold text-white">
                Offer Lift
              </Text>
            </Button>
          </View>
        </View>
      )}

      {/* More Options Bottom Sheet */}
      <BottomSheetComponent ref={moreOptionsSheetRef}>
        <View className="px-6">
          {/* Report Lift */}
          <TouchableOpacity
            onPress={handleReportLift}
            className="flex-row items-center gap-3 py-4"
            activeOpacity={0.7}
          >
            <Flag color={colors.state.red} size={24} strokeWidth={2} />
            <Text className="text-base text-state-red">Report lift</Text>
          </TouchableOpacity>

          {/* Divider */}
          <View className="h-px bg-grey-plain-150" />

          {/* Report Lift and Block User */}
          <TouchableOpacity
            onPress={handleReportAndBlockUser}
            className="flex-row items-center gap-3 py-4"
            activeOpacity={0.7}
          >
            <Ban color={colors.state.red} size={24} strokeWidth={2} />
            <Text className="text-base text-state-red">
              Report lift and block user
            </Text>
          </TouchableOpacity>
        </View>
      </BottomSheetComponent>

      <ConfirmDialog
        visible={showConfirmDialog}
        title="Decline lift request"
        message="Are you sure you want to decline this lift request from Isaac Tolulope?"
        confirmText="Yes, decline"
        cancelText="No"
        onConfirm={() => {
          // TODO: Unhide all posts
          console.log('Unhiding all hidden posts');
          setShowConfirmDialog(false);
          // TODO: Clear the hidden posts list or navigate back
          router.back();
        }}
        onCancel={() => {
          setShowConfirmDialog(false);
        }}
        cancelTextColor={colors.primary.purple}
      />

      {/* Payment Bottom Sheet */}
      <PaymentBottomSheet
        ref={paymentSheetRef}
        amount={targetAmount}
        walletBalance={500000}
        onFundWallet={() => console.log('Fund wallet')}
        onProceed={handlePaymentProceed}
      />

      {/* Offer Confirmation Modal */}
      <ConfirmationModal
        visible={showOfferConfirmationModal}
        title={`You are about to lift ${liftData?.owner.name} with ₦${targetAmount.toLocaleString()}`}
        message="They will receive the monetary value of your lift in their wallet."
        confirmText="Yes, lift"
        cancelText="Cancel"
        onConfirm={handleConfirmOffer}
        onCancel={handleCancelOffer}
      />

      {/* Passcode Bottom Sheet */}
      <PasscodeBottomSheet
        ref={passcodeBottomSheetRef}
        mode="verify"
        onComplete={handlePasscodeComplete}
      />

      {/* Success Bottom Sheet */}
      <RequestSuccessBottomSheet
        ref={successSheetRef}
        title="Lift offer successfully sent"
        description="Your lift offer has been sent. We will notify you when it's accepted."
        primaryButtonTitle="Share lift offer"
        secondaryButtonTitle="Go to feeds"
        onGoToFeeds={handleGoToFeeds}
        onShareRequest={handleShareOffer}
      />
    </SafeAreaView>
  );
}
