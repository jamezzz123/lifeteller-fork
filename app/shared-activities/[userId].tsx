import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import {
  CornerUpLeft,
  Search,
  EllipsisVertical,
  BadgeCheck,
} from 'lucide-react-native';
import { colors } from '@/theme/colors';
import { FilterTabs, FilterTab } from '@/components/ui/FilterTabs';
import { SharedActivityCard } from '@/components/shared-activities/SharedActivityCard';
import { Avatar } from '@/components/ui/Avatar';

interface SharedActivity {
  id: string;
  type: 'supported-lift' | 'conversation' | 'co-raise' | 'liked-post';
  title: string;
  description: string;
  amount?: string;
  messageCount?: number;
  timestamp: string;
}

// Mock data - replace with actual API call
const mockActivities: SharedActivity[] = [
  {
    id: '1',
    type: 'supported-lift',
    title: "Supported Ayoola Babajide's Raised Lift",
    description: 'You both contributed to this lift',
    amount: '$50 each',
    timestamp: '2 days ago',
  },
  {
    id: '2',
    type: 'conversation',
    title: "Conversation on 'Help Tola see again' lift",
    description:
      "You both commented to this lift, and you replied to Isaac's comment.",
    messageCount: 3,
    timestamp: '2 days ago',
  },
  {
    id: '3',
    type: 'co-raise',
    title: "Co-raise 'Food drive lift'",
    description: 'You both raised to this lift.',
    amount: '$50,000 raised',
    timestamp: '2 days ago',
  },
  {
    id: '4',
    type: 'liked-post',
    title: 'Liked your post about Volunteering at Devfest 2026',
    description: 'Isaac liked and commented on your post about volunteering.',
    timestamp: '2 days ago',
  },
];

const filters: FilterTab[] = [
  { id: 'all', label: 'All', count: 15 },
  { id: 'lifts', label: 'Lifts', count: 5 },
  { id: 'posts', label: 'Posts', count: 4 },
  { id: 'comments', label: 'Comments', count: 3 },
  { id: 'interactions', label: 'Interactions', count: 3 },
];

export default function SharedActivitiesScreen() {
  const params = useLocalSearchParams<{
    userId?: string;
    username?: string;
    fullName?: string;
    profileImage?: string;
    isVerified?: string;
    followsYou?: string;
  }>();

  const username = params.username || 'dareytemy';
  const fullName = params.fullName || 'Isaac Tolulope';
  const profileImage = params.profileImage;
  const isVerified = params.isVerified === 'true';
  const followsYou = params.followsYou === 'true';

  const [activeFilter, setActiveFilter] = useState('all');
  const [activities] = useState<SharedActivity[]>(mockActivities);

  const filteredActivities = activities.filter((activity) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'lifts') {
      return activity.type === 'supported-lift' || activity.type === 'co-raise';
    }
    if (activeFilter === 'posts') return activity.type === 'liked-post';
    if (activeFilter === 'comments') return activity.type === 'conversation';
    if (activeFilter === 'interactions') {
      return activity.type === 'conversation' || activity.type === 'liked-post';
    }
    return true;
  });

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
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
          <Text className="text-lg font-semibold text-grey-alpha-500">
            Shared activities - {fullName}
          </Text>
        </View>
        <TouchableOpacity>
          <Search color={colors['grey-alpha']['500']} size={24} />
        </TouchableOpacity>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        {/* User Profile Header */}
        <View className="border-b border-grey-plain-150 bg-white px-4 py-4">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-3">
              {/* Profile Picture */}
              <Avatar
                profileImage={profileImage}
                name={fullName}
                size={64}
                showBadge={false}
              />

              {/* User Info */}
              <View className="flex-1">
                <View className="mb-1 flex-row items-center gap-2">
                  <Text className="text-base font-semibold text-grey-alpha-500">
                    {fullName}
                  </Text>
                  {isVerified && (
                    <BadgeCheck color={colors.primary.purple} size={18} />
                  )}
                </View>
                <Text className="mb-1 text-sm text-grey-plain-550">
                  @{username}
                </Text>
                {followsYou && (
                  <Text className="text-xs text-grey-plain-550">
                    Follows you
                  </Text>
                )}
              </View>
            </View>

            {/* More Options */}
            <TouchableOpacity>
              <EllipsisVertical color={colors['grey-alpha']['500']} size={24} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Filter Tabs */}
        <FilterTabs
          filters={filters}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          showCounts={true}
          scrollable={true}
          contentContainerClassName="py-3"
        />

        {/* Activities List */}
        <View className="px-4 pt-4">
          {filteredActivities.length === 0 ? (
            <View className="items-center py-12">
              <Text className="text-base text-grey-plain-550">
                No activities found
              </Text>
            </View>
          ) : (
            <View className="gap-4">
              {filteredActivities.map((activity) => (
                <SharedActivityCard key={activity.id} activity={activity} />
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
