import React, { useState } from 'react';
import {
  TextInput as RNTextInput,
  View,
  Text,
  TextInputProps as RNTextInputProps,
  Pressable,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Info } from 'lucide-react-native';

import { colors } from '@/theme/colors';
import { themeConfig } from '@/theme/config';

interface TextInputProps extends Omit<RNTextInputProps, 'style'> {
  label?: string;
  error?: string;
  helperText?: string;
  showPasswordToggle?: boolean;
  containerClassName?: string;
  rightIcon?: React.ReactNode;
  showLoading?: boolean;
}

export function TextInput({
  label,
  error,
  helperText,
  showPasswordToggle = false,
  containerClassName = '',
  secureTextEntry,
  rightIcon,
  showLoading = false,
  ...props
}: TextInputProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <View className={containerClassName}>
      {label && (
        <Text className="mb-1.5 text-sm font-inter-medium text-grey-alpha-400">
          {label}
        </Text>
      )}
      <View
        className={`
          flex-row
          items-center
          rounded-xl
          border
          bg-grey-plain-50
          px-4
          ${isFocused ? 'border-primary' : 'border-grey-alpha-250'}
          ${error ? 'border-red-500' : ''}
        `}
        style={{
          minHeight: 48,
          height: 48,
        }}
      >
        <RNTextInput
          {...props}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          placeholderTextColor={colors['grey-alpha']['400']}
          className="flex-1 text-base text-grey-alpha-500"
          style={{
            fontFamily: themeConfig.typography.primary.normal,
            fontSize: 16,
            color: colors['grey-alpha']['500'],
            paddingVertical: 0,
            paddingTop: 0,
            paddingBottom: 0,
            lineHeight: 20,
            ...(Platform.OS === 'android' && {
              textAlignVertical: 'center',
              includeFontPadding: false,
            }),
          }}
        />
        {showLoading && (
          <View className="ml-2">
            <ActivityIndicator
              size="small"
              color={colors.primary.purple}
            />
          </View>
        )}
        {rightIcon && !showLoading && (
          <View className="ml-2">{rightIcon}</View>
        )}
        {showPasswordToggle && !showLoading && !rightIcon && (
          <Pressable onPress={togglePasswordVisibility} className="ml-2">
            <Text
              className="text-sm font-inter-medium text-primary"
              style={{
                color: colors.primary.purple,
                fontFamily: themeConfig.typography.primary.semiBold,
              }}
            >
              {isPasswordVisible ? 'Hide' : 'Show'}
            </Text>
          </Pressable>
        )}
      </View>
      {error && <Text className="mt-1 text-sm text-red-500">{error}</Text>}
      {helperText && !error && (
        <View className="mt-1 flex-row items-center gap-1.5">
          <Info size={14} color={colors['grey-alpha']['400']} strokeWidth={2} />
          <Text className="text-sm text-grey-alpha-400">{helperText}</Text>
        </View>
      )}
    </View>
  );
}
