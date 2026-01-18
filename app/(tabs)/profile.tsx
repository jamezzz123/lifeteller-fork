import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Pressable,
  Alert,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TabView, TabBar, Route } from 'react-native-tab-view';
import { router } from 'expo-router';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
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
  Play,
  Bug,
} from 'lucide-react-native';
import { colors } from '@/theme/colors';
import { FeedPost } from '@/components/feed/FeedPost';
import { useAuth } from '@/context/auth';
import { formatCurrency } from '@/utils/formatAmount';
import { getInitials, getFullName } from '@/utils/user';
import { InfoBanner } from '@/components/ui/InfoBanner';
import { LiftProgressBar } from '@/components/ui/LiftProgressBar';
import { InterestChip } from '@/components/ui/InterestChip';
import LifterBadge from '@/assets/images/badges/lifter.svg';
import LiftCaptainBadge from '@/assets/images/badges/lift-captain.svg';
import { ShareProfileBottomSheet } from '@/components/profile/ShareProfileBottomSheet';
import { BottomSheetRef } from '@/components/ui/BottomSheet';
import { useUploadAvatar } from '@/lib/hooks/mutations/useUploadAvatar';

const { width } = Dimensions.get('window');

// Placeholder tab content components
function PostsTab() {
  // Placeholder posts data
  const posts = [
    {
      id: 'profile-post-1',
      userId: 'user-1',
      username: 'Isaac Tolulope',
      handle: 'dareytemy',
      timestamp: '10 seconds ago',
      profileImage: 'https://i.pravatar.cc/150?img=12',
      content:
        'Today, I visited the orphanage home at Yaba, Lagos. I went there with @xyz and @abc. We had a joyful moment with the children of the @fgh orphanage and geared towards what the future will hold... see more',
      likes: 56,
      comments: 12,
      reposts: 12,
      withUsers: ['xyz', 'abc', 'fgh'],
    },
    {
      id: 'profile-post-2',
      userId: 'user-1',
      username: 'Isaac Tolulope',
      handle: 'dareytemy',
      timestamp: '2 hours ago',
      profileImage: 'https://i.pravatar.cc/150?img=12',
      content:
        'Another amazing day helping the community! #LiftTogether #CommunityService',
      media: [
        {
          id: 'media-1',
          type: 'image' as const,
          uri: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800',
        },
      ],
      likes: 234,
      comments: 45,
      reposts: 67,
    },
    {
      id: 'profile-post-3',
      userId: 'user-1',
      username: 'Isaac Tolulope',
      handle: 'dareytemy',
      timestamp: '1 day ago',
      profileImage: 'https://i.pravatar.cc/150?img=12',
      content: 'Grateful for everyone who supported our latest initiative 🙏',
      lift: {
        title: 'Community Medical Support',
        currentAmount: 45000,
        targetAmount: 100000,
      },
      likes: 892,
      comments: 123,
      reposts: 234,
    },
  ];

  return (
    <ScrollView
      className="flex-1 bg-grey-plain-50"
      showsVerticalScrollIndicator={false}
    >
      {posts.map((post) => (
      <FeedPost
          key={post.id}
          id={post.id}
          userId={post.userId}
          username={post.username}
          handle={post.handle}
          timestamp={post.timestamp}
          profileImage={post.profileImage}
          content={post.content}
          media={post.media}
          lift={post.lift}
          likes={post.likes}
          comments={post.comments}
          reposts={post.reposts}
          withUsers={post.withUsers}
      />
      ))}
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
  // Placeholder video clip data - replace with actual data from API/hooks
  // Each clip should have: { id: string, thumbnailUri: string, videoUri: string, duration?: number }
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

  const clips = Array.from({ length: 9 }, (_, i) => ({
    id: `clip-${i + 1}`,
    thumbnailUri: `https://images.unsplash.com/photo-${shuffledIds[i]}?w=400&h=400&fit=crop`,
    videoUri: `https://example.com/video-${i + 1}.mp4`, // Placeholder
    duration: Math.floor(Math.random() * 120) + 15, // Random duration between 15-135 seconds
  }));

  const { width } = Dimensions.get('window');
  const GAP = 2;
  const CLIP_SIZE = (width - GAP) / 2;

  const handleClipPress = (clipId: string) => {
    // Navigate to video player or full screen view
    console.log('Clip pressed:', clipId);
    // TODO: Navigate to video player screen
    // router.push(`/clip/${clipId}`);
  };

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
            onPress={() => handleClipPress(clip.id)}
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
            {/* Video overlay with play icon */}
            <View className="absolute inset-0 items-center justify-center bg-black/20">
              <View className="h-12 w-12 items-center justify-center rounded-full border-2 border-white bg-white/30">
                <Play
                  color={colors['grey-plain']['50']}
                  size={24}
                  fill={colors['grey-plain']['50']}
                />
              </View>
            </View>
            {/* Duration badge */}
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
          <Info color={colors['grey-plain']['550']} size={16} strokeWidth={2} />
        </TouchableOpacity>
      )}
    </View>
  );
}

