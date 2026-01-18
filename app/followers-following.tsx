import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import {
  EllipsisVertical,
  CornerUpLeft,
  BadgeCheck,
  Users,
} from 'lucide-react-native';
import { colors } from '@/theme/colors';
import { TabView, TabBar, Route } from 'react-native-tab-view';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';

const { width } = Dimensions.get('window');

interface UserListItem {
  id: string;
  name: string;
  username: string;
  profileImage?: string;
  isVerified: boolean;
  isFollowing: boolean;
  followsYou: boolean;
}

interface UserListItemProps {
  user: UserListItem;
  onFollowPress: (userId: string) => void;
}

function UserListItemComponent({ user, onFollowPress }: UserListItemProps) {
  const handleProfilePress = () => {
    router.push(`/user/${user.id}` as any);
  };

  return (
    <TouchableOpacity
      className="flex-row items-center border-b border-grey-plain-150 px-4 py-3"
      onPress={handleProfilePress}
      activeOpacity={0.7}
    >
      {/* Profile Picture with Badge */}
      <View className="mr-3">
        <Avatar
          profileImage={user.profileImage}
          name={user.name}
          size={48}
          showBadge={true}
          userId={user.id}
        />
      </View>

      {/* User Info */}
      <View className="flex-1">
        <View className="mb-0.5 flex-row items-center gap-1.5">
          <Text className="text-[15px] font-inter-semibold text-grey-alpha-500">
            {user.name}
          </Text>
          {user.isVerified && (
            <BadgeCheck color={colors.primary.purple} size={16} />
          )}
        </View>
        <Text className="text-[13px] text-grey-plain-550">
          @{user.username}
        </Text>
      </View>

      {/* Follow Button */}
      <View onStartShouldSetResponder={() => true}>
        <Button
          title={user.isFollowing ? 'Following' : 'Follow back'}
          onPress={() => onFollowPress(user.id)}
          variant={user.isFollowing ? 'outline' : 'primary'}
          size="small"
          className="rounded-full"
        />
      </View>
    </TouchableOpacity>
  );
}

function FollowingTab({
  users,
  onFollowPress,
}: {
  users: UserListItem[];
  onFollowPress: (userId: string) => void;
}) {
  // Separate users who follow you
  const followsYouUsers = users.filter((u) => u.followsYou);
  const otherUsers = users.filter((u) => !u.followsYou);

  const renderItem = ({ item }: { item: UserListItem }) => (
    <UserListItemComponent user={item} onFollowPress={onFollowPress} />
  );

  return (
    <FlatList
      data={[...followsYouUsers, ...otherUsers]}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={
        followsYouUsers.length > 0 ? (
          <View className="border-b border-grey-plain-150 bg-grey-plain-50 px-4 py-2">
            <View className="flex-row items-center gap-2">
              <Users
                color={colors['grey-plain']['550']}
                size={16}
                strokeWidth={2}
              />
              <Text className="text-sm font-inter-semibold text-grey-alpha-500">
                Follows you
              </Text>
            </View>
          </View>
        ) : null
      }
      showsVerticalScrollIndicator={false}
    />
  );
}

function FollowersTab({
  users,
  onFollowPress,
}: {
  users: UserListItem[];
  onFollowPress: (userId: string) => void;
}) {
  // Separate users who follow you
  const followsYouUsers = users.filter((u) => u.followsYou);
  const otherUsers = users.filter((u) => !u.followsYou);

  const renderItem = ({ item }: { item: UserListItem }) => (
    <UserListItemComponent user={item} onFollowPress={onFollowPress} />
  );

  return (
    <FlatList
      data={[...followsYouUsers, ...otherUsers]}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={
        followsYouUsers.length > 0 ? (
          <View className="border-b border-grey-plain-150 bg-grey-plain-50 px-4 py-2">
            <View className="flex-row items-center gap-2">
              <Users
                color={colors['grey-plain']['550']}
                size={16}
                strokeWidth={2}
              />
              <Text className="text-sm font-inter-semibold text-grey-alpha-500">
                Follows you
              </Text>
            </View>
          </View>
        ) : null
      }
      showsVerticalScrollIndicator={false}
    />
  );
}

