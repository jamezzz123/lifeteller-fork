import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import {
  CornerUpLeft,
  Landmark,
  ChevronRight,
  Info,
  Check,
} from 'lucide-react-native';
import { colors } from '@/theme/colors';
import { Button } from '@/components/ui/Button';
import { formatAmount } from '@/utils/formatAmount';
import {
  formatCurrencyInput,
  parseCurrencyInput,
} from '@/utils/formatCurrencyInput';
import { BankSelectionBottomSheet } from '@/components/wallet/BankSelectionBottomSheet';
import { WithdrawSummaryBottomSheet } from '@/components/wallet/WithdrawSummaryBottomSheet';
import { WithdrawSuccessBottomSheet } from '@/components/wallet/WithdrawSuccessBottomSheet';
import { PasscodeBottomSheet } from '@/components/ui/PasscodeBottomSheet';
import { BottomSheetRef } from '@/components/ui/BottomSheet';
import * as Haptics from 'expo-haptics';

interface BankAccount {
  id: string;
  accountName: string;
  bankName: string;
  accountNumber: string;
  maskedAccountNumber: string;
}

// Mock saved bank accounts - replace with actual data from API
const MOCK_SAVED_BANKS: BankAccount[] = [
  {
    id: '1',
    accountName: 'Isaac Akinyemi Freeman',
    bankName: 'GTB',
    accountNumber: '1268810810',
    maskedAccountNumber: '1268***810',
  },
  {
    id: '2',
    accountName: 'Isaac Akinyemi Freeman',
    bankName: 'GTB',
    accountNumber: '1268810810',
    maskedAccountNumber: '1268***810',
  },
  {
    id: '3',
    accountName: 'Isaac Akinyemi Freeman',
    bankName: 'GTB',
    accountNumber: '1268810810',
    maskedAccountNumber: '1268***810',
  },
];

const QUICK_AMOUNTS = [5000, 10000, 20000, 30000, 50000, 100000];

// Mock available balance - replace with actual data from API
const MOCK_AVAILABLE_BALANCE = 10000;

