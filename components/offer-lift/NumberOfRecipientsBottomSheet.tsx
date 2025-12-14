import React, {
  forwardRef,
  useState,
  useRef,
  useImperativeHandle,
} from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Check } from 'lucide-react-native';
import { colors } from '@/theme/colors';
import { Button } from '@/components/ui/Button';
import { MaterialInput } from '@/components/ui/MaterialInput';
import * as Haptics from 'expo-haptics';
import {
  BottomSheetComponent,
  BottomSheetRef,
} from '@/components/ui/BottomSheet';

interface NumberOfRecipientsBottomSheetProps {
  initialValue?: number;
  onConfirm: (numberOfRecipients: number) => void;
}

export type NumberOfRecipientsBottomSheetRef = BottomSheetRef;

const QUICK_OPTIONS = [1, 2, 3, 5, 10];

export const NumberOfRecipientsBottomSheet = forwardRef<
  NumberOfRecipientsBottomSheetRef,
  NumberOfRecipientsBottomSheetProps
>(
  (
    { initialValue = 5, onConfirm }: NumberOfRecipientsBottomSheetProps,
    ref: React.Ref<NumberOfRecipientsBottomSheetRef>
  ) => {
    const bottomSheetRef = useRef<BottomSheetRef>(null);
    const [selectedNumber, setSelectedNumber] = useState(initialValue);

    useImperativeHandle(ref, () => ({
      expand: () => {
        bottomSheetRef.current?.expand();
      },
      close: () => {
        bottomSheetRef.current?.close();
      },
    }));

    const handleSelectNumber = (number: number) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setSelectedNumber(number);
    };

    const handleNumberChange = (text: string) => {
      const cleaned = text.replace(/[^0-9]/g, '');
      const number = cleaned ? parseInt(cleaned, 10) : initialValue;
      setSelectedNumber(number);
    };

    const handleConfirm = () => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      bottomSheetRef.current?.close();
      onConfirm(selectedNumber);
    };

    return (
      <BottomSheetComponent ref={bottomSheetRef}>
        <View className="px-6">
          {/* Title */}
          <Text className="text-2xl font-bold text-grey-alpha-500">
            Offer lift to multiple people
          </Text>

          {/* Number Input */}
          <View className="mt-6">
            <MaterialInput
              label="Number of recipients"
              value={selectedNumber.toString()}
              onChangeText={handleNumberChange}
              keyboardType="numeric"
              placeholder="0"
            />
          </View>

          {/* Quick Selection Buttons */}
          <View className="mt-8 flex-row gap-3">
            {QUICK_OPTIONS.map((number) => {
              const isSelected = selectedNumber === number;
              return (
                <TouchableOpacity
                  key={number}
                  onPress={() => handleSelectNumber(number)}
                  className="flex-1 items-center justify-center rounded-2xl py-4"
                  style={{
                    backgroundColor: isSelected
                      ? colors.primary.purple + '20'
                      : colors['grey-plain']['50'],
                    borderWidth: isSelected ? 0 : 1,
                    borderColor: colors['grey-plain']['450'] + '20',
                  }}
                  activeOpacity={0.7}
                >
                  <View className="relative items-center">
                    <Text
                      className="text-2xl font-semibold"
                      style={{
                        color: isSelected
                          ? colors.primary.purple
                          : colors['grey-alpha']['500'],
                      }}
                    >
                      {number}
                    </Text>
                    {/* {isSelected && (
                      <View
                        className="absolute -right-2 -top-1 rounded-full p-0.5"
                        style={{ backgroundColor: colors.primary.purple }}
                      >
                        <Check size={12} color="white" strokeWidth={3} />
                      </View>
                    )} */}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Done Button */}
          <View className="mt-8">
            <Button title="Done" variant="primary" onPress={handleConfirm} />
          </View>
        </View>
      </BottomSheetComponent>
    );
  }
);

NumberOfRecipientsBottomSheet.displayName = 'NumberOfRecipientsBottomSheet';
