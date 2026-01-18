import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { ArrowLeft, Bug } from 'lucide-react-native';
import { colors } from '@/theme/colors';

interface DebugOption {
  title: string;
  description?: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
}

export default function DebugScreen() {
  function handleNavigate(path: string, params?: Record<string, string>) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (params) {
      router.push({ pathname: path as any, params });
    } else {
      router.push(path as any);
    }
  }

  const debugOptions: DebugOption[] = [
    {
      title: 'Earned Badge Screen',
      description: 'Test the badge celebration screen',
      onPress: () => handleNavigate('/earned-badge', { badgeName: 'Lifter' }),
      variant: 'primary',
    },
    {
      title: 'BVN Success Screen',
      description: 'Simulate BVN verification success',
      onPress: () =>
        handleNavigate('/upgrade-wallet/success', {
          type: 'bvn',
          tier: 'Tier 1',
        }),
      variant: 'primary',
    },
    {
      title: 'NIN Success Screen',
      description: 'Simulate NIN verification success',
      onPress: () =>
        handleNavigate('/upgrade-wallet/success', {
          type: 'nin',
          tier: 'Tier 2',
        }),
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-grey-plain-50" edges={['top']}>
      {/* Header */}
      <View className="flex-row items-center justify-between border-b border-grey-plain-150 bg-white px-4 py-3">
        <View className="flex-row items-center gap-3">
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft
              color={colors['grey-alpha']['500']}
              size={24}
              strokeWidth={2}
            />
          </TouchableOpacity>
          <View className="flex-row items-center gap-2">
            <Bug
              color={colors['grey-alpha']['500']}
              size={24}
              strokeWidth={2}
            />
            <Text className="text-lg font-semibold text-grey-alpha-500">
              Debug Menu
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        <View className="px-4 pt-6">
          {/* Description */}
          <Text className="mb-6 text-sm leading-5 text-grey-plain-550">
            Test screens and features for development and debugging purposes.
          </Text>

          {/* Debug Options */}
          <View className="gap-3">
            {debugOptions.map((option, index) => (
              <TouchableOpacity
                key={index}
                onPress={option.onPress}
                className="rounded-xl border bg-white p-4"
                style={{
                  borderColor: colors['grey-alpha']['250'],
                }}
                activeOpacity={0.7}
              >
                <View className="flex-row items-center justify-between">
                  <View className="flex-1">
                    <Text className="mb-1 text-base font-semibold text-grey-alpha-500">
                      {option.title}
                    </Text>
                    {option.description && (
                      <Text className="text-sm text-grey-plain-550">
                        {option.description}
                      </Text>
                    )}
                  </View>
                  {option.variant === 'primary' && (
                    <View
                      className="ml-3 rounded-full px-2 py-1"
                      style={{
                        backgroundColor: colors['primary-tints'].purple['100'],
                      }}
                    >
                      <Text
                        className="text-xs font-semibold"
                        style={{ color: colors.primary.purple }}
                      >
                        New
                      </Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Info Section */}
          <View className="mt-8 rounded-xl border bg-grey-plain-100 p-4">
            <Text className="mb-2 text-sm font-semibold text-grey-alpha-500">
              Debug Information
            </Text>
            <Text className="text-xs leading-4 text-grey-plain-550">
              This screen is only available in development mode. Use it to
              quickly navigate to and test various screens and features.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