export default function WithdrawScreen() {
  const bankSelectionSheetRef = useRef<BottomSheetRef>(null);
  const withdrawSummarySheetRef = useRef<BottomSheetRef>(null);
  const withdrawPasscodeSheetRef = useRef<BottomSheetRef>(null);
  const withdrawSuccessSheetRef = useRef<BottomSheetRef>(null);

  const [amount, setAmount] = useState<string>('');
  const [formattedAmount, setFormattedAmount] = useState<string>('');
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [selectedBankId, setSelectedBankId] = useState<string | null>(
    MOCK_SAVED_BANKS.length > 0 ? MOCK_SAVED_BANKS[0].id : null
  );
  const [narration, setNarration] = useState<string>('');
  const [withdrawPasscodeError, setWithdrawPasscodeError] = useState<
    string | undefined
  >();
  const [withdrawalSuccessData, setWithdrawalSuccessData] = useState<{
    amount: number;
    recipientName: string;
  } | null>(null);

  const handleGoBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  const handleQuickAmountSelect = (quickAmount: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedAmount(quickAmount);
    const numericString = quickAmount.toString();
    setAmount(numericString);
    setFormattedAmount(formatCurrencyInput(numericString));
  };

  const handleAmountChange = (text: string) => {
    // Parse the input to get numeric value
    const numericValue = parseCurrencyInput(text);
    setAmount(numericValue);
    // Format for display
    setFormattedAmount(formatCurrencyInput(numericValue));
    setSelectedAmount(null);
  };

  const handleBankSelect = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    bankSelectionSheetRef.current?.expand();
  };

  const handleBankAccountSelect = (bankId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedBankId(bankId);
  };

  const handleBankSelected = (bankId: string) => {
    setSelectedBankId(bankId);
    bankSelectionSheetRef.current?.close();
  };

  const handleAddNewBank = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    bankSelectionSheetRef.current?.close();
    router.push('/bank-accounts' as any);
  };

  const handleProceed = () => {
    const numericAmount = parseFloat(amount);
    if (
      numericAmount > 0 &&
      numericAmount <= MOCK_AVAILABLE_BALANCE &&
      selectedBankId
    ) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      // Show summary bottom sheet
      withdrawSummarySheetRef.current?.expand();
    }
  };

  const handleWithdrawFromSummary = () => {
    withdrawSummarySheetRef.current?.close();
    setTimeout(() => {
      setWithdrawPasscodeError(undefined);
      withdrawPasscodeSheetRef.current?.expand();
    }, 300);
  };

  const handleWithdrawPasscodeComplete = async (passcode: string) => {
    // TODO: Verify passcode with backend and process withdrawal
    // Mock verification for now
    const CORRECT_PASSCODE = '123456';

    if (passcode === CORRECT_PASSCODE) {
      setWithdrawPasscodeError(undefined);
      withdrawPasscodeSheetRef.current?.close();
      // Show success bottom sheet after a short delay
      setTimeout(() => {
        const numericAmount = parseFloat(amount) || 0;
        const selectedBank = MOCK_SAVED_BANKS.find(
          (bank) => bank.id === selectedBankId
        );
        setWithdrawalSuccessData({
          amount: numericAmount,
          recipientName: selectedBank?.accountName || '',
        });
        withdrawSuccessSheetRef.current?.expand();
      }, 300);
    } else {
      setWithdrawPasscodeError('Incorrect passcode. Please try again.');
    }
  };

  const handleWithdrawForgotPasscode = () => {
    withdrawPasscodeSheetRef.current?.close();
    router.push('/verify-otp');
  };

  const handleSuccessClose = () => {
    withdrawSuccessSheetRef.current?.close();
    setWithdrawalSuccessData(null);
    // Reset form
    setAmount('');
    setFormattedAmount('');
    setSelectedAmount(null);
    setNarration('');
  };

  const handleShareReceipt = () => {
    // TODO: Implement share receipt functionality
    console.log('Share receipt');
  };

  const handleDownloadReceipt = () => {
    // TODO: Implement download receipt functionality
    console.log('Download receipt');
  };

  const numericAmount = parseFloat(amount) || 0;
  const canProceed =
    numericAmount > 0 &&
    numericAmount <= MOCK_AVAILABLE_BALANCE &&
    selectedBankId !== null;

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        {/* Header */}
        <View className="flex-row items-center gap-4 border-b border-grey-plain-150 bg-white px-4 py-4">
          <TouchableOpacity onPress={handleGoBack} hitSlop={8}>
            <CornerUpLeft
              size={24}
              color={colors['grey-alpha']['500']}
              strokeWidth={2}
            />
          </TouchableOpacity>
          <Text className="flex-1 text-lg font-inter-semibold text-grey-alpha-500">
            Withdraw
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
            {/* Amount to withdraw section */}
            <View className="mb-6">
              <Text className="mb-3 text-base font-inter-semibold text-grey-alpha-500">
                Amount to withdraw
              </Text>

              {/* Amount input */}
              <View className="mb-3 border-b border-grey-plain-300 pb-3">
                <View className="flex-row items-center">
                  <Text className="text-3xl font-inter-bold text-grey-alpha-500">
                    ₦{' '}
                  </Text>
                  <TextInput
                    value={formattedAmount}
                    onChangeText={handleAmountChange}
                    placeholder="0"
                    placeholderTextColor={colors['grey-alpha']['400']}
                    keyboardType="numeric"
                    className="flex-1 text-3xl font-inter-bold text-grey-alpha-500"
                    style={{
                      fontSize: 32,
                      lineHeight: 38,
                      paddingVertical: 0,
                      paddingHorizontal: 0,
                      margin: 0,
                      ...(Platform.OS === 'android' && {
                        textAlignVertical: 'center',
                        includeFontPadding: false,
                      }),
                    }}
                  />
                </View>
              </View>

              {/* Available balance info */}
              <View className="mb-4 flex-row items-center gap-2">
                <Info size={16} color={colors.primary.purple} strokeWidth={2} />
                <Text
                  className="text-sm font-inter-medium"
                  style={{ color: colors.primary.purple }}
                >
                  Available balance:{' '}
                  {formatAmount(MOCK_AVAILABLE_BALANCE, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </Text>
              </View>

              {/* Quick amount buttons */}
              <View className="flex-row flex-wrap gap-3">
                {QUICK_AMOUNTS.map((quickAmount) => {
                  const isSelected = selectedAmount === quickAmount;
                  const isDisabled = quickAmount > MOCK_AVAILABLE_BALANCE;
                  // Auto-select if amount matches available balance and no manual selection
                  const matchesBalance =
                    quickAmount === MOCK_AVAILABLE_BALANCE &&
                    selectedAmount === null &&
                    amount === '';

                  return (
                    <TouchableOpacity
                      key={quickAmount}
                      onPress={() => handleQuickAmountSelect(quickAmount)}
                      disabled={isDisabled}
                      className={`rounded-xl border px-4 py-2.5 ${
                        isSelected || matchesBalance
                          ? 'border-primary bg-primary/10'
                          : 'border-grey-plain-300 bg-white'
                      } ${isDisabled ? 'opacity-50' : ''}`}
                      activeOpacity={0.7}
                    >
                      <Text
                        className={`text-sm font-inter-semibold ${
                          isSelected || matchesBalance
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

              {/* Saved bank accounts */}
              {MOCK_SAVED_BANKS.length > 0 && (
                <View className="gap-3">
                  {MOCK_SAVED_BANKS.map((bank) => {
                    const isSelected = selectedBankId === bank.id;
                    return (
                      <TouchableOpacity
                        key={bank.id}
                        onPress={() => handleBankAccountSelect(bank.id)}
                        className="rounded-xl px-4 py-3"
                        style={{
                          backgroundColor: isSelected
                            ? colors['primary-tints'].purple['100']
                            : colors['grey-alpha']['150'],
                        }}
                        activeOpacity={0.7}
                      >
                        <View className="flex-row items-center gap-2">
                          {isSelected && (
                            <Check
                              size={16}
                              color={colors['grey-alpha']['450']}
                              strokeWidth={3}
                            />
                          )}
                          <Text
                            className="flex-1 text-base font-inter-semibold"
                            style={{
                              color: colors['grey-alpha']['450'],
                            }}
                          >
                            {bank.accountName} - {bank.bankName} (
                            {bank.maskedAccountNumber})
                          </Text>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
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
          </View>
        </ScrollView>

        {/* Footer */}
        <View className="absolute bottom-0 left-0 right-0 flex-row items-center justify-between border-t border-grey-plain-150 bg-white px-4 py-4">
          <TouchableOpacity onPress={handleGoBack} hitSlop={8}>
            <Text className="text-base font-inter-medium text-grey-alpha-500">
              Go back
            </Text>
          </TouchableOpacity>
          <Button
            title="Proceed"
            onPress={handleProceed}
            variant="primary"
            size="medium"
            disabled={!canProceed}
          />
        </View>
      </KeyboardAvoidingView>

      {/* Bank Selection Bottom Sheet */}
      <BankSelectionBottomSheet
        ref={bankSelectionSheetRef}
        savedBanks={MOCK_SAVED_BANKS}
        onSelectBank={handleBankSelected}
        onAddNewBank={handleAddNewBank}
      />

      {/* Withdraw Summary Bottom Sheet */}
      {selectedBankId && (
        <WithdrawSummaryBottomSheet
          ref={withdrawSummarySheetRef}
          amount={parseFloat(amount) || 0}
          bankAccount={
            MOCK_SAVED_BANKS.find((bank) => bank.id === selectedBankId)!
          }
          availableBalance={MOCK_AVAILABLE_BALANCE}
          narration={narration.trim() || undefined}
          onWithdraw={handleWithdrawFromSummary}
        />
      )}

      {/* Withdraw Passcode Bottom Sheet */}
      <PasscodeBottomSheet
        ref={withdrawPasscodeSheetRef}
        title="Enter your passcode"
        onComplete={handleWithdrawPasscodeComplete}
        onForgotPasscode={handleWithdrawForgotPasscode}
        error={withdrawPasscodeError}
        mode="verify"
      />

      {/* Withdraw Success Bottom Sheet */}
      {withdrawalSuccessData && (
        <WithdrawSuccessBottomSheet
          ref={withdrawSuccessSheetRef}
          amount={withdrawalSuccessData.amount}
          recipientName={withdrawalSuccessData.recipientName}
          onClose={handleSuccessClose}
          onShareReceipt={handleShareReceipt}
          onDownloadReceipt={handleDownloadReceipt}
        />
      )}
    </SafeAreaView>
  );
}
