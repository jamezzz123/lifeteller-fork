import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import {
  CornerUpLeft,
  EllipsisVertical,
  Check,
  Pen,
  Trash2,
} from 'lucide-react-native';
import { FeedPost } from '@/components/feed/FeedPost';
import { ActionMenu } from '@/components/ui/ActionMenu';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import {
  BottomSheetComponent,
  BottomSheetRef,
} from '@/components/ui/BottomSheet';
import { colors } from '@/theme/colors';

type FilterType = 'all' | 'posts' | 'lifts';

interface ScheduledPost {
  id: string;
  username: string;
  handle: string;
  timestamp: string;
  content: string;
  profileImage?: string;
  otherUsersCount?: number;
  withUsers?: string[];
  lift?: {
    title: string;
    currentAmount: number;
    targetAmount: number;
  };
  likes: number;
  comments: number;
  reposts: number;
}

const mockScheduledPosts: ScheduledPost[] = [
  {
    id: 's1',
    username: 'Amaka Johnson',
    handle: 'amakaj',
    timestamp: 'Scheduled • Tomorrow, 9:00 AM',
    content: 'Excited to share this update about our community drive...',
    profileImage:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    likes: 12,
    comments: 1,
    reposts: 0,
  },
  {
    id: 's2',
    username: 'Chidi Okoro',
    handle: 'chidok',
    timestamp: 'Scheduled • Dec 25, 2025 • 6:00 PM',
    content: 'Preparing something special for the holidays — stay tuned!',
    profileImage:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    lift: {
      title: 'Medical Support',
      currentAmount: 2000,
      targetAmount: 10000,
    },
    likes: 3,
    comments: 0,
    reposts: 0,
  },
];

