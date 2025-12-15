import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import {
  Heart,
  MessageCircleMore,
  Repeat2,
  Ellipsis,
  BadgeCheck,
  Medal,
  ChevronDown,
} from 'lucide-react-native';
import { colors } from '@/theme/colors';

interface LiftDetailCommentsProps {
  postId: string;
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

// Mock comments data
const mockComments = [
  {
    id: '1',
    username: 'Isaac Tolulope',
    handle: 'dareytemy',
    timestamp: '10 seconds ago',
    profileImage: 'https://i.pravatar.cc/150?img=12',
    content:
      'This is amazing! I went there with @xyz and @abc. We had a joyful moment with the children. Check out #hashtag1 #hashtag2 #hashtag3',
    likes: 56,
    replies: 12,
    reposts: 12,
  },
  {
    id: '2',
    username: 'Isaac Tolulope',
    handle: 'dareytemy',
    timestamp: '10 seconds ago',
    profileImage: 'https://i.pravatar.cc/150?img=12',
    content:
      'This is amazing! I went there with @xyz and @abc. We had a joyful moment with the children. Check out #hashtag1 #hashtag2 #hashtag3',
    likes: 56,
    replies: 12,
    reposts: 12,
  },
  {
    id: '3',
    username: 'Isaac Tolulope',
    handle: 'dareytemy',
    timestamp: '10 seconds ago',
    profileImage: 'https://i.pravatar.cc/150?img=12',
    content:
      'This is amazing! I went there with @xyz and @abc. We had a joyful moment with the children. Check out #hashtag1 #hashtag2 #hashtag3',
    likes: 56,
    replies: 12,
    reposts: 12,
  },
];

export function LiftDetailComments({ postId }: LiftDetailCommentsProps) {
  const [sortBy, setSortBy] = useState<'most-relevant' | 'newest'>(
    'most-relevant'
  );

  return (
    <View className="bg-white">
      {/* Comments Header */}
      <View className="border-b border-grey-plain-150 px-4 py-3">
        <TouchableOpacity
          className="flex-row items-center gap-2"
          onPress={() => {
            setSortBy(sortBy === 'most-relevant' ? 'newest' : 'most-relevant');
          }}
        >
          <Text className="text-[15px] font-semibold text-grey-alpha-500">
            {sortBy === 'most-relevant' ? 'Most relevant' : 'Newest'}
          </Text>
          <ChevronDown color={colors['grey-plain']['550']} size={16} />
        </TouchableOpacity>
      </View>

      {/* Comments List */}
      <View>
        {mockComments.map((comment) => {
          const textParts = parseTextWithStyling(comment.content);
          return (
            <View
              key={comment.id}
              className="border-b border-grey-plain-150 px-4 py-4"
            >
              {/* Comment Header */}
              <View className="mb-2 flex-row items-start justify-between">
                <View className="flex-1 flex-row items-center gap-3">
                  {/* Profile Picture */}
                  <View className="relative h-10 w-10">
                    <View className="h-10 w-10 overflow-hidden rounded-full bg-grey-plain-300">
                      {comment.profileImage ? (
                        <Image
                          source={{ uri: comment.profileImage }}
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: 20,
                          }}
                          contentFit="cover"
                        />
                      ) : (
                        <View className="h-full w-full bg-grey-plain-450" />
                      )}
                    </View>
                    {/* Badge Overlay */}
                    <View
                      className="absolute -bottom-0.5 left-0 h-4 w-4 items-center justify-center rounded-full border-2 border-white"
                      style={{
                        backgroundColor: colors['primary-tints'].purple['100'],
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
                  <View className="flex-1">
                    <View className="mb-0.5 flex-row items-center gap-1.5">
                      <Text className="text-[14px] font-semibold text-grey-alpha-500">
                        {comment.username}
                      </Text>
                      <BadgeCheck color={colors.primary.purple} size={14} />
                    </View>
                    <View className="flex-row items-center gap-1">
                      <Text className="text-[12px] text-grey-plain-550">
                        @{comment.handle}
                      </Text>
                      <View className="h-1 w-1 rounded-full bg-grey-plain-550" />
                      <Text className="text-[12px] text-grey-plain-550">
                        {comment.timestamp}
                      </Text>
                    </View>
                  </View>
                </View>
                <TouchableOpacity className="p-1">
                  <Ellipsis color={colors['grey-plain']['550']} size={18} />
                </TouchableOpacity>
              </View>

              {/* Comment Content */}
              <View className="mb-3">
                <Text
                  className="text-[14px] text-grey-alpha-500"
                  style={{ lineHeight: 20 }}
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

              {/* Comment Engagement */}
              <View className="flex-row items-center gap-4">
                <TouchableOpacity className="flex-row items-center gap-1">
                  <Heart color={colors['grey-plain']['550']} size={18} />
                  <Text className="text-xs text-grey-plain-550">
                    {comment.likes}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity className="flex-row items-center gap-1">
                  <MessageCircleMore
                    color={colors['grey-plain']['550']}
                    size={18}
                  />
                  <Text className="text-xs text-grey-plain-550">
                    {comment.replies}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity className="flex-row items-center gap-1">
                  <Repeat2 color={colors['grey-plain']['550']} size={18} />
                  <Text className="text-xs text-grey-plain-550">
                    {comment.reposts}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}
