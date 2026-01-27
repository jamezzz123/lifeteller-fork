import React, { forwardRef, useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import {
  BottomSheetComponent,
  BottomSheetRef,
} from '@/components/ui/BottomSheet';
import { Button } from '@/components/ui/Button';
import { colors } from '@/theme/colors';

const TIME_RANGE_OPTIONS = ['All time', 'This week', 'This month'];

interface TimeRangeBottomSheetProps {
  selectedRange?: string;
  onApply: (range: string) => void;
  onClose?: () => void;
}

export const TimeRangeBottomSheet = forwardRef<
  BottomSheetRef,
  TimeRangeBottomSheetProps
>(({ selectedRange, onApply, onClose }, ref) => {
  const [activeRange, setActiveRange] = useState(
    selectedRange || TIME_RANGE_OPTIONS[0]
  );

  useEffect(() => {
    if (selectedRange) setActiveRange(selectedRange);
  }, [selectedRange]);

  const handleClose = () => {
    if (ref && typeof ref !== 'function' && ref.current) {
      ref.current.close();
    }
    onClose?.();
  };

  const handleApply = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onApply(activeRange);
    handleClose();
  };

  const handleSelectRange = (range: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setActiveRange(range);
  };

  return (
    <BottomSheetComponent ref={ref} onClose={onClose}>
      <View className="px-6 pb-4 pt-2">
        <Text className="text-lg font-semibold text-grey-alpha-500">
          Time range
        </Text>

        <View className="mt-4 flex-row flex-wrap gap-3">
          {TIME_RANGE_OPTIONS.map((option) => {
            const isSelected = activeRange === option;
            return (
              <TouchableOpacity
                key={option}
                onPress={() => handleSelectRange(option)}
                className="rounded-full px-4 py-2"
                style={{
                  backgroundColor: isSelected
                    ? colors['primary-tints'].purple['100']
                    : colors['grey-plain']['50'],
                  borderWidth: 1,
                  borderColor: isSelected
                    ? colors.primary.purple
                    : colors['grey-plain']['300'],
                }}
                activeOpacity={0.7}
              >
                <Text
                  className="text-sm font-medium"
                  style={{
                    color: isSelected
                      ? colors.primary.purple
                      : colors['grey-alpha']['500'],
                  }}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View className="mt-8 items-end">
          <Button title="Apply filter" onPress={handleApply} size="medium" />
        </View>
      </View>
    </BottomSheetComponent>
  );
});

TimeRangeBottomSheet.displayName = 'TimeRangeBottomSheet';
