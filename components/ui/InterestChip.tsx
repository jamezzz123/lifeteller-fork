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
      className={`rounded-full px-3 py-1.5 ${className}`}
      style={{
        backgroundColor: selected
          ? colors['primary-tints'].purple['50']
          : colors['grey-alpha']['150'],
      }}
    >
      <Text
        className="font-medium"
        style={{
          color: selected
            ? colors['primary-shades'].purple['300']
            : colors['grey-alpha']['400'],
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

