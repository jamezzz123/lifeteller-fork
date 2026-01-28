import React, { useRef, useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import { Image } from 'expo-image';
import {
  Heart,
  MessageCircleMore,
  Repeat2,
  Ellipsis,
  BadgeCheck,
  Medal,
  ChevronDown,
  Image as ImageIcon,
  SmilePlus,
  AtSign,
} from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BottomSheet, {
  BottomSheetScrollView,
  BottomSheetBackdrop,
  BottomSheetHandleProps,
  BottomSheetBackdropProps,
  BottomSheetTextInput,
  BottomSheetFooter,
  BottomSheetFooterProps,
} from '@gorhom/bottom-sheet';
import { colors } from '@/theme/colors';
import { useCommentBottomSheet } from '@/context/comment-bottom-sheet';
import { useAuth } from '@/context/auth';
import { useKeyboard } from '@/lib/hooks/useKeyboard';
import { Button } from '@/components/ui/Button';
import * as Haptics from 'expo-haptics';

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

// Separate component to isolate keyboard and text state changes
interface CommentInputFooterProps {
  user: any;
  postId: string | null;
  bottomInset: number;
}

function CommentInputFooter({
  user,
  postId,
  bottomInset,
}: CommentInputFooterProps) {
  const { isKeyboardVisible, keyboardHeight } = useKeyboard();
  const [commentText, setCommentText] = useState('');

  function handleSendComment() {
    if (!commentText.trim()) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // TODO: Implement send comment API
    console.log('Send comment:', commentText, 'for post:', postId);
    setCommentText('');
  }

  // On Android, we need to manually add keyboard height as padding
  // Add extra 50px to account for the button row height
  const androidKeyboardPadding =
    Platform.OS === 'android' && isKeyboardVisible ? keyboardHeight + 50 : 0;

  return (
    <View
      className="border-t border-grey-plain-150 bg-grey-plain-50 px-4"
      style={{
        paddingTop: isKeyboardVisible ? 8 : 12,
        paddingBottom: isKeyboardVisible
          ? 8 + androidKeyboardPadding
          : 12 + bottomInset,
      }}
    >
      <View className="flex-row items-center gap-3">
        {/* User Avatar */}
        <View className="h-10 w-10 overflow-hidden rounded-full bg-grey-plain-300">
          {user?.profile_photo_url ? (
            <Image
              // source={{ uri: user.profile_photo_url }}
              source={{ uri: 'https://i.pravatar.cc/150?img=17' }}
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
        {/* Input */}
        <View className="flex-1 rounded-full border border-grey-plain-200 bg-grey-plain-100 px-4">
          <BottomSheetTextInput
            placeholder="Add a comment..."
            placeholderTextColor={colors['grey-plain']['450']}
            className="flex-1 text-[14px] text-grey-alpha-500"
            value={commentText}
            onChangeText={setCommentText}
            style={{
              paddingVertical: 8,
              minHeight: 40,
              maxHeight: 80,
            }}
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
            onPress={handleSendComment}
            variant="primary"
            size="small"
            disabled={!commentText.trim()}
            className="px-6"
          />
        </View>
      )}
    </View>
  );
}

// Mock comments data
const mockComments = [
  {
    id: '1',
    userId: 'user-1',
    username: 'Isaac Tolulope',
    handle: 'dareytemy',
    timestamp: '10 seconds ago',
    profileImage: 'https://i.pravatar.cc/150?img=12',
    content:
      'Today, I visited the orphanage home at Yaba, Lagos. I went there with @xyz and @abc. We had a joyful moment with the children. #hashtag1 #hashtag2 #hashtag3',
    likes: 56,
    replies: 12,
    reposts: 12,
  },
  {
    id: '2',
    userId: 'user-2',
    username: 'Isaac Tolulope',
    handle: 'dareytemy',
    timestamp: '10 seconds ago',
    profileImage: 'https://i.pravatar.cc/150?img=12',
    content:
      'Today, I visited the orphanage home at Yaba, Lagos. I went there with @xyz and @abc. We had a joyful moment with the children. #hashtag1 #hashtag2 #hashtag3',
    likes: 56,
    replies: 12,
    reposts: 12,
  },
  {
    id: '3',
    userId: 'user-3',
    username: 'Isaac Tolulope',
    handle: 'dareytemy',
    timestamp: '10 seconds ago',
    profileImage: 'https://i.pravatar.cc/150?img=12',
    content:
      'Today, I visited the orphanage home at Yaba, Lagos. I went there with @xyz and @abc. We had a joyful moment with the children. #hashtag1 #hashtag2 #hashtag3',
    likes: 56,
    replies: 12,
    reposts: 12,
  },
];

export function CommentBottomSheet() {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const { isOpen, postId, closeComments } = useCommentBottomSheet();
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const [sortBy, setSortBy] = useState<'most-relevant' | 'newest'>(
    'most-relevant'
  );

  useEffect(() => {
    if (isOpen) {
      bottomSheetRef.current?.expand();
    } else {
      bottomSheetRef.current?.close();
    }
  }, [isOpen]);

  function handleSheetChanges(index: number) {
    if (index === -1) {
      closeComments();
    }
  }

  function renderHandle(props: BottomSheetHandleProps) {
    return (
      <View className="w-full items-center py-3" {...props}>
        <View className="h-1 w-12 rounded-full bg-grey-plain-450" />
      </View>
    );
  }

  function renderBackdrop(props: BottomSheetBackdropProps) {
    return (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
      />
    );
  }

  const renderFooter = useCallback(
    (props: BottomSheetFooterProps) => (
      <BottomSheetFooter {...props} bottomInset={0}>
        <CommentInputFooter
          user={user}
          postId={postId}
          bottomInset={insets.bottom}
        />
      </BottomSheetFooter>
    ),
    [insets.bottom, user, postId]
  );

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={['75%', '95%']}
      enablePanDownToClose
      handleComponent={renderHandle}
      backdropComponent={renderBackdrop}
      backgroundStyle={{
        backgroundColor: colors['grey-plain']['50'],
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
      }}
      onChange={handleSheetChanges}
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      android_keyboardInputMode="adjustResize"
      footerComponent={renderFooter}
    >
      <View className="flex-1">
        {/* Sort Header */}
        <View className="border-b border-grey-plain-150 px-4 py-3">
          <TouchableOpacity
            className="flex-row items-center gap-2"
            onPress={() => {
              setSortBy(
                sortBy === 'most-relevant' ? 'newest' : 'most-relevant'
              );
            }}
          >
            <Text className="text-[15px] font-semibold text-grey-alpha-500">
              {sortBy === 'most-relevant' ? 'Most relevant' : 'Newest'}
            </Text>
            <ChevronDown color={colors['grey-plain']['550']} size={16} />
          </TouchableOpacity>
        </View>

        {/* Comments List */}
        <BottomSheetScrollView
          contentContainerStyle={{ paddingBottom: 80 + insets.bottom }}
        >
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
                    <TouchableOpacity activeOpacity={0.7}>
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
                            backgroundColor:
                              colors['primary-tints'].purple['100'],
                          }}
                        >
                          <Medal
                            color={colors.primary.purple}
                            size={10}
                            style={{ alignSelf: 'center' }}
                          />
                        </View>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity className="flex-1" activeOpacity={0.7}>
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
                    </TouchableOpacity>
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
        </BottomSheetScrollView>
      </View>
    </BottomSheet>
  );
}
