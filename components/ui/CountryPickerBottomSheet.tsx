import React, { forwardRef, useState, useMemo, useImperativeHandle, useRef } from 'react';
import { View, Text, Pressable, TextInput, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  BottomSheetModal,
  BottomSheetFlatList,
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetHandleProps,
} from '@gorhom/bottom-sheet';
import { Search } from 'lucide-react-native';
import { colors } from '@/theme/colors';
import { themeConfig } from '@/theme/config';
import type { ICountry } from 'react-native-international-phone-number';

export interface BottomSheetRef {
  expand: () => void;
  close: () => void;
}

interface CountryPickerBottomSheetProps {
  countries: ICountry[];
  selectedCountry?: ICountry;
  onSelectCountry: (country: ICountry) => void;
}

// Popular countries that should appear at the top
const POPULAR_COUNTRY_CODES = [
  'NG', // Nigeria
  'US', // United States
  'GB', // United Kingdom
  'CA', // Canada
  'GH', // Ghana
  'KE', // Kenya
  'ZA', // South Africa
  'AE', // UAE
  'IN', // India
  'AU', // Australia
];

export const CountryPickerBottomSheet = forwardRef<
  BottomSheetRef,
  CountryPickerBottomSheetProps
>(({ countries, selectedCountry, onSelectCountry }, ref) => {
  const [searchQuery, setSearchQuery] = useState('');
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const insets = useSafeAreaInsets();

  useImperativeHandle(ref, () => ({
    expand: () => {
      bottomSheetRef.current?.present();
    },
    close: () => {
      bottomSheetRef.current?.dismiss();
    },
  }));

  // Get dial code from country
  const getDialCode = (country: ICountry): string => {
    const root = country.idd?.root || '';
    const suffix = country.idd?.suffixes?.[0] || '';
    return `${root}${suffix}`;
  };

  // Sort and filter countries
  const sortedAndFilteredCountries = useMemo(() => {
    // Filter by search query
    let filtered = countries.filter((country) => {
      const countryName = country.name?.common?.toLowerCase() || '';
      const dialCode = getDialCode(country);
      const query = searchQuery.toLowerCase();

      return (
        countryName.includes(query) ||
        dialCode.includes(query) ||
        country.cca2.toLowerCase().includes(query)
      );
    });

    // Separate into popular and rest
    const popular: ICountry[] = [];
    const rest: ICountry[] = [];

    filtered.forEach((country) => {
      if (POPULAR_COUNTRY_CODES.includes(country.cca2)) {
        popular.push(country);
      } else {
        rest.push(country);
      }
    });

    // Sort popular by the order in POPULAR_COUNTRY_CODES
    popular.sort((a, b) => {
      const indexA = POPULAR_COUNTRY_CODES.indexOf(a.cca2);
      const indexB = POPULAR_COUNTRY_CODES.indexOf(b.cca2);
      return indexA - indexB;
    });

    // Sort rest alphabetically by name
    rest.sort((a, b) => {
      const nameA = a.name?.common || '';
      const nameB = b.name?.common || '';
      return nameA.localeCompare(nameB);
    });

    // Combine: popular first, then rest
    return [...popular, ...rest];
  }, [countries, searchQuery]);

  const handleSelectCountry = (country: ICountry) => {
    onSelectCountry(country);
    setSearchQuery(''); // Clear search when selecting
  };

  const renderCountryItem = ({ item }: { item: ICountry }) => {
    const isSelected = selectedCountry?.cca2 === item.cca2;
    const dialCode = getDialCode(item);

    return (
      <Pressable
        onPress={() => handleSelectCountry(item)}
        className="flex-row items-center gap-3 px-6 py-3"
        style={{
          backgroundColor: isSelected
            ? colors['primary-tints'].purple['100']
            : 'transparent',
        }}
      >
        <Text className="text-2xl">{item.flag}</Text>
        <View className="flex-1">
          <Text
            className="text-base text-grey-alpha-500"
            style={{
              fontFamily: themeConfig.typography.primary.medium,
            }}
          >
            {item.name?.common}
          </Text>
        </View>
        <Text
          className="text-sm text-grey-alpha-400"
          style={{
            fontFamily: themeConfig.typography.primary.normal,
          }}
        >
          {dialCode}
        </Text>
      </Pressable>
    );
  };

  const renderHeader = () => (
    <View style={{ paddingBottom: 16 }}>
      {/* Title */}
      <View className="px-6 pb-4">
        <Text className="text-grey-alpha-550 text-lg font-bold">
          Select Country
        </Text>
      </View>

      {/* Search Input */}
      <View className="px-6">
        <View className="flex-row items-center gap-3 rounded-xl border border-grey-alpha-250 bg-grey-plain-50 px-4">
          <Search size={20} color={colors['grey-alpha']['400']} />
          <TextInput
            placeholder="Search country or code"
            placeholderTextColor={colors['grey-plain']['350']}
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="flex-1 py-3 text-base text-grey-alpha-500"
            style={{
              fontFamily: themeConfig.typography.primary.normal,
            }}
          />
        </View>
      </View>
    </View>
  );

  function renderHandle(props: BottomSheetHandleProps) {
    return (
      <View className="w-full items-center py-3" {...props}>
        <View className="h-1 w-12 rounded-full bg-grey-plain-450" />
      </View>
    );
  }

  function renderBackdrop(props: BottomSheetBackdropProps) {
    return (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
      />
    );
  }

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      snapPoints={['75%']}
      enablePanDownToClose
      handleComponent={renderHandle}
      backdropComponent={renderBackdrop}
      backgroundStyle={styles.container}
    >
      <BottomSheetFlatList
        data={sortedAndFilteredCountries}
        renderItem={renderCountryItem}
        keyExtractor={(item) => item.cca2}
        ListHeaderComponent={renderHeader}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: Math.max(insets.bottom, 32),
        }}
        ListEmptyComponent={
          <View className="py-8">
            <Text className="text-center text-grey-alpha-400">
              No countries found
            </Text>
          </View>
        }
      />
    </BottomSheetModal>
  );
});

CountryPickerBottomSheet.displayName = 'CountryPickerBottomSheet';

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors['grey-plain']['50'],
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
});
