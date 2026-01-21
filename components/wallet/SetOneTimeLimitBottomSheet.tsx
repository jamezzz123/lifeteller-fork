import React, { useState, forwardRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import { Check } from 'lucide-react-native';
import { colors } from '@/theme/colors';
import { Button } from '@/components/ui/Button';
import { formatAmount } from '@/utils/formatAmount';
import {
  formatCurrencyInput,
  parseCurrencyInput,
} from '@/utils/formatCurrencyInput';
import {
  BottomSheetComponent,
  BottomSheetRef,
} from '@/components/ui/BottomSheet';
import * as Haptics from 'expo-haptics';

const PRESET_AMOUNTS = [50000, 100000, 200000, 300000, 500000, 1000000];

interface SetOneTimeLimitBottomSheetProps {
  onDone: (amount: number) => void;
  onClose?: () => void;
}

export const SetOneTimeLimitBottomSheet = forwardRef<
  BottomSheetRef,
  SetOneTimeLimitBottomSheetProps
>(({ onDone, onClose }, ref) => {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');

  // Reset when sheet opens
  useEffect(() => {
    setSelectedAmount(null);
    setCustomAmount('');
  }, []);

  const handleSelectAmount = (amount: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedAmount(amount);
    setCustomAmount(String(amount));
  };

  const handleCustomAmountChange = (text: string) => {
    const numericValue = parseCurrencyInput(text);
    setCustomAmount(numericValue);
    setSelectedAmount(null);
  };

  const handleDone = () => {
    const amount = customAmount ? parseInt(customAmount, 10) : selectedAmount;

    if (!amount || amount <= 0) {
      // TODO: Show error message
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onDone(amount);
  };

  const isDoneEnabled =
    selectedAmount !== null || (customAmount && parseInt(customAmount, 10) > 0);

  return (
    <BottomSheetComponent ref={ref} onClose={onClose}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        <View className="px-6">
          {/* Title */}
          <Text className="mb-6 text-xl font-semibold text-grey-alpha-500">
            Set wallet one-time transaction limit
          </Text>

          {/* Amount Input Field */}
          <View className="mb-6">
            <Text className="mb-2 text-sm font-medium text-grey-alpha-400">
              Amount
            </Text>
            <View className="flex-row items-center border-b border-grey-plain-300 pb-3">
              <Text className="text-2xl font-bold text-grey-alpha-500">₦</Text>
              <TextInput
                value={formatCurrencyInput(customAmount)}
                onChangeText={handleCustomAmountChange}
                placeholder="0"
                placeholderTextColor={colors['grey-alpha']['250']}
                keyboardType="numeric"
                className="ml-2 flex-1 text-2xl font-bold text-grey-alpha-500"
                autoFocus={false}
              />
            </View>
          </View>

          {/* Preset Amount Buttons */}
          <View className="mb-8">
            <View className="flex-row flex-wrap gap-3">
              {PRESET_AMOUNTS.map((amount) => {
                const isSelected = selectedAmount === amount;
                return (
                  <TouchableOpacity
                    key={amount}
                    onPress={() => handleSelectAmount(amount)}
                    className={`flex-1 flex-row items-center justify-center gap-1.5 rounded-lg border px-4 py-3 ${
                      isSelected
                        ? 'border-primary bg-primary-tints-100'
                        : 'border-grey-alpha-250 bg-white'
                    }`}
                    style={{
                      minWidth: '30%',
                    }}
                  >
                    {isSelected && (
                      <Check
                        size={16}
                        color={colors.primary.purple}
                        strokeWidth={2.2}
                      />
                    )}
                    <Text
                      className={`text-sm font-medium ${
                        isSelected ? 'text-primary' : 'text-grey-alpha-450'
                      }`}
                    >
                      {formatAmount(amount)}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Done Button */}
      <View className="border-t border-grey-plain-150 bg-white px-6 pb-4 pt-4">
        <Button
          title="Done"
          onPress={handleDone}
          disabled={!isDoneEnabled}
          variant="primary"
          size="large"
          className="w-full"
        />
      </View>
    </BottomSheetComponent>
  );
});

SetOneTimeLimitBottomSheet.displayName = 'SetOneTimeLimitBottomSheet';
