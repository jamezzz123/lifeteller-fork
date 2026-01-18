import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import {
  CornerUpLeft,
  EllipsisVertical,
  Image as ImageIcon,
  SmilePlus,
  AtSign,
} from 'lucide-react-native';
import { colors } from '@/theme/colors';
import { LiftDetailContent } from '@/components/lift/LiftDetailContent';
import { LiftDetailComments } from '@/components/lift/LiftDetailComments';
import { LiftDetailBottomBar } from '@/components/lift/LiftDetailBottomBar';
import { Button } from '@/components/ui/Button';
import { useKeyboard } from '@/lib/hooks/useKeyboard';

// Mock data - in production, this would come from an API
const mockPosts: Record<string, any> = {
  '1': {
    id: '1',
    userId: 'user-1',
    username: 'Isaac Tolulope',
    handle: 'dareytemy',
    timestamp: '10 seconds ago',
    profileImage: 'https://i.pravatar.cc/150?img=12',
    otherUsersCount: 5,
    content:
      'Today, I visited the orphanage home at Yaba, Lagos. I went there with @xyz and @abc. We had a joyful moment with the children of the @fgh orphanage. Check out #CommunityService #GivingBack https://lifteller.com/help',
    likes: 56,
    comments: 12,
    reposts: 12,
    type: 'text',
  },
  '2': {
    id: '2',
    userId: 'user-2',
    username: 'Sarah Johnson',
    handle: 'sarahj',
    timestamp: '15 minutes ago',
    profileImage: 'https://i.pravatar.cc/150?img=5',
    otherUsersCount: 3,
    content: 'Just completed an amazing community service project! 🌟',
    media: [
      {
        id: 'media-1',
        type: 'image' as const,
        uri: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800',
      },
    ],
    likes: 89,
    comments: 23,
    reposts: 15,
    withUsers: ['fgh', 'xyz', 'abc'],
    type: 'media',
  },
  '3': {
    id: '3',
    userId: 'user-3',
    username: 'Emma Williams',
    handle: 'emmaw',
    timestamp: '2 hours ago',
    profileImage: 'https://i.pravatar.cc/150?img=20',
    content: 'Amazing day with the team!',
    media: [
      {
        id: 'media-2',
        type: 'image' as const,
        uri: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800',
      },
      {
        id: 'media-3',
        type: 'image' as const,
        uri: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800',
      },
      {
        id: 'media-4',
        type: 'image' as const,
        uri: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800',
      },
      {
        id: 'media-5',
        type: 'image' as const,
        uri: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800',
      },
      {
        id: 'media-6',
        type: 'image' as const,
        uri: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800',
      },
    ],
    likes: 124,
    comments: 34,
    reposts: 28,
    type: 'media',
  },
  '4': {
    id: '4',
    userId: 'user-1',
    username: 'Isaac Tolulope',
    handle: 'dareytemy',
    timestamp: '10 seconds ago',
    profileImage: 'https://i.pravatar.cc/150?img=12',
    content:
      'Today, I visited the orphanage home at Yaba, Lagos. I went there with @xyz and @abc. We had a joyful moment with the children of the @fgh orphanage and geared towards what the future will hold...',
    lift: {
      title: 'John Medical Expenses',
      currentAmount: 420000,
      targetAmount: 500000,
      category: 'Financial Aid',
      timeRemaining: '23 days left',
      location: 'Ikeja, Lagos',
    },
    likes: 56,
    comments: 12,
    reposts: 12,
    type: 'lift',
    media: [
      {
        id: 'media-lift-1',
        type: 'image' as const,
        uri: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800',
      },
      {
        id: 'media-lift-2',
        type: 'image' as const,
        uri: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800',
      },
      {
        id: 'media-lift-3',
        type: 'image' as const,
        uri: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800',
      },
    ],
  },
};

