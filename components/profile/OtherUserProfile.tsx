import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TabView, TabBar, Route } from 'react-native-tab-view';
import { router } from 'expo-router';
import { Image } from 'expo-image';
import {
  CornerUpLeft,
  Search,
  Bell,
  EllipsisVertical,
  Share2,
  MessagesSquare,
  BadgeCheck,
  Medal,
  ArrowUpRight,
  UserCircle,
  SquareMousePointer,
  CalendarHeart,
  Info,
  Play,
} from 'lucide-react-native';
import { colors } from '@/theme/colors';
import { FeedPost } from '@/components/feed/FeedPost';
import { BottomSheetRef } from '@/components/ui/BottomSheet';
import { MoreOptionsBottomSheet } from './MoreOptionsBottomSheet';
import { ShareProfileBottomSheet } from './ShareProfileBottomSheet';
import { InterestChip } from '@/components/ui/InterestChip';
import { Button } from '@/components/ui/Button';
import { BlockUserConfirmationModal } from './BlockUserConfirmationModal';
import LifterBadge from '@/assets/images/badges/lifter.svg';
import LiftCaptainBadge from '@/assets/images/badges/lift-captain.svg';
import LiftChampionBadge from '@/assets/images/badges/lift-champion.svg';
import GoldenLifterBadge from '@/assets/images/badges/golden-lifter.svg';

const { width } = Dimensions.get('window');

interface OtherUser {
  id: string;
  fullName: string;
  handle: string;
  profileImage?: string;
  bio?: string;
  followersCount?: number;
  followingCount?: number;
  liftsCount?: number;
  postsCount?: number;
  isVerified?: boolean;
  followsYou?: boolean;
  isFollowing?: boolean;
  badge?: string;
  interests?: string[];
  dateOfBirth?: string;
  dateJoined?: string;
  dateVerified?: string;
}

interface OtherUserProfileProps {
  user: OtherUser;
}

// Placeholder tab content components
function PostsTab({ user }: { user: OtherUser }) {
  return (
    <ScrollView
      className="flex-1 bg-grey-plain-50"
      showsVerticalScrollIndicator={false}
    >
      <FeedPost
        id="profile-post-1"
        userId={user.id}
        username={user.fullName}
        handle={user.handle}
        timestamp="10 seconds ago"
        content="Today, I visited the orphanage home at Yaba, Lagos. I went there with @xyz and @abc. We had a joyful moment with the children of the @fgh orphanage and geared towards what the future will hold... see more"
        likes={56}
        comments={12}
        reposts={12}
      />
      <FeedPost
        id="profile-post-2"
        userId={user.id}
        username={user.fullName}
        handle={user.handle}
        timestamp="1 hour ago"
        content="Today, I visited the orphanage home at Yaba, Lagos. I went there with @xyz and @abc. We had a joyful moment with the children. #hashtag1 #hashtag2 #hashtag3"
        likes={56}
        comments={12}
        reposts={12}
      />
    </ScrollView>
  );
}

