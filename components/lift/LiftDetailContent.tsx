import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import {
  Heart,
  MessageCircleMore,
  Repeat2,
  Bookmark,
  Share2,
  BadgeCheck,
  Medal,
  ClockFading,
  ArrowRight,
  Tag,
} from 'lucide-react-native';
import { colors } from '@/theme/colors';
import { MediaCarousel } from './MediaCarousel';
import { MinimalLiftCard } from './MinimalLiftCard';
import { ProfileStack } from '@/components/ui/ProfileStack';
import { formatAmount } from '@/utils/formatAmount';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';

interface MediaItem {
  id: string;
  type: 'image' | 'video';
  uri: string;
}

interface LiftData {
  title: string;
  currentAmount: number;
  targetAmount: number;
  category?: string;
  timeRemaining?: string;
  location?: string;
}

interface Post {
  id: string;
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
  type?: 'text' | 'media' | 'lift';
}

interface LiftDetailContentProps {
  post: Post;
}

// Parse text and style mentions, hashtags, and links
function parseTextWithStyling(text: string) {
  const parts: { text: string; style: 'normal' | 'primary' }[] = [];
  const regex = /(@\w+|#\w+|https?:\/\/[^\s]+)/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({
        text: text.substring(lastIndex, match.index),
        style: 'normal',
      });
    }
    parts.push({
      text: match[0],
      style: 'primary',
    });
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push({
      text: text.substring(lastIndex),
      style: 'normal',
    });
  }

  return parts.length > 0 ? parts : [{ text, style: 'normal' as const }];
}

