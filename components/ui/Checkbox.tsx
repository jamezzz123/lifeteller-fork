import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Check } from 'lucide-react-native';

import { colors } from '@/theme/colors';

interface CheckboxProps {
  label?: string;
  checked: boolean;
  onPress: () => void;
  disabled?: boolean;
  className?: string;
}

export function Checkbox({
  label,
  checked,
  onPress,
  disabled = false,
  className = '',
}: CheckboxProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={`flex-row items-center ${disabled ? 'opacity-50' : ''} ${className}`}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
    >
      <View
        className={`
          size-5
          items-center
          justify-center
          rounded
          border-2
          ${checked ? 'border-primary bg-primary' : 'border-grey-plain-450 bg-transparent'}
        `}
        style={{
          borderColor: checked
            ? colors.primary.purple
            : colors['grey-plain']['450'],
          backgroundColor: checked ? colors.primary.purple : 'transparent',
        }}
      >
        {checked && (
          <Check size={14} color={colors['grey-plain']['50']} strokeWidth={3} />
        )}
      </View>
      {label && (
        <Text className="ml-2 text-sm text-grey-alpha-500">{label}</Text>
      )}
    </Pressable>
  );
}

