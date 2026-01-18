import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '@/theme/colors';

interface LiftProgressCardProps {
  title: string;
  currentAmount: number;
  targetAmount: number;
  onOfferLift?: () => void;
}

export function LiftProgressCard({
  title,
  currentAmount,
  targetAmount,
  onOfferLift,
}: LiftProgressCardProps) {
  const progress = Math.min((currentAmount / targetAmount) * 100, 100);
  const formattedCurrent = new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
  }).format(currentAmount);
  const formattedTarget = new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
  }).format(targetAmount);

  return (
    <View className="mt-3 rounded-xl border border-grey-plain-300 bg-white p-4">
      {/* Header */}
      <View className="mb-3 flex-row items-center justify-between">
        <Text className="flex-1 text-[15px] font-inter-semibold text-grey-alpha-500">
          {title}
        </Text>
        <TouchableOpacity
          onPress={onOfferLift}
          activeOpacity={0.7}
          style={styles.offerButton}
        >
          <Text className="text-[13px] font-inter-medium text-primary">
            Offer lift
          </Text>
        </TouchableOpacity>
      </View>

      {/* Progress Bar */}
      <View className="relative mb-2">
        <View className="h-2 flex-1 overflow-visible rounded-full bg-grey-plain-300">
          <View className="relative h-full w-full">
            <LinearGradient
              colors={['#7538BA', '#CF2586']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                width: `${progress}%`,
                height: '100%',
                borderRadius: 999,
              }}
            />
            {/* Percentage Pill positioned at progress edge */}
            <View
              className="border-primary-purple absolute -top-2 h-6 min-w-[40px] items-center justify-center rounded-full border bg-white px-2"
              style={{
                left: `${progress}%`,
                marginLeft: -20, // Half of min-width to center on edge
              }}
            >
              <Text className="text-xs font-inter-medium text-grey-alpha-500">
                {Math.round(progress)}%
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Amount Display */}
      <Text className="text-[13px] text-grey-plain-550">
        <Text className="font-inter-semibold">{formattedCurrent}</Text> of{' '}
        {formattedTarget}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  offerButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.primary.purple,
    backgroundColor: colors['primary-tints'].purple['100'],
  },
});