export function LiftDetailContent({ post }: LiftDetailContentProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const textParts = parseTextWithStyling(post.content);
  const shouldTruncate = post.content.length > 200 && !isExpanded;
  const displayText = shouldTruncate
    ? post.content.substring(0, 200) + '...'
    : post.content;
  const displayParts = shouldTruncate
    ? parseTextWithStyling(displayText)
    : textParts;

  return (
    <View className="bg-grey-plain-50">
      {/* Author Header */}
      <View className="border-b border-grey-plain-150 bg-white px-4 pb-2 pt-4">
        <View className="mb-1 flex-row items-start justify-between">
          <View className="flex-1 flex-row items-center gap-3">
            {/* Profile Picture with Badge */}
            <TouchableOpacity
              onPress={() => {
                if (post.userId) {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  router.push(`/user/${post.userId}` as any);
                }
              }}
              disabled={!post.userId}
              activeOpacity={post.userId ? 0.7 : 1}
            >
              <View className="relative h-12 w-12">
                <View className="h-12 w-12 overflow-hidden rounded-full bg-grey-plain-300">
                  {post.profileImage ? (
                    <Image
                      source={{ uri: post.profileImage }}
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
            <TouchableOpacity
              className="flex-1"
              onPress={() => {
                if (post.userId) {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  router.push(`/user/${post.userId}` as any);
                }
              }}
              disabled={!post.userId}
              activeOpacity={post.userId ? 0.7 : 1}
            >
              <View className="mb-0.5 flex-row items-center gap-1.5">
                <Text className="text-[15px] font-inter-semibold text-grey-alpha-500">
                  {post.username}
                </Text>
                <BadgeCheck color={colors.primary.purple} size={16} />
                {post.otherUsersCount !== undefined &&
                  post.otherUsersCount > 0 && (
                    <Text className="text-[13px] text-grey-plain-550">
                      and{' '}
                      <Text className="font-inter-semibold">
                        +{post.otherUsersCount}
                      </Text>{' '}
                      others
                    </Text>
                  )}
              </View>
              <View className="flex-row items-center gap-1">
                <Text className="text-[13px] text-grey-plain-550">
                  @{post.handle}
                </Text>
                <View className="h-1 w-1 rounded-full bg-grey-plain-550" />
                <Text className="text-[13px] text-grey-plain-550">
                  {post.timestamp}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Media Carousel (for media and lift posts) */}
      {post.media && post.media.length > 0 && (
        <View className="bg-white">
          <MediaCarousel media={post.media} />
        </View>
      )}

      {/* Lift Metadata (for lift posts) */}
      {post.type === 'lift' && post.lift && (
        <View className="border-b border-grey-plain-150 bg-white px-4 py-3">
          <View className="mb-2 flex-row flex-wrap items-center justify-between gap-3">
            {post.lift.category && (
              <View className="bg-primary-purple/10 flex-row items-center gap-1.5 rounded-full py-1.5 pr-3">
                <Tag color={colors.primary.purple} size={14} />
                <Text className="text-primary-purple text-[13px] font-inter-medium">
                  {post.lift.category}
                </Text>
              </View>
            )}
            {post.lift.timeRemaining && (
              <View className="flex-row items-center gap-1.5">
                <ClockFading color={colors['grey-plain']['550']} size={14} />
                <Text className="text-[13px] text-grey-plain-550">
                  {post.lift.timeRemaining}
                </Text>
              </View>
            )}
          </View>
        </View>
      )}

      {/* Content */}
      <View className="border-b border-grey-plain-150 bg-white px-4 py-4">
        {post.lift && post.lift.location && (
          <View className="mb-2 flex-row items-center gap-1.5">
            <Text className="text-[13px] text-grey-plain-550">
              {post.lift.location}
            </Text>
          </View>
        )}

        {post.lift && (
          <Text className="mb-3 text-xl font-inter-bold text-grey-alpha-500">
            {post.lift.title}
          </Text>
        )}
        {post.content && (
          <View className="mb-2">
            <Text
              className="text-[15px] text-grey-alpha-500"
              style={{ lineHeight: 22 }}
            >
              {displayParts.map((part, index) => (
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
            {shouldTruncate && (
              <TouchableOpacity
                onPress={() => setIsExpanded(true)}
                className="mt-1"
              >
                <Text className="text-primary-purple text-[15px] font-inter-medium">
                  see more
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* With Users */}
        {post.withUsers && post.withUsers.length > 0 && (
          <View className="mb-3">
            <Text className="text-[13px] text-grey-plain-550">
              With:{' '}
              {post.withUsers.map((user, index) => (
                <Text key={index}>
                  <Text style={{ color: colors.primary.purple }}>@{user}</Text>
                  {index < post.withUsers!.length - 1 && ', '}
                </Text>
              ))}
            </Text>
          </View>
        )}

        {/* Minimal Lift Card */}
        {post.lift && (
          <MinimalLiftCard
            currentAmount={post.lift.currentAmount}
            targetAmount={post.lift.targetAmount}
          />
        )}

        {/* Engagement Bar */}
        <View className="flex-row items-center gap-4">
          <TouchableOpacity className="flex-row items-center gap-1">
            <Heart color={colors['grey-plain']['550']} size={20} />
            <Text className="text-sm text-grey-plain-550">
              {post.likes || 0}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-row items-center gap-1">
            <MessageCircleMore color={colors['grey-plain']['550']} size={20} />
            <Text className="text-sm text-grey-plain-550">
              {post.comments || 0}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-row items-center gap-1">
            <Repeat2 color={colors['grey-plain']['550']} size={20} />
            <Text className="text-sm text-grey-plain-550">
              {post.reposts || 0}
            </Text>
          </TouchableOpacity>
          <View className="flex-1" />
          <TouchableOpacity className="flex-row items-center gap-1">
            <Bookmark color={colors['grey-plain']['550']} size={20} />
          </TouchableOpacity>
          <TouchableOpacity className="flex-row items-center gap-1">
            <Share2 color={colors['grey-plain']['550']} size={20} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Lifted By Summary (for lift posts) */}
      {post.type === 'lift' && (
        <TouchableOpacity className="flex-row items-center justify-between border border-grey-plain-300 bg-grey-plain-50 p-3">
          <View className="flex-row items-center gap-2">
            <ProfileStack
              profiles={[
                'https://i.pravatar.cc/150?img=12',
                'https://i.pravatar.cc/150?img=5',
                'https://i.pravatar.cc/150?img=20',
              ]}
              maxVisible={3}
              size={32}
              overlap={16}
            />
            <Text className="text-[13px] text-grey-plain-550">
              Lifted by <Text className="font-inter-semibold">Seyi Makinde</Text> and{' '}
              <Text className="font-inter-semibold">15 others</Text>
            </Text>
          </View>
          <ArrowRight color={colors.primary.purple} size={16} />
        </TouchableOpacity>
      )}

      {/* Raised by Section */}
      {post.type === 'lift' && (
        <View className="border-t border-grey-plain-150 bg-white px-4 py-4">
          {/* Header */}
          <Text className="mb-4 text-xs font-inter-medium uppercase tracking-wider text-grey-plain-550">
            RAISED BY
          </Text>

          {/* User Profile */}
          <View className="mb-4">
            <TouchableOpacity
              className="mb-3 flex-row items-start gap-3"
              onPress={() => {
                if (post.userId) {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  router.push(`/user/${post.userId}` as any);
                }
              }}
              disabled={!post.userId}
              activeOpacity={post.userId ? 0.7 : 1}
            >
              {/* Profile Picture with Badge */}
              <View className="relative h-12 w-12">
                <View className="h-12 w-12 overflow-hidden rounded-full bg-grey-plain-300">
                  {post.profileImage ? (
                    <Image
                      source={{ uri: post.profileImage }}
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

              {/* User Info */}
              <View className="flex-1 justify-center">
                <View className="mb-0.5 flex-row items-center gap-1.5">
                  <Text className="text-[15px] font-inter-semibold text-grey-alpha-500">
                    {post.username}
                  </Text>
                  <BadgeCheck color={colors.primary.purple} size={16} />
                </View>
                <View className="mb-2 flex-row items-center gap-1">
                  <Text className="text-[13px] text-grey-plain-550">
                    @{post.handle}
                  </Text>
                  <View className="h-1 w-1 rounded-full bg-grey-plain-550" />
                  <Text className="text-[13px] text-grey-plain-550">
                    {post.timestamp}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>

            <View className="mb-6">
              <Text className="mb-2 text-[14px] text-grey-alpha-500">
                Healthy Philanthropist. Changing lives, one at a time.
              </Text>
              <View className="flex-row items-center gap-1.5">
                <Medal color={colors.primary.purple} size={14} />
                <Text className="text-[14px] font-inter-semibold text-grey-alpha-500">
                  Lift Captain
                </Text>
              </View>
            </View>

            {/* Metrics Cards */}
            <View className="mb-4 flex-row gap-3">
              <View className="flex-1 rounded-lg bg-grey-plain-150 px-1 py-1">
                <Text className="mb-1 px-2 text-xs text-grey-plain-550">
                  Total Lifts
                </Text>
                <Text className="rounded bg-white px-2 py-1 text-2xl font-inter-bold text-grey-alpha-500">
                  24
                </Text>
              </View>
              <View className="flex-1 rounded-lg bg-grey-plain-150 px-1 py-1">
                <Text className="mb-1 px-2 text-xs text-grey-plain-550">
                  Total Lift Raised
                </Text>
                <Text className="rounded bg-white px-2 py-1 text-2xl font-inter-bold text-grey-alpha-500">
                  24
                </Text>
              </View>
            </View>

            {/* Following/Followers */}
            <View className="mb-3">
              <Text className="text-[12px] text-grey-alpha-500">
                <Text>1,324 Following</Text>
                <Text className="font-inter-semibold"> 48.2k Followers</Text>
              </Text>
            </View>

            {/* Followed By */}
            <View className="flex-row items-center gap-3 pr-4">
              <ProfileStack
                profiles={[
                  'https://i.pravatar.cc/150?img=12',
                  'https://i.pravatar.cc/150?img=5',
                  'https://i.pravatar.cc/150?img=20',
                ]}
                maxVisible={3}
                size={32}
                overlap={16}
              />
              <Text className="flex-1 text-[13px] text-grey-plain-550">
                Followed by <Text className="font-inter-semibold">dareytemy</Text>,{' '}
                <Text className="font-inter-semibold">donJazzy</Text>,{' '}
                <Text className="font-inter-semibold">Olamibest</Text>, and{' '}
                <Text className="font-inter-semibold">21 others</Text>
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Lifted By Section */}
      {post.type === 'lift' && (
        <View className="border-t border-grey-plain-150 bg-white px-4 py-4">
          {/* Header */}
          <View className="mb-4 flex-row items-center justify-between">
            <Text className="text-xs font-inter-semibold uppercase tracking-wider text-grey-alpha-500">
              LIFTED BY <Text className="font-inter">(12)</Text>
            </Text>
            <TouchableOpacity>
              <Text className="text-[13px] font-inter-medium text-primary">
                See more
              </Text>
            </TouchableOpacity>
          </View>

          {/* Contributors List */}
          <View>
            {[
              {
                id: '1',
                username: 'Isaac Tolulope',
                handle: 'dareytemy',
                timestamp: '10 seconds ago',
                profileImage: 'https://i.pravatar.cc/150?img=12',
                amount: 5000,
              },
              {
                id: '2',
                username: 'Isaac Tolulope',
                handle: 'dareytemy',
                timestamp: '10 seconds ago',
                profileImage: 'https://i.pravatar.cc/150?img=5',
                amount: 5000,
              },
              {
                id: '3',
                username: 'Isaac Tolulope',
                handle: 'dareytemy',
                timestamp: '10 seconds ago',
                profileImage: 'https://i.pravatar.cc/150?img=20',
                amount: 5000,
              },
              {
                id: '4',
                username: 'Isaac Tolulope',
                handle: 'dareytemy',
                timestamp: '10 seconds ago',
                profileImage: 'https://i.pravatar.cc/150?img=12',
                amount: 5000,
              },
              {
                id: '5',
                username: 'Isaac Tolulope',
                handle: 'dareytemy',
                timestamp: '10 seconds ago',
                profileImage: 'https://i.pravatar.cc/150?img=5',
                amount: 5000,
              },
            ].map((contributor, index) => {
              const formattedAmount = formatAmount(contributor.amount);

              return (
                <View
                  key={contributor.id}
                  className={`flex-row items-center gap-3 py-4 ${
                    index < 4 ? 'border-b border-grey-plain-150' : ''
                  }`}
                >
                  <TouchableOpacity
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      router.push(`/user/${contributor.id}` as any);
                    }}
                    activeOpacity={0.7}
                    className="flex-1 flex-row items-center gap-3"
                  >
                    {/* Profile Picture with Badge */}
                    <View className="relative h-10 w-10">
                      <View className="h-10 w-10 overflow-hidden rounded-full bg-grey-plain-300">
                        <Image
                          source={{ uri: contributor.profileImage }}
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: 20,
                          }}
                          contentFit="cover"
                        />
                      </View>
                      {/* Badge Overlay */}
                      <View
                        className="absolute -bottom-0.5 right-0 h-4 w-4 items-center justify-center rounded-full border-2 border-white"
                        style={{
                          backgroundColor:
                            colors['primary-tints'].purple['100'],
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Medal
                          color={colors.primary.purple}
                          size={10}
                          style={{ alignSelf: 'center' }}
                        />
                      </View>
                    </View>

                    {/* User Info */}
                    <View className="flex-1">
                      <View className="mb-0.5 flex-row items-center gap-1.5">
                        <Text className="text-[14px] font-inter-semibold text-grey-alpha-500">
                          {contributor.username}
                        </Text>
                        <BadgeCheck color={colors.primary.purple} size={14} />
                      </View>
                      <View className="flex-row items-center gap-1">
                        <Text className="text-[12px] text-grey-plain-550">
                          @{contributor.handle}
                        </Text>
                        <View className="h-1 w-1 rounded-full bg-grey-plain-550" />
                        <Text className="text-[12px] text-grey-plain-550">
                          {contributor.timestamp}
                        </Text>
                      </View>
                    </View>

                    {/* Amount */}
                    <View className="rounded-full bg-grey-plain-150 px-3 py-1.5">
                      <Text className="text-[14px] font-inter-semibold text-grey-alpha-500">
                        {formattedAmount}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        </View>
      )}
    </View>
  );
}
