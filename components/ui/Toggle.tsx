import React, { useEffect, useRef } from 'react';
import { Pressable, Animated, View } from 'react-native';
import { Check } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { colors } from '@/theme/colors';

interface ToggleProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
  size?: 'small' | 'medium';
}

export function Toggle({
  value,
  onValueChange,
  disabled = false,
  size = 'medium',
}: ToggleProps) {
  const animatedValue = useRef(new Animated.Value(value ? 1 : 0)).current;

  // Dimensions based on size
  const dimensions = {
    small: { width: 44, height: 26, thumbSize: 20, padding: 3 },
    medium: { width: 52, height: 30, thumbSize: 24, padding: 3 },
  };

  const { width, height, thumbSize, padding } = dimensions[size];
  const translateX = width - thumbSize - padding * 2;

  useEffect(() => {
    Animated.spring(animatedValue, {
      toValue: value ? 1 : 0,
      useNativeDriver: true,
      friction: 8,
      tension: 60,
    }).start();
  }, [value, animatedValue]);

  const handlePress = () => {
    if (disabled) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onValueChange(!value);
  };

  const thumbTranslateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, translateX],
  });

  const trackColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [colors['grey-plain']['300'], colors.primary.purple],
  });

  const checkOpacity = animatedValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0, 1],
  });

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      style={{ opacity: disabled ? 0.5 : 1 }}
    >
      <Animated.View
        style={{
          width,
          height,
          borderRadius: height / 2,
          backgroundColor: trackColor,
          padding,
          justifyContent: 'center',
        }}
      >
        <Animated.View
          style={{
            width: thumbSize,
            height: thumbSize,
            borderRadius: thumbSize / 2,
            backgroundColor: colors['grey-plain']['50'],
            transform: [{ translateX: thumbTranslateX }],
            alignItems: 'center',
            justifyContent: 'center',
            // Shadow for thumb
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.15,
            shadowRadius: 2,
            elevation: 2,
          }}
        >
          <Animated.View style={{ opacity: checkOpacity }}>
            <Check
              size={size === 'small' ? 12 : 14}
              color={colors.primary.purple}
              strokeWidth={3}
            />
          </Animated.View>
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
}
