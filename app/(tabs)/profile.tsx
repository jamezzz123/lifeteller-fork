import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TabView, TabBar, Route } from 'react-native-tab-view';
import { Image } from 'expo-image';
import {
  Search,
  Settings,
  Pencil,
  Share2,
  BadgeCheck,
  Medal,
  ArrowUpRight,
  Plus,
} from 'lucide-react-native';
import { colors } from '@/theme/colors';
import { FeedPost } from '@/components/feed/FeedPost';
import { useUser, User } from '@/hooks/useUser';

const { width } = Dimensions.get('window');

// Placeholder tab content components
function PostsTab({ user }: { user: User }) {
  return (
    <ScrollView
      className="flex-1 bg-grey-plain-50"
      showsVerticalScrollIndicator={false}
    >
      <FeedPost
        username={user.fullName}
        handle={user.handle}
        timestamp="10 seconds ago"
        content="Today, I visited the orphanage home at Yaba, Lagos. I went there with @xyz and @abc. We had a joyful moment with the children of the @fgh orphanage and geared towards what the future will hold... see more"
        likes={56}
        comments={12}
        reposts={12}
      />
      <FeedPost
        username={user.fullName}
        handle={user.handle}
        timestamp="2 hours ago"
        content="Another amazing day helping the community! #LiftTogether #CommunityService"
        likes={234}
        comments={45}
        reposts={67}
      />
      <FeedPost
        username={user.fullName}
        handle={user.handle}
        timestamp="1 day ago"
        content="Grateful for everyone who supported our latest initiative 🙏"
        likes={892}
        comments={123}
        reposts={234}
      />
    </ScrollView>
  );
}

function LiftHistoryTab() {
  return (
    <View className="flex-1 items-center justify-center bg-grey-plain-50">
      <Text className="text-base text-grey-plain-550">Lift history</Text>
    </View>
  );
}

function PhotosTab() {
  return (
    <View className="flex-1 items-center justify-center bg-grey-plain-50">
      <Text className="text-base text-grey-plain-550">Photo</Text>
    </View>
  );
}

function LiftClipsTab() {
  return (
    <View className="flex-1 items-center justify-center bg-grey-plain-50">
      <Text className="text-base text-grey-plain-550">Lift clips</Text>
    </View>
  );
}

function AboutTab() {
  return (
    <View className="flex-1 items-center justify-center bg-grey-plain-50">
      <Text className="text-base text-grey-plain-550">About</Text>
    </View>
  );
}

