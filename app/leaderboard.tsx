import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import {
  CornerUpLeft,
  ChevronDown,
  Search,
  HandHeart,
  Flame,
  Crown,
  Spotlight,
  Medal,
  BadgeCheck,
  ChevronRight,
} from 'lucide-react-native';
import { colors } from '@/theme/colors';
import { Avatar } from '@/components/ui/Avatar';
import BlockTop from '@/assets/images/block-top.svg';
import {
  RankingScopeBottomSheet,
} from '@/components/leaderboard/RankingScopeBottomSheet';
import {
  TimeRangeBottomSheet,
} from '@/components/leaderboard/TimeRangeBottomSheet';
import { BottomSheetRef } from '@/components/ui/BottomSheet';

interface LeaderboardUser {
  id: string;
  rank: number;
  name: string;
  username: string;
  profileImage?: string;
  points: number;
  lifts: number;
  streak: number;
  isVerified: boolean;
}

// Mock data
const mockUsers: LeaderboardUser[] = [
  {
    id: '1',
    rank: 1,
    name: 'Isaac Tolulope',
    username: 'dareytemy',
    profileImage:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    points: 435,
    lifts: 125,
    streak: 12,
    isVerified: true,
  },
  {
    id: '2',
    rank: 2,
    name: 'Isaac Tolulope',
    username: 'dareytemy',
    profileImage:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    points: 425,
    lifts: 120,
    streak: 10,
    isVerified: true,
  },
  {
    id: '3',
    rank: 3,
    name: 'Isaac Tolulope',
    username: 'dareytemy',
    profileImage:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    points: 415,
    lifts: 115,
    streak: 8,
    isVerified: true,
  },
  {
    id: '4',
    rank: 4,
    name: 'Isaac Tolulope',
    username: 'dareytemy',
    profileImage:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    points: 400,
    lifts: 110,
    streak: 7,
    isVerified: true,
  },
  {
    id: '5',
    rank: 5,
    name: 'Isaac Tolulope',
    username: 'dareytemy',
    profileImage:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    points: 390,
    lifts: 105,
    streak: 6,
    isVerified: true,
  },
];

const currentUser: LeaderboardUser = {
  id: 'current',
  rank: 23,
  name: 'You',
  username: 'you',
  points: 391,
  lifts: 125,
  streak: 12,
  isVerified: false,
};

const top3Users = mockUsers.slice(0, 3);

function RankIcon({ rank }: { rank: number }) {
  if (rank === 1) {
    return <Crown color="#F0B100" size={20} />;
  }
  if (rank === 2) {
    return <Medal color="#C0C0C0" size={20} />;
  }
  if (rank === 3) {
    return <Medal color="#CD7F32" size={20} />;
  }
  return (
    <View
      className="h-6 w-6 items-center justify-center rounded-full"
      style={{ backgroundColor: colors['grey-plain']['150'] }}
    >
      <Text className="text-xs font-semibold text-grey-plain-550">{rank}</Text>
    </View>
  );
}

