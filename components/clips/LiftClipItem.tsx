import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import { VideoView, useVideoPlayer } from 'expo-video';
import { BlurView } from 'expo-blur';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useRouter } from 'expo-router';
import {
  Heart,
  Bookmark,
  Repeat2,
  MessageSquare,
  Share2,
  HandHeart,
  MessageCircleMore,
  BadgeCheck,
  Music2,
  Plus,
  EllipsisVertical,
  Search,
} from 'lucide-react-native';
import { colors } from '@/theme/colors';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '../ui/Button';
import { ProfileStack } from '../ui/ProfileStack';

export interface LiftClipData {
  id: string;
  videoUri: string;
  user: {
    id: string;
    name: string;
    username: string;
    profileImage?: string;
  };
  caption: string;
  location?: string;
  liftDetails?: string;
  likes: number;
  comments: number;
  isLiked?: boolean;
  isSaved?: boolean;
}

interface LiftClipItemProps {
  clip: LiftClipData;
  isActive: boolean;
  clipHeight: number;
  onLike?: () => void;
  onComment?: () => void;
  onShare?: () => void;
  onSave?: () => void;
  onJoinLift?: () => void;
  onViewLiftDetails?: () => void;
  onOpenClipOptions?: () => void;
}

export function LiftClipItem({
  clip,
  isActive,
  clipHeight,
  onLike,
  onComment,
  onShare,
  onSave,
  onJoinLift,
  onViewLiftDetails,
  onOpenClipOptions,
}: LiftClipItemProps) {
  const player = useVideoPlayer(clip.videoUri, (player) => {
    player.loop = true;
    player.volume = 0.1;
  });
  const [isLiked, setIsLiked] = useState(clip.isLiked || false);
  const [isSaved, setIsSaved] = useState(clip.isSaved || false);
  const [likesCount, setLikesCount] = useState(clip.likes);
  const tabBarHeight = useBottomTabBarHeight();
  const bottomPadding =
    Platform.OS === 'android' ? tabBarHeight - 60 : tabBarHeight;
  const router = useRouter();

  useEffect(() => {
    if (isActive) {
      player.play();
    } else {
      player.pause();
    }
  }, [isActive, player]);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
    onLike?.();
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    onSave?.();
  };

  const handleCreateClip = () => {
    router.push('/lift-clip' as any);
  };

  const formatCount = (count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  return (
    <View
      className="relative"
      style={{
        height: clipHeight,
        backgroundColor: colors['grey-alpha']['500'],
      }}
    >
      {/* Video Player */}
      <VideoView
        player={player}
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
        }}
        contentFit="cover"
        nativeControls={false}
      />

      <View
        className="align-items-end absolute bottom-0 z-20 w-full flex-row  justify-between px-2"
        style={{ paddingBottom: bottomPadding }}
      >
        <View className="flex-1 justify-end">
          <View className="flex-row items-center gap-3">
            <Avatar
              profileImage="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"
              name={'JAMES'}
            ></Avatar>
            <View className="flex-1">
              <View className="flex-row items-center gap-2">
                <Text className="text-base font-inter-medium text-grey-plain-50">
                  {clip.user.name}
                </Text>
                <BadgeCheck
                  size={16}
                  color={colors['grey-plain']['50']}
                ></BadgeCheck>
              </View>
              <View className="flex-row items-center gap-1">
                <Text className="text-sm text-white">
                  @{clip.user.username}
                </Text>
                <View
                  style={{
                    height: 5,
                    width: 5,
                    backgroundColor: colors['grey-plain']['50'],
                    borderRadius: 10,
                    // color: colors['grey-plain']['50'],
                  }}
                ></View>
                <Text className="text-sm text-white">Oct 22</Text>
              </View>
              {/* <Text className="text-sm text-white">
                @{clip.user.username} . Oct 22
              </Text> */}
            </View>
          </View>

          {/* Caption */}
          <Text className="mb-2 text-sm text-grey-plain-50" numberOfLines={2}>
            {clip.caption}
          </Text>
          <View className="mb-2 flex-row items-center gap-2">
            <ProfileStack
              profiles={[
                'https://i.pravatar.cc/150?img=12',
                'https://i.pravatar.cc/150?img=5',
                'https://i.pravatar.cc/150?img=20',
              ]}
              maxVisible={3}
              size={20}
              overlap={16}
            />
            <Text className="text-sm text-grey-plain-50">
              Liked by <Text className="font-inter-semibold">Seyi Makinde</Text> and{' '}
              <Text className="font-inter-semibold">15 others</Text>
            </Text>
          </View>

          {/* Location & Lift Details */}
          <View className="flex-row items-center gap-4">
            <View className="flex-row items-center gap-1">
              <Music2 color={colors['grey-plain']['50']} size={14} />
              <Text className="text-xs text-grey-plain-50">
                Temi ni Temi . Brymo
              </Text>
            </View>

            {clip.liftDetails && (
              <TouchableOpacity onPress={onViewLiftDetails}>
                <Text className="text-xs font-inter-semibold text-grey-plain-50">
                  See details
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
        <View className="items-end">
          <TouchableOpacity
            onPress={handleLike}
            className="mb-2 flex-row items-center justify-center gap-2 rounded-full p-3"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
          >
            <Heart
              color={isLiked ? colors.state.red : '#ffffff'}
              fill={isLiked ? colors.state.red : 'transparent'}
              size={20}
            />
            {/* rgba(37, 42, 49, 0.7) */}
            <Text className="text-sm font-inter-semibold text-grey-plain-50">
              {formatCount(likesCount)}
            </Text>
          </TouchableOpacity>

          {/* Comment Button */}
          <TouchableOpacity
            onPress={onComment}
            className="mb-2 flex-row items-center justify-center gap-2 rounded-full p-3"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
          >
            <MessageCircleMore color={colors['grey-plain']['50']} size={20} />
            <Text className="text-sm font-inter-semibold text-grey-plain-50">
              {formatCount(clip.comments)}
            </Text>
          </TouchableOpacity>

          {/* Repost Button */}
          <TouchableOpacity
            className="mb-2 flex-row items-center justify-center gap-2 rounded-full p-3"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
          >
            <Repeat2 color={colors['grey-plain']['50']} size={20} />
            <Text className="text-sm font-inter-semibold text-grey-plain-50">12</Text>
          </TouchableOpacity>

          {/* Chat Button */}
          <TouchableOpacity
            className="mb-2 flex-row items-center justify-center gap-2 rounded-full p-3"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
          >
            <MessageSquare color={colors['grey-plain']['50']} size={20} />
            <Text className="text-sm font-inter-semibold text-grey-plain-50">
              Chat
            </Text>
          </TouchableOpacity>

          {/* Save and Share Buttons */}
          <View className="mb-2 flex-row items-center gap-2">
            <TouchableOpacity
              onPress={handleSave}
              className="items-center justify-center rounded-full p-3"
              style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
            >
              <Bookmark
                color={colors['grey-plain']['50']}
                fill={isSaved ? 'rgba(37, 42, 49, 0.7)' : 'transparent'}
                size={18}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onShare}
              className=" items-center justify-center rounded-full p-3"
              style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
            >
              <Share2 color={colors['grey-plain']['50']} size={18} />
            </TouchableOpacity>
          </View>

          {/* Offer Lift Button */}
          {/* <TouchableOpacity
            onPress={onJoinLift}
            className="flex-row items-center gap-2 rounded-full px-4 py-2"
            style={{ backgroundColor: colors.primary.purple }}
          >
            <HandHeart color="rgba(37, 42, 49, 0.7)" size={20} />
            <Text className="text-sm font-bold text-grey-plain-50">
              Offer lift
            </Text>
          </TouchableOpacity> */}
          <Button
            onPress={() => onJoinLift}
            iconLeft={
              <HandHeart color={colors['grey-plain']['50']} size={20} />
            }
            size="small"
            title="Offer lift"
          ></Button>
        </View>
      </View>

      <View className="absolute top-0 w-full flex-row justify-between px-2 py-4">
        <BlurView
          intensity={10}
          tint="dark"
          className="overflow-hidden rounded-full"
        >
          <TouchableOpacity
            onPress={handleCreateClip}
            style={{ backgroundColor: 'rgba(37, 42, 49, 0.7)' }}
            className="flex-row items-center gap-2  rounded-full p-3 text-grey-plain-50"
          >
            <Plus color={colors['grey-plain']['50']} size={20} />
            <Text className="text-sm font-inter-semibold text-grey-plain-50">
              Create
            </Text>
          </TouchableOpacity>
        </BlurView>
        <View className="flex-row gap-2">
          <BlurView
            intensity={10}
            tint="dark"
            className="overflow-hidden rounded-full"
          >
            <TouchableOpacity
              onPress={onOpenClipOptions}
              style={{ backgroundColor: 'rgba(37, 42, 49, 0.7)' }}
              className="flex-row items-center gap-2  rounded-full p-3 text-grey-plain-50"
            >
              <Search color={colors['grey-plain']['50']} size={20} />
            </TouchableOpacity>
          </BlurView>
          <BlurView
            intensity={10}
            tint="dark"
            className="overflow-hidden rounded-full"
          >
            <TouchableOpacity
              onPress={onOpenClipOptions}
              style={{ backgroundColor: 'rgba(37, 42, 49, 0.7)' }}
              className="flex-row items-center gap-2  rounded-full p-3 text-grey-plain-50"
            >
              <EllipsisVertical color={colors['grey-plain']['50']} size={20} />
            </TouchableOpacity>
          </BlurView>
        </View>
      </View>
    </View>
  );
}