export default function ScheduledPostsScreen() {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteAllDialog, setShowDeleteAllDialog] = useState(false);
  const [showPostAllDialog, setShowPostAllDialog] = useState(false);

  const [selectedPost, setSelectedPost] = useState<ScheduledPost | null>(null);
  const [showPostNowDialog, setShowPostNowDialog] = useState(false);
  const [showDeletePostDialog, setShowDeletePostDialog] = useState(false);

  const sheetRef = useRef<BottomSheetRef>(null);

  const filters: { id: FilterType; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'posts', label: 'Posts' },
    { id: 'lifts', label: 'Lifts' },
  ];

  const filteredPosts = mockScheduledPosts.filter((post) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'posts') return !post.lift;
    if (activeFilter === 'lifts') return !!post.lift;
    return true;
  });

  function openPostOptions(post: ScheduledPost) {
    setSelectedPost(post);
    sheetRef.current?.expand();
  }

  function closeSheet() {
    setSelectedPost(null);
    sheetRef.current?.close();
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'bottom']}>
      <View className="flex-row items-center justify-between border-b border-grey-plain-150 bg-white px-4 py-3">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.back()} className="mr-3">
            <CornerUpLeft
              color={colors['grey-plain']['550']}
              size={24}
              strokeWidth={2}
            />
          </TouchableOpacity>
          <Text className="text-lg font-semibold text-grey-alpha-500">
            Scheduled posts
          </Text>
        </View>
        <TouchableOpacity onPress={() => setShowMenu(true)} activeOpacity={0.7}>
          <EllipsisVertical
            color={colors['grey-plain']['550']}
            size={24}
            strokeWidth={2}
          />
        </TouchableOpacity>
      </View>

      <View className="border-b border-grey-plain-150 bg-white px-4 py-3">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8 }}
        >
          {filters.map((filter) => {
            const isActive = activeFilter === filter.id;
            return (
              <TouchableOpacity
                key={filter.id}
                style={[
                  styles.filterButton,
                  isActive
                    ? styles.filterButtonActive
                    : styles.filterButtonInactive,
                ]}
                onPress={() => setActiveFilter(filter.id)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.filterText,
                    isActive
                      ? styles.filterTextActive
                      : styles.filterTextInactive,
                  ]}
                >
                  {filter.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        {filteredPosts.map((post) => (
          <FeedPost
            key={post.id}
            id={post.id}
            username={post.username}
            handle={post.handle}
            timestamp={post.timestamp}
            content={post.content}
            profileImage={post.profileImage}
            otherUsersCount={post.otherUsersCount}
            lift={post.lift}
            likes={post.likes}
            comments={post.comments}
            reposts={post.reposts}
            withUsers={post.withUsers}
            onMenuPress={() => openPostOptions(post)}
          />
        ))}
      </ScrollView>

      <ActionMenu
        visible={showMenu}
        options={[
          {
            label: 'Post all scheduled posts',
            onPress: () => {
              setShowPostAllDialog(true);
            },
            icon: <Check size={18} color={colors.primary.purple} />,
          },
          {
            label: 'Delete all scheduled posts',
            onPress: () => {
              setShowDeleteAllDialog(true);
            },
            destructive: true,
            icon: <Trash2 size={18} color={colors.state.red} />,
          },
        ]}
        onClose={() => setShowMenu(false)}
      />

      <BottomSheetComponent ref={sheetRef} onClose={() => closeSheet()}>
        <View className="px-6">
          <TouchableOpacity
            onPress={() => {
              sheetRef.current?.close();
              setShowPostNowDialog(true);
            }}
            className="flex-row items-center justify-between border-b border-grey-plain-300 py-3"
          >
            <View className="flex-row items-center">
              <Check size={18} color={colors.primary.purple} />
              <View style={{ marginLeft: 12 }}>
                <Text className="text-base font-semibold text-grey-alpha-550">
                  Post now
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              sheetRef.current?.close();
              if (selectedPost) router.push(`/offer-lift-profile`);
            }}
            className="flex-row items-center justify-between border-b border-grey-plain-300 py-3"
          >
            <View className="flex-row items-center">
              <Pen size={18} color={colors['grey-alpha']['400']} />
              <View style={{ marginLeft: 12 }}>
                <Text className="text-base font-semibold text-grey-alpha-550">
                  Edit post
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              sheetRef.current?.close();
              setShowDeletePostDialog(true);
            }}
            className="flex-row items-center justify-between py-3"
          >
            <View className="flex-row items-center">
              <Trash2 size={18} color={colors.state.red} />
              <View style={{ marginLeft: 12 }}>
                <Text
                  className="text-base font-semibold text-grey-alpha-550"
                  style={{ color: colors.state.red }}
                >
                  Delete post
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </BottomSheetComponent>

      <ConfirmDialog
        visible={showDeleteAllDialog}
        title="Delete all scheduled posts"
        message="Are you sure you want to delete all scheduled posts?"
        confirmText="Yes, delete all"
        cancelText="No"
        destructive
        onConfirm={() => {
          // TODO: Delete all scheduled posts
          console.log('Deleting all scheduled posts');
          setShowDeleteAllDialog(false);
          setShowMenu(false);
          router.back();
        }}
        onCancel={() => setShowDeleteAllDialog(false)}
        cancelTextColor={colors.primary.purple}
      />

      <ConfirmDialog
        visible={showPostAllDialog}
        title="Post now"
        message="Are you sure you make this post live?"
        confirmText="Yes, post all"
        cancelText="No"
        onConfirm={() => {
          // TODO: Post all scheduled posts
          console.log('Posting all scheduled posts');
          setShowPostAllDialog(false);
          setShowMenu(false);
          router.back();
        }}
        onCancel={() => setShowPostAllDialog(false)}
        cancelTextColor={colors.primary.purple}
      />

      <ConfirmDialog
        visible={showPostNowDialog}
        title="Post now"
        message="Are you sure you make this post live?"
        confirmText="Yes, post"
        cancelText="No"
        onConfirm={() => {
          // TODO: Post the selected post
          console.log('Posting selected post', selectedPost?.id);
          setShowPostNowDialog(false);
          setSelectedPost(null);
        }}
        onCancel={() => {
          setShowPostNowDialog(false);
          setSelectedPost(null);
        }}
        cancelTextColor={colors.primary.purple}
      />

      <ConfirmDialog
        visible={showDeletePostDialog}
        title="Delete post"
        message="Are you sure you want to delete this scheduled post?"
        confirmText="Yes, delete"
        cancelText="No"
        destructive
        onConfirm={() => {
          // TODO: Delete selected post
          console.log('Deleting post', selectedPost?.id);
          setShowDeletePostDialog(false);
          setSelectedPost(null);
        }}
        onCancel={() => {
          setShowDeletePostDialog(false);
          setSelectedPost(null);
        }}
        cancelTextColor={colors.primary.purple}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterButtonActive: {
    backgroundColor: colors['primary-tints'].purple['100'],
    borderColor: colors.primary.purple,
  },
  filterButtonInactive: {
    backgroundColor: colors['grey-plain']['50'],
    borderColor: colors['grey-plain']['300'],
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
  },
  filterTextActive: {
    color: colors.primary.purple,
  },
  filterTextInactive: {
    color: colors['grey-alpha']['500'],
  },
});
