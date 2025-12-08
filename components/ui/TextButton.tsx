import React from 'react';

import { TouchableOpacity, Text, View, ViewStyle } from 'react-native';

import { colors } from '@/theme/colors';

interface TextButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  underline?: boolean;
  className?: string;
}

export function TextButton({
  title,
  onPress,
  disabled = false,
  underline = false,
  className = '',
}: TextButtonProps) {
  const containerStyle: ViewStyle | undefined = underline
    ? {
        borderBottomWidth: 1,
        borderBottomColor: colors.primary.purple,
        paddingBottom: 2,
      }
    : undefined;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      className={`py-2 ${disabled ? 'opacity-50' : ''} ${className}`}
      accessibilityRole="button"
    >
      {underline ? (
        <View style={containerStyle}>
          <Text className="text-sm font-medium text-primary">{title}</Text>
        </View>
      ) : (
      <Text className="text-sm font-medium text-primary">{title}</Text>
      )}
    </TouchableOpacity>
  );
}
