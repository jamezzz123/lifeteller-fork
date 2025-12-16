import React, { useState } from 'react';
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
  ChevronRight,
  UserCircle,
  SquareMousePointer,
  CalendarHeart,
  Info,
  Star,
} from 'lucide-react-native';
import { colors } from '@/theme/colors';
import { FeedPost } from '@/components/feed/FeedPost';
import { useUser, User } from '@/hooks/useUser';
import { formatCurrency } from '@/utils/formatAmount';
import { InfoBanner } from '@/components/ui/InfoBanner';
import { LiftProgressBar } from '@/components/ui/LiftProgressBar';
import { InterestChip } from '@/components/ui/InterestChip';
import LifterBadge from '@/assets/images/badges/lifter.svg';
import LiftCaptainBadge from '@/assets/images/badges/lift-captain.svg';

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

interface LiftHistoryCardProps {
  title: string;
  count: number;
  amount: number;
  onPress?: () => void;
}

function LiftHistoryCard({
  title,
  count,
  amount,
  onPress,
}: LiftHistoryCardProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="relative flex-1 rounded-xl bg-grey-plain-150 p-2"
      activeOpacity={0.7}
    >
      <View>
        {/* Title at the top */}
        <Text className="px-2 py-1 text-xs font-medium text-grey-plain-550">
          {title}
        </Text>
        <View className="flex-row items-center justify-between rounded-lg bg-white px-2 py-2">
          <View>
            {/* Large count number */}
            <Text className="text-2xl font-bold text-grey-alpha-550">
              {count.toLocaleString()}
            </Text>
            {/* Currency amount */}
            <Text className="text-base font-medium text-grey-alpha-450">
              {formatCurrency(amount)}
            </Text>
          </View>

          <ChevronRight
            color={colors['grey-plain']['550']}
            size={18}
            strokeWidth={2.5}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
}

function LiftHistoryTab() {
  // Placeholder data - replace with actual data from API/hooks
  const liftHistoryData = {
    totalLifts: { count: 24, amount: 2898000 },
    totalRaised: { count: 24, amount: 2898000 },
    totalOffered: { count: 24, amount: 2898000 },
    totalRequested: { count: 24, amount: 2898000 },
  };

  return (
    <ScrollView
      className="flex-1 bg-grey-plain-50"
      showsVerticalScrollIndicator={false}
    >
      {/* Informational Banner */}
      <InfoBanner message="Only you can see this information" />

      {/* Lift History Cards Grid */}
      <View className="px-4 py-4">
        <View className="mb-3 flex-row gap-3">
          <LiftHistoryCard
            title="Total Lifts"
            count={liftHistoryData.totalLifts.count}
            amount={liftHistoryData.totalLifts.amount}
            onPress={() => {
              // Navigate to detailed view
            }}
          />
          <LiftHistoryCard
            title="Total Lifts Raised"
            count={liftHistoryData.totalRaised.count}
            amount={liftHistoryData.totalRaised.amount}
            onPress={() => {
              // Navigate to detailed view
            }}
          />
        </View>
        <View className="flex-row gap-3">
          <LiftHistoryCard
            title="Total Lifts Offered"
            count={liftHistoryData.totalOffered.count}
            amount={liftHistoryData.totalOffered.amount}
            onPress={() => {
              // Navigate to detailed view
            }}
          />
          <LiftHistoryCard
            title="Total Lifts Requested"
            count={liftHistoryData.totalRequested.count}
            amount={liftHistoryData.totalRequested.amount}
            onPress={() => {
              // Navigate to detailed view
            }}
          />
        </View>
      </View>
    </ScrollView>
  );
}

