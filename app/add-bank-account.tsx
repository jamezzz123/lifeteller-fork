import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { X, Landmark, ChevronRight, Info, Check } from 'lucide-react-native';
import { colors } from '@/theme/colors';
import { Button } from '@/components/ui/Button';
import { ConfirmationModal } from '@/components/ui/ConfirmationModal';
import { Toast } from '@/components/ui/Toast';
import { BankSuggestionsBottomSheet } from '@/components/wallet/BankSuggestionsBottomSheet';
import { BottomSheetRef } from '@/components/ui/BottomSheet';
import { useBankSuggestions } from '@/lib/hooks/queries/useBankSuggestions';
import { useAccountName } from '@/lib/hooks/queries/useAccountName';
import { useAddBankAccount } from '@/lib/hooks/mutations/useAddBankAccount';
import * as Haptics from 'expo-haptics';
import * as Clipboard from 'expo-clipboard';

interface Bank {
  id: string;
  name: string;
  code: string;
}

export default function AddBankAccountScreen() {
  const bankSelectionSheetRef = useRef<BottomSheetRef>(null);
  const [accountNumber, setAccountNumber] = useState<string>('');
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null);
  const [accountName, setAccountName] = useState<string>('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // Debounce account number for bank suggestions
  const [debouncedAccountNumber, setDebouncedAccountNumber] =
    useState<string>('');
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      setDebouncedAccountNumber(accountNumber);
    }, 500);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [accountNumber]);

  // Fetch bank suggestions when account number is entered
  const { data: bankSuggestionsData, isLoading: isLoadingBanks } =
    useBankSuggestions(
      debouncedAccountNumber,
      debouncedAccountNumber.trim().length >= 10
    );

  // Fetch account name when bank is selected
  const { data: accountNameData, isLoading: isLoadingAccountName } =
    useAccountName(
      accountNumber,
      selectedBank?.code || '',
      !!selectedBank && accountNumber.trim().length >= 10
    );

  // Update account name when data is fetched
  useEffect(() => {
    if (accountNameData?.data?.account_name) {
      setAccountName(accountNameData.data.account_name);
    }
  }, [accountNameData]);

  // Reset bank and account name when account number changes
  useEffect(() => {
    if (accountNumber !== debouncedAccountNumber) {
      setSelectedBank(null);
      setAccountName('');
    }
  }, [accountNumber, debouncedAccountNumber]);

  const handleGoBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  const handlePaste = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      const text = await Clipboard.getStringAsync();
      if (text) {
        // Remove non-numeric characters
        const numericText = text.replace(/[^0-9]/g, '');
        setAccountNumber(numericText);
      }
    } catch (error) {
      console.error('Failed to paste:', error);
    }
  };

  const handleAccountNumberChange = (text: string) => {
    // Only allow numeric input
    const numericText = text.replace(/[^0-9]/g, '');
    setAccountNumber(numericText);
    // Reset bank and account name when account number changes
    if (numericText !== accountNumber) {
      setSelectedBank(null);
      setAccountName('');
    }
  };

  const handleSelectBank = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    bankSelectionSheetRef.current?.expand();
  };

  const handleBankSelected = (bank: Bank) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedBank(bank);
    setAccountName(''); // Reset account name to trigger new fetch
  };

  const handleProceed = () => {
    if (accountNumber && selectedBank && accountName) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      setShowConfirmation(true);
    }
  };

  const addBankAccountMutation = useAddBankAccount();

  const handleConfirmAdd = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setShowConfirmation(false);

    if (accountNumber && selectedBank && accountName) {
      addBankAccountMutation.mutate(
        {
          account_number: accountNumber,
          bank_code: selectedBank.code,
          account_name: accountName,
        },
        {
          onSuccess: () => {
            setShowSuccessToast(true);
            setTimeout(() => {
              router.back();
            }, 2000);
          },
          onError: (error) => {
            console.error('Failed to add bank account:', error);
            // TODO: Show error toast
          },
        }
      );
    }
  };

  const handleCancelAdd = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowConfirmation(false);
  };

  const suggestedBanks: Bank[] = bankSuggestionsData?.data || [];
  const canProceed =
    accountNumber.trim().length >= 10 &&
    selectedBank !== null &&
    accountName.trim().length > 0;

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        {/* Header */}
        <View className="flex-row items-center gap-4 border-b border-grey-plain-150 bg-white px-4 py-4">
          <TouchableOpacity onPress={handleGoBack} hitSlop={8}>
            <X size={24} color={colors['grey-alpha']['500']} strokeWidth={2} />
          </TouchableOpacity>
          <Text className="flex-1 text-lg font-semibold text-grey-alpha-500">
            Add a bank
          </Text>
        </View>

        {/* Content */}
        <ScrollView
          className="flex-1 bg-grey-plain-50"
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View className="rounded-t-3xl bg-white px-4 pt-6">
            {/* Info Banner */}
            <View
              className="mb-6 flex-row items-start gap-2 rounded-xl px-4 py-3"
              style={{ backgroundColor: colors['primary-tints'].purple['100'] }}
            >
              <Info
                size={16}
                color={colors.primary.purple}
                strokeWidth={2}
                style={{ marginTop: 2 }}
              />
              <Text
                className="flex-1 text-sm font-medium"
                style={{ color: colors.primary.purple }}
              >
                Please enter an account number that is yours.
              </Text>
            </View>

            {/* Account Number Input */}
            <View className="mb-6">
              <Text className="mb-2 text-base font-semibold text-grey-alpha-500">
                Account number
              </Text>
              <View className="flex-row items-center border-b border-grey-plain-300 pb-2">
                <TextInput
                  value={accountNumber}
                  onChangeText={handleAccountNumberChange}
                  placeholder="Type account number"
                  placeholderTextColor={colors['grey-alpha']['400']}
                  keyboardType="numeric"
                  maxLength={10}
                  className="flex-1 bg-transparent text-base text-grey-alpha-500"
                  style={{
                    fontSize: 16,
                    paddingVertical: 0,
                    minHeight: 40,
                    includeFontPadding: false,
                    textAlignVertical: 'center',
                  }}
                />
                <TouchableOpacity
                  onPress={handlePaste}
                  className="rounded-lg px-3 py-1.5"
                  style={{
                    backgroundColor: colors['primary-tints'].purple['100'],
                  }}
                  activeOpacity={0.7}
                >
                  <Text
                    className="text-sm font-semibold"
                    style={{ color: colors.primary.purple }}
                  >
                    Paste
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Select Bank Section */}
            {accountNumber.trim().length >= 10 && (
              <View className="mb-6">
                <TouchableOpacity
                  onPress={handleSelectBank}
                  disabled={isLoadingBanks || suggestedBanks.length === 0}
                  className="flex-row items-center justify-between"
                  activeOpacity={0.7}
                >
                  <View className="flex-row items-center gap-2">
                    {isLoadingBanks ? (
                      <ActivityIndicator
                        size="small"
                        color={colors.primary.purple}
                      />
                    ) : (
                      <Landmark
                        size={20}
                        color={colors['grey-alpha']['500']}
                        strokeWidth={2}
                      />
                    )}
                    <Text className="text-base font-semibold text-grey-alpha-500">
                      {selectedBank
                        ? selectedBank.name
                        : isLoadingBanks
                          ? 'Loading banks...'
                          : 'Select bank'}
                    </Text>
                  </View>
                  {!isLoadingBanks && suggestedBanks.length > 0 && (
                    <ChevronRight
                      size={20}
                      color={colors['grey-alpha']['500']}
                      strokeWidth={2}
                    />
                  )}
                </TouchableOpacity>
              </View>
            )}

            {/* Account Name Display */}
            {selectedBank && (
              <View className="mb-6">
                {isLoadingAccountName ? (
                  <View className="flex-row items-center gap-2 rounded-xl border border-grey-plain-300 bg-white p-4">
                    <ActivityIndicator
                      size="small"
                      color={colors.primary.purple}
                    />
                    <Text className="text-sm text-grey-alpha-400">
                      Loading account name...
                    </Text>
                  </View>
                ) : accountName ? (
                  <View
                    className="flex-row items-center gap-3 rounded-xl p-4"
                    style={{
                      backgroundColor: colors['green-tint']['100'],
                    }}
                  >
                    <View
                      className="h-6 w-6 items-center justify-center rounded-full"
                      style={{ backgroundColor: colors.state.green }}
                    >
                      <Check size={16} color="#FFFFFF" strokeWidth={3} />
                    </View>
                    <Text className="flex-1 text-base font-semibold text-grey-alpha-500">
                      {accountName}
                    </Text>
                  </View>
                ) : null}
              </View>
            )}
          </View>
        </ScrollView>

        {/* Footer */}
        <View className="absolute bottom-0 left-0 right-0 flex-row items-center justify-between border-t border-grey-plain-150 bg-white px-4 py-4">
          <TouchableOpacity onPress={handleGoBack} hitSlop={8}>
            <Text className="text-base font-medium text-grey-alpha-500">
              Go back
            </Text>
          </TouchableOpacity>
          <Button
            title="Add account"
            onPress={handleProceed}
            variant="primary"
            size="medium"
            disabled={!canProceed || addBankAccountMutation.isPending}
            loading={addBankAccountMutation.isPending}
          />
        </View>
      </KeyboardAvoidingView>

      {/* Bank Suggestions Bottom Sheet */}
      {suggestedBanks.length > 0 && (
        <BankSuggestionsBottomSheet
          ref={bankSelectionSheetRef}
          banks={suggestedBanks}
          onSelectBank={handleBankSelected}
        />
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        visible={showConfirmation}
        title="Add bank account"
        message="Are you sure you want to add this account?"
        confirmText="Yes, add"
        cancelText="No"
        onConfirm={handleConfirmAdd}
        onCancel={handleCancelAdd}
      />

      {/* Success Toast */}
      <Toast
        visible={showSuccessToast}
        message="Bank account added successfully"
        duration={3000}
        onHide={() => setShowSuccessToast(false)}
      />
    </SafeAreaView>
  );
}
