import React, { useState } from 'react';
import {
  TextInput as RNTextInput,
  View,
  Text,
  TextInputProps as RNTextInputProps,
  Pressable,
  Platform,
} from 'react-native';
import { ChevronDown } from 'lucide-react-native';

import { colors } from '@/theme/colors';
import { themeConfig } from '@/theme/config';

interface Country {
  code: string;
  dialCode: string;
  flag: string; // Emoji flag
  name: string;
}

const COUNTRIES: Country[] = [
  { code: 'NG', dialCode: '+234', flag: '🇳🇬', name: 'Nigeria' },
  { code: 'US', dialCode: '+1', flag: '🇺🇸', name: 'United States' },
  { code: 'GB', dialCode: '+44', flag: '🇬🇧', name: 'United Kingdom' },
  // Add more countries as needed
];

interface PhoneInputProps extends Omit<RNTextInputProps, 'style'> {
  label?: string;
  error?: string;
  helperText?: string;
  containerClassName?: string;
  onCountryChange?: (country: Country) => void;
}

export function PhoneInput({
  label,
  error,
  helperText,
  containerClassName = '',
  onCountryChange,
  ...props
}: PhoneInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<Country>(COUNTRIES[0]);

  const handleCountryPress = () => {
    // TODO: Open country picker modal/sheet
    // For now, just cycle through countries as a placeholder
    const currentIndex = COUNTRIES.findIndex(
      (c) => c.code === selectedCountry.code
    );
    const nextIndex = (currentIndex + 1) % COUNTRIES.length;
    const nextCountry = COUNTRIES[nextIndex];
    setSelectedCountry(nextCountry);
    onCountryChange?.(nextCountry);
  };

  return (
    <View className={containerClassName}>
      {label && (
        <Text className="mb-1.5 text-sm font-medium text-grey-alpha-400">
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
        {/* Country Selector */}
        <Pressable
          onPress={handleCountryPress}
          className="flex-row items-center gap-2"
        >
          <Text className="text-xl">{selectedCountry.flag}</Text>
          <Text
            className="text-base text-grey-alpha-500"
            style={{
              fontFamily: themeConfig.typography.primary.normal,
              color: colors['grey-alpha']['500'],
            }}
          >
            {selectedCountry.dialCode}
          </Text>
          <ChevronDown
            size={16}
            color={colors['grey-alpha']['400']}
            strokeWidth={2}
          />
        </Pressable>

        {/* Separator */}
        <View
          className="mx-3 h-6 w-px bg-grey-plain-300"
          style={{ backgroundColor: colors['grey-plain']['300'] }}
        />

        {/* Phone Number Input */}
        <RNTextInput
          {...props}
          keyboardType="phone-pad"
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
      </View>
      {error && <Text className="mt-1 text-sm text-red-500">{error}</Text>}
      {helperText && !error && (
        <View className="mt-1 flex-row items-center">
          <Text className="text-sm text-grey-alpha-400">{helperText}</Text>
        </View>
      )}
    </View>
  );
}
