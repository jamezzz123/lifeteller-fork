import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import {
  CornerUpLeft,
  ShieldUser,
  CalendarClock,
  Check,
} from 'lucide-react-native';
import { colors } from '@/theme/colors';
import { Button } from '@/components/ui/Button';
import * as Haptics from 'expo-haptics';

interface KYCItem {
  id: string;
  label: string;
  isVerified: boolean;
}

export default function WalletSettingsScreen() {
  // Mock KYC data - replace with actual data from API
  const kycItems: KYCItem[] = [
    { id: 'bvn-1', label: 'BVN', isVerified: true },
    { id: 'bvn-2', label: 'BVN', isVerified: true },
    { id: 'other', label: 'Any other one', isVerified: true },
  ];

  const handleSetupDailyLimit = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // TODO: Navigate to setup daily limit screen
    console.log('Setup daily cumulative transaction limit');
  };

  const handleSetupOneTimeLimit = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // TODO: Navigate to setup one-time limit screen
    console.log('Setup one-time transaction limit');
  };

  const handleHelpCenter = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/help-center/wallet');
  };

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
          Wallet settings
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        {/* KYC Status Section */}
        <View
          className="mx-4 mt-6 rounded-2xl p-2"
          style={{ backgroundColor: colors['grey-plain']['150'] }}
        >
          <Text className="mb-4 ml-3 mt-2 text-base font-semibold text-grey-alpha-500">
            KYC status
          </Text>

          {kycItems.map((item, index) => (
            <View key={item.id}>
              <View className="flex-row items-center justify-between rounded-xl bg-white px-4 py-4">
                <Text className="text-[15px] font-medium text-grey-alpha-500">
                  {item.label}
                </Text>
                {item.isVerified && (
                  <View
                    className="flex-row items-center gap-1.5 rounded-lg px-2.5 py-1"
                    style={{ backgroundColor: colors['green-tint']['100'] }}
                  >
                    <View
                      className="h-4 w-4 items-center justify-center rounded-full"
                      style={{ backgroundColor: colors.state.green }}
                    >
                      <Check
                        color={colors['grey-plain']['50']}
                        size={10}
                        strokeWidth={2.5}
                      />
                    </View>
                    <Text
                      className="text-xs font-medium"
                      style={{ color: colors['grey-alpha']['500'] }}
                    >
                      Verified
                    </Text>
                  </View>
                )}
              </View>
              {index < kycItems.length - 1 && (
                <View
                  className="my-1 h-px"
                  style={{ backgroundColor: colors['grey-plain']['300'] }}
                />
              )}
            </View>
          ))}
        </View>

        {/* Transaction Limits - Flat List */}
        <View className="mx-4 mt-4">
          {/* Daily Cumulative Transaction Limit */}
          <View className="flex-row items-center justify-between px-4 py-4">
            <View className="flex-1 flex-row items-center gap-3">
              <ShieldUser
                color={colors['grey-alpha']['500']}
                size={24}
                strokeWidth={2}
              />
              <Text className="flex-1 text-sm font-medium text-grey-alpha-500">
                Daily cumulative transaction limit
              </Text>
            </View>
            <Button
              title="Setup"
              onPress={handleSetupDailyLimit}
              variant="outline"
              size="small"
              className="ml-3"
            />
          </View>

          {/* Divider */}
          <View
            className="mx-4 h-px"
            style={{ backgroundColor: colors['grey-plain']['300'] }}
          />

          {/* One-time Transaction Limit */}
          <View className="flex-row items-center justify-between px-4 py-4">
            <View className="flex-1 flex-row items-center gap-3">
              <CalendarClock
                color={colors['grey-alpha']['500']}
                size={24}
                strokeWidth={2}
              />
              <Text className="flex-1 text-sm font-medium text-grey-alpha-500">
                One-time transaction limit
              </Text>
            </View>
            <Button
              title="Setup"
              onPress={handleSetupOneTimeLimit}
              variant="outline"
              size="small"
              className="ml-3"
            />
          </View>
        </View>

        {/* Help Center Link */}
        <View className="mx-4 mt-6 px-4">
          <Text className="text-center text-sm text-grey-plain-550">
            Visit the{' '}
            <Text
              onPress={handleHelpCenter}
              className="font-semibold"
              style={{ color: colors.primary.purple }}
            >
              wallet help center
            </Text>{' '}
            for wallet-related issues.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
