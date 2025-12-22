import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { colors } from '@/theme/colors';

interface RadioButtonProps {
  label: string;
  checked: boolean;
  onPress: () => void;
  disabled?: boolean;
  className?: string;
}

export function RadioButton({
  label,
  checked,
  onPress,
  disabled = false,
  className = '',
}: RadioButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={`flex-row items-center ${disabled ? 'opacity-50' : ''} ${className}`}
      accessibilityRole="radio"
      accessibilityState={{ checked }}
    >
      <View
        className="size-5 items-center justify-center rounded-full border-2"
        style={{
          borderColor: checked
            ? colors.primary.purple
            : colors['grey-plain']['300'],
        }}
      >
        {checked && (
          <View
            className="size-2.5 rounded-full"
            style={{ backgroundColor: colors.primary.purple }}
          />
        )}
      </View>
      <Text className="ml-3 text-sm text-grey-alpha-500">{label}</Text>
    </Pressable>
  );
}

