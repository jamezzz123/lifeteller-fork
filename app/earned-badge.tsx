import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { colors } from '@/theme/colors';
import { Button } from '@/components/ui/Button';
import LifterBadge from '@/assets/images/badges/lifter.svg';

export default function EarnedBadgeScreen() {
  const params = useLocalSearchParams<{ badgeName?: string; badgeId?: string }>();
  const badgeName = params.badgeName || 'Lifter';
  function handleContinue() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.back();
  }

  function handleShareOnFeeds() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // TODO: Implement share functionality
    router.back();
  }

  return (
    <SafeAreaView className="flex-1 bg-grey-plain-50" edges={['top', 'bottom']}>
      <View className="flex-1">
        {/* Top Label */}
        <View className="px-4 pt-2">
          <Text className="text-sm text-grey-plain-550">Earned a badge</Text>
        </View>

        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 32,
            alignItems: 'center',
            justifyContent: 'center',
            flexGrow: 1,
          }}
        >
          <View className="flex-1 items-center justify-center px-4">
            {/* Badge Graphic Container */}
            <View className="relative mb-6 items-center justify-center">
              {/* Celebratory Elements - Stars */}
              <View className="absolute -left-4 -top-2">
                <View
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: colors.primary.purple }}
                />
              </View>
              <View className="absolute -right-6 top-4">
                <View
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: colors.primary.purple }}
                />
              </View>
              <View className="absolute -bottom-4 -left-2">
                <View
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: colors.primary.purple }}
                />
              </View>
              <View className="absolute -bottom-2 -right-4">
                <View
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: colors.primary.purple }}
                />
              </View>
              <View className="absolute left-8 -top-6">
                <View
                  className="h-1.5 w-1.5 rounded-full border"
                  style={{
                    borderColor: colors.primary.purple,
                    backgroundColor: 'transparent',
                  }}
                />
              </View>
              <View className="absolute -right-8 top-8">
                <View
                  className="h-2 w-2 rounded-full border"
                  style={{
                    borderColor: colors.primary.purple,
                    backgroundColor: 'transparent',
                  }}
                />
              </View>
              <View className="absolute -bottom-6 right-8">
                <View
                  className="h-1.5 w-1.5 rounded-full border"
                  style={{
                    borderColor: colors.primary.purple,
                    backgroundColor: 'transparent',
                  }}
                />
              </View>

              {/* Badge Icon */}
              <View className="items-center justify-center">
                <LifterBadge width={72} height={73} />
              </View>

              {/* Badge Name */}
              <Text className="mt-4 text-lg font-semibold text-grey-alpha-500">
                {badgeName}
              </Text>
            </View>

            {/* Heading */}
            <Text className="mb-3 text-2xl font-bold text-grey-alpha-500">
              You earned a badge!
            </Text>

            {/* Congratulatory Message */}
            <Text className="mb-8 text-center text-sm leading-5 text-grey-plain-550">
              We rare super proud of you and the wonderful things that you are
              doing for the community.
            </Text>

            {/* Action Buttons */}
            <View className="w-full flex-row gap-3">
              <View className="flex-1">
                <Button
                  title="Continue"
                  onPress={handleContinue}
                  variant="outline"
                  size="large"
                />
              </View>
              <View className="flex-1">
                <Button
                  title="Share on feeds"
                  onPress={handleShareOnFeeds}
                  variant="primary"
                  size="large"
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

