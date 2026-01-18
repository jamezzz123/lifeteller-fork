import React from 'react';
import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MapPin, Clock } from 'lucide-react-native';
import { colors } from '@/theme/colors';

interface LiftCardProps {
  title: string;
  currentAmount: number;
  targetAmount: number;
  location: string;
  daysLeft: number;
}

export function LiftCard({
  title,
  currentAmount,
  targetAmount,
  location,
  daysLeft,
}: LiftCardProps) {
  const progress =
    targetAmount > 0 ? Math.min((currentAmount / targetAmount) * 100, 100) : 0;

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);

  return (
    <View className="mb-6 rounded-2xl border border-grey-alpha-250 bg-white p-4">
      <View>
        <Text className="mb-2 text-base font-inter-semibold text-grey-alpha-500">
          {title}
        </Text>

        <Text className="mb-2 text-sm text-grey-plain-550">
          <Text className="font-inter-semibold">{formatCurrency(currentAmount)}</Text>{' '}
          of {formatCurrency(targetAmount)} raised
        </Text>

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

        <View className="flex-row items-center justify-between gap-4">
          <View className="flex-row items-center gap-1">
            <MapPin
              size={16}
              color={colors['grey-plain']['550']}
              strokeWidth={2}
            />
            <Text className="text-[13px] text-grey-plain-550">{location}</Text>
          </View>
          <View className="flex-row items-center gap-1">
            <Clock
              size={16}
              color={colors['grey-plain']['550']}
              strokeWidth={2}
            />
            <Text className="text-[13px] text-grey-plain-550">
              {daysLeft} days left
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
