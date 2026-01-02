import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import * as Haptics from 'expo-haptics';
import {
  HandHelping,
  Share2,
  MessageSquareText,
  SquareUserRound,
  UserMinus,
  Waypoints,
  EyeOff,
  UserRoundCog,
  Ban,
  Flag,
  FlagOff,
} from 'lucide-react-native';
import {
  BottomSheetComponent,
  BottomSheetRef,
} from '@/components/ui/BottomSheet';
import { colors } from '@/theme/colors';
import { router } from 'expo-router';

interface MoreOptionsBottomSheetProps {
  userId: string;
  username: string;
  isFollowing?: boolean;
  onRequestLift?: () => void;
  onShareProfile?: () => void;
  onMessage?: () => void;
  onAddToList?: () => void;
  onSharedActivities?: () => void;
  onUnfollow?: () => void;
  onAboutAccount?: () => void;
  onMutePosts?: () => void;
  onBlockUser?: () => void;
  onReportUser?: () => void;
  onReportAndBlock?: () => void;
}

export const MoreOptionsBottomSheet = forwardRef<
  BottomSheetRef,
  MoreOptionsBottomSheetProps
>(
  (
    {
      userId,
      username,
      isFollowing = false,
      onRequestLift,
      onShareProfile,
      onMessage,
      onAddToList,
      onSharedActivities,
      onUnfollow,
      onAboutAccount,
      onMutePosts,
      onBlockUser,
      onReportUser,
      onReportAndBlock,
    },
    ref
  ) => {
    const bottomSheetRef = useRef<BottomSheetRef>(null);

    useImperativeHandle(ref, () => ({
      expand: () => {
        bottomSheetRef.current?.expand();
      },
      close: () => {
        bottomSheetRef.current?.close();
      },
    }));

    const handleAction = (
      action: () => void | undefined,
      hapticStyle: Haptics.ImpactFeedbackStyle = Haptics.ImpactFeedbackStyle
        .Light,
      shouldClose = true
    ) => {
      Haptics.impactAsync(hapticStyle);
      action?.();
      if (shouldClose) {
        bottomSheetRef.current?.close();
      }
    };

    const handleRequestLift = () => {
      handleAction(() => {
        onRequestLift?.();
        // Navigate to request lift flow
        router.push({
          pathname: '/request-lift',
          params: { recipientId: userId, recipientName: username },
        } as any);
      });
    };

    const handleShareProfile = () => {
      handleAction(() => {
        onShareProfile?.();
        // TODO: Implement share profile functionality
      });
    };

    const handleMessage = () => {
      handleAction(() => {
        onMessage?.();
        // TODO: Navigate to message screen
      });
    };

    const handleAddToList = () => {
      handleAction(() => {
        onAddToList?.();
        // TODO: Navigate to add to list screen
      });
    };

    const handleSharedActivities = () => {
      handleAction(() => {
        onSharedActivities?.();
        router.push({
          pathname: '/shared-activities/[userId]',
          params: { userId, username },
        } as any);
      });
    };

    const handleUnfollow = () => {
      handleAction(() => {
        onUnfollow?.();
        // TODO: Implement unfollow functionality
      });
    };

    const handleAboutAccount = () => {
      handleAction(() => {
        onAboutAccount?.();
        // TODO: Show about account modal/screen
      });
    };

    const handleMutePosts = () => {
      handleAction(() => {
        onMutePosts?.();
        // TODO: Implement mute posts functionality
      });
    };

    const handleBlockUser = () => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      bottomSheetRef.current?.close();
      onBlockUser?.();
    };

    const handleReportUser = () => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      bottomSheetRef.current?.close();
      onReportUser?.();
      router.push({
        pathname: '/report-user',
        params: { userId, username },
      } as any);
    };

    const handleReportAndBlock = () => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      bottomSheetRef.current?.close();
      onReportAndBlock?.();
      router.push({
        pathname: '/report-and-block-user',
        params: { userId, username },
      } as any);
    };

    return (
      <BottomSheetComponent ref={bottomSheetRef} snapPoints={['60%']}>
        <View className="px-6">
          {/* Section 1: Primary Actions */}
          <View>
            <TouchableOpacity
              onPress={handleRequestLift}
              className="flex-row items-center gap-3 py-4"
              activeOpacity={0.7}
            >
              <HandHelping color={colors['grey-alpha']['500']} size={20} />
              <Text className="text-base text-grey-alpha-500">
                Request lift from {username}
              </Text>
            </TouchableOpacity>

            <View className="h-px bg-grey-plain-150" />

            <TouchableOpacity
              onPress={handleShareProfile}
              className="flex-row items-center gap-3 py-4"
              activeOpacity={0.7}
            >
              <Share2 color={colors['grey-alpha']['500']} size={20} />
              <Text className="text-base text-grey-alpha-500">
                Share {username}&apos;s profile
              </Text>
            </TouchableOpacity>

            <View className="h-px bg-grey-plain-150" />

            <TouchableOpacity
              onPress={handleMessage}
              className="flex-row items-center gap-3 py-4"
              activeOpacity={0.7}
            >
              <MessageSquareText
                color={colors['grey-alpha']['500']}
                size={20}
              />
              <Text className="text-base text-grey-alpha-500">
                Message {username.split(' ')[0]}
              </Text>
            </TouchableOpacity>

            <View className="h-px bg-grey-plain-150" />

            <TouchableOpacity
              onPress={handleAddToList}
              className="flex-row items-center gap-3 py-4"
              activeOpacity={0.7}
            >
              <SquareUserRound color={colors['grey-alpha']['500']} size={20} />
              <Text className="text-base text-grey-alpha-500">
                Add/remove from lists
              </Text>
            </TouchableOpacity>

            <View className="h-px bg-grey-plain-150" />

            <TouchableOpacity
              onPress={handleSharedActivities}
              className="flex-row items-center gap-3 py-4"
              activeOpacity={0.7}
            >
              <Waypoints color={colors['grey-alpha']['500']} size={20} />
              <Text className="text-base text-grey-alpha-500">
                Shared activities
              </Text>
            </TouchableOpacity>
          </View>

          {/* Section 2: Relationship Actions */}
          <View className="mt-2">
            <View className="h-px bg-grey-plain-150" />

            {isFollowing && (
              <>
                <TouchableOpacity
                  onPress={handleUnfollow}
                  className="flex-row items-center gap-3 py-4"
                  activeOpacity={0.7}
                >
                  <UserMinus color={colors['grey-alpha']['500']} size={20} />
                  <Text className="text-base text-grey-alpha-500">
                    Unfollow
                  </Text>
                </TouchableOpacity>

                <View className="h-px bg-grey-plain-150" />
              </>
            )}

            <TouchableOpacity
              onPress={handleAboutAccount}
              className="flex-row items-center gap-3 py-4"
              activeOpacity={0.7}
            >
              <UserRoundCog color={colors['grey-alpha']['500']} size={20} />
              <Text className="text-base text-grey-alpha-500">
                About this account
              </Text>
            </TouchableOpacity>

            <View className="h-px bg-grey-plain-150" />

            <TouchableOpacity
              onPress={handleMutePosts}
              className="flex-row items-center gap-3 py-4"
              activeOpacity={0.7}
            >
              <EyeOff color={colors['grey-alpha']['500']} size={20} />
              <Text className="text-base text-grey-alpha-500">
                Mute posts from user
              </Text>
            </TouchableOpacity>
          </View>

          {/* Section 3: Critical Actions (Red) */}
          <View className="mt-2">
            <View className="h-px bg-grey-plain-150" />

            <TouchableOpacity
              onPress={handleBlockUser}
              className="flex-row items-center gap-3 py-4"
              activeOpacity={0.7}
            >
              <Ban color={colors.state.red} size={20} />
              <Text className="text-base" style={{ color: colors.state.red }}>
                Block user
              </Text>
            </TouchableOpacity>

            <View className="h-px bg-grey-plain-150" />

            <TouchableOpacity
              onPress={handleReportUser}
              className="flex-row items-center gap-3 py-4"
              activeOpacity={0.7}
            >
              <Flag color={colors.state.red} size={20} />
              <Text className="text-base" style={{ color: colors.state.red }}>
                Report user
              </Text>
            </TouchableOpacity>

            <View className="h-px bg-grey-plain-150" />

            <TouchableOpacity
              onPress={handleReportAndBlock}
              className="flex-row items-center gap-3 py-4"
              activeOpacity={0.7}
            >
              <FlagOff color={colors.state.red} size={20} />
              <Text className="text-base" style={{ color: colors.state.red }}>
                Report and block user
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </BottomSheetComponent>
    );
  }
);

MoreOptionsBottomSheet.displayName = 'MoreOptionsBottomSheet';
