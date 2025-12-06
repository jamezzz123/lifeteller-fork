import React from 'react';

import { TouchableOpacity } from 'react-native';

import { colors } from '@/theme/colors';

interface IconButtonProps {
  icon: React.ReactNode;
  onPress: () => void;
  size?: number;
  disabled?: boolean;
  className?: string;
  accessibilityLabel?: string;
}

export function IconButton({
  icon,
  onPress,
  size = 48,
  disabled = false,
  className = '',
  accessibilityLabel,
}: IconButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      className={`
        size-12
        items-center
        justify-center
        rounded-full
        border
        border-grey-plain-450
        ${disabled ? 'opacity-50' : ''}
        ${className}
      `}
      style={{
        backgroundColor: colors['grey-plain']['50'],
        ...(size !== 48 && { width: size, height: size }),
      }}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
    >
      {icon}
    </TouchableOpacity>
  );
}
