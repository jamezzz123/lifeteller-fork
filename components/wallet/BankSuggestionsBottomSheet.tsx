import React, { forwardRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Landmark, ChevronRight } from 'lucide-react-native';
import {
  BottomSheetComponent,
  BottomSheetRef,
} from '@/components/ui/BottomSheet';
import { colors } from '@/theme/colors';
import * as Haptics from 'expo-haptics';

interface Bank {
  id: string;
  name: string;
  code: string;
}

interface BankSuggestionsBottomSheetProps {
  banks: Bank[];
  onSelectBank?: (bank: Bank) => void;
}

export const BankSuggestionsBottomSheet = forwardRef<
  BottomSheetRef,
  BankSuggestionsBottomSheetProps
>(({ banks = [], onSelectBank }, ref) => {
  const handleBankSelect = (bank: Bank) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSelectBank?.(bank);
    if (ref && typeof ref === 'object' && 'current' in ref) {
      ref.current?.close();
    }
  };

  return (
    <BottomSheetComponent ref={ref} snapPoints={['60%']}>
      <ScrollView
        className="flex-1 px-4"
        showsVerticalScrollIndicator={false}
      >
        <Text className="mb-4 text-center text-lg font-bold text-grey-alpha-500">
          Select bank
        </Text>

        {/* Bank List */}
        {banks.map((bank, index) => (
          <TouchableOpacity
            key={bank.id || bank.code}
            onPress={() => handleBankSelect(bank)}
            className={`flex-row items-center gap-3 rounded-xl bg-white py-3 px-4 ${
              index < banks.length - 1 ? 'mb-2' : ''
            }`}
            activeOpacity={0.7}
          >
            {/* Bank icon */}
            <View className="size-12 items-center justify-center rounded-full bg-primary">
              <Text className="text-xs font-bold text-white">
                {bank.name.substring(0, 4).toUpperCase()}
              </Text>
            </View>

            {/* Bank name */}
            <View className="flex-1">
              <Text className="text-base font-semibold text-grey-alpha-500">
                {bank.name}
              </Text>
            </View>

            <ChevronRight
              size={20}
              color={colors['grey-alpha']['400']}
              strokeWidth={2}
            />
          </TouchableOpacity>
        ))}

        {/* See all banks option */}
        <TouchableOpacity
          className="mt-2 flex-row items-center gap-3 rounded-xl bg-white py-3 px-4"
          activeOpacity={0.7}
        >
          <View className="size-12 items-center justify-center rounded-full bg-primary/10">
            <Landmark
              size={24}
              color={colors.primary.purple}
              strokeWidth={2}
            />
          </View>

          <View className="flex-1">
            <Text className="text-base font-semibold text-grey-alpha-500">
              See all banks
            </Text>
          </View>

          <ChevronRight
            size={20}
            color={colors['grey-alpha']['400']}
            strokeWidth={2}
          />
        </TouchableOpacity>
      </ScrollView>
    </BottomSheetComponent>
  );
});

BankSuggestionsBottomSheet.displayName = 'BankSuggestionsBottomSheet';
