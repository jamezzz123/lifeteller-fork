import React from 'react';
import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { formatAmount } from '@/utils/formatAmount';

interface MinimalLiftCardProps {
  currentAmount: number;
  targetAmount: number;
}

export function MinimalLiftCard({
  currentAmount,
  targetAmount,
}: MinimalLiftCardProps) {
  const progress = Math.min((currentAmount / targetAmount) * 100, 100);
  const formattedCurrent = formatAmount(currentAmount);
  const formattedTarget = formatAmount(targetAmount);

  return (
    <View className="mb-4 mt-4 rounded-xl bg-grey-plain-150 p-4">
      {/* Top Section - Amounts and Percentage */}
      <View className="mb-4 flex-row items-start justify-between">
        {/* Left Side - Amount Raised */}
        <View className="flex-1">
          <Text className="text-2xl font-inter-bold text-grey-alpha-500">
            {formattedCurrent}
          </Text>
          <Text className="mt-1 text-sm text-grey-plain-550">
            raised of {formattedTarget}
          </Text>
        </View>

        {/* Right Side - Percentage */}
        <View className="items-end">
          <Text className="text-2xl font-inter-bold text-grey-alpha-500">
            {Math.round(progress)}%
          </Text>
          <Text className="mt-1 text-sm text-grey-plain-550">funded</Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View className="h-2 overflow-hidden rounded-full bg-grey-plain-300">
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
      </View>
    </View>
  );
}
