import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, Pressable } from 'react-native';

import { colors } from '@/theme/colors';

interface ToggleSwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export function ToggleSwitch({
  value,
  onValueChange,
  disabled = false,
  className = '',
}: ToggleSwitchProps) {
  const animation = useRef(new Animated.Value(value ? 1 : 0)).current;
  const knobTranslate = useMemo(
    () =>
      animation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 18],
      }),
    [animation]
  );

  useEffect(() => {
    Animated.timing(animation, {
      toValue: value ? 1 : 0,
      duration: 180,
      useNativeDriver: true,
    }).start();
  }, [animation, value]);

  return (
    <Pressable
      onPress={() => onValueChange(!value)}
      disabled={disabled}
      accessibilityRole="switch"
      accessibilityState={{ checked: value, disabled }}
      className={disabled ? `opacity-50 ${className}` : className}
      style={{
        width: 44,
        height: 26,
        borderRadius: 999,
        borderWidth: 2,
        borderColor: value
          ? colors.primary.purple
          : colors['grey-plain']['350'],
        backgroundColor: value
          ? colors.primary.purple
          : colors['grey-plain']['100'],
        justifyContent: 'center',
        paddingHorizontal: 4,
      }}
    >
      <Animated.View
        style={{
          width: 14,
          height: 14,
          borderRadius: 999,
          backgroundColor: value
            ? colors['grey-plain']['50']
            : colors['grey-plain']['450'],
          transform: [{ translateX: knobTranslate }],
        }}
      />
    </Pressable>
  );
}
