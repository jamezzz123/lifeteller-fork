import React, { useEffect } from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '@/theme/colors';
import { Check } from 'lucide-react-native';
import { Button } from '@/components/ui/Button';
import { formatAmount } from '@/utils/formatAmount';
import * as Haptics from 'expo-haptics';

interface DailyLimitSuccessBottomSheetProps {
  visible: boolean;
  amount: number;
  onClose: () => void;
}

export function DailyLimitSuccessBottomSheet({
  visible,
  amount,
  onClose,
}: DailyLimitSuccessBottomSheetProps) {
  useEffect(() => {
    if (visible) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  }, [visible]);

  const handleGoToFeeds = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onClose();
    // TODO: Navigate to feeds
  };

  const handleGoToWallet = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onClose();
    // onClose already navigates to wallet-settings
  };

  const formattedAmount = formatAmount(amount);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPress={onClose}
        className="flex-1 justify-end bg-black/50"
      >
        <TouchableOpacity activeOpacity={1} onPress={() => {}}>
          <View className="items-center rounded-t-3xl bg-white px-6 pb-8 pt-4">
            {/* Handle Bar */}
            <View className="mb-6 items-center">
              <View className="h-1 w-12 rounded-full bg-grey-plain-450" />
            </View>

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
                {/* Confetti elements (simplified) */}
                <View className="absolute -right-2 -top-2 h-3 w-3 rounded-full bg-primary" />
                <View className="absolute -bottom-2 -left-2 h-2 w-2 rounded-full bg-yellow-50" />
                <View className="absolute -right-4 top-4 h-2 w-2 rounded-full bg-state-green" />
              </View>
            </View>

            {/* Title */}
            <Text className="mb-2 text-2xl font-inter-bold text-grey-alpha-500">
              Daily transaction limit set
            </Text>

            {/* Description */}
            <Text className="mb-8 text-center text-base text-grey-plain-550">
              Your daily transaction limit is now {formattedAmount}. We will
              notify you when you are about to hit it.
            </Text>

            {/* Buttons */}
            <View className="flex-row gap-3">
              {/* Secondary Action Button */}
              <View className="flex-1">
                <Button
                  title="Go to feeds"
                  onPress={handleGoToFeeds}
                  variant="outline"
                  className="w-full"
                />
              </View>

              {/* Primary Action Button */}
              <View className="flex-1">
                <Button
                  title="Go to my wallet"
                  onPress={handleGoToWallet}
                  variant="primary"
                  className="w-full"
                />
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}