export default function LiftDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [commentText, setCommentText] = useState('');
  const { isKeyboardVisible } = useKeyboard();
  const post = mockPosts[id || '1'];

  if (!post) {
    return (
      <SafeAreaView className="flex-1 bg-grey-plain-50">
        <View className="flex-1 items-center justify-center">
          <Text className="text-grey-plain-550">Post not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const title = post.lift?.title || 'Post';
  const hasBottomBar = post.type === 'lift' && post.lift;
  const commentInputHeight = 60 + insets.bottom;

  return (
    <SafeAreaView className="flex-1 bg-grey-plain-50" edges={['top']}>
      {/* Header */}
      <View className="flex-row items-center justify-between border-b border-grey-plain-150 bg-white px-4 py-3">
        <View className="flex-row items-center gap-3">
          <TouchableOpacity onPress={() => router.back()}>
            <CornerUpLeft color={colors['grey-plain']['550']} size={24} />
          </TouchableOpacity>
          <Text className="text-lg font-inter-semibold text-grey-alpha-500">
            {title}
          </Text>
        </View>
        <TouchableOpacity>
          <EllipsisVertical color={colors['grey-plain']['550']} size={24} />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        className="flex-1"
        behavior="padding"
        keyboardVerticalOffset={0}
        enabled={isKeyboardVisible}
      >
        {/* Content */}
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: hasBottomBar ? 180 : commentInputHeight,
          }}
          keyboardShouldPersistTaps="handled"
        >
          <LiftDetailContent post={post} />
          {!hasBottomBar && <LiftDetailComments postId={post.id} />}
        </ScrollView>

        {/* Bottom Action Bar (for Lift posts) */}
        {hasBottomBar && <LiftDetailBottomBar lift={post.lift} />}

        {/* Fixed Comment Input - Only show for non-lift posts */}
        {!hasBottomBar && (
          <View
            className="border-t border-grey-plain-150 bg-white px-4"
            style={{
              paddingTop: isKeyboardVisible ? 8 : 12,
              paddingBottom: isKeyboardVisible
                ? 8
                : Math.max(insets.bottom, 12),
            }}
          >
            <View className="flex-row items-center gap-3">
              <View className="h-10 w-10 overflow-hidden rounded-full bg-grey-plain-300">
                <Image
                  source={{ uri: 'https://i.pravatar.cc/150?img=12' }}
                  style={{ width: 40, height: 40 }}
                  contentFit="cover"
                />
              </View>
              <View className="flex-1 rounded-full border border-grey-plain-300 bg-grey-plain-50 px-4">
                <TextInput
                  placeholder="Add a comment..."
                  placeholderTextColor={colors['grey-plain']['550']}
                  value={commentText}
                  onChangeText={setCommentText}
                  className="text-[14px] text-grey-alpha-500"
                  style={{
                    paddingVertical: 8,
                    textAlignVertical: 'center',
                    minHeight: 40,
                  }}
                  multiline={false}
                />
              </View>
            </View>

            {/* Icons and Comment Button - Only show when keyboard is visible */}
            {isKeyboardVisible && (
              <View className="mt-2 flex-row items-center justify-between">
                <View className="flex-row items-center gap-4">
                  <TouchableOpacity
                    onPress={() => {
                      // TODO: Handle image picker
                      console.log('Add image');
                    }}
                    activeOpacity={0.7}
                  >
                    <ImageIcon
                      color={colors['grey-plain']['550']}
                      size={24}
                      strokeWidth={1.5}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      // TODO: Handle emoji picker
                      console.log('Add emoji');
                    }}
                    activeOpacity={0.7}
                  >
                    <SmilePlus
                      color={colors['grey-plain']['550']}
                      size={24}
                      strokeWidth={1.5}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      // TODO: Handle mention
                      console.log('Add mention');
                    }}
                    activeOpacity={0.7}
                  >
                    <AtSign
                      color={colors['grey-plain']['550']}
                      size={24}
                      strokeWidth={1.5}
                    />
                  </TouchableOpacity>
                </View>
                <Button
                  title="Comment"
                  onPress={() => {
                    // TODO: Handle comment submission
                    console.log('Post comment:', commentText);
                    setCommentText('');
                  }}
                  variant="primary"
                  size="small"
                  disabled={!commentText.trim()}
                  className="px-6"
                />
              </View>
            )}
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
