import { forwardRef } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { Wallet, Lock, AlertCircle } from 'lucide-react-native';

import { Button } from '@/components/ui/Button';
import {
  BottomSheetComponent,
  BottomSheetRef,
} from '@/components/ui/BottomSheet';
import { colors } from '@/theme/colors';

type PaymentBottomSheetProps = {
  amount: number;
  walletBalance: number;
  onFundWallet: () => void;
  onProceed: () => void;
};

export const PaymentBottomSheet = forwardRef<
  BottomSheetRef,
  PaymentBottomSheetProps
>(({ amount, walletBalance, onFundWallet, onProceed }, ref) => {
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(value);

  const hasInsufficientBalance = walletBalance < amount;

  return (
    <BottomSheetComponent ref={ref} title="Make payment">
      <View className="px-6">
        {/* Amount Display */}
        <View className="mb-6 flex-row items-center gap-3">
          <View className="rounded-lg bg-primary-tints-100 p-2">
            <Wallet size={24} color={colors.primary.purple} strokeWidth={2} />
          </View>
          <Text className="text-2xl font-inter-bold text-grey-alpha-500">
            {formatCurrency(amount)}
          </Text>
        </View>

        {/* Lift With Section */}
        <Text className="mb-3 text-sm font-inter-semibold text-grey-alpha-450">
          Lift with
        </Text>

        {/* Wallet Payment Option */}
        <TouchableOpacity
          className="mb-4 flex-row items-center justify-between rounded-xl  bg-grey-plain-50 p-4"
          activeOpacity={0.7}
        >
          <View className="flex-row items-center gap-2">
            <View className="rounded-lg bg-grey-alpha-150 p-2">
              <Wallet
                size={20}
                color={colors['grey-alpha']['500']}
                strokeWidth={2}
              />
            </View>
            <View>
              <Text className="mb-1 text-base font-inter-semibold text-grey-alpha-500">
                My wallet {formatCurrency(walletBalance)}
              </Text>
              <Text className="text-xs text-grey-alpha-400">
                Zero transaction charge
              </Text>
            </View>
          </View>

          {/* Radio Button */}
          <View className="size-5 items-center justify-center rounded-full border-2 border-primary">
            <View className="size-3 rounded-full bg-primary" />
          </View>
        </TouchableOpacity>

        {/* Insufficient Balance Warning */}
        {hasInsufficientBalance && (
          <View className="bg-yellow-tint-50 mb-4 flex-row gap-3 rounded-lg p-4">
            <AlertCircle
              size={20}
              color={colors['yellow']['50']}
              strokeWidth={2}
            />
            <Text className="text-gray-alpha-450 flex-1 text-sm leading-5">
              You have insufficient balance. Please fund your wallet.
            </Text>
          </View>
        )}

        {/* Action Button */}
        <View className="mb-4 items-center">
          {hasInsufficientBalance ? (
            <Button
              title="Fund wallet"
              onPress={onFundWallet}
              variant="primary"
              className="w-1/2"
            />
          ) : (
            <Button title="Proceed" onPress={onProceed} variant="primary" />
          )}
        </View>

        {/* Security Footer */}
        <View className="flex-row items-center justify-center gap-2 pb-2">
          <Lock size={16} color={colors['grey-alpha']['400']} strokeWidth={2} />
          <Text className="text-sm text-grey-alpha-400">
            Your payment is secured
          </Text>
        </View>
      </View>
    </BottomSheetComponent>
  );
});

PaymentBottomSheet.displayName = 'PaymentBottomSheet';