function PhotosTab() {
  const unsplashImageIds = [
    '1507003211169-0a1dd7228f2d',
    '1492562080023-4713a9a30c24',
    '1500648767791-00dcc994a43e',
    '1506794778202-cad84cf45f1d',
    '1502823403499-6ccfcf4fb453',
    '1539571691757-3988c6b0c0c0',
    '1544005313-94ddf0286d2b',
    '1534528741775-53994a69daeb',
    '1529626455594-4ff0802cfb9e',
    '1506794778202-cad84cf45f1d',
    '1500648767791-00dcc994a43e',
    '1492562080023-4713a9a30c24',
  ];

  const shuffledIds = [...unsplashImageIds].sort(() => Math.random() - 0.5);

  const photos = Array.from({ length: 12 }, (_, i) => ({
    id: `photo-${i + 1}`,
    uri: `https://images.unsplash.com/photo-${shuffledIds[i]}?w=400&h=400&fit=crop`,
  }));

  const GAP = 2;
  const IMAGE_SIZE = (width - GAP * 2) / 3;

  return (
    <ScrollView
      className="flex-1 bg-grey-plain-50"
      showsVerticalScrollIndicator={true}
      contentContainerStyle={{ paddingBottom: 16 }}
    >
      <View
        className="flex-row flex-wrap"
        style={{
          paddingTop: 2,
        }}
      >
        {photos.map((photo, index) => (
          <Pressable
            key={photo.id}
            style={{
              width: IMAGE_SIZE,
              height: IMAGE_SIZE,
              marginRight: index % 3 !== 2 ? GAP : 0,
              marginBottom: GAP,
            }}
            className="overflow-hidden bg-grey-plain-300"
          >
            <Image
              source={{ uri: photo.uri }}
              style={{ width: '100%', height: '100%' }}
              contentFit="cover"
              transition={200}
            />
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}

function LiftClipsTab() {
  const unsplashImageIds = [
    '1507003211169-0a1dd7228f2d',
    '1492562080023-4713a9a30c24',
    '1500648767791-00dcc994a43e',
    '1506794778202-cad84cf45f1d',
    '1502823403499-6ccfcf4fb453',
    '1539571691757-3988c6b0c0c0',
    '1544005313-94ddf0286d2b',
    '1534528741775-53994a69daeb',
    '1529626455594-4ff0802cfb9e',
  ];

  const shuffledIds = [...unsplashImageIds].sort(() => Math.random() - 0.5);

  const clips = Array.from({ length: 9 }, (_, i) => ({
    id: `clip-${i + 1}`,
    thumbnailUri: `https://images.unsplash.com/photo-${shuffledIds[i]}?w=400&h=400&fit=crop`,
    duration: Math.floor(Math.random() * 120) + 15,
  }));

  const GAP = 2;
  const CLIP_SIZE = (width - GAP) / 2;

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <ScrollView
      className="flex-1 bg-grey-plain-50"
      showsVerticalScrollIndicator={true}
      contentContainerStyle={{ paddingBottom: 16 }}
    >
      <View
        className="flex-row flex-wrap"
        style={{
          paddingTop: 2,
        }}
      >
        {clips.map((clip, index) => (
          <Pressable
            key={clip.id}
            style={{
              width: CLIP_SIZE,
              height: CLIP_SIZE,
              marginRight: index % 2 !== 1 ? GAP : 0,
              marginBottom: GAP,
            }}
            className="relative overflow-hidden bg-grey-plain-300"
          >
            <Image
              source={{ uri: clip.thumbnailUri }}
              style={{ width: '100%', height: '100%' }}
              contentFit="cover"
              transition={200}
            />
            <View className="absolute inset-0 items-center justify-center bg-black/20">
              <View className="h-12 w-12 items-center justify-center rounded-full border-2 border-white bg-white/30">
                <Play
                  color={colors['grey-plain']['50']}
                  size={24}
                  fill={colors['grey-plain']['50']}
                />
              </View>
            </View>
            {clip.duration && (
              <View
                className="absolute bottom-1 right-1 rounded px-1.5 py-0.5"
                style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.7)',
                }}
              >
                <Text className="text-[10px] font-semibold text-white">
                  {formatDuration(clip.duration)}
                </Text>
              </View>
            )}
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}

interface SectionHeaderProps {
  icon: React.ReactNode;
  title: string;
  showInfo?: boolean;
  onInfoPress?: () => void;
}

function SectionHeader({
  icon,
  title,
  showInfo = false,
  onInfoPress,
}: SectionHeaderProps) {
  return (
    <View className="mb-3 flex-row items-center justify-between">
      <View className="flex-row items-center gap-2">
        {icon}
        <Text className="text-sm font-semibold text-grey-alpha-500">
          {title}
        </Text>
      </View>
      {showInfo && (
        <TouchableOpacity onPress={onInfoPress} className="p-1">
          <Info color={colors['grey-plain']['550']} size={16} />
        </TouchableOpacity>
      )}
    </View>
  );
}

function AboutTab({ user }: { user: OtherUser }) {
  // Determine current badge based on points or badge name
  const getBadgeData = () => {
    const pointsEarned = 427; // Default, should come from user data
    const badgeName = user.badge || 'Lifter';

    // Map badge names to components
    const badgeMap: Record<
      string,
      {
        component: React.ComponentType<any>;
        nextBadge: string;
        nextComponent: React.ComponentType<any>;
      }
    > = {
      Lifter: {
        component: LifterBadge,
        nextBadge: 'Lift Captain',
        nextComponent: LiftCaptainBadge,
      },
      'Lift Captain': {
        component: LiftCaptainBadge,
        nextBadge: 'Lift Champion',
        nextComponent: LiftChampionBadge,
      },
      'Lift Champion': {
        component: LiftChampionBadge,
        nextBadge: 'Golden Lifter',
        nextComponent: GoldenLifterBadge,
      },
      'Golden Lifter': {
        component: GoldenLifterBadge,
        nextBadge: 'Golden Lifter',
        nextComponent: GoldenLifterBadge,
      },
    };

    const current = badgeMap[badgeName] || badgeMap['Lifter'];

    return {
      pointsEarned,
      currentBadge: {
        name: badgeName,
        component: current.component,
      },
      nextBadge: {
        name: current.nextBadge,
        component: current.nextComponent,
      },
      progress: 60, // Default progress percentage
      pointsToGo: 50, // Default points to next badge
    };
  };

  const badgeData = getBadgeData();

  const aboutData = {
    bio: user.bio || 'Lazy Philanthropist. Touching lives one by one.',
    badges: badgeData,
    interests: user.interests || [
      'Religion-based',
      'Education',
      'Faith',
      'Healthcare and Medical',
      'Family',
    ],
    dateOfBirth: user.dateOfBirth || '12th December, 2005',
    dateJoined: user.dateJoined || '12/12/2021 • 10:09pm',
    dateVerified: user.dateVerified || '12/12/2021 • 10:09pm',
  };

  return (
    <ScrollView
      className="flex-1 bg-grey-plain-50"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 16 }}
    >
      {/* Tagline/Bio Section */}
      <View
        className="mx-4 mt-4 rounded-xl p-4"
        style={{ backgroundColor: '#FAFBFC' }}
      >
        <SectionHeader
          icon={<UserCircle color={colors['grey-alpha']['500']} size={18} />}
          title="Tagline/bio"
        />
        <View className="mt-3 border-t border-grey-plain-300 pt-3">
          <Text className="text-sm leading-5 text-grey-alpha-500">
            {aboutData.bio}
          </Text>
        </View>
      </View>

      {/* Badges Section */}
      <View
        className="mx-4 mt-4 rounded-xl p-4"
        style={{ backgroundColor: '#FAFBFC' }}
      >
        <SectionHeader
          icon={
            <Medal
              color={colors['grey-alpha']['500']}
              size={18}
              strokeWidth={2}
            />
          }
          title="Badges"
        />
        <View className="mt-3 border-t border-grey-plain-300 pt-3">
          {/* Current Badge */}
          <View className="items-center">
            <Text className="mb-2 text-xs font-medium text-grey-plain-550">
              Current
            </Text>
            <View className="mb-2 h-20 w-20 items-center justify-center">
              {React.createElement(aboutData.badges.currentBadge.component, {
                width: 80,
                height: 80,
              })}
            </View>
            <Text className="text-xs font-medium text-grey-alpha-500">
              {aboutData.badges.currentBadge.name}
            </Text>
          </View>
        </View>
      </View>

      {/* Interests Section */}
      <View
        className="mx-4 mt-4 rounded-xl p-4"
        style={{ backgroundColor: '#FAFBFC' }}
      >
        <SectionHeader
          icon={
            <SquareMousePointer color={colors['grey-alpha']['500']} size={18} />
          }
          title="Interests"
        />
        <View className="mt-3 border-t border-grey-plain-300 pt-3">
          <View className="flex-row flex-wrap gap-2">
            {aboutData.interests.map((interest, index) => (
              <InterestChip key={index} label={interest} selected />
            ))}
          </View>
        </View>
      </View>

      {/* Date of Birth Section */}
      <View
        className="mx-4 mt-4 rounded-xl p-4"
        style={{ backgroundColor: '#FAFBFC' }}
      >
        <SectionHeader
          icon={<CalendarHeart color={colors['grey-alpha']['500']} size={18} />}
          title="Date of birth"
          showInfo
        />
        <View className="mt-3 border-t border-grey-plain-300 pt-3">
          <Text className="text-sm text-grey-alpha-500">
            {aboutData.dateOfBirth}
          </Text>
        </View>
      </View>

      {/* Other Details Section */}
      <View
        className="mx-4 mt-4 rounded-xl p-4"
        style={{ backgroundColor: '#FAFBFC' }}
      >
        <SectionHeader
          icon={<CalendarHeart color={colors['grey-alpha']['500']} size={18} />}
          title="Other details"
        />
        <View className="mt-3 border-t border-grey-plain-300 pt-3">
          <View className="mb-2 flex-row items-center justify-between">
            <Text className="text-sm text-grey-alpha-500">Date joined:</Text>
            <Text className="text-sm text-grey-alpha-500">
              {aboutData.dateJoined}
            </Text>
          </View>
          <View className="flex-row items-center justify-between">
            <Text className="text-sm text-grey-alpha-500">Date verified:</Text>
            <Text className="text-sm text-grey-alpha-500">
              {aboutData.dateVerified}
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

export function OtherUserProfile({ user }: OtherUserProfileProps) {
  const [index, setIndex] = useState(0);
  const moreOptionsSheetRef = useRef<BottomSheetRef>(null);
  const shareProfileSheetRef = useRef<BottomSheetRef>(null);
  const [isFollowing, setIsFollowing] = useState(user.isFollowing || false);
  const [showBlockConfirmation, setShowBlockConfirmation] = useState(false);
  const [routes] = useState([
    { key: 'posts', title: 'Posts' },
    { key: 'photos', title: 'Photos' },
    { key: 'liftClips', title: 'Lift clips' },
    { key: 'about', title: 'About' },
  ]);

  const renderScene = ({ route }: { route: Route }) => {
    switch (route.key) {
      case 'posts':
        return <PostsTab user={user} />;
      case 'photos':
        return <PhotosTab />;
      case 'liftClips':
        return <LiftClipsTab />;
      case 'about':
        return <AboutTab user={user} />;
      default:
        return null;
    }
  };

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    // TODO: Implement follow/unfollow functionality
  };

  const handleRequestLift = () => {
    router.push({
      pathname: '/request-lift',
      params: { recipientId: user.id, recipientName: user.fullName },
    } as any);
  };

  const handleOfferLift = () => {
    router.push({
      pathname: '/offer-lift',
      params: { recipientId: user.id, recipientName: user.fullName },
    } as any);
  };

  const handleBlockUser = () => {
    setShowBlockConfirmation(true);
  };

  const handleConfirmBlock = () => {
    // TODO: Implement block user functionality
    console.log('Block user:', user.id);
    setShowBlockConfirmation(false);
    router.back();
  };

  const handleCancelBlock = () => {
    setShowBlockConfirmation(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-grey-plain-50" edges={['top']}>
      {/* Scrollable Content */}
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Profile Header Section */}
        <View className="border-b border-grey-plain-150 bg-white">
          {/* Navigation Bar */}
          <View className="flex-row items-center justify-between border-b border-grey-plain-150 px-4 py-3">
            <View className="flex-row items-center gap-3">
              <TouchableOpacity onPress={() => router.back()}>
                <CornerUpLeft color={colors['grey-plain']['550']} size={24} />
              </TouchableOpacity>
              <Text className="text-lg font-semibold text-grey-alpha-500">
                {user.fullName}
              </Text>
            </View>
            <View className="flex-row items-center gap-4">
              <TouchableOpacity>
                <Search color={colors['grey-alpha']['500']} size={24} />
              </TouchableOpacity>
              <TouchableOpacity>
                <Bell color={colors['grey-alpha']['500']} size={24} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => moreOptionsSheetRef.current?.expand()}
              >
                <EllipsisVertical
                  color={colors['grey-alpha']['500']}
                  size={24}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* User Info */}
          <View className="px-4 pb-4 pt-6">
            <View className="mb-4">
              <View className="mb-3 flex-row items-start">
                {/* Profile Picture */}
                <View className="relative mr-4">
                  <View className="h-24 w-24 overflow-hidden rounded-full bg-grey-plain-300">
                    {user.profileImage ? (
                      <Image
                        source={{ uri: user.profileImage }}
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
                          {user.badge || 'Lift Captain'}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>

                {/* Action Icons */}
                <View className="ml-auto flex-row gap-3">
                  <TouchableOpacity
                    className="p-1.5"
                    onPress={() => shareProfileSheetRef.current?.expand()}
                  >
                    <Share2 color={colors['grey-alpha']['500']} size={22} />
                  </TouchableOpacity>
                  <TouchableOpacity className="p-1.5">
                    <MessagesSquare
                      color={colors['grey-alpha']['500']}
                      size={22}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Follows You Indicator */}
              {user.followsYou && (
                <View className="mb-2">
                  <Text className="text-sm text-grey-plain-550">
                    Follows you
                  </Text>
                </View>
              )}

              {/* Bio */}
              {user.bio && (
                <Text className="mb-4 text-sm text-grey-plain-550">
                  {user.bio}
                </Text>
              )}

              {/* Action Buttons */}
              <View className="mb-4 flex-row items-center gap-3">
                <Button
                  title="Request lift"
                  onPress={handleRequestLift}
                  variant="outline"
                  size="medium"
                />
                <Button
                  title="Offer lift"
                  onPress={handleOfferLift}
                  variant="outline"
                  size="medium"
                />
                <Button
                  title={isFollowing ? 'Following' : 'Follow'}
                  onPress={handleFollow}
                  variant="primary"
                  size="medium"
                  className="flex-1"
                />
              </View>
            </View>

            {/* Stats */}
            <View className="flex-row gap-3">
              {/* Lifts Card */}
              <View className="relative flex-1 rounded-xl border border-grey-plain-300 bg-grey-plain-50 p-4">
                <Text className="mb-1 text-2xl font-bold text-grey-alpha-500">
                  {(user.liftsCount || 0).toLocaleString()}
                </Text>
                <Text className="text-xs font-medium text-grey-plain-550">
                  Lifts
                </Text>
              </View>

              {/* Following Card */}
              <TouchableOpacity
                className="relative flex-1 rounded-xl border border-grey-plain-300 bg-grey-plain-50 p-4"
                onPress={() =>
                  router.push({
                    pathname: '/followers-following',
                    params: {
                      userName: user.fullName,
                      userId: user.id,
                      initialTab: 'following',
                    },
                  })
                }
                activeOpacity={0.7}
              >
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
              <TouchableOpacity
                className="relative flex-1 rounded-xl border border-grey-plain-300 bg-grey-plain-50 p-4"
                onPress={() =>
                  router.push({
                    pathname: '/followers-following',
                    params: {
                      userName: user.fullName,
                      userId: user.id,
                      initialTab: 'followers',
                    },
                  })
                }
                activeOpacity={0.7}
              >
                <View className="absolute right-2.5 top-2.5">
                  <ArrowUpRight
                    color={colors['grey-plain']['550']}
                    size={14}
                    strokeWidth={2.5}
                  />
                </View>
                <Text className="mb-1 text-2xl font-bold text-grey-alpha-500">
                  {(user.followersCount || 0).toLocaleString()}
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

      {/* More Options Bottom Sheet */}
      <MoreOptionsBottomSheet
        ref={moreOptionsSheetRef}
        userId={user.id}
        username={user.handle || user.fullName}
        isFollowing={isFollowing}
        onUnfollow={() => setIsFollowing(false)}
        onBlockUser={handleBlockUser}
        onShareProfile={() => shareProfileSheetRef.current?.expand()}
        onSharedActivities={() => {
          router.push({
            pathname: '/shared-activities/[userId]',
            params: {
              userId: user.id,
              username: user.handle || user.fullName,
              fullName: user.fullName,
              profileImage: user.profileImage,
              isVerified: user.isVerified ? 'true' : 'false',
              followsYou: user.followsYou ? 'true' : 'false',
            },
          } as any);
        }}
      />

      {/* Block User Confirmation Modal */}
      <BlockUserConfirmationModal
        visible={showBlockConfirmation}
        username={user.handle || user.fullName}
        onConfirm={handleConfirmBlock}
        onCancel={handleCancelBlock}
      />

      {/* Share Profile Bottom Sheet */}
      <ShareProfileBottomSheet
        ref={shareProfileSheetRef}
        username={user.handle || user.fullName}
        profileUrl={`https://lifteller.com/${user.handle || user.id}`}
      />
    </SafeAreaView>
  );
}