export default function FollowersFollowingScreen() {
  const { userName = 'Isaac Tolulope', initialTab = 'following' } =
    useLocalSearchParams<{
      userName?: string;
      initialTab?: 'following' | 'followers';
    }>();

  const [index, setIndex] = useState(initialTab === 'followers' ? 1 : 0);
  const [routes] = useState([
    { key: 'following', title: 'Following' },
    { key: 'followers', title: 'Followers' },
  ]);

  // Placeholder data - replace with actual data from API/hooks
  const followingUsers: UserListItem[] = Array.from({ length: 10 }, (_, i) => ({
    id: `following-${i + 1}`,
    name: 'Isaac Tolulope',
    username: 'dareytemy',
    profileImage:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    isVerified: true,
    isFollowing: true,
    followsYou: i < 3, // First 3 follow you back
  }));

  const followersUsers: UserListItem[] = Array.from({ length: 15 }, (_, i) => ({
    id: `follower-${i + 1}`,
    name: 'Isaac Tolulope',
    username: 'dareytemy',
    profileImage:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    isVerified: true,
    isFollowing: i > 0, // First one is not following (shows "Follow back")
    followsYou: i < 6, // First 6 follow you
  }));

  const handleFollowPress = (userId: string) => {
    // Toggle follow status
    console.log('Toggle follow for user:', userId);
  };

  const renderScene = ({ route }: { route: Route }) => {
    switch (route.key) {
      case 'following':
        return (
          <FollowingTab
            users={followingUsers}
            onFollowPress={handleFollowPress}
          />
        );
      case 'followers':
        return (
          <FollowersTab
            users={followersUsers}
            onFollowPress={handleFollowPress}
          />
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'bottom']}>
      {/* Header */}
      <View className="flex-row items-center justify-between border-b border-grey-plain-150 bg-white px-4 py-3">
        <View className="flex-row items-center gap-3">
          <TouchableOpacity onPress={() => router.back()}>
            <CornerUpLeft
              color={colors['grey-plain']['550']}
              size={24}
              strokeWidth={2}
            />
          </TouchableOpacity>
          <Text className="text-lg font-inter-semibold text-grey-alpha-500">
            {userName}
          </Text>
        </View>
        <TouchableOpacity>
          <EllipsisVertical
            color={colors['grey-plain']['550']}
            size={24}
            strokeWidth={2}
          />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width }}
        renderTabBar={(props) => (
          <View>
            <TabBar
              {...props}
              indicatorStyle={{
                backgroundColor: colors.primary.purple,
                height: 2,
              }}
              style={{
                backgroundColor: 'white',
                borderBottomWidth: 1,
                borderBottomColor: colors['grey-plain']['150'],
              }}
              activeColor={colors.primary.purple}
              inactiveColor={colors['grey-plain']['550']}
              tabStyle={{ width: 'auto', paddingHorizontal: 12 }}
              // @ts-ignore - renderLabel is a valid prop in react-native-tab-view
              renderLabel={({
                route,
                focused,
              }: {
                route: Route;
                focused: boolean;
              }) => (
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: '600',
                    color: focused
                      ? colors.primary.purple
                      : colors['grey-plain']['550'],
                  }}
                >
                  {route.title}
                </Text>
              )}
            />
            {/* Count Display */}
            <View className="border-b border-grey-plain-150 bg-white px-4 py-2">
              <Text className="text-sm text-grey-alpha-500">
                {index === 0
                  ? `${followingUsers.length.toLocaleString()} Following`
                  : `${followersUsers.length.toLocaleString()} Followers`}
              </Text>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}
