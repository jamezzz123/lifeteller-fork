import { forwardRef, useState } from 'react';
import { Text, View, Platform, Pressable } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Calendar } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

import { colors } from '@/theme/colors';
import { Button } from '@/components/ui/Button';
import {
  BottomSheetComponent,
  BottomSheetRef,
} from '@/components/ui/BottomSheet';

type CalendarBottomSheetProps = {
  onDone: (date: Date) => void;
  initialDate?: Date;
  title?: string;
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

export const CalendarBottomSheet = forwardRef<
  BottomSheetRef,
  CalendarBottomSheetProps
>(({ onDone, initialDate, title }, ref) => {
  const [selectedDate, setSelectedDate] = useState<Date>(
    initialDate || new Date()
  );
  const [showAndroidPicker, setShowAndroidPicker] = useState<
    'date' | 'time' | null
  >(null);

  function handleDone() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onDone(selectedDate);
    if (typeof ref !== 'function' && ref?.current) {
      ref.current.close();
    }
  }

  return (
    <BottomSheetComponent
      ref={ref}
      snapPoints={[Platform.OS === 'ios' ? '45%' : '40%']}
    >
      <View className="px-4">
        {/* Header */}
        <View className="mb-4">
          <Text className="text-center font-inter-bold text-lg text-grey-alpha-500">
            {title}
          </Text>
          <Text className="mt-1 text-center font-inter text-sm text-grey-alpha-400">
            Choose date and time below.
          </Text>
        </View>

        {Platform.OS === 'ios' ? (
          /* iOS: inline spinner */
          <DateTimePicker
            value={selectedDate}
            mode="datetime"
            display="spinner"
            minimumDate={new Date()}
            themeVariant="light"
            onChange={(_event, date) => {
              if (date) setSelectedDate(date);
            }}
            textColor={colors['grey-alpha']['500']}
          />
        ) : (
          /* Android: tap to open native dialog */
          <>
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setShowAndroidPicker('date');
              }}
              className="mb-6 flex-row items-center justify-between rounded-xl border border-grey-plain-300 bg-white px-4 py-4"
            >
              <Text className="flex-1 font-inter-medium text-base text-grey-alpha-500">
                {formatDateTime(selectedDate)}
              </Text>
              <Calendar
                size={20}
                color={colors['grey-alpha']['400']}
                strokeWidth={2}
              />
            </Pressable>

            {showAndroidPicker === 'date' && (
              <DateTimePicker
                value={selectedDate}
                mode="date"
                minimumDate={new Date()}
                onChange={(_event, date) => {
                  if (date) {
                    setSelectedDate(date);
                    setShowAndroidPicker('time');
                  } else {
                    setShowAndroidPicker(null);
                  }
                }}
              />
            )}

            {showAndroidPicker === 'time' && (
              <DateTimePicker
                value={selectedDate}
                mode="time"
                onChange={(_event, date) => {
                  if (date) setSelectedDate(date);
                  setShowAndroidPicker(null);
                }}
              />
            )}
          </>
        )}

        {/* Done Button */}
        <View className="mt-4">
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

CalendarBottomSheet.displayName = 'CalendarBottomSheet';
