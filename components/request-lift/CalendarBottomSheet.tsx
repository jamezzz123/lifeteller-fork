import { forwardRef, useState, useRef, useEffect } from 'react';
import {
  Text,
  View,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import * as Haptics from 'expo-haptics';

import { colors } from '@/theme/colors';
import { Button } from '@/components/ui/Button';
import { BottomSheetComponent, BottomSheetRef } from '@/components/ui/BottomSheet';

const ITEM_HEIGHT = 50;

type CalendarBottomSheetProps = {
  onDone: (date: Date) => void;
  initialDate?: Date;
};

// Generate dates for the next 30 days
function generateDates() {
  const dates: Date[] = [];
  const today = new Date();
  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    dates.push(date);
  }
  return dates;
}

// Generate hours (0-23)
function generateHours() {
  return Array.from({ length: 24 }, (_, i) => i);
}

// Generate minutes (0-59)
function generateMinutes() {
  return Array.from({ length: 60 }, (_, i) => i);
}

function formatDate(date: Date) {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  const dayName = days[date.getDay()];
  const monthName = months[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();

  return `${dayName}, ${monthName} ${day} ${year}`;
}

function formatHour(hour: number) {
  if (hour === 0) return '12: (12am)';
  if (hour < 12) return `${hour}: (${hour}am)`;
  if (hour === 12) return '12: (12pm)';
  return `${hour}: (${hour - 12}pm)`;
}

export const CalendarBottomSheet = forwardRef<
  BottomSheetRef,
  CalendarBottomSheetProps
>(({ onDone, initialDate }, ref) => {
  const dates = generateDates();
  const hours = generateHours();
  const minutes = generateMinutes();

  const now = initialDate || new Date();
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);
  const [selectedHour, setSelectedHour] = useState(now.getHours());
  const [selectedMinute, setSelectedMinute] = useState(now.getMinutes());

  const dateScrollRef = useRef<ScrollView>(null);
  const hourScrollRef = useRef<ScrollView>(null);
  const minuteScrollRef = useRef<ScrollView>(null);

  // Scroll to initial values when sheet opens
  useEffect(() => {
    const timer = setTimeout(() => {
      hourScrollRef.current?.scrollTo({
        y: selectedHour * ITEM_HEIGHT,
        animated: false,
      });
      minuteScrollRef.current?.scrollTo({
        y: selectedMinute * ITEM_HEIGHT,
        animated: false,
      });
    }, 100);
    return () => clearTimeout(timer);
  }, [selectedHour, selectedMinute]);

  function handleDateScroll(event: NativeSyntheticEvent<NativeScrollEvent>) {
    const offsetY = event.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / ITEM_HEIGHT);
    if (index !== selectedDateIndex && index >= 0 && index < dates.length) {
      setSelectedDateIndex(index);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }

  function handleHourScroll(event: NativeSyntheticEvent<NativeScrollEvent>) {
    const offsetY = event.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / ITEM_HEIGHT);
    if (index !== selectedHour && index >= 0 && index < hours.length) {
      setSelectedHour(index);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }

  function handleMinuteScroll(event: NativeSyntheticEvent<NativeScrollEvent>) {
    const offsetY = event.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / ITEM_HEIGHT);
    if (index !== selectedMinute && index >= 0 && index < minutes.length) {
      setSelectedMinute(index);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }

  function handleDone() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const selectedDate = new Date(dates[selectedDateIndex]);
    selectedDate.setHours(selectedHour);
    selectedDate.setMinutes(selectedMinute);
    selectedDate.setSeconds(0);
    selectedDate.setMilliseconds(0);
    onDone(selectedDate);
    if (typeof ref !== 'function' && ref?.current) {
      ref.current.close();
    }
  }

  function renderPickerItem<T>(
    item: T,
    isSelected: boolean,
    formatter: (val: T) => string
  ) {
    return (
      <View
        key={String(item)}
        style={{
          height: ITEM_HEIGHT,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text
          style={{
            fontSize: isSelected ? 18 : 16,
            fontWeight: isSelected ? '600' : '400',
            color: isSelected
              ? colors['grey-alpha']['500']
              : colors['grey-alpha']['250'],
          }}
        >
          {formatter(item)}
        </Text>
      </View>
    );
  }

  return (
    <BottomSheetComponent ref={ref} snapPoints={['65%']}>
      <View className="px-4">
        {/* Header */}
        <View className="mb-2">
          <Text className="text-center text-lg font-bold text-grey-alpha-500">
            Schedule request
          </Text>
          <Text className="mt-1 text-center text-sm text-grey-alpha-400">
            Choose date and time below.
          </Text>
        </View>

        {/* Column Headers */}
        <View className="mb-2 flex-row items-center justify-between px-2">
          <View style={{ flex: 1.5 }}>
            <Text className="text-center text-sm font-semibold text-grey-alpha-400">
              Date
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text className="text-center text-sm font-semibold text-grey-alpha-400">
              Hour
            </Text>
          </View>
          <View style={{ flex: 0.8 }}>
            <Text className="text-center text-sm font-semibold text-grey-alpha-400">
              Minute
            </Text>
          </View>
        </View>

        {/* Pickers Container */}
        <View style={{ height: ITEM_HEIGHT * 5, position: 'relative' }}>
          {/* Selection Indicator */}
          <View
            className="absolute left-0 right-0 border-y-2"
            style={{
              top: ITEM_HEIGHT * 2,
              height: ITEM_HEIGHT,
              borderColor: colors.primary.purple,
              pointerEvents: 'none',
              zIndex: 10,
              backgroundColor: colors['primary-tints'].purple['50'],
            }}
          />

          <View className="flex-row justify-between">
            {/* Date Picker */}
            <View style={{ flex: 1.5 }}>
              <ScrollView
                ref={dateScrollRef}
                showsVerticalScrollIndicator={false}
                snapToInterval={ITEM_HEIGHT}
                decelerationRate="fast"
                onMomentumScrollEnd={handleDateScroll}
                contentContainerStyle={{
                  paddingVertical: ITEM_HEIGHT * 2,
                }}
              >
                {dates.map((date, index) =>
                  renderPickerItem(
                    date,
                    index === selectedDateIndex,
                    formatDate
                  )
                )}
              </ScrollView>
            </View>

            {/* Hour Picker */}
            <View style={{ flex: 1 }}>
              <ScrollView
                ref={hourScrollRef}
                showsVerticalScrollIndicator={false}
                snapToInterval={ITEM_HEIGHT}
                decelerationRate="fast"
                onMomentumScrollEnd={handleHourScroll}
                contentContainerStyle={{
                  paddingVertical: ITEM_HEIGHT * 2,
                }}
              >
                {hours.map((hour) =>
                  renderPickerItem(hour, hour === selectedHour, formatHour)
                )}
              </ScrollView>
            </View>

            {/* Minute Picker */}
            <View style={{ flex: 0.8 }}>
              <ScrollView
                ref={minuteScrollRef}
                showsVerticalScrollIndicator={false}
                snapToInterval={ITEM_HEIGHT}
                decelerationRate="fast"
                onMomentumScrollEnd={handleMinuteScroll}
                contentContainerStyle={{
                  paddingVertical: ITEM_HEIGHT * 2,
                }}
              >
                {minutes.map((minute) =>
                  renderPickerItem(
                    minute,
                    minute === selectedMinute,
                    (m) => m.toString().padStart(2, '0')
                  )
                )}
              </ScrollView>
            </View>
          </View>
        </View>

        {/* Done Button */}
        <View className="mt-6">
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
