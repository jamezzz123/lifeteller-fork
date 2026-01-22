import React, { forwardRef, useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { Check } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import {
  BottomSheetComponent,
  BottomSheetRef,
} from '@/components/ui/BottomSheet';
import { Button } from '@/components/ui/Button';
import { colors } from '@/theme/colors';

interface QuantityBottomSheetProps {
  onDone: (quantity: string) => void;
  initialQuantity?: string;
  onClose?: () => void;
}

const QUICK_OPTIONS = ['1', '3', '5', 'Unlimited'];

export const QuantityBottomSheet = forwardRef<
  BottomSheetRef,
  QuantityBottomSheetProps
>(({ onDone, initialQuantity = '1', onClose }, ref) => {
  const [quantity, setQuantity] = useState(initialQuantity);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef =
    useRef<React.ElementRef<typeof BottomSheetTextInput>>(null);
  const bottomSheetRef = useRef<BottomSheetRef>(null);

  useEffect(() => {
    const expandTimer = setTimeout(() => {
      bottomSheetRef.current?.expand();
    }, 50);

    return () => clearTimeout(expandTimer);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 450);

    return () => clearTimeout(timer);
  }, []);

  const handleQuickOption = (option: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setQuantity(option);
  };

  const handleDone = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (quantity) {
      onDone(quantity);
    }
  };

  const handleInputChange = (text: string) => {
    const cleaned = text.replace(/[^0-9]/g, '');
    setQuantity(cleaned || '');
  };

  const isSelected = (option: string) => quantity === option;

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
          Quantity a user can request
        </Text>

        {/* Input */}
        <View className="mb-6">
          <Text
            className={`mb-2 font-inter-semibold text-xs ${
              isFocused ? 'text-primary' : 'text-grey-alpha-450'
            }`}
          >
            Type quantity here
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
            <BottomSheetTextInput
              ref={inputRef}
              value={quantity === 'Unlimited' ? '' : quantity}
              onChangeText={handleInputChange}
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
        </View>

        {/* Quick Options */}
        <View className="mb-6 flex-row gap-2">
          {QUICK_OPTIONS.map((option) => {
            const selected = isSelected(option);
            return (
              <TouchableOpacity
                key={option}
                onPress={() => handleQuickOption(option)}
                className={`flex-1 flex-row items-center justify-center gap-1.5 rounded-lg py-3 ${
                  selected ? 'bg-primary-tints-100' : 'bg-grey-plain-150'
                }`}
                style={{
                  borderWidth: selected ? 0 : 1,
                  borderColor: colors['grey-plain']['300'],
                }}
              >
                {selected && (
                  <Check
                    size={16}
                    color={colors.primary.purple}
                    strokeWidth={2.5}
                  />
                )}
                <Text
                  className={`text-sm font-medium ${
                    selected ? 'text-primary' : 'text-grey-alpha-500'
                  }`}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Done Button */}
        <View className="flex-row justify-end">
          <Button
            title="Done"
            onPress={handleDone}
            variant="primary"
            size="small"
            disabled={!quantity}
          />
        </View>
      </View>
    </BottomSheetComponent>
  );
});

QuantityBottomSheet.displayName = 'QuantityBottomSheet';
