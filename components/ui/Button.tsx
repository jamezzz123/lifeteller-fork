import React from 'react';

import {
  Pressable,
  Text,
  ActivityIndicator,
  TextStyle,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { colors } from '@/theme/colors';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'gradient-border';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  className?: string;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  className = '',
}: ButtonProps) {
  const getGradientColors = (): [string, string] => {
    switch (variant) {
      case 'primary':
        return [
          colors['primary-tints'].purple['200'],
          colors['primary-tints'].purple['500'],
        ];
      case 'secondary':
        return [
          colors['primary-tints'].purple['200'],
          colors['primary-tints'].purple['500'],
        ];
      case 'gradient-border':
        return [
          colors['primary-tints'].purple['200'],
          colors['primary-tints'].purple['500'],
        ];
      default:
        return [
          colors['primary-tints'].purple['200'],
          colors['primary-tints'].purple['500'],
        ];
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'outline':
        return 'border border-primary bg-transparent active:bg-primary-tints-100';
      default:
        return '';
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return 'px-3 py-2 min-h-[40px] min-w-[80px]';
      case 'medium':
        return 'px-4 py-3 h-12 min-w-[100px]';
      case 'large':
        return 'px-6 py-4 min-h-[56px] min-w-[120px]';
      default:
        return 'px-4 py-3 h-12 min-w-[100px]';
    }
  };

  const getTextStyles = (): TextStyle => {
    const fontSize = size === 'large' ? 18 : 14;

    switch (variant) {
      case 'primary':
      case 'secondary':
        return {
          fontSize,
          fontWeight: '600',
          color: colors['grey-plain']['50'],
          textAlign: 'center',
        };
      case 'outline':
      case 'gradient-border':
        return {
          fontSize,
          fontWeight: '600',
          color: colors.primary.purple,
          textAlign: 'center',
        };
      default:
        return {
          fontSize,
          fontWeight: '600',
          color: colors['grey-plain']['50'],
          textAlign: 'center',
        };
    }
  };

  const buttonContent = (
    <>
      {loading ? (
        <ActivityIndicator
          size="small"
          color={
            variant === 'outline' || variant === 'gradient-border'
              ? colors.primary.purple
              : colors['grey-plain']['50']
          }
        />
      ) : (
        <Text style={getTextStyles()}>{title}</Text>
      )}
    </>
  );

  if (variant === 'gradient-border') {
    const borderWidth = 2;

    return (
      <Pressable
        onPress={onPress}
        disabled={disabled || loading}
        style={{
          opacity: disabled ? 0.5 : 1,
        }}
      >
        {({ pressed }) => (
          <LinearGradient
            colors={getGradientColors()}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{
              borderRadius: 9999,
              padding: borderWidth,
              opacity: pressed ? 0.8 : 1,
            }}
          >
            <View
              className={`
                ${getSizeStyles()}
                flex-row
                items-center
                justify-center
                rounded-full
                bg-transparent
                ${className}
              `}
              style={{
                backgroundColor: colors['grey-plain']['50'],
              }}
            >
              {buttonContent}
            </View>
          </LinearGradient>
        )}
      </Pressable>
    );
  }

  if (variant === 'outline') {
    return (
      <Pressable
        onPress={onPress}
        disabled={disabled || loading}
        className={`
          ${getVariantStyles()}
          ${getSizeStyles()}
          flex-row
          items-center
          justify-center
          rounded-full
          ${disabled ? 'opacity-50' : ''}
          ${className}
        `}
      >
        {buttonContent}
      </Pressable>
    );
  }

  const borderWidth = 2;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={{
        opacity: disabled ? 0.5 : 1,
      }}
    >
      {({ pressed }) => (
        <LinearGradient
          colors={[
            colors.primary['purple-light'],
            colors['primary-tints']['purple']['200'],
            colors.primary.purple,
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            borderRadius: 9999,
            padding: borderWidth,
            opacity: pressed ? 0.8 : 1,
          }}
        >
          <LinearGradient
            colors={getGradientColors()}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{
              borderRadius: 9999,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <View
              className={`
                ${getSizeStyles()}
                flex-row
                items-center
                justify-center
                ${className}
              `}
            >
              {buttonContent}
            </View>
          </LinearGradient>
        </LinearGradient>
      )}
    </Pressable>
  );
}