function Top3Visual({ users }: { users: LeaderboardUser[] }) {
  const heights = [100, 140, 80]; // Heights for 2nd, 1st, 3rd

  const truncateName = (name: string, maxLength: number = 12) => {
    if (name.length <= maxLength) return name;
    return name.substring(0, maxLength) + '...';
  };

  return (
    <View className="mb-6 flex-row items-end justify-center gap-4 px-4">
      {/* 2nd Place */}
      <View className="items-center">
        <Avatar
          profileImage={users[1]?.profileImage}
          name={users[1]?.name}
          size={56}
        />
        <View className="mt-2 flex-row items-center gap-1">
          <Text className="text-xs font-semibold text-grey-alpha-500">
            {truncateName(users[1]?.name || '')}
          </Text>
          {users[1]?.isVerified && (
            <BadgeCheck color={colors.primary.purple} size={14} />
          )}
        </View>
        <Text className="mt-0.5 text-xs text-grey-plain-550">
          {users[1]?.points} points
        </Text>

        <View className="mt-2">
          <View style={{ width: 110, alignItems: 'center', overflow: 'visible' }}>
            <BlockTop width={110} height={16} />
          </View>
          <View
            className="items-center justify-center"
            style={{
              width: 110,
              backgroundColor: colors['primary-tints'].purple['100'],
              height: heights[0],
            }}
          >
            <Text
              className="text-lg font-bold"
              style={{ color: colors.primary.purple }}
            >
              2nd
            </Text>
          </View>
        </View>
      </View>

      {/* 1st Place */}
      <View className="items-center">
        <Crown color="#F0B100" size={24} style={{ marginBottom: 4 }} />
        <Avatar
          profileImage={users[0]?.profileImage}
          name={users[0]?.name}
          size={56}
        />
        <View className="mt-2 flex-row items-center gap-1">
          <Text className="text-xs font-semibold text-grey-alpha-500">
            {truncateName(users[0]?.name || '')}
          </Text>
          {users[0]?.isVerified && (
            <BadgeCheck color={colors.primary.purple} size={14} />
          )}
        </View>
        <Text className="mt-0.5 text-xs text-grey-plain-550">
          {users[0]?.points} points
        </Text>
        <View className="mt-2">
          <View style={{ width: 110, alignItems: 'center', overflow: 'visible' }}>
            <BlockTop width={110} height={16} />
          </View>
          <View
            className="items-center justify-center"
            style={{
              width: 110,
              backgroundColor: colors['primary-tints'].purple['100'],
              height: heights[1],
            }}
          >
          <Text
            className="text-lg font-bold"
            style={{ color: colors.primary.purple }}
          >
            1st
          </Text>
          </View>
        </View>
      </View>

      {/* 3rd Place */}
      <View className="items-center">
        <Avatar
          profileImage={users[2]?.profileImage}
          name={users[2]?.name}
          size={56}
        />
        <View className="mt-2 flex-row items-center gap-1">
          <Text className="text-xs font-semibold text-grey-alpha-500">
            {truncateName(users[2]?.name || '')}
          </Text>
          {users[2]?.isVerified && (
            <BadgeCheck color={colors.primary.purple} size={14} />
          )}
        </View>
        <Text className="mt-0.5 text-xs text-grey-plain-550">
          {users[2]?.points} points
        </Text>
        <View className="mt-2">
          <View style={{ width: 110, alignItems: 'center', overflow: 'visible' }}>
            <BlockTop width={110} height={16} />
          </View>
          <View
            className="items-center justify-center"
            style={{
              width: 110,
              backgroundColor: colors['primary-tints'].purple['100'],
              height: heights[2],
            }}
          >
          <Text
            className="text-lg font-bold"
            style={{ color: colors.primary.purple }}
          >
            3rd
          </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

function RankListItem({ user }: { user: LeaderboardUser }) {
  return (
    <TouchableOpacity
      className="flex-row items-center border-b border-grey-plain-150 bg-white px-4 py-3"
      activeOpacity={0.7}
    >
      <View className="mr-3">
        <RankIcon rank={user.rank} />
      </View>
      <Avatar profileImage={user.profileImage} name={user.name} size={40} />
      <View className="ml-3 flex-1">
        <View className="flex-row items-center gap-1.5">
          <Text className="text-[15px] font-semibold text-grey-alpha-500">
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
      <Text className="text-sm font-semibold text-grey-alpha-500">
        {user.points} pts
      </Text>
    </TouchableOpacity>
  );
}

export default function LeaderboardScreen() {
  const [selectedFilter, setSelectedFilter] = useState('All users');
  const [selectedTime, setSelectedTime] = useState('All time');
  const [searchQuery, setSearchQuery] = useState('');
  const rankingScopeSheetRef = useRef<BottomSheetRef>(null);
  const timeRangeSheetRef = useRef<BottomSheetRef>(null);

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'bottom']}>
      {/* Header */}
      <View className="flex-row items-center border-b border-grey-plain-150 bg-white px-4 py-3">
        <TouchableOpacity onPress={() => router.back()} className="mr-3">
          <CornerUpLeft
            color={colors['grey-plain']['550']}
            size={24}
            strokeWidth={2}
          />
        </TouchableOpacity>
        <Text className="text-lg font-semibold text-grey-alpha-500">
          Leaderboard
        </Text>
      </View>

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 12 : 0}
      >
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 16 }}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        >
          {/* Filter Options */}
          <View className="flex-row gap-3 border-b border-grey-plain-150 bg-white px-4 py-3">
            <TouchableOpacity
              className="flex-1 flex-row items-center justify-between rounded-full border border-grey-plain-300 bg-white px-3 py-2.5"
              activeOpacity={0.7}
              onPress={() => rankingScopeSheetRef.current?.expand()}
            >
              <Text className="text-sm font-medium text-grey-alpha-500">
                {selectedFilter}
              </Text>
              <ChevronDown
                color={colors['grey-plain']['550']}
                size={18}
                strokeWidth={2}
              />
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 flex-row items-center justify-between rounded-full border border-grey-plain-300 bg-white px-3 py-2.5"
              activeOpacity={0.7}
              onPress={() => timeRangeSheetRef.current?.expand()}
            >
              <Text className="text-sm font-medium text-grey-alpha-500">
                {selectedTime}
              </Text>
              <ChevronDown
                color={colors['grey-plain']['550']}
                size={18}
                strokeWidth={2}
              />
            </TouchableOpacity>
          </View>

        {/* Your Rank Card */}
        <View className="mb-8 mt-4 px-3">
          <LinearGradient
            colors={[
              colors['primary-tints'].violet['300'],
              colors.primary.purple,
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            className="w-full"
            style={{ borderRadius: 16 }}
          >
            <View className="px-4 py-4">
              {/* Top Section */}
              <View className="flex-row items-start justify-between pb-3">
                <View>
                  <Text className="mb-1 text-xs font-medium text-white">
                    Your rank
                  </Text>
                  <Text className="text-3xl font-bold text-white">
                    #{currentUser.rank}
                  </Text>
                </View>
                <View className="items-end">
                  <Text className="mb-1 text-xs font-medium text-white">
                    Lift points
                  </Text>
                  <Text className="text-3xl font-bold text-white">
                    {currentUser.points.toLocaleString()}
                  </Text>
                </View>
              </View>

              {/* Divider Line */}
              <View className="mb-3 h-px bg-white/30" />

              {/* Bottom Section */}
              <View className="flex-row gap-6">
                <View className="flex-row items-center gap-1.5">
                  <HandHeart color="#FFFFFF" size={16} />
                  <Text className="text-sm font-medium text-white">
                    {currentUser.lifts} lifts
                  </Text>
                </View>
                <View className="flex-row items-center gap-1.5">
                  <Spotlight color="#FFFFFF" size={16} />
                  <Text className="text-sm font-medium text-white">
                    Top 5%
                  </Text>
                </View>
                <View className="flex-row items-center gap-1.5">
                  <Flame color="#FFFFFF" size={16} />
                  <Text className="text-sm font-medium text-white">
                    {currentUser.streak} days streak
                  </Text>
                </View>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Top 3 Visual */}
        <Top3Visual users={top3Users} />

        {/* Ranks Section */}
        <View className="px-4">
          <View className="mb-4 flex-row items-center justify-between">
            <Text className="text-base font-semibold text-grey-alpha-500">
              Ranks
            </Text>
            <TouchableOpacity
              activeOpacity={0.7}
              className="flex-row items-center gap-1"
            >
              <Text
                className="text-sm font-medium"
                style={{ color: colors.primary.purple }}
              >
                See all
              </Text>
              <ChevronRight
                color={colors.primary.purple}
                size={16}
                strokeWidth={2}
              />
            </TouchableOpacity>
          </View>

          {/* Search Bar */}
          <View className="mb-4 flex-row gap-2">
            <View className="flex-1 flex-row items-center rounded-full border border-grey-plain-300 bg-white px-3 py-2.5">
              <Search
                color={colors['grey-plain']['550']}
                size={18}
                strokeWidth={2}
                style={{ marginRight: 8 }}
              />
              <TextInput
                placeholder="Search by title or description"
                placeholderTextColor={colors['grey-plain']['550']}
                value={searchQuery}
                onChangeText={setSearchQuery}
                className="flex-1 text-sm text-grey-alpha-500"
              />
            </View>
          </View>

          {/* Ranks List */}
          <View>
            {mockUsers.map((user) => (
              <RankListItem key={user.id} user={user} />
            ))}
          </View>
        </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <RankingScopeBottomSheet
        ref={rankingScopeSheetRef}
        selectedScope={selectedFilter}
        onApply={setSelectedFilter}
      />
      <TimeRangeBottomSheet
        ref={timeRangeSheetRef}
        selectedRange={selectedTime}
        onApply={setSelectedTime}
      />
    </SafeAreaView>
  );
}
