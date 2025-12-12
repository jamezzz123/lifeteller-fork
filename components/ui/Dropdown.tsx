import React from 'react';
import { Pressable, Text, PressableProps } from 'react-native';
import { ChevronDown } from 'lucide-react-native';

import { colors } from '@/theme/colors';

interface DropdownProps extends Omit<PressableProps, 'children'> {
  label: string;
  variant?: 'default' | 'primary';
  size?: 'small' | 'medium';
}

export function Dropdown({
  label,
  variant = 'primary',
  size = 'medium',
  ...props
}: DropdownProps) {
  const variantStyles = {
    default: {
      containerClass: 'border-grey-alpha-250',
      textClass: 'text-grey-alpha-500',
      iconColor: colors['grey-alpha']['500'],
    },
    primary: {
      containerClass: 'border-primary',
      textClass: 'text-primary',
      iconColor: colors.primary.purple,
    },
  };

  const sizeStyles = {
    small: {
      containerClass: 'px-2.5 py-1',
      textClass: 'text-xs',
      iconSize: 12,
    },
    medium: {
      containerClass: 'px-3 py-1.5',
      textClass: 'text-sm',
      iconSize: 14,
    },
  };

  const currentVariant = variantStyles[variant];
  const currentSize = sizeStyles[size];

  return (
    <Pressable
      className={`flex-row items-center justify-center gap-1 rounded-full border ${currentVariant.containerClass} ${currentSize.containerClass}`}
      {...props}
    >
      <Text
        className={`font-semibold ${currentVariant.textClass} ${currentSize.textClass}`}
      >
        {label}
      </Text>
      <ChevronDown
        size={currentSize.iconSize}
        color={currentVariant.iconColor}
        strokeWidth={2}
      />
    </Pressable>
  );
}
