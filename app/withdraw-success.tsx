import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Check, Share2, Download } from 'lucide-react-native';
import { colors } from '@/theme/colors';
import { formatAmount } from '@/utils/formatAmount';
import * as Haptics from 'expo-haptics';

export default function WithdrawSuccessScreen() {
  const params = useLocalSearchParams<{
    amount: string;
    recipientName: string;
  }>();

  const amount = parseFloat(params.amount || '0');
  const recipientName = params.recipientName || '';

  const handleShareReceipt = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // TODO: Implement share receipt functionality
    console.log('Share receipt');
  };

  const handleDownloadReceipt = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // TODO: Implement download receipt functionality
    console.log('Download receipt');
  };

  const handleGoToFeeds = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/(tabs)/' as any);
  };

  const handleGoToWallet = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/(tabs)/wallet' as any);
  };

  if (!amount || !recipientName) {
    // Invalid params, go back
    router.back();
    return null;
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'bottom']}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="items-center rounded-t-3xl bg-white px-6 pb-8 pt-4">
          {/* Success Icon with Confetti Effect */}
          <View className="mb-6 items-center">
            <View className="relative">
              {/* Green Checkmark Circle */}
              <View
                className="h-16 w-16 items-center justify-center rounded-full"
                style={{ backgroundColor: colors.state.green }}
              >
                <Check
                  color={colors['grey-plain']['50']}
                  size={32}
                  strokeWidth={3}
                />
              </View>
              {/* Confetti elements */}
              <View className="absolute -right-2 -top-2 h-3 w-3 rounded-full bg-primary" />
              <View className="absolute -bottom-2 -left-2 h-2 w-2 rounded-full bg-yellow-50" />
              <View className="absolute -right-4 top-4 h-2 w-2 rounded-full bg-state-green" />
              <View className="absolute -left-4 top-6 h-2 w-2 rounded-full bg-blue-50" />
            </View>
          </View>

          {/* Title */}
          <Text className="mb-2 text-2xl font-inter-bold text-grey-alpha-500">
            Withdraw successful
          </Text>

          {/* Description */}
          <Text className="mb-8 text-center text-base text-grey-plain-550">
            We have sent{' '}
            <Text className="font-inter-semibold text-grey-alpha-500">
              {formatAmount(amount, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </Text>{' '}
            to {recipientName}.
          </Text>

          {/* Receipt Actions */}
          <View className="mb-8 flex-row gap-6">
            <TouchableOpacity
              onPress={handleShareReceipt}
              className="flex-row items-center gap-2"
              activeOpacity={0.7}
            >
              <Share2
                size={20}
                color={colors.primary.purple}
                strokeWidth={2}
              />
              <Text
                className="text-base font-inter-semibold"
                style={{ color: colors.primary.purple }}
              >
                Share receipt
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleDownloadReceipt}
              className="flex-row items-center gap-2"
              activeOpacity={0.7}
            >
              <Download
                size={20}
                color={colors.primary.purple}
                strokeWidth={2}
              />
              <Text
                className="text-base font-inter-semibold"
                style={{ color: colors.primary.purple }}
              >
                Download receipt
              </Text>
            </TouchableOpacity>
          </View>

          {/* Action Buttons */}
          <View className="flex-row gap-3">
            {/* Secondary Action Button */}
            <View className="flex-1">
              <TouchableOpacity
                onPress={handleGoToFeeds}
                className="items-center justify-center rounded-xl border-2 border-primary bg-white py-4"
                activeOpacity={0.7}
              >
                <Text
                  className="text-base font-inter-semibold"
                  style={{ color: colors.primary.purple }}
                >
                  Go to feeds
                </Text>
              </TouchableOpacity>
            </View>

            {/* Primary Action Button */}
            <View className="flex-1">
              <TouchableOpacity
                onPress={handleGoToWallet}
                className="items-center justify-center rounded-xl bg-primary py-4"
                activeOpacity={0.7}
              >
                <Text className="text-base font-inter-semibold text-white">
                  Go to wallet
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
