import React, { forwardRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Landmark, ChevronRight, Plus } from 'lucide-react-native';
import {
  BottomSheetComponent,
  BottomSheetRef,
} from '@/components/ui/BottomSheet';
import { colors } from '@/theme/colors';
import * as Haptics from 'expo-haptics';

interface BankAccount {
  id: string;
  accountName: string;
  bankName: string;
  accountNumber: string;
  maskedAccountNumber: string;
}

interface BankSelectionBottomSheetProps {
  savedBanks?: BankAccount[];
  onSelectBank?: (bankId: string) => void;
  onAddNewBank?: () => void;
}

export const BankSelectionBottomSheet = forwardRef<
  BottomSheetRef,
  BankSelectionBottomSheetProps
>(({ savedBanks = [], onSelectBank, onAddNewBank }, ref) => {
  const handleBankSelect = (bankId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSelectBank?.(bankId);
    if (ref && typeof ref === 'object' && 'current' in ref) {
      ref.current?.close();
    }
  };

  const handleAddNewBank = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onAddNewBank?.();
    if (ref && typeof ref === 'object' && 'current' in ref) {
      ref.current?.close();
    }
  };

  return (
    <BottomSheetComponent ref={ref} snapPoints={['60%']}>
      <ScrollView
        className="flex-1 px-6"
        showsVerticalScrollIndicator={false}
      >
        <Text className="mb-4 text-base font-semibold text-grey-alpha-500">
          Choose an option
        </Text>

        {/* Saved bank accounts */}
        {savedBanks.map((bank, index) => (
          <TouchableOpacity
            key={bank.id}
            onPress={() => handleBankSelect(bank.id)}
            className={`flex-row items-center gap-3 rounded-xl bg-white p-4 ${
              index < savedBanks.length - 1 ? 'mb-3' : ''
            }`}
            activeOpacity={0.7}
          >
            {/* Bank icon placeholder - using purple circle with bank initials */}
            <View className="size-12 items-center justify-center rounded-full bg-primary">
              <Text className="text-xs font-bold text-white">
                {bank.bankName.substring(0, 4).toUpperCase()}
              </Text>
            </View>

            {/* Bank details */}
            <View className="flex-1">
              <Text className="mb-1 text-base font-semibold text-grey-alpha-500">
                {bank.accountName}
              </Text>
              <Text className="text-sm text-grey-plain-550">
                {bank.bankName} • {bank.accountNumber}
              </Text>
            </View>

            <ChevronRight
              size={20}
              color={colors['grey-alpha']['400']}
              strokeWidth={2}
            />
          </TouchableOpacity>
        ))}

        {/* Add new bank option */}
        <TouchableOpacity
          onPress={handleAddNewBank}
          className="mt-3 flex-row items-center gap-3 rounded-xl bg-white p-4"
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
              Add a new account details
            </Text>
          </View>

          <Plus
            size={20}
            color={colors['grey-alpha']['400']}
            strokeWidth={2}
          />
        </TouchableOpacity>
      </ScrollView>
    </BottomSheetComponent>
  );
});

BankSelectionBottomSheet.displayName = 'BankSelectionBottomSheet';
