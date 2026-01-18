import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { CornerUpLeft, EllipsisVertical } from 'lucide-react-native';
import { FeedPost } from '@/components/feed/FeedPost';
import { ActionMenu } from '@/components/ui/ActionMenu';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { colors } from '@/theme/colors';

type FilterType = 'all' | 'posts' | 'lifts';

const mockHiddenPosts = [
  {
    id: '1',
    username: 'Isaac Tolulope',
    handle: 'dareytemy',
    timestamp: '10 seconds ago',
    content:
      'Today, I visited the orphanage home at Yaba, Lagos. I went there with @xyz and @abc. We had a joyful moment with the children of the @fgh orphanage and geared towards what the future will hold... see more',
    profileImage:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    likes: 56,
    comments: 12,
    reposts: 12,
  },
  {
    id: '2',
    username: 'Isaac Tolulope',
    handle: 'dareytemy',
    timestamp: '15 minutes ago',
    content:
      'Today, I visited the orphanage home at Yaba, Lagos. I went there with @xyz and @abc. We had a joyful moment with the children of the @fgh orphanage and geared towards what the future will hold... see more',
    profileImage:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    otherUsersCount: 5,
    lift: {
      title: 'John Medical Expenses',
      currentAmount: 50000,
      targetAmount: 100000,
    },
    withUsers: ['@fgh', '@xyz', '@xyz', '@xyz', '@xyz'],
    likes: 56,
    comments: 12,
    reposts: 12,
  },
];

export default function HiddenPostsScreen() {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [showMenu, setShowMenu] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const filters: { id: FilterType; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'posts', label: 'Posts' },
    { id: 'lifts', label: 'Lifts' },
  ];

  const filteredPosts = mockHiddenPosts.filter((post) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'posts') return !post.lift;
    if (activeFilter === 'lifts') return !!post.lift;
    return true;
  });

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'bottom']}>
      {/* Header */}
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
            Hidden posts
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

      {/* Filter Buttons */}
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

      {/* Posts List */}
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
          />
        ))}
      </ScrollView>

      {/* Action Menu */}
      <ActionMenu
        visible={showMenu}
        options={[
          {
            label: 'Unhide all hidden posts',
            onPress: () => {
              setShowConfirmDialog(true);
            },
          },
        ]}
        onClose={() => setShowMenu(false)}
      />

      {/* Confirmation Dialog */}
      <ConfirmDialog
        visible={showConfirmDialog}
        title="Unhide all post"
        message="Are you sure you want to unhide all hidden posts?"
        confirmText="Yes, unhide"
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
