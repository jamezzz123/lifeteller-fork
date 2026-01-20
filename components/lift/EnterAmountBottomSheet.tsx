import React, { forwardRef, useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
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
  inputLabel?: string;
  hintText?: string;
  quickAmounts?: number[];
  enableFormattedDisplay?: boolean;
  onClose?: () => void;
  singleRowQuickAmounts?: boolean;
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
      inputLabel = 'Amount',
      hintText = '',
      enableFormattedDisplay = true,
      quickAmounts = QUICK_AMOUNTS,
      onClose,
      singleRowQuickAmounts = false,
    },
    ref
  ) => {
    const [amount, setAmount] = useState(initialAmount);
    const [isFocused, setIsFocused] = useState(false);
    const inputRef =
      useRef<React.ElementRef<typeof BottomSheetTextInput>>(null);
    const bottomSheetRef = useRef<BottomSheetRef>(null);

    // Auto-expand bottom sheet when component mounts
    useEffect(() => {
      // Small delay to ensure bottom sheet is mounted
      const expandTimer = setTimeout(() => {
        bottomSheetRef.current?.expand();
      }, 50);

      return () => clearTimeout(expandTimer);
    }, []);

    // Focus input after bottom sheet expands (delay to allow animation to complete)
    useEffect(() => {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 450); // Delay to ensure bottom sheet animation completes before focusing

      return () => clearTimeout(timer);
    }, []);

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

    const isSelected = (value: number) => amount === value.toString();

    const renderQuickAmounts = () => {
      if (singleRowQuickAmounts) {
        return (
          <View className="mb-6">
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 8 }}
            >
              {quickAmounts.map((value) => (
                <TouchableOpacity
                  key={value}
                  onPress={() => handleQuickAmount(value)}
                  className={`items-center rounded-lg px-5 py-3 ${
                    isSelected(value)
                      ? 'bg-primary-tints-100'
                      : 'bg-grey-plain-150'
                  }`}
                >
                  <Text
                    className={`text-sm font-medium ${
                      isSelected(value) ? 'text-primary' : 'text-grey-alpha-500'
                    }`}
                  >
                    {enableFormattedDisplay ? formatCurrency(value) : value}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        );
      }

      // Original two-row layout
      return (
        <View className="mb-6 gap-2">
          <View className="flex-row gap-2">
            {quickAmounts.slice(0, 3).map((value) => (
              <TouchableOpacity
                key={value}
                onPress={() => handleQuickAmount(value)}
                className={`flex-1 items-center rounded-lg py-3 ${
                  isSelected(value)
                    ? 'bg-primary-tints-100'
                    : 'bg-grey-plain-150'
                }`}
              >
                <Text
                  className={`text-sm font-medium ${
                    isSelected(value) ? 'text-primary' : 'text-grey-alpha-500'
                  }`}
                >
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
                className={`flex-1 items-center rounded-lg py-3 ${
                  isSelected(value)
                    ? 'bg-primary-tints-100'
                    : 'bg-grey-plain-150'
                }`}
              >
                <Text
                  className={`text-sm font-medium ${
                    isSelected(value) ? 'text-primary' : 'text-grey-alpha-500'
                  }`}
                >
                  {enableFormattedDisplay ? formatCurrency(value) : value}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      );
    };

    return (
      <BottomSheetComponent
        ref={bottomSheetRef}
        snapPoints={['50%', '90%']}
        keyboardBehavior="extend"
        android_keyboardInputMode="adjustResize"
        scrollable
        onClose={onClose}
      >
        <View className="flex-1 px-4 pb-6">
          <Text className="mb-6 text-lg font-bold text-grey-alpha-500">
            {title}
          </Text>

          {/* MaterialInput-style Label and Input */}
          <View className="mb-6">
            <Text
              className={`mb-2 font-inter-semibold text-xs ${
                isFocused ? 'text-primary' : 'text-grey-alpha-450'
              }`}
            >
              {inputLabel}
            </Text>
            <View
              className="flex-row items-center pb-3"
              style={{
                borderBottomWidth: isFocused ? 2 : 1,
                borderBottomColor: isFocused
                  ? colors.primary.purple
                  : colors['grey-alpha']['250'],
              }}
            >
              {enableFormattedDisplay && (
                <Text className="mr-2 text-base text-grey-alpha-500">₦</Text>
              )}
              <BottomSheetTextInput
                ref={inputRef}
                value={amount}
                onChangeText={setAmount}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="0"
                keyboardType="numeric"
                placeholderTextColor={colors['grey-alpha']['250']}
                className="flex-1 text-base text-grey-alpha-500"
                style={{
                  fontSize: 16,
                  color: colors['grey-alpha']['500'],
                }}
              />
            </View>
            {hintText && (
              <Text className="mt-2 font-inter text-xs text-grey-alpha-400">
                {hintText}
              </Text>
            )}
          </View>

          {/* Quick Amount Buttons */}
          {renderQuickAmounts()}

          {/* Done Button - aligned right */}
          <View className="flex-row justify-end">
            <Button
              title="Done"
              onPress={handleDone}
              variant="primary"
              size="small"
              disabled={!amount}
            />
          </View>
        </View>
      </BottomSheetComponent>
    );
  }
);

EnterAmountBottomSheet.displayName = 'EnterAmountBottomSheet';
