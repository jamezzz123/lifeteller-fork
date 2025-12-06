import React from 'react';

import { TouchableOpacity, Text } from 'react-native';

interface TextButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  className?: string;
}

export function TextButton({
  title,
  onPress,
  disabled = false,
  className = '',
}: TextButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      className={`py-2 ${disabled ? 'opacity-50' : ''} ${className}`}
      accessibilityRole="button"
    >
      <Text className="text-sm font-medium text-primary">{title}</Text>
    </TouchableOpacity>
  );
}
