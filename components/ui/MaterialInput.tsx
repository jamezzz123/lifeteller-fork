import React, { useState } from 'react';
import {
  TextInput as RNTextInput,
  View,
  Text,
  TextInputProps as RNTextInputProps,
  Platform,
} from 'react-native';

import { colors } from '@/theme/colors';

interface MaterialInputProps extends Omit<RNTextInputProps, 'style'> {
  label?: string;
  prefix?: string;
  error?: string;
  helperText?: string;
  containerClassName?: string;
  size?: 'small' | 'large';
}

export function MaterialInput({
  label,
  prefix,
  error,
  helperText,
  containerClassName = '',
  size = 'large',
  value,
  ...props
}: MaterialInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const hasValue = value && value.length > 0;

  // Size variants
  const sizeStyles = {
    small: {
      fontSize: 14,
      lineHeight: 20,
      textClass: 'text-sm',
      prefixClass: 'text-sm',
    },
    large: {
      fontSize: 18,
      lineHeight: 24,
      textClass: 'text-lg',
      prefixClass: 'text-lg',
    },
  };

  const currentSize = sizeStyles[size];

  return (
    <View className={containerClassName}>
      {/* Floating Label */}
      {label && (
        <Text
          className={`mb-2 text-xs font-semibold transition-all ${
            isFocused
              ? 'text-primary'
              : error
                ? 'text-red-500'
                : 'text-grey-alpha-450'
          }`}
        >
          {label}
        </Text>
      )}

      {/* Input Container */}
      <View
        className={`flex-row items-center border-b pb-3 ${
          isFocused
            ? 'border-primary'
            : error
              ? 'border-red-500'
              : 'border-grey-alpha-250'
        }`}
        style={{
          borderBottomWidth: isFocused ? 2 : 1,
        }}
      >
        {/* Prefix */}
        {prefix && (
          <Text
            className={`mr-3 ${currentSize.prefixClass}  ${
              isFocused || hasValue
                ? 'text-grey-alpha-500'
                : 'text-grey-alpha-400'
            }`}
          >
            {prefix}
          </Text>
        )}

        {/* Input */}
        <RNTextInput
          {...props}
          value={value}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          placeholderTextColor={colors['grey-alpha']['250']}
          className={`flex-1 ${currentSize.textClass}  text-grey-plain-300`}
          style={{
            // fontFamily: themeConfig.typography.primary.medium,
            fontSize: currentSize.fontSize,
            color: colors['grey-alpha']['500'],
            paddingVertical: 0,
            paddingTop: 0,
            paddingBottom: 0,
            lineHeight: currentSize.lineHeight,
            ...(Platform.OS === 'android' && {
              textAlignVertical: 'center',
              includeFontPadding: false,
            }),
          }}
        />
      </View>

      {/* Error or Helper Text */}
      {error && <Text className="mt-1.5 text-xs text-red-500">{error}</Text>}
      {helperText && !error && (
        <Text className="mt-1.5 text-xs text-grey-alpha-400">{helperText}</Text>
      )}
    </View>
  );
}
