import React from 'react';
import { View, Text, TouchableOpacity, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import {
  Heart,
  MessageCircleMore,
  Repeat2,
  Bookmark,
  Share2,
  Ellipsis,
  BadgeCheck,
  Medal,
  Play,
} from 'lucide-react-native';
import { colors } from '@/theme/colors';
import { LiftProgressCard } from './LiftProgressCard';
import { useCommentBottomSheet } from '@/context/comment-bottom-sheet';

type MediaItem = {
  id: string;
  type: 'image' | 'video';
  uri: string;
};

interface LiftData {
  title: string;
  currentAmount: number;
  targetAmount: number;
}

interface FeedPostProps {
  id?: string;
  userId?: string;
  username: string;
  handle: string;
  timestamp: string;
  content: string;
  profileImage?: string;
  otherUsersCount?: number;
  media?: MediaItem[];
  lift?: LiftData;
  likes?: number;
  comments?: number;
  reposts?: number;
  withUsers?: string[];
  onMenuPress?: () => void;
}

// Parse text and style mentions, hashtags, and links
function parseTextWithStyling(text: string) {
  const parts: { text: string; style: 'normal' | 'primary' }[] = [];
  const regex = /(@\w+|#\w+|https?:\/\/[^\s]+)/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    // Add text before match
    if (match.index > lastIndex) {
      parts.push({
        text: text.substring(lastIndex, match.index),
        style: 'normal',
      });
    }
    // Add matched text (mention/hashtag/link)
    parts.push({
      text: match[0],
      style: 'primary',
    });
    lastIndex = regex.lastIndex;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push({
      text: text.substring(lastIndex),
      style: 'normal',
    });
  }

  return parts.length > 0 ? parts : [{ text, style: 'normal' as const }];
}

export function FeedPost({
  id,
  userId,
  username,
  handle,
  timestamp,
  content,
  profileImage,
  otherUsersCount,
  media,
  lift,
  likes = 0,
  comments = 0,
  reposts = 0,
  withUsers,
  onMenuPress,
}: FeedPostProps) {
  const textParts = parseTextWithStyling(content);
  const { openComments } = useCommentBottomSheet();

  function handlePostPress() {
    if (!id) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(`/lift/${id}` as any);
  }

  function handleProfilePress(e?: any) {
    if (e) {
      e.stopPropagation();
    }
    if (!userId) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(`/user/${userId}` as any);
  }

  return (
    <Pressable
      onPress={handlePostPress}
      className="border-b border-grey-plain-150 bg-grey-plain-50"
    >
      <View className="px-4 py-4">
        {/* Header */}
        <View className="mb-3 flex-row items-start justify-between">
          <View className="flex-1 flex-row items-center gap-3">
            {/* Profile Picture with Badge */}
            <TouchableOpacity
              onPress={handleProfilePress}
              disabled={!userId}
              activeOpacity={userId ? 0.7 : 1}
            >
              <View className="relative h-12 w-12">
                <View className="h-12 w-12 overflow-hidden rounded-full bg-grey-plain-300">
                  {profileImage ? (
                    <Image
                      source={{ uri: profileImage }}
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 24,
                      }}
                      contentFit="cover"
                    />
                  ) : (
                    <View className="h-full w-full bg-grey-plain-450" />
                  )}
                </View>
                {/* Badge Overlay */}
                <View
                  className="absolute -bottom-0.5 left-0 h-5 w-5 items-center justify-center rounded-full border-2 border-white"
                  style={{
                    backgroundColor: colors['primary-tints'].purple['100'],
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Medal
                    color={colors.primary.purple}
                    size={12}
                    style={{ alignSelf: 'center' }}
                  />
                </View>
              </View>
            </TouchableOpacity>
            <View className="flex-1">
              <TouchableOpacity
                onPress={handleProfilePress}
                disabled={!userId}
                activeOpacity={userId ? 0.7 : 1}
              >
                <View className="mb-0.5 flex-row items-center gap-1.5">
                  <Text className="text-[15px] font-semibold text-grey-alpha-500">
                    {username}
                  </Text>
                  <BadgeCheck color={colors.primary.purple} size={16} />
                  {otherUsersCount !== undefined && otherUsersCount > 0 && (
                    <Text className="text-[13px] text-grey-plain-550">
                      and{' '}
                      <Text className="font-semibold">+{otherUsersCount}</Text>{' '}
                      others
                    </Text>
                  )}
                </View>
                <View className="flex-row items-center gap-1">
                  <Text className="text-[13px] text-grey-plain-550">
                    @{handle}
                  </Text>
                  <View className="h-1 w-1 rounded-full bg-grey-plain-550" />
                  <Text className="text-[13px] text-grey-plain-550">
                    {timestamp}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity className="p-1" onPress={onMenuPress}>
            <Ellipsis color={colors['grey-plain']['550']} size={20} />
          </TouchableOpacity>
        </View>

        {/* Content */}
        {content && (
          <View className="mb-3">
            <Text
              className="text-[15px] text-grey-alpha-500"
              style={{ lineHeight: 22 }}
            >
              {textParts.map((part, index) => (
                <Text
                  key={index}
                  style={
                    part.style === 'primary'
                      ? { color: colors.primary.purple }
                      : undefined
                  }
                >
                  {part.text}
                </Text>
              ))}
            </Text>
          </View>
        )}

        {/* Media */}
        {media && media.length > 0 && (
          <View className="mb-3">
            {media.length === 1 ? (
              <View className="relative overflow-hidden rounded-xl">
                <Image
                  source={{ uri: media[0].uri }}
                  style={{ width: '100%', aspectRatio: 16 / 9 }}
                  contentFit="cover"
                />
                {media[0].type === 'video' && (
                  <View className="absolute inset-0 items-center justify-center">
                    <View className="h-16 w-16 items-center justify-center rounded-full border-2 border-white bg-white/20">
                      <Play
                        color={colors['grey-plain']['50']}
                        size={24}
                        fill={colors['grey-plain']['50']}
                      />
                    </View>
                  </View>
                )}
              </View>
            ) : (
              <View className="flex-row flex-wrap gap-1">
                {media.slice(0, 4).map((item, index) => (
                  <View
                    key={item.id}
                    className={`${
                      media.length === 2
                        ? 'w-[calc(50%-4px)]'
                        : media.length === 3 && index === 0
                          ? 'w-[calc(50%-4px)]'
                          : 'w-[calc(33.333%-3px)]'
                    } aspect-square overflow-hidden rounded-lg`}
                  >
                    <Image
                      source={{ uri: item.uri }}
                      style={{ width: '100%', height: '100%' }}
                      contentFit="cover"
                    />
                    {item.type === 'video' && (
                      <View className="absolute inset-0 items-center justify-center bg-black/20">
                        <View className="h-10 w-10 items-center justify-center rounded-full border border-white bg-white/30">
                          <Play
                            color={colors['grey-plain']['50']}
                            size={16}
                            fill={colors['grey-plain']['50']}
                          />
                        </View>
                      </View>
                    )}
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        {/* With Users */}
        {withUsers && withUsers.length > 0 && (
          <View className="mb-3">
            <Text className="text-[13px] text-grey-plain-550">
              With:{' '}
              {withUsers.map((user, index) => (
                <Text key={index}>
                  <Text style={{ color: colors.primary.purple }}>@{user}</Text>
                  {index < withUsers.length - 1 && ', '}
                </Text>
              ))}
            </Text>
          </View>
        )}

        {/* Lift Progress Card */}
        {lift && (
          <View className="mb-4">
            <LiftProgressCard
              title={lift.title}
              currentAmount={lift.currentAmount}
              targetAmount={lift.targetAmount}
              onOfferLift={() => {
                // TODO: Handle offer lift action
                console.log('Offer lift');
              }}
            />
          </View>
        )}

        {/* Engagement */}
        <View className="flex-row items-center gap-4">
          <TouchableOpacity
            className="flex-row items-center gap-1"
            onPress={() => {
              // TODO: Handle like action
            }}
          >
            <Heart color={colors['grey-plain']['550']} size={20} />
            <Text className="text-sm text-grey-plain-550">{likes}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-row items-center gap-1"
            onPress={() => {
              if (id) {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                openComments(id);
              }
            }}
          >
            <MessageCircleMore color={colors['grey-plain']['550']} size={20} />
            <Text className="text-sm text-grey-plain-550">{comments}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-row items-center gap-1"
            onPress={() => {
              // TODO: Handle repost action
            }}
          >
            <Repeat2 color={colors['grey-plain']['550']} size={20} />
            <Text className="text-sm text-grey-plain-550">{reposts}</Text>
          </TouchableOpacity>
          <View className="flex-1" />
          <TouchableOpacity
            className="flex-row items-center gap-1"
            onPress={() => {
              // TODO: Handle bookmark action
            }}
          >
            <Bookmark color={colors['grey-plain']['550']} size={20} />
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-row items-center gap-1"
            onPress={() => {
              // TODO: Handle share action
            }}
          >
            <Share2 color={colors['grey-plain']['550']} size={20} />
          </TouchableOpacity>
        </View>
      </View>
    </Pressable>
  );
}