export default function ProfileScreen() {
  const { user } = useUser();
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'posts', title: 'Posts' },
    { key: 'liftHistory', title: 'Lift history' },
    { key: 'photos', title: 'Photos' },
    { key: 'liftClips', title: 'Lift clips' },
    { key: 'about', title: 'About' },
  ]);

  const renderScene = ({ route }: { route: Route }) => {
    switch (route.key) {
      case 'posts':
        return <PostsTab user={user} />;
      case 'liftHistory':
        return <LiftHistoryTab />;
      case 'photos':
        return <PhotosTab />;
      case 'liftClips':
        return <LiftClipsTab />;
      case 'about':
        return <AboutTab />;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-grey-plain-50" edges={['top']}>
      {/* Fixed Header */}
      <View className="flex-row items-center justify-between border-b border-grey-plain-150 bg-white px-4 py-3">
        <Text className="text-2xl font-bold text-grey-alpha-500">Profile</Text>
        <View className="flex-row items-center gap-4">
          <TouchableOpacity>
            <Search color={colors['grey-alpha']['500']} size={24} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Settings color={colors['grey-alpha']['500']} size={24} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Scrollable Content */}
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Profile Header Section */}
        <View className="border-b border-grey-plain-150 bg-white">
          {/* User Info */}
          <View className="px-4 pb-4 pt-6">
            <View className="mb-4">
              <View className="mb-3 flex-row items-start">
                {/* Profile Picture */}
                <View className="relative mr-4">
                  <View className="h-24 w-24 overflow-hidden rounded-full bg-grey-plain-300">
                    {user.profileImage ? (
                      <Image
                        source={user.profileImage}
                        style={{ width: 96, height: 96 }}
                        contentFit="cover"
                      />
                    ) : (
                      <View className="bg-primary-tints-purple-100 h-full w-full items-center justify-center">
                        <Text
                          className="text-2xl font-bold"
                          style={{ color: colors.primary.purple }}
                        >
                          {user.fullName
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </Text>
                      </View>
                    )}
                  </View>
                  {/* Add Profile/Story Button */}
                  <TouchableOpacity
                    className="absolute -bottom-0.5 -right-0.5 h-7 w-7 items-center justify-center rounded-full border-2 border-white"
                    style={{
                      backgroundColor: colors['grey-plain']['50'],
                    }}
                  >
                    <Plus
                      color={colors['grey-alpha']['550']}
                      size={16}
                      strokeWidth={3}
                    />
                  </TouchableOpacity>
                </View>

                {/* User Details */}
                <View className="flex-1">
                  <View className="mb-1.5 flex-row items-center gap-2">
                    <Text className="text-xl font-bold text-grey-alpha-500">
                      {user.fullName}
                    </Text>
                    {user.isVerified && (
                      <BadgeCheck color={colors.primary.purple} size={20} />
                    )}
                  </View>
                  <View className="mb-2.5">
                    <Text className="mb-1.5 text-sm text-grey-plain-550">
                      @{user.handle}
                    </Text>
                    <View
                      className="self-start rounded-full px-2.5 py-1"
                      style={{
                        backgroundColor: colors['primary-tints'].purple['100'],
                      }}
                    >
                      <View className="flex-row items-center gap-1.5">
                        <Medal color={colors.primary.purple} size={12} />
                        <Text
                          className="text-xs font-semibold"
                          style={{ color: colors['grey-alpha']['550'] }}
                        >
                          Lift Captain
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>

                {/* Action Buttons */}
                <View className="ml-auto flex-row gap-3">
                  <TouchableOpacity className="p-1.5">
                    <Pencil
                      color={colors['grey-alpha']['500']}
                      size={22}
                      strokeWidth={2}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity className="p-1.5">
                    <Share2
                      color={colors['grey-alpha']['500']}
                      size={22}
                      strokeWidth={2}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Bio - Below avatar and user info */}
              {user.bio && (
                <Text className="text-sm text-grey-plain-550">{user.bio}</Text>
              )}
            </View>

            {/* Stats */}
            <View className="flex-row gap-3">
              {/* Lifts Card */}
              <TouchableOpacity className="relative flex-1 rounded-xl border border-grey-plain-300 bg-grey-plain-50 p-4">
                <Text className="mb-1 text-2xl font-bold text-grey-alpha-500">
                  {(user.liftsCount || 0).toLocaleString()}
                </Text>
                <Text className="text-xs font-medium text-grey-plain-550">
                  Lifts
                </Text>
              </TouchableOpacity>

              {/* Following Card */}
              <TouchableOpacity className="relative flex-1 rounded-xl border border-grey-plain-300 bg-grey-plain-50 p-4">
                <View className="absolute right-2.5 top-2.5">
                  <ArrowUpRight
                    color={colors['grey-plain']['550']}
                    size={14}
                    strokeWidth={2.5}
                  />
                </View>
                <Text className="mb-1 text-2xl font-bold text-grey-alpha-500">
                  {(user.followingCount || 0).toLocaleString()}
                </Text>
                <Text className="text-xs font-medium text-grey-plain-550">
                  Following
                </Text>
              </TouchableOpacity>

              {/* Followers Card */}
              <TouchableOpacity className="relative flex-1 rounded-xl border border-grey-plain-300 bg-grey-plain-50 p-4">
                <View className="absolute right-2.5 top-2.5">
                  <ArrowUpRight
                    color={colors['grey-plain']['550']}
                    size={14}
                    strokeWidth={2.5}
                  />
                </View>
                <Text className="mb-1 text-2xl font-bold text-grey-alpha-500">
                  {user.followersCount && user.followersCount >= 1000
                    ? `${(user.followersCount / 1000).toFixed(1)}k`
                    : (user.followersCount || 0).toLocaleString()}
                </Text>
                <Text className="text-xs font-medium text-grey-plain-550">
                  Followers
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Tab View - Swipeable */}
        <View style={{ height: Dimensions.get('window').height * 0.7 }}>
          <TabView
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={{ width }}
            renderTabBar={(props) => (
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
                scrollEnabled
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
            )}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
