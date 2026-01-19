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
  suffix?: string;
  error?: string;
  helperText?: string;
  containerClassName?: string;
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  showCharacterCount?: boolean;
  showCharacterCountBelow?: boolean;
  maxCharacters?: number;
 
}

export function MaterialInput({
  label,
  prefix,
  suffix,
  error,
  helperText,
  containerClassName = '',
  size = 'large',
  value,
  showCharacterCount = false,
  showCharacterCountBelow = false,
  maxCharacters,
  multiline = false,
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
    medium: {
      fontSize: 16,
      lineHeight: 22,
      textClass: 'text-base',
      prefixClass: 'text-base',
    },
    large: {
      fontSize: 18,
      lineHeight: 24,
      textClass: 'text-lg',
      prefixClass: 'text-lg',
    },
    xlarge: {
      fontSize: 20,
      lineHeight: 26,
      textClass: 'text-xl',
      prefixClass: 'text-xl',
    },
  };

  const currentSize = sizeStyles[size];

  return (
    <View className={containerClassName}>
      {/* Floating Label */}
      {label && (
        <Text
          className={`font-inter-semibold mb-2 text-xs transition-all ${
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
        className={`flex-row  pb-3 ${multiline ? 'items-start' : 'items-center'} ${
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
            className={`font-inter mr-3 ${currentSize.prefixClass} ${multiline ? 'pt-0.5' : ''} ${
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
          multiline={multiline}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          placeholderTextColor={colors['grey-alpha']['250']}
          className={`font-inter flex-1 ${currentSize.textClass} text-grey-plain-300`}
          style={{
            fontSize: currentSize.fontSize,
            color: colors['grey-alpha']['500'],
            paddingVertical: 0,
            paddingTop: 0,
            paddingBottom: 0,
            lineHeight: currentSize.lineHeight,
            ...(multiline && {
              maxHeight: 200,
              textAlignVertical: 'top',
            }),
            ...(Platform.OS === 'android' && {
              textAlignVertical: multiline ? 'top' : 'center',
              includeFontPadding: false,
            }),
          }}
        />

        {/* Suffix (Character Count or Custom) */}
        {(suffix || showCharacterCount) && (
          <Text
            className={`font-inter ml-3 ${currentSize.prefixClass} text-grey-alpha-400`}
            style={{
              alignSelf: 'flex-end',
              paddingBottom: 2,
            }}
          >
            {suffix ||
              (showCharacterCount && maxCharacters
                ? `${value?.length || 0}/${maxCharacters}`
                : '')}
          </Text>
        )}
      </View>
  {showCharacterCountBelow && (
          <Text
            className={`font-inter -mb-5 text-xs mt-2 ml-3 ${currentSize.prefixClass} text-grey-alpha-400`}
            style={{
              alignSelf: 'flex-end',
            }}
          >
            {
              (showCharacterCountBelow && maxCharacters
                ? `${value?.length || 0}/${maxCharacters}`
                : '')}
          </Text>
        )}
      {/* Error or Helper Text */}
      {error && <Text className="font-inter mt-1.5 text-xs text-red-500">{error}</Text>}
      {helperText && !error && (
        <Text className="font-inter mt-1 text-xs text-grey-alpha-400">{helperText}</Text>
      )}
    </View>
  );
}
