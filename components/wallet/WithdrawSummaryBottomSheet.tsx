import React, { forwardRef } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Lock, Info } from 'lucide-react-native';
import {
  BottomSheetComponent,
  BottomSheetRef,
} from '@/components/ui/BottomSheet';
import { Button } from '@/components/ui/Button';
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

interface WithdrawSummaryBottomSheetProps {
  amount: number;
  bankAccount: BankAccount;
  availableBalance: number;
  narration?: string;
  onWithdraw: () => void;
}

export const WithdrawSummaryBottomSheet = forwardRef<
  BottomSheetRef,
  WithdrawSummaryBottomSheetProps
>(({ amount, bankAccount, availableBalance, narration, onWithdraw }, ref) => {
  const handleWithdraw = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onWithdraw();
  };

  return (
    <BottomSheetComponent ref={ref} snapPoints={['70%']}>
      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        {/* Amount */}
        <View className="mb-6 mt-4">
          <Text className="text-4xl font-bold text-grey-alpha-500">
            {formatAmount(amount, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </Text>
        </View>

        {/* Destination */}
        <View className="mb-6">
          <Text className="mb-3 text-sm font-medium text-grey-alpha-400">
            Destination
          </Text>

          <View className="flex-row items-center gap-3 rounded-xl bg-white p-4">
            {/* Bank icon */}
            <View className="size-12 items-center justify-center rounded-full bg-primary">
              <Text className="text-xs font-bold text-white">
                {bankAccount.bankName.substring(0, 4).toUpperCase()}
              </Text>
            </View>

            {/* Bank details */}
            <View className="flex-1">
              <Text className="mb-1 text-base font-semibold text-grey-alpha-500">
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
          <Info size={16} color={colors['grey-alpha']['400']} strokeWidth={2} />
          <Text className="text-sm text-grey-alpha-500">
            Available balance:{' '}
            <Text
              className="font-semibold"
              style={{ color: colors.primary.purple }}
            >
              {formatAmount(availableBalance, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </Text>
          </Text>
        </View>

        {/* Narration (if provided) */}
        {narration && (
          <View className="mb-6">
            <Text className="mb-2 text-sm font-medium text-grey-alpha-400">
              Narration
            </Text>
            <Text className="text-base text-grey-alpha-500">{narration}</Text>
          </View>
        )}

        {/* Withdraw button */}
        <View className="mb-4">
          <Button
            title="Withdraw"
            onPress={handleWithdraw}
            variant="primary"
            size="large"
            className="w-full"
          />
        </View>

        {/* Security message */}
        <View className="mb-6 flex-row items-center justify-center gap-2">
          <Lock size={16} color={colors['grey-alpha']['400']} strokeWidth={2} />
          <Text className="text-sm text-grey-alpha-400">
            Your payment is secured
          </Text>
        </View>
      </ScrollView>
    </BottomSheetComponent>
  );
});

WithdrawSummaryBottomSheet.displayName = 'WithdrawSummaryBottomSheet';