function AboutTab({
  userBio,
  userInterests,
}: {
  userBio?: string | null;
  userInterests?: { id: string; name: string; icon: string | null }[];
}) {
  // Placeholder data - replace with actual data from API/hooks
  const aboutData = {
    bio: userBio || 'No bio yet.',
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
    interests: userInterests?.map((interest) => interest.name) || [],
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
          onInfoPress={() =>
            router.push({
              pathname: '/badges-info',
              params: {
                pointsEarned: aboutData.badges.pointsEarned.toString(),
              },
            })
          }
        />
        <View className="mt-3 border-t border-grey-plain-300 pt-3">
          {/* Points and Leaderboard */}
          <View className="mb-8 flex-row items-center justify-between">
            <Text className="text-sm text-grey-alpha-500">
              🎉 {aboutData.badges.pointsEarned} points earned so far
            </Text>
            <TouchableOpacity onPress={() => router.push('/leaderboard')}>
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
  const { user } = useAuth();
  const [index, setIndex] = useState(0);
  const shareProfileSheetRef = useRef<BottomSheetRef>(null);
  const uploadAvatarMutation = useUploadAvatar();
  const [routes] = useState([
    { key: 'posts', title: 'Posts' },
    { key: 'liftHistory', title: 'Lift history' },
    { key: 'photos', title: 'Photos' },
    { key: 'liftClips', title: 'LiftClips' },
    { key: 'about', title: 'About' },
  ]);

  // Get user data with fallbacks
  const fullName = user ? getFullName(user.first_name, user.last_name) : '';
  const username = user?.username || '';
  const avatarUrl = user?.avatar_url;
  const bio = user?.bio || '';
  const initials = getInitials(fullName);
  // TODO: These should come from API when available
  const liftsCount = 0;
  const followingCount = 0;
  const followersCount = 0;
  const isVerified = user?.is_email_verified || false;

  async function handleChangeAvatar() {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      // Request permissions
      if (Platform.OS !== 'web') {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert(
            'Permission Required',
            'Sorry, we need camera roll permissions to upload your profile picture!'
          );
          return;
        }
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];

        // Check file size (5MB = 5242880 bytes)
        if (asset.fileSize && asset.fileSize > 5242880) {
          Alert.alert('Error', 'Image size should be 5MB or less.');
          return;
        }

        // Extract file extension from URI
        const uriParts = asset.uri.split('.');
        const fileExtension = uriParts[uriParts.length - 1] || 'jpg';
        const mimeType = `image/${
          fileExtension === 'jpg' || fileExtension === 'jpeg'
            ? 'jpeg'
            : fileExtension
        }`;

        // Upload avatar
        await uploadAvatarMutation.mutateAsync({
          uri: asset.uri,
          type: mimeType,
          name: `avatar.${fileExtension}`,
        });

        // Wait a bit for the profile to refresh, then show success
        // The mutation's onSuccess already calls fetchUserProfile()
        setTimeout(() => {
          Alert.alert('Success', 'Profile picture updated successfully!');
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }, 500);
      }
    } catch (error: any) {
      // Extract error message
      let errorMessage = 'Failed to upload profile picture. Please try again.';
      if (error?.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }

      Alert.alert('Error', errorMessage);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  }

  const renderScene = ({ route }: { route: Route }) => {
    switch (route.key) {
      case 'posts':
        return <PostsTab />;
      case 'liftHistory':
        return <LiftHistoryTab />;
      case 'photos':
        return <PhotosTab />;
      case 'liftClips':
        return <LiftClipsTab />;
      case 'about':
        return <AboutTab userBio={user?.bio} userInterests={user?.interests} />;
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
          <TouchableOpacity onPress={() => router.push('/debug')}>
            <Bug color={colors['grey-alpha']['500']} size={24} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/settings')}>
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
                    {avatarUrl ? (
                      <Image
                        source={{ uri: avatarUrl }}
                        style={{ width: 96, height: 96 }}
                        contentFit="cover"
                      />
                    ) : initials ? (
                      <View className="bg-primary-tints-purple-100 h-full w-full items-center justify-center">
                        <Text
                          className="text-2xl font-bold"
                          style={{ color: colors.primary.purple }}
                        >
                          {initials}
                        </Text>
                      </View>
                    ) : (
                      <View
                        className="h-full w-full"
                        style={{ backgroundColor: colors['grey-plain']['450'] }}
                      />
                    )}
                  </View>
                  {/* Add Profile/Story Button */}
                  <TouchableOpacity
                    className="absolute -bottom-0.5 -right-0.5 h-7 w-7 items-center justify-center rounded-full border-2 border-white"
                    style={{
                      backgroundColor: colors['grey-plain']['50'],
                    }}
                    onPress={handleChangeAvatar}
                    disabled={uploadAvatarMutation.isPending}
                    activeOpacity={0.7}
                  >
                    {uploadAvatarMutation.isPending ? (
                      <ActivityIndicator
                        size="small"
                        color={colors['grey-alpha']['550']}
                      />
                    ) : (
                    <Plus
                      color={colors['grey-alpha']['550']}
                      size={16}
                      strokeWidth={3}
                    />
                    )}
                  </TouchableOpacity>
                </View>

                {/* User Details */}
                <View className="flex-1">
                  <View className="mb-1.5 flex-row items-center gap-2">
                    <Text className="text-xl font-bold text-grey-alpha-500">
                      {fullName || 'User'}
                    </Text>
                    {isVerified && (
                      <BadgeCheck color={colors.primary.purple} size={20} />
                    )}
                  </View>
                  <View className="mb-2.5">
                    <Text className="mb-1.5 text-sm text-grey-plain-550">
                      @{username || 'username'}
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
                  <TouchableOpacity
                    className="p-1.5"
                    onPress={() => router.push('/edit-details' as any)}
                  >
                    <Pencil
                      color={colors['grey-alpha']['500']}
                      size={22}
                      strokeWidth={2}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="p-1.5"
                    onPress={() => shareProfileSheetRef.current?.expand()}
                  >
                    <Share2
                      color={colors['grey-alpha']['500']}
                      size={22}
                      strokeWidth={2}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Bio - Below avatar and user info */}
              {bio && (
                <Text className="text-sm text-grey-plain-550">{bio}</Text>
              )}
            </View>

            {/* Stats */}
            <View className="flex-row gap-3">
              {/* Lifts Card */}
              <TouchableOpacity className="relative flex-1 rounded-xl border border-grey-plain-300 bg-grey-plain-50 p-4">
                <Text className="mb-1 text-2xl font-bold text-grey-alpha-500">
                  {liftsCount.toLocaleString()}
                </Text>
                <Text className="text-xs font-medium text-grey-plain-550">
                  Lifts
                </Text>
              </TouchableOpacity>

              {/* Following Card */}
              <TouchableOpacity
                className="relative flex-1 rounded-xl border border-grey-plain-300 bg-grey-plain-50 p-4"
                onPress={() =>
                  router.push({
                    pathname: '/followers-following',
                    params: {
                      userName: fullName,
                      initialTab: 'following',
                    },
                  })
                }
              >
                <View className="absolute right-2.5 top-2.5">
                  <ArrowUpRight
                    color={colors['grey-plain']['550']}
                    size={14}
                    strokeWidth={2.5}
                  />
                </View>
                <Text className="mb-1 text-2xl font-bold text-grey-alpha-500">
                  {followingCount.toLocaleString()}
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
                      userName: fullName,
                      initialTab: 'followers',
                    },
                  })
                }
              >
                <View className="absolute right-2.5 top-2.5">
                  <ArrowUpRight
                    color={colors['grey-plain']['550']}
                    size={14}
                    strokeWidth={2.5}
                  />
                </View>
                <Text className="mb-1 text-2xl font-bold text-grey-alpha-500">
                  {followersCount >= 1000
                    ? `${(followersCount / 1000).toFixed(1)}k`
                    : followersCount.toLocaleString()}
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

      {/* Share Profile Bottom Sheet */}
      <ShareProfileBottomSheet
        ref={shareProfileSheetRef}
        username={username}
        profileUrl={`https://lifteller.com/${username}`}
      />
    </SafeAreaView>
  );
}
