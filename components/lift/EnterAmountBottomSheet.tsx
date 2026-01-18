import { forwardRef, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import * as Haptics from 'expo-haptics';
import {
  BottomSheetComponent,
  BottomSheetRef,
} from '@/components/ui/BottomSheet';
import { Button } from '@/components/ui/Button';
import { colors } from '@/theme/colors';

interface EnterAmountBottomSheetProps {
  onDone: (amount: string) => void;
  initialAmount?: string;
  title?: string;
  hintText?: string;
  quickAmounts?: number[];
  enableFormattedDisplay?: boolean;
}

const QUICK_AMOUNTS = [5000, 10000, 20000, 30000, 50000, 100000];

export const EnterAmountBottomSheet = forwardRef<
  BottomSheetRef,
  EnterAmountBottomSheetProps
>(
  (
    {
      onDone,
      initialAmount = '',
      title = 'Enter Amount',
      hintText = '',
      enableFormattedDisplay = true,
      quickAmounts = QUICK_AMOUNTS,
    },
    ref
  ) => {
    const [amount, setAmount] = useState(initialAmount);

    const handleQuickAmount = (value: number) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setAmount(value.toString());
    };

    const handleDone = () => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      if (amount) {
        onDone(amount);
      }
    };

    const formatCurrency = (value: number) =>
      new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 0,
      }).format(value);

    return (
      <BottomSheetComponent
        ref={ref}
        snapPoints={['60%', '90%']}
        keyboardBehavior="extend"
        android_keyboardInputMode="adjustResize"
        scrollable
      >
        <View className="px-4 pb-6">
          <Text className="mb-6 text-lg font-bold text-grey-alpha-500">
            {title}
          </Text>
          <Text className="mb-4 text-sm text-grey-alpha-400">{hintText}</Text>

          {/* Amount Input */}
          <View className="mb-6">
            <Text className="mb-2 text-sm text-grey-alpha-400">Amount</Text>
            <View className="flex-row items-center rounded-lg border border-grey-plain-450 bg-white px-4 py-3">
              {enableFormattedDisplay && (
                <Text className="mr-2 text-base text-grey-alpha-500">₦</Text>
              )}
              <BottomSheetTextInput
                value={amount}
                onChangeText={setAmount}
                placeholder="0"
                keyboardType="numeric"
                placeholderTextColor={colors['grey-alpha']['250']}
                className="flex-1 text-base text-grey-alpha-500"
                autoFocus
              />
            </View>
          </View>

          {/* Quick Amount Buttons */}
          <View className="mb-6 gap-2">
            <View className="flex-row gap-2">
              {quickAmounts.slice(0, 3).map((value) => (
                <TouchableOpacity
                  key={value}
                  onPress={() => handleQuickAmount(value)}
                  className="flex-1 items-center rounded-lg bg-grey-plain-150 py-3"
                >
                  <Text className="text-sm font-medium text-grey-alpha-500">
                    {enableFormattedDisplay ? formatCurrency(value) : value}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View className="flex-row gap-2">
              {quickAmounts.slice(3, 6).map((value) => (
                <TouchableOpacity
                  key={value}
                  onPress={() => handleQuickAmount(value)}
                  className="flex-1 items-center rounded-lg bg-grey-plain-150 py-3"
                >
                  <Text className="text-sm font-medium text-grey-alpha-500">
                    {enableFormattedDisplay ? formatCurrency(value) : value}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Done Button */}
          <Button
            title="Done"
            onPress={handleDone}
            variant="primary"
            disabled={!amount}
          />
        </View>
      </BottomSheetComponent>
    );
  }
);

EnterAmountBottomSheet.displayName = 'EnterAmountBottomSheet';
