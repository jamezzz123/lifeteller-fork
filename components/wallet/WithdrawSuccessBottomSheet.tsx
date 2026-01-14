import React, { forwardRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Check, Share2, Download } from 'lucide-react-native';
import {
  BottomSheetComponent,
  BottomSheetRef,
} from '@/components/ui/BottomSheet';
import { Button } from '@/components/ui/Button';
import { colors } from '@/theme/colors';
import { formatAmount } from '@/utils/formatAmount';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';

interface WithdrawSuccessBottomSheetProps {
  amount: number;
  recipientName: string;
  onClose: () => void;
  onShareReceipt?: () => void;
  onDownloadReceipt?: () => void;
}

export const WithdrawSuccessBottomSheet = forwardRef<
  BottomSheetRef,
  WithdrawSuccessBottomSheetProps
>(
  (
    { amount, recipientName, onClose, onShareReceipt, onDownloadReceipt },
    ref
  ) => {
    const handleShareReceipt = () => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onShareReceipt?.();
    };

    const handleDownloadReceipt = () => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onDownloadReceipt?.();
    };

    const handleGoToFeeds = () => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      onClose();
      router.push('/(tabs)/' as any);
    };

    const handleGoToWallet = () => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      onClose();
      router.push('/(tabs)/wallet' as any);
    };

    return (
      <BottomSheetComponent ref={ref} snapPoints={['80%']}>
        <ScrollView
          className="flex-1 px-6"
          showsVerticalScrollIndicator={false}
        >
          <View className="items-center">
            {/* Success Icon with Confetti Effect */}
            <View className="mb-6 mt-6 items-center">
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
            <Text className="mb-2 text-2xl font-bold text-grey-alpha-500">
              Withdraw successful
            </Text>

            {/* Description */}
            <Text className="mb-8 text-center text-base text-grey-plain-550">
              We have sent{' '}
              <Text className="font-semibold text-grey-alpha-500">
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
                  className="text-base font-semibold"
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
                  className="text-base font-semibold"
                  style={{ color: colors.primary.purple }}
                >
                  Download receipt
                </Text>
              </TouchableOpacity>
            </View>

            {/* Action Buttons */}
            <View className="mb-6 flex-row gap-3">
              {/* Secondary Action Button */}
              <View className="flex-1">
                <Button
                  title="Go to feeds"
                  onPress={handleGoToFeeds}
                  variant="outline"
                  size="large"
                  className="w-full"
                />
              </View>

              {/* Primary Action Button */}
              <View className="flex-1">
                <Button
                  title="Go to wallet"
                  onPress={handleGoToWallet}
                  variant="primary"
                  size="large"
                  className="w-full"
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </BottomSheetComponent>
    );
  }
);

WithdrawSuccessBottomSheet.displayName = 'WithdrawSuccessBottomSheet';
