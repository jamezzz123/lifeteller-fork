import { forwardRef, useState } from 'react';
import { Text, View, Pressable } from 'react-native';
import DatePicker from 'react-native-date-picker';
import { Calendar } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

import { colors } from '@/theme/colors';
import { Button } from '@/components/ui/Button';
import { BottomSheetComponent, BottomSheetRef } from '@/components/ui/BottomSheet';

type ScheduleRequestBottomSheetProps = {
  onDone: (date: Date) => void;
  initialDate?: Date;
};

function formatDateTime(date: Date) {
  return `${date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })} at ${date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })}`;
}

export const ScheduleRequestBottomSheet = forwardRef<
  BottomSheetRef,
  ScheduleRequestBottomSheetProps
>(({ onDone, initialDate }, ref) => {
  const [selectedDate, setSelectedDate] = useState<Date>(initialDate || new Date());
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  function handleOpenPicker() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsPickerOpen(true);
  }

  function handleDateConfirm(date: Date) {
    setSelectedDate(date);
    setIsPickerOpen(false);
  }

  function handleDone() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onDone(selectedDate);
    if (typeof ref !== 'function' && ref?.current) {
      ref.current.close();
    }
  }

  return (
    <BottomSheetComponent ref={ref} snapPoints={['40%']}>
      <View className="px-4">
        {/* Header */}
        <View className="mb-6">
          <Text className="text-center font-inter-bold text-lg text-grey-alpha-500">
            Schedule request
          </Text>
          <Text className="mt-1 text-center font-inter text-sm text-grey-alpha-400">
            Choose date and time below.
          </Text>
        </View>

        {/* Date/Time Selector */}
        <Pressable
          onPress={handleOpenPicker}
          className="mb-6 flex-row items-center justify-between rounded-xl border border-grey-plain-300 bg-white px-4 py-4"
        >
          <Text className="flex-1 font-inter-medium text-base text-grey-alpha-500">
            {formatDateTime(selectedDate)}
          </Text>
          <Calendar size={20} color={colors['grey-alpha']['400']} strokeWidth={2} />
        </Pressable>

        {/* Native Date Picker Modal */}
        {isPickerOpen && (
          <DatePicker
            modal
            open={isPickerOpen}
            date={selectedDate}
            mode="datetime"
            minimumDate={new Date()}
            onConfirm={handleDateConfirm}
            onCancel={() => setIsPickerOpen(false)}
          />
        )}

        {/* Done Button */}
        <View className="mt-2">
          <Button
            title="Done"
            onPress={handleDone}
            variant="primary"
            size="large"
          />
        </View>
      </View>
    </BottomSheetComponent>
  );
});

ScheduleRequestBottomSheet.displayName = 'ScheduleRequestBottomSheet';
