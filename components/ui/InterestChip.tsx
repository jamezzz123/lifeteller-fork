import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { colors } from '@/theme/colors';

interface InterestChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  className?: string;
}

export function InterestChip({
  label,
  selected = false,
  onPress,
  className = '',
}: InterestChipProps) {
  const content = (
    <View
      className={`rounded-xl px-3 py-1.5 ${className}`}
      style={{
        backgroundColor: selected
          ? colors['primary-tints'].purple['100']
          : colors['grey-alpha']['150'],
      }}
    >
      <Text
        className="text-xs font-inter-medium"
        style={{
          color: selected
            ? colors.primary.purple
            : colors['grey-alpha']['450'],
        }}
      >
        {label}
      </Text>
    </View>
  );

  if (onPress) {
    return <Pressable onPress={onPress}>{content}</Pressable>;
  }

  return content;
}

