import { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import DatePicker from 'react-native-date-picker';
import { Calendar } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

import { colors } from '@/theme/colors';

interface DatePickerFieldProps {
  label?: string;
  value?: Date | null;
  onChange: (date: Date) => void;
  placeholder?: string;
  minimumDate?: Date;
  maximumDate?: Date;
  disabled?: boolean;
  containerClassName?: string;
}

function formatDate(value: Date) {
  return value.toLocaleDateString('en-GB');
}

export function DatePickerField({
  label,
  value,
  onChange,
  placeholder = 'DD/MM/YYYY',
  minimumDate,
  maximumDate,
  disabled = false,
  containerClassName = '',
}: DatePickerFieldProps) {
  const [isOpen, setIsOpen] = useState(false);

  const displayValue = value ? formatDate(value) : placeholder;
  const displayColor = value ? colors['grey-alpha']['500'] : colors['grey-alpha']['400'];
  const initialDate = value ?? maximumDate ?? new Date();

  function handleOpen() {
    if (disabled) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsOpen(true);
  }

  return (
    <View className={containerClassName}>
      {label && (
        <Text className="mb-2 text-base font-medium text-grey-alpha-500">
          {label}
        </Text>
      )}

      <Pressable
        onPress={handleOpen}
        className="flex-row items-center justify-between rounded-xl border border-grey-plain-300 bg-white px-4 py-4"
        style={{ minHeight: 56 }}
        accessibilityRole="button"
        accessibilityLabel={label || 'Select date'}
        accessibilityState={{ disabled }}
      >
        <Text className="flex-1 text-base" style={{ color: displayColor }}>
          {displayValue}
        </Text>
        <Calendar size={20} color={colors['grey-alpha']['400']} strokeWidth={2} />
      </Pressable>

      <DatePicker
        modal
        open={isOpen}
        date={initialDate}
        mode="date"
        minimumDate={minimumDate}
        maximumDate={maximumDate}
        onConfirm={(selectedDate) => {
          setIsOpen(false);
          onChange(selectedDate);
        }}
        onCancel={() => setIsOpen(false)}
      />
    </View>
  );
}
