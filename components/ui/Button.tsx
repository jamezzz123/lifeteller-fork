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
  title?: string;
  children?: React.ReactNode;
  iconLeft?: React.ReactNode;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'gradient-border' | 'destructive' | 'link' | 'link-destructive';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  className?: string;
}

export function Button({
  title,
  children,
  iconLeft,
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
          colors['primary-tints'].purple['50'],
          colors['primary-tints'].purple['50'],
        ];
      case 'gradient-border':
        return [
          colors['primary-tints'].purple['200'],
          colors['primary-tints'].purple['500'],
        ];
      case 'destructive':
        return [colors.state.red, colors.state.red];
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
        const hasWhiteBorder =
          className.includes('border-white') ||
          className.includes('border-grey-plain-50');
        return hasWhiteBorder
          ? 'border border-grey-plain-50 bg-transparent'
          : 'border border-primary bg-transparent active:bg-primary-tints-100';
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
    const fontSize = size === 'large' ? 18 : size === 'medium' ? 14 : 14;
    const hasWhiteBorder =
      (variant === 'outline' &&
        (className.includes('border-white') ||
          className.includes('border-grey-plain-50'))) ||
      (variant === 'secondary' &&
        (className.includes('border-white') ||
          className.includes('border-grey-plain-50')));

    switch (variant) {
      case 'primary':
        return {
          fontSize,
          fontWeight: '600',
          color: colors['grey-plain']['50'],
          textAlign: 'center',
        };
      case 'secondary':
        return {
          fontSize,
          fontWeight: '600',
          color: colors['grey-plain']['550'],
          textAlign: 'center',
        };
      case 'outline':
        return {
          fontSize,
          fontWeight: '600',
          color: hasWhiteBorder
            ? colors['grey-plain']['50']
            : colors.primary.purple,
          textAlign: 'center',
        };
      case 'gradient-border':
        return {
          fontSize,
          fontWeight: '600',
          color: colors.primary.purple,
          textAlign: 'center',
        };
      case 'destructive':
        return {
          fontSize,
          fontWeight: '600',
          color: colors['grey-plain']['50'],
          textAlign: 'center',
        };
      case 'link':
        return {
          fontSize,
          fontWeight: '500',
          color: colors.primary.purple,
          textAlign: 'center',
        };
      case 'link-destructive':
        return {
          fontSize,
          fontWeight: '500',
          color: colors.state.red,
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
      ) : children ? (
        children
      ) : title ? (
        <View className="flex-row items-center gap-3">
          {iconLeft && iconLeft}
          <Text style={getTextStyles()}>{title}</Text>
        </View>
      ) : null}
    </>
  );

  if (variant === 'gradient-border') {
    const borderWidth = 2;

    return (
      <Pressable
        onPress={onPress}
        disabled={disabled || loading}
        className={className}
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

  if (variant === 'link' || variant === 'link-destructive') {
    return (
      <Pressable
        onPress={onPress}
        disabled={disabled || loading}
        className={`
          flex-row
          items-center
          justify-center
          ${disabled ? 'opacity-50' : ''}
          ${className}
        `}
        style={({ pressed }) => ({
          opacity: pressed ? 0.7 : disabled ? 0.5 : 1,
        })}
      >
        {buttonContent}
      </Pressable>
    );
  }

  if (variant === 'secondary') {
    // Check if secondary should have white border (for dark backgrounds)
    const hasWhiteBorder =
      className.includes('border-white') ||
      className.includes('border-grey-plain-50');

    if (hasWhiteBorder) {
      // Separate padding classes from margin/other classes
      const paddingClasses = className
        .split(' ')
        .filter(
          (cls) =>
            cls.startsWith('p') &&
            (cls.includes('x') || cls.includes('y') || cls.match(/^p-\d+$/))
        )
        .join(' ');
      const otherClasses = className
        .split(' ')
        .filter(
          (cls) =>
            !cls.startsWith('p') ||
            (!cls.includes('x') && !cls.includes('y') && !cls.match(/^p-\d+$/))
        )
        .join(' ')
        .replace('border-white', '')
        .replace('border-grey-plain-50', '');

      return (
        <Pressable
          onPress={onPress}
          disabled={disabled || loading}
          className={otherClasses}
          style={{
            opacity: disabled ? 0.5 : 1,
          }}
        >
          {({ pressed }) => (
            <View
              className={`
                ${getSizeStyles()}
                flex-row
                items-center
                justify-center
                rounded-full
                border
                border-grey-plain-50
                bg-primary-tints-50
                ${paddingClasses}
              `}
              style={{
                opacity: pressed ? 0.9 : 1,
              }}
            >
              {buttonContent}
            </View>
          )}
        </Pressable>
      );
    }

    // Default secondary variant with purple border
    // Separate padding classes from margin/other classes
    const paddingClasses = className
      .split(' ')
      .filter(
        (cls) =>
          cls.startsWith('p') &&
          (cls.includes('x') || cls.includes('y') || cls.match(/^p-\d+$/))
      )
      .join(' ');
    const otherClasses = className
      .split(' ')
      .filter(
        (cls) =>
          !cls.startsWith('p') ||
          (!cls.includes('x') && !cls.includes('y') && !cls.match(/^p-\d+$/))
      )
      .join(' ');

    return (
      <Pressable
        onPress={onPress}
        disabled={disabled || loading}
        className={otherClasses}
        style={{
          opacity: disabled ? 0.5 : 1,
        }}
      >
        {({ pressed }) => (
          <View
            className={`
              ${getSizeStyles()}
              flex-row
              items-center
              justify-center
              rounded-2xl
              border
              ${paddingClasses}
            `}
            style={{
              borderColor: colors['primary-tints'].purple['50'],
              backgroundColor: colors['primary-tints'].purple['50'],
              opacity: pressed ? 0.9 : 1,
            }}
          >
            {buttonContent}
          </View>
        )}
      </Pressable>
    );
  }

  const borderWidth = 2;

  // Separate padding classes from margin/other classes
  const paddingClasses = className
    .split(' ')
    .filter(
      (cls) =>
        cls.startsWith('p') &&
        (cls.includes('x') || cls.includes('y') || cls.match(/^p-\d+$/))
    )
    .join(' ');
  const otherClasses = className
    .split(' ')
    .filter(
      (cls) =>
        !cls.startsWith('p') ||
        (!cls.includes('x') && !cls.includes('y') && !cls.match(/^p-\d+$/))
    )
    .join(' ');

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      className={otherClasses}
      style={{
        opacity: disabled ? 0.5 : 1,
      }}
    >
      {({ pressed }) => (
        <LinearGradient
          colors={
            variant === 'destructive'
              ? [colors.state.red, colors.state.red, colors.state.red]
              : [
                  colors.primary['purple-light'],
                  colors['primary-tints']['purple']['200'],
                  colors.primary.purple,
                ]
          }
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
                ${paddingClasses}
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
