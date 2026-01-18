import React, { useState, useRef, useMemo } from 'react';
import {
  TextInput as RNTextInput,
  View,
  Text,
  TextInputProps as RNTextInputProps,
  Pressable,
  Platform,
} from 'react-native';
import { ChevronDown } from 'lucide-react-native';
import { getAllCountries, type ICountry } from 'react-native-international-phone-number';

import { colors } from '@/theme/colors';
import { themeConfig } from '@/theme/config';
import { CountryPickerBottomSheet } from './CountryPickerBottomSheet';
import { BottomSheetRef } from './BottomSheet';

interface PhoneInputProps extends Omit<RNTextInputProps, 'style'> {
  label?: string;
  error?: string;
  helperText?: string;
  containerClassName?: string;
  onCountryChange?: (country: ICountry) => void;
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
  const bottomSheetRef = useRef<BottomSheetRef>(null);

  // Get all countries from package
  const allCountries = useMemo(() => getAllCountries(), []);

  // Default to Nigeria
  const [selectedCountry, setSelectedCountry] = useState<ICountry>(() => {
    return allCountries.find((c) => c.cca2 === 'NG') || allCountries[0];
  });

  const handleCountryPress = () => {
    bottomSheetRef.current?.expand();
  };

  const handleSelectCountry = (country: ICountry) => {
    setSelectedCountry(country);
    onCountryChange?.(country);
    bottomSheetRef.current?.close();
  };

  // Get dial code from selected country
  const getDialCode = (country: ICountry): string => {
    const root = country.idd?.root || '';
    const suffix = country.idd?.suffixes?.[0] || '';
    return `${root}${suffix}`;
  };

  return (
    <>
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
              {getDialCode(selectedCountry)}
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
            placeholderTextColor={colors['grey-plain']['350']}
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

      {/* Country Picker Bottom Sheet - Rendered outside container to appear on full screen */}
      <CountryPickerBottomSheet
        ref={bottomSheetRef}
        countries={allCountries}
        selectedCountry={selectedCountry}
        onSelectCountry={handleSelectCountry}
      />
    </>
  );
}
