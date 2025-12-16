import React from 'react';
import { View, Text } from 'react-native';
import { Info } from 'lucide-react-native';
import { colors } from '@/theme/colors';

interface InfoBannerProps {
  message: string;
  className?: string;
}

export function InfoBanner({ message, className = '' }: InfoBannerProps) {
  return (
    <View
      className={`mx-4 mt-4 flex-row items-center rounded-lg px-3 py-2.5 ${className}`}
      style={{
        backgroundColor: '#FFF9E6',
      }}
    >
      <Info
        color={colors.variant.yellow['150']}
        size={18}
        strokeWidth={2}
        style={{ marginRight: 8 }}
      />
      <Text className="flex-1 text-xs text-grey-alpha-550">{message}</Text>
    </View>
  );
}