function PhotosTab() {
  // Placeholder photo data - replace with actual data from API/hooks
  // Each photo should have: { id: string, uri: string }
  const unsplashImageIds = [
    '1507003211169-0a1dd7228f2d',
    '1492562080023-4713a9a30c24',
    '1500648767791-00dcc994a43e',
    '1506794778202-cad84cf45f1d',
    '1502823403499-6ccfcf4fb453',
    '1539571691757-3988c6b0c0c0',
    '1544005313-94ddf0286d2b',
    '1534528741775-53994a69daeb',
    '1529626455594-4ff0802cfb7e',
    '1506794778202-cad84cf45f1d',
    '1500648767791-00dcc994a43e',
    '1492562080023-4713a9a30c24',
  ];

  // Shuffle array for randomization
  const shuffledIds = [...unsplashImageIds].sort(() => Math.random() - 0.5);

  const photos = Array.from({ length: 12 }, (_, i) => ({
    id: `photo-${i + 1}`,
    uri: `https://images.unsplash.com/photo-${shuffledIds[i]}?w=400&h=400&fit=crop`,
  }));

  const { width } = Dimensions.get('window');
  const GAP = 2;
  const IMAGE_SIZE = (width - GAP * 2) / 3;

  const handlePhotoPress = (photoId: string) => {
    // Navigate to photo detail or full screen view
    console.log('Photo pressed:', photoId);
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
        {photos.map((photo, index) => (
          <Pressable
            key={photo.id}
            onPress={() => handlePhotoPress(photo.id)}
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
  return (
    <View className="flex-1 items-center justify-center bg-grey-plain-50">
      <Text className="text-base text-grey-plain-550">Lift clips</Text>
    </View>
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
          <Info color={colors['grey-plain']['550']} size={16} strokeWidth={2} />
        </TouchableOpacity>
      )}
    </View>
  );
}

function AboutTab() {
  // Placeholder data - replace with actual data from API/hooks
  const aboutData = {
    bio: 'Lazy Philanthropist. Touching lives one by one. This is who I am, this is what I am.',
    badges: {
      pointsEarned: 427,
      currentBadge: {
        name: 'Lifter',
        icon: Medal,
      },
      nextBadge: {
        name: 'Lift Captain',
        icon: Star,
      },
      progress: 60,
      pointsToGo: 50,
    },
    interests: [
      'Religion-based',
      'Education',
      'Faith',
      'Healthcare and Medical',
      'Family',
    ],
    dateOfBirth: '12th December, 2005',
    dateJoined: '12/12/2021 • 10:09pm',
    dateVerified: '12/12/2021 • 10:09pm',
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
          icon={
            <UserCircle
              color={colors['grey-alpha']['500']}
              size={18}
              strokeWidth={2}
            />
          }
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
          showInfo
        />
        <View className="mt-3 border-t border-grey-plain-300 pt-3">
          {/* Points and Leaderboard */}
          <View className="mb-8 flex-row items-center justify-between">
            <Text className="text-sm text-grey-alpha-500">
              🎉 {aboutData.badges.pointsEarned} points earned so far
            </Text>
            <TouchableOpacity>
              <Text
                className="border-b border-primary text-sm font-medium"
                style={{ color: colors.primary.purple }}
              >
                Leaderboard
              </Text>
            </TouchableOpacity>
          </View>

          {/* Current and Next Badges */}
          <View className="mb-4 flex-row gap-4">
            {/* Current Badge */}
            <View className="flex-1 items-center">
              <Text className="mb-2 text-xs font-medium text-grey-plain-550">
                Current
              </Text>
              <View className="mb-2 h-20 w-20 items-center justify-center">
                <LifterBadge width={80} height={80} />
              </View>
              <Text className="text-xs font-medium text-grey-alpha-500">
                {aboutData.badges.currentBadge.name}
              </Text>
            </View>

            {/* Next Badge */}
            <View className="flex-1 items-center">
              <Text className="mb-2 text-xs font-medium text-grey-plain-550">
                Next
              </Text>
              <View className="mb-2 h-20 w-20 items-center justify-center opacity-60">
                <LiftCaptainBadge width={80} height={80} />
              </View>
              <Text className="text-xs font-medium text-grey-alpha-500">
                {aboutData.badges.nextBadge.name}
              </Text>
            </View>
          </View>

          {/* Progress Bar */}
          <View className="mb-2">
            <LiftProgressBar
              currentAmount={
                (aboutData.badges.pointsToGo /
                  (1 - aboutData.badges.progress / 100)) *
                (aboutData.badges.progress / 100)
              }
              targetAmount={
                aboutData.badges.pointsToGo /
                (1 - aboutData.badges.progress / 100)
              }
              showAmount={false}
            />
          </View>

          {/* Points to go */}
          <View className="mt-3 flex-row items-center justify-center gap-1">
            <Text className="text-xs text-grey-plain-550">
              🎯 {aboutData.badges.pointsToGo} points to go
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
            <SquareMousePointer
              color={colors['grey-alpha']['500']}
              size={18}
              strokeWidth={2}
            />
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
          icon={
            <CalendarHeart
              color={colors['grey-alpha']['500']}
              size={18}
              strokeWidth={2}
            />
          }
          title="Date of birth"
          showInfo
        />
        <View className="mt-3 border-t border-grey-plain-300 pt-3">
          <TouchableOpacity>
            <Text
              className="text-sm font-medium underline"
              style={{ color: colors.primary.purple }}
            >
              {aboutData.dateOfBirth}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Other Details Section */}
      <View
        className="mx-4 mt-4 rounded-xl p-4"
        style={{ backgroundColor: '#FAFBFC' }}
      >
        <SectionHeader
          icon={
            <CalendarHeart
              color={colors['grey-alpha']['500']}
              size={18}
              strokeWidth={2}
            />
          }
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
