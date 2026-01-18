import React from 'react';
import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { formatAmount } from '@/utils/formatAmount';

interface LiftProgressBarProps {
  currentAmount: number;
  targetAmount: number;
  showAmount?: boolean;
  amountTextSize?: 'xs' | 'sm' | 'base';
  className?: string;
}

export function LiftProgressBar({
  currentAmount,
  targetAmount,
  showAmount = true,
  amountTextSize = 'sm',
  className = '',
}: LiftProgressBarProps) {
  const progress = Math.min((currentAmount / targetAmount) * 100, 100);
  const formattedCurrent = formatAmount(currentAmount);
  const formattedTarget = formatAmount(targetAmount);

  const textSizeClass =
    amountTextSize === 'xs'
      ? 'text-xs'
      : amountTextSize === 'sm'
        ? 'text-[13px]'
        : 'text-sm';

  return (
    <View className={className}>
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
              <Text className="text-xs font-medium text-grey-alpha-500">
                {Math.round(progress)}%
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Amount Display */}
      {showAmount && (
        <Text className={`${textSizeClass} text-grey-plain-550`}>
          <Text className="font-semibold">{formattedCurrent}</Text> of{' '}
          {formattedTarget}
        </Text>
      )}
    </View>
  );
}
