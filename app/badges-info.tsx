import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { X } from 'lucide-react-native';
import { SvgProps } from 'react-native-svg';
import { colors } from '@/theme/colors';
import LifterBadge from '@/assets/images/badges/lifter.svg';
import LiftCaptainBadge from '@/assets/images/badges/lift-captain.svg';
import LiftChampionBadge from '@/assets/images/badges/lift-champion.svg';
import GoldenLifterBadge from '@/assets/images/badges/golden-lifter.svg';

interface Activity {
  activity: string;
  points: number;
}

interface Badge {
  name: string;
  icon: React.ComponentType<SvgProps>;
  pointsRequired: number;
}

const ACTIVITIES: Activity[] = [
  { activity: 'Invite a friend', points: 20 },
  { activity: 'Raise a lift', points: 10 },
  { activity: 'Offer a lift', points: 10 },
  { activity: 'Request a lift', points: 5 },
  { activity: 'Share a lift', points: 5 },
  { activity: 'Comment on a lift', points: 2 },
];

const BADGES: Badge[] = [
  { name: 'Lifter', icon: LifterBadge, pointsRequired: 100 },
  { name: 'Lift Captain', icon: LiftCaptainBadge, pointsRequired: 500 },
  { name: 'Lift Champion', icon: LiftChampionBadge, pointsRequired: 2000 },
  { name: 'Golden Lifter', icon: GoldenLifterBadge, pointsRequired: 5000 },
];

export default function BadgesInfoScreen() {
  const { pointsEarned = '427' } = useLocalSearchParams<{
    pointsEarned?: string;
  }>();
  const points = parseInt(pointsEarned, 10) || 427;

  // Determine current badge based on points
  let currentBadgeIndex = 0;
  for (let i = BADGES.length - 1; i >= 0; i--) {
    if (points >= BADGES[i].pointsRequired) {
      currentBadgeIndex = i;
      break;
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'bottom']}>
      {/* Header */}
      <View className="flex-row items-center justify-between border-b border-grey-plain-150 px-4 py-3">
        <View className="flex-row items-center gap-3">
          <TouchableOpacity
            onPress={() => router.back()}
            hitSlop={10}
            accessibilityLabel="Close"
          >
            <X
              size={20}
              color={colors['grey-alpha']['500']}
              strokeWidth={2.6}
            />
          </TouchableOpacity>
          <Text className="text-base font-semibold text-grey-alpha-500">
            How badges work
          </Text>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 32, paddingTop: 16 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="px-4">
          {/* Introductory Text */}
          <Text className="text-sm leading-5 text-grey-alpha-500">
            When you perform any of the activities below, you get points and
            then unlock badges as you progress.
          </Text>

          {/* Activities Table */}
          <View className="mt-6">
            <View
              className="overflow-hidden rounded-xl border"
              style={{ borderColor: colors['grey-plain']['300'] }}
            >
              {/* Table Header */}
              <View
                className="flex-row border-b px-4 py-3"
                style={{
                  backgroundColor: colors['grey-plain']['150'],
                  borderBottomColor: colors['grey-plain']['300'],
                }}
              >
                <Text className="flex-1 text-xs font-semibold uppercase text-grey-plain-550">
                  Activity
                </Text>
                <Text className="text-xs font-semibold uppercase text-grey-plain-550">
                  Lift Points
                </Text>
              </View>
              {/* Table Rows */}
              {ACTIVITIES.map((item, index) => (
                <View
                  key={index}
                  className={`flex-row px-4 py-3 ${
                    index !== ACTIVITIES.length - 1 ? 'border-b' : ''
                  }`}
                  style={{
                    borderBottomColor: colors['grey-plain']['300'],
                  }}
                >
                  <Text className="flex-1 text-sm text-grey-alpha-500">
                    {item.activity}
                  </Text>
                  <Text className="text-sm font-medium text-grey-alpha-500">
                    +{item.points} points
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Current Points */}
          <View className="mt-6">
            <Text className="text-center text-sm text-grey-alpha-500">
              🎉 {points.toLocaleString()} points earned so far
            </Text>
          </View>

          {/* Badges Progression */}
          <View className="mt-8">
            <View className="flex-row flex-wrap justify-between gap-4">
              {BADGES.map((badge, index) => {
                const isCurrent = index === currentBadgeIndex;
                const isUnlocked = points >= badge.pointsRequired;
                const BadgeIcon = badge.icon;

                return (
                  <View
                    key={index}
                    className="relative min-w-[140px] flex-1 items-center"
                  >
                    {isCurrent && (
                      <View
                        className="absolute -top-4 z-30 mb-2 rounded-full px-2 py-0.5"
                        style={{
                          backgroundColor:
                            colors['primary-tints'].purple['100'],
                        }}
                      >
                        <Text
                          className="text-xs font-semibold"
                          style={{ color: colors.primary.purple }}
                        >
                          Current
                        </Text>
                      </View>
                    )}
                    <View
                      className="mb-2 h-20 w-20 items-center justify-center"
                      style={{ opacity: isUnlocked ? 1 : 0.5 }}
                    >
                      <BadgeIcon width={80} height={80} />
                    </View>
                    <Text className="mb-1 text-xs font-medium text-grey-alpha-500">
                      {badge.name}
                    </Text>
                    <Text className="text-xs text-grey-plain-550">
                      {badge.pointsRequired.toLocaleString()} points to unlock
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
