import React, { forwardRef, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import {
  Landmark,
  ChevronRight,
  Info,
  Plus,
} from 'lucide-react-native';
import {
  BottomSheetComponent,
  BottomSheetRef,
} from '@/components/ui/BottomSheet';
import { colors } from '@/theme/colors';
import { formatAmount } from '@/utils/formatAmount';
import * as Haptics from 'expo-haptics';

interface BankAccount {
  id: string;
  accountName: string;
  bankName: string;
  accountNumber: string;
  maskedAccountNumber: string;
}

interface WithdrawFormBottomSheetProps {
  availableBalance: number;
  savedBanks?: BankAccount[];
  selectedBankId?: string | null;
  onBankSelect?: () => void;
  onProceed?: (data: {
    amount: number;
    bankAccountId: string | null;
    narration?: string;
  }) => void;
}

const QUICK_AMOUNTS = [5000, 10000, 20000, 30000, 50000, 100000];

export const WithdrawFormBottomSheet = forwardRef<
  BottomSheetRef,
  WithdrawFormBottomSheetProps
>(
  (
    {
      availableBalance,
      savedBanks = [],
      selectedBankId: externalSelectedBankId,
      onBankSelect,
      onProceed,
    },
    ref
  ) => {
    const [amount, setAmount] = useState<string>('');
    const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
    const [selectedBankId, setSelectedBankId] = useState<string | null>(
      externalSelectedBankId ?? (savedBanks.length > 0 ? savedBanks[0].id : null)
    );
    const [narration, setNarration] = useState<string>('');

    // Update selected bank when prop changes
    useEffect(() => {
      if (externalSelectedBankId !== undefined) {
        setSelectedBankId(externalSelectedBankId);
      }
    }, [externalSelectedBankId]);

    const handleQuickAmountSelect = (quickAmount: number) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setSelectedAmount(quickAmount);
      setAmount(quickAmount.toString());
    };

    const handleAmountChange = (text: string) => {
      // Remove non-numeric characters except decimal point
      const numericText = text.replace(/[^0-9.]/g, '');
      setAmount(numericText);
      setSelectedAmount(null);
    };

    const handleBankSelect = () => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onBankSelect?.();
    };

    const handleBankAccountSelect = (bankId: string) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setSelectedBankId(bankId);
    };

    const handleProceed = () => {
      const numericAmount = parseFloat(amount);
      if (
        numericAmount > 0 &&
        numericAmount <= availableBalance &&
        selectedBankId
      ) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        onProceed?.({
          amount: numericAmount,
          bankAccountId: selectedBankId,
          narration: narration.trim() || undefined,
        });
      }
    };

    const numericAmount = parseFloat(amount) || 0;
    const canProceed =
      numericAmount > 0 &&
      numericAmount <= availableBalance &&
      selectedBankId !== null;

    return (
      <BottomSheetComponent ref={ref} snapPoints={['90%']}>
        <ScrollView
          className="flex-1 px-6"
          showsVerticalScrollIndicator={false}
        >
          {/* Amount to withdraw section */}
          <View className="mb-6">
            <Text className="mb-3 text-base font-inter-semibold text-grey-alpha-500">
              Amount to withdraw
            </Text>

            {/* Amount input */}
            <View className="mb-3">
              <TextInput
                value={amount}
                onChangeText={handleAmountChange}
                placeholder="₦"
                placeholderTextColor={colors['grey-alpha']['400']}
                keyboardType="numeric"
                className="text-3xl font-inter-bold text-grey-alpha-500"
                style={{ fontSize: 32 }}
              />
            </View>

            {/* Available balance info */}
            <View className="mb-4 flex-row items-center gap-2">
              <Info size={16} color={colors.primary.purple} strokeWidth={2} />
              <Text
                className="text-sm font-inter-medium"
                style={{ color: colors.primary.purple }}
              >
                Available balance:{' '}
                {formatAmount(availableBalance, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </Text>
            </View>

            {/* Quick amount buttons */}
            <View className="flex-row flex-wrap gap-3">
              {QUICK_AMOUNTS.map((quickAmount) => {
                const isSelected = selectedAmount === quickAmount;
                const isDisabled = quickAmount > availableBalance;

                return (
                  <TouchableOpacity
                    key={quickAmount}
                    onPress={() => handleQuickAmountSelect(quickAmount)}
                    disabled={isDisabled}
                    className={`rounded-xl border px-4 py-2.5 ${
                      isSelected
                        ? 'border-primary bg-primary/10'
                        : 'border-grey-plain-300 bg-white'
                    } ${isDisabled ? 'opacity-50' : ''}`}
                    activeOpacity={0.7}
                  >
                    <Text
                      className={`text-sm font-inter-semibold ${
                        isSelected
                          ? 'text-primary'
                          : 'text-grey-alpha-500'
                      }`}
                    >
                      {formatAmount(quickAmount)}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Select destination bank section */}
          <View className="mb-6">
            <TouchableOpacity
              onPress={handleBankSelect}
              className="mb-3 flex-row items-center justify-between"
              activeOpacity={0.7}
            >
              <View className="flex-row items-center gap-2">
                <Landmark
                  size={20}
                  color={colors['grey-alpha']['500']}
                  strokeWidth={2}
                />
                <Text className="text-base font-inter-semibold text-grey-alpha-500">
                  Select destination bank
                </Text>
              </View>
              <ChevronRight
                size={20}
                color={colors['grey-alpha']['500']}
                strokeWidth={2}
              />
            </TouchableOpacity>

            {/* Saved bank accounts or add bank button */}
            {savedBanks.length > 0 ? (
              <View className="gap-3">
                {savedBanks.map((bank) => {
                  const isSelected = selectedBankId === bank.id;
                  return (
                    <TouchableOpacity
                      key={bank.id}
                      onPress={() => handleBankAccountSelect(bank.id)}
                      className={`flex-row items-center gap-3 rounded-xl border p-4 ${
                        isSelected
                          ? 'border-primary bg-primary/5'
                          : 'border-grey-plain-300 bg-white'
                      }`}
                      activeOpacity={0.7}
                    >
                      <View
                        className={`size-5 items-center justify-center rounded-full border-2 ${
                          isSelected
                            ? 'border-primary bg-primary'
                            : 'border-grey-plain-300'
                        }`}
                      >
                        {isSelected && (
                          <View className="size-2 rounded-full bg-white" />
                        )}
                      </View>
                      <View className="flex-1">
                        <Text className="text-base font-inter-semibold text-grey-alpha-500">
                          {bank.accountName} - {bank.bankName} (
                          {bank.maskedAccountNumber})
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ) : (
              <TouchableOpacity
                onPress={handleBankSelect}
                className="flex-row items-center justify-center gap-2 rounded-xl border border-primary bg-white p-4"
                activeOpacity={0.7}
              >
                <Plus
                  size={20}
                  color={colors.primary.purple}
                  strokeWidth={2}
                />
                <Text
                  className="text-base font-inter-semibold"
                  style={{ color: colors.primary.purple }}
                >
                  Add a bank
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Optional narration section */}
          <View className="mb-6">
            <Text className="mb-3 text-base font-inter-semibold text-grey-alpha-500">
              Optional narration
            </Text>
            <TextInput
              value={narration}
              onChangeText={setNarration}
              placeholder="Type narration here..."
              placeholderTextColor={colors['grey-alpha']['400']}
              multiline
              numberOfLines={3}
              className="rounded-xl border border-grey-plain-300 bg-white p-4 text-base text-grey-alpha-500"
              style={{
                textAlignVertical: 'top',
                minHeight: 80,
              }}
            />
          </View>

          {/* Action buttons */}
          <View className="mb-6 flex-row gap-3">
            <TouchableOpacity
              onPress={() => {
                if (ref && typeof ref === 'object' && 'current' in ref) {
                  ref.current?.close();
                }
              }}
              className="flex-1 items-center justify-center rounded-xl bg-grey-plain-150 py-4"
              activeOpacity={0.7}
            >
              <Text className="text-base font-inter-semibold text-grey-alpha-500">
                Go back
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleProceed}
              disabled={!canProceed}
              className={`flex-1 items-center justify-center rounded-xl py-4 ${
                canProceed
                  ? 'bg-primary'
                  : 'bg-grey-plain-300'
              }`}
              activeOpacity={0.7}
            >
              <Text
                className={`text-base font-inter-semibold ${
                  canProceed ? 'text-white' : 'text-grey-alpha-400'
                }`}
              >
                Proceed
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </BottomSheetComponent>
    );
  }
);

WithdrawFormBottomSheet.displayName = 'WithdrawFormBottomSheet';
