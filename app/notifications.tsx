import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import {
  CornerUpLeft,
  Package,
  MessageSquare,
  UserPlus,
  CreditCard,
  Camera,
} from 'lucide-react-native';
import { colors } from '@/theme/colors';
import { Toggle } from '@/components/ui/Toggle';

function NotificationRow({
  Icon,
  title,
  description,
  value,
  onToggle,
}: {
  Icon?: any;
  title: string;
  description?: string;
  value: boolean;
  onToggle: () => void;
}) {
  return (
    <View className="flex-row items-center justify-between rounded-xl bg-white px-4 py-4">
      <View className="flex-1 flex-row items-center gap-3">
        {Icon ? (
          <View
            className="h-10 w-10 items-center justify-center rounded-md"
            style={{ backgroundColor: colors['grey-plain']['50'] }}
          >
            <Icon
              color={colors['grey-plain']['550']}
              size={24}
              strokeWidth={2}
            />
          </View>
        ) : null}

        <View className="flex-1">
          <Text className="font-inter text-base text-grey-alpha-500">{title}</Text>
          {description ? (
            <Text className="font-inter text-sm text-grey-plain-550">{description}</Text>
          ) : null}
        </View>
      </View>

      <Toggle
        value={value}
        onValueChange={onToggle}
      />
    </View>
  );
}

export default function NotificationsScreen() {
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [liftOffersEnabled, setLiftOffersEnabled] = useState(true);
  const [postsEnabled, setPostsEnabled] = useState(true);
  const [followEnabled, setFollowEnabled] = useState(true);
  const [walletEnabled, setWalletEnabled] = useState(true);
  const [storiesEnabled, setStoriesEnabled] = useState(true);

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'bottom']}>
      {/* Header */}
      <View className="flex-row items-center justify-between border-b border-grey-plain-150 bg-white px-4 py-3">
        <View className="flex-row items-center gap-3">
          <TouchableOpacity onPress={() => router.back()} className="mr-3">
            <CornerUpLeft
              color={colors['grey-plain']['550']}
              size={24}
              strokeWidth={2}
            />
          </TouchableOpacity>
          <Text className="font-inter-semibold text-lg text-grey-alpha-500">
            Notifications
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 16 }}>
        <View
          className="mx-4 mt-6 rounded-2xl p-2"
          style={{ backgroundColor: colors['grey-plain']['150'] }}
        >
          <View className="mb-4 ml-3 mt-2 flex-row items-center justify-between pr-3">
            <Text className="font-inter-semibold text-base text-grey-alpha-500">
              Email notification
            </Text>
            <Toggle
              value={emailEnabled}
              onValueChange={() => setEmailEnabled((s) => !s)}
            />
          </View>

          <View className="gap-1">
            <NotificationRow
              Icon={Package}
              title="Lift offers, Join lifts, Raised lifts, Lift requests, Lift approval, and Lift decline"
              value={liftOffersEnabled}
              onToggle={() => setLiftOffersEnabled((s) => !s)}
            />

            <NotificationRow
              Icon={MessageSquare}
              title="Posts, Likes, Replies, Comments, and Tags."
              value={postsEnabled}
              onToggle={() => setPostsEnabled((s) => !s)}
            />

            <NotificationRow
              Icon={UserPlus}
              title="Follow and Unfollow"
              value={followEnabled}
              onToggle={() => setFollowEnabled((s) => !s)}
            />

            <NotificationRow
              Icon={CreditCard}
              title="Wallet transactions"
              value={walletEnabled}
              onToggle={() => setWalletEnabled((s) => !s)}
            />

            <NotificationRow
              Icon={Camera}
              title="Stories"
              value={storiesEnabled}
              onToggle={() => setStoriesEnabled((s) => !s)}
            />
          </View>
        </View>
        {/* Push notifications section */}
        <View
          className="mx-4 mt-6 rounded-2xl p-2"
          style={{ backgroundColor: colors['grey-plain']['150'] }}
        >
          <Text className="mb-4 ml-3 mt-2 text-base font-semibold text-grey-alpha-500">
            Push notifications
          </Text>

          <View className="gap-1">
            <NotificationRow
              Icon={Package}
              title="Lift offers, Join lifts, Raised lifts, Lift requests, Lift approval, and Lift decline"
              value={liftOffersEnabled}
              onToggle={() => setLiftOffersEnabled((s) => !s)}
            />

            <NotificationRow
              Icon={MessageSquare}
              title="Posts, Likes, Replies, Comments, and Tags."
              value={postsEnabled}
              onToggle={() => setPostsEnabled((s) => !s)}
            />

            <NotificationRow
              Icon={UserPlus}
              title="Follow and Unfollow"
              value={followEnabled}
              onToggle={() => setFollowEnabled((s) => !s)}
            />

            <NotificationRow
              Icon={CreditCard}
              title="Wallet transactions"
              value={walletEnabled}
              onToggle={() => setWalletEnabled((s) => !s)}
            />

            <NotificationRow
              Icon={Camera}
              title="Stories"
              value={storiesEnabled}
              onToggle={() => setStoriesEnabled((s) => !s)}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
