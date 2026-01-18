import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { CornerUpLeft, Lock, Info } from 'lucide-react-native';
import { colors } from '@/theme/colors';
import { formatAmount } from '@/utils/formatAmount';
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
    bankName: 'FCMB',
    accountNumber: '1209708991',
    maskedAccountNumber: '1209***991',
  },
];

// Mock available balance - replace with actual data from API
const MOCK_AVAILABLE_BALANCE = 90000;

export default function WithdrawSummaryScreen() {
  const params = useLocalSearchParams<{
    amount: string;
    bankAccountId: string;
    narration?: string;
  }>();
  
  const withdrawPasscodeSheetRef = useRef<BottomSheetRef>(null);
  const [withdrawPasscodeError, setWithdrawPasscodeError] = useState<
    string | undefined
  >();

  const amount = parseFloat(params.amount || '0');
  const bankAccount = MOCK_SAVED_BANKS.find(
    (bank) => bank.id === params.bankAccountId
  );

  const handleGoBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  const handleWithdraw = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setWithdrawPasscodeError(undefined);
    withdrawPasscodeSheetRef.current?.expand();
  };

  const handleWithdrawPasscodeComplete = async (passcode: string) => {
    // TODO: Verify passcode with backend and process withdrawal
    // Mock verification for now
    const CORRECT_PASSCODE = '123456';

    if (passcode === CORRECT_PASSCODE) {
      setWithdrawPasscodeError(undefined);
      withdrawPasscodeSheetRef.current?.close();
      // Navigate to success screen after a short delay
      setTimeout(() => {
        router.push({
          pathname: '/withdraw-success' as any,
          params: {
            amount: amount.toString(),
            recipientName: bankAccount?.accountName || '',
          },
        });
      }, 300);
    } else {
      setWithdrawPasscodeError('Incorrect passcode. Please try again.');
    }
  };

  const handleWithdrawForgotPasscode = () => {
    withdrawPasscodeSheetRef.current?.close();
    router.push('/verify-otp');
  };

  if (!bankAccount || !amount) {
    // Invalid params, go back
    router.back();
    return null;
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'bottom']}>
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
          Summary
        </Text>
      </View>

      {/* Content */}
      <ScrollView
        className="flex-1 bg-grey-plain-50"
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="rounded-t-3xl bg-white px-4 pt-6">
          {/* Amount */}
          <View className="mb-6 items-center">
            <Text className="text-4xl font-inter-bold text-grey-alpha-500">
              {formatAmount(amount, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </Text>
          </View>

          {/* Destination */}
          <View className="mb-6">
            <Text className="mb-3 text-sm font-inter-medium text-grey-alpha-400">
              Destination
            </Text>

            <View className="flex-row items-center gap-3 rounded-xl bg-white p-4">
              {/* Bank icon */}
              <View className="size-12 items-center justify-center rounded-full bg-primary">
                <Text className="text-xs font-inter-bold text-white">
                  {bankAccount.bankName.substring(0, 4).toUpperCase()}
                </Text>
              </View>

              {/* Bank details */}
              <View className="flex-1">
                <Text className="mb-1 text-base font-inter-semibold text-grey-alpha-500">
                  {bankAccount.accountName}
                </Text>
                <Text className="text-sm text-grey-plain-550">
                  {bankAccount.bankName} • {bankAccount.accountNumber}
                </Text>
              </View>
            </View>
          </View>

          {/* Available balance info */}
          <View className="mb-6 flex-row items-center gap-2">
            <Info
              size={16}
              color={colors['grey-alpha']['400']}
              strokeWidth={2}
            />
            <Text className="text-sm text-grey-alpha-500">
              Available balance:{' '}
              <Text
                className="font-inter-semibold"
                style={{ color: colors.primary.purple }}
              >
                {formatAmount(MOCK_AVAILABLE_BALANCE, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </Text>
            </Text>
          </View>

          {/* Narration (if provided) */}
          {params.narration && (
            <View className="mb-6">
              <Text className="mb-2 text-sm font-inter-medium text-grey-alpha-400">
                Narration
              </Text>
              <Text className="text-base text-grey-alpha-500">
                {params.narration}
              </Text>
            </View>
          )}

          {/* Security message */}
          <View className="mb-6 flex-row items-center justify-center gap-2">
            <Lock
              size={16}
              color={colors['grey-alpha']['400']}
              strokeWidth={2}
            />
            <Text className="text-sm text-grey-alpha-400">
              Your payment is secured
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View className="absolute bottom-0 left-0 right-0 border-t border-grey-plain-150 bg-white px-4 py-4">
        <TouchableOpacity
          onPress={handleWithdraw}
          className="items-center justify-center rounded-xl bg-primary py-4"
          activeOpacity={0.8}
        >
          <Text className="text-base font-inter-semibold text-white">Withdraw</Text>
        </TouchableOpacity>
      </View>

      {/* Withdraw Passcode Bottom Sheet */}
      <PasscodeBottomSheet
        ref={withdrawPasscodeSheetRef}
        title="Enter your passcode"
        onComplete={handleWithdrawPasscodeComplete}
        onForgotPasscode={handleWithdrawForgotPasscode}
        error={withdrawPasscodeError}
        mode="verify"
      />
    </SafeAreaView>
  );
}
