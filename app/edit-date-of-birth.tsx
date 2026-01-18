import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { X, ChevronDown, Info, Check } from 'lucide-react-native';
import { colors } from '@/theme/colors';
import { Button } from '@/components/ui/Button';

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

// Generate days (1-31)
function generateDays() {
  return Array.from({ length: 31 }, (_, i) => i + 1);
}

// Generate years (1900 to current year)
function generateYears() {
  const currentYear = new Date().getFullYear();
  const startYear = 1900;
  const years: number[] = [];
  for (let year = currentYear; year >= startYear; year--) {
    years.push(year);
  }
  return years;
}

interface PickerModalProps {
  visible: boolean;
  title: string;
  items: (string | number)[];
  selectedItem: string | number;
  onSelect: (item: string | number) => void;
  onClose: () => void;
}

function PickerModal({
  visible,
  title,
  items,
  selectedItem,
  onSelect,
  onClose,
}: PickerModalProps) {
  function handleSelect(item: string | number) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSelect(item);
    onClose();
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end bg-black/50">
        <SafeAreaView className="bg-background">
          <View className="max-h-96">
            {/* Header */}
            <View className="flex-row items-center justify-between border-b border-grey-alpha-250 px-4 py-4">
              <Text className="text-base font-inter-semibold text-grey-alpha-500">
                {title}
              </Text>
              <TouchableOpacity onPress={onClose} hitSlop={10}>
                <X
                  size={24}
                  color={colors['grey-alpha']['500']}
                  strokeWidth={2}
                />
              </TouchableOpacity>
            </View>

            {/* Items List */}
            <ScrollView className="px-4 py-2">
              {items.map((item) => {
                const isSelected = selectedItem === item;
                return (
                  <TouchableOpacity
                    key={String(item)}
                    onPress={() => handleSelect(item)}
                    className="flex-row items-center justify-between border-b border-grey-alpha-150 py-4"
                    activeOpacity={0.7}
                  >
                    <Text
                      className={`text-base ${
                        isSelected
                          ? 'font-inter-semibold text-primary'
                          : 'text-grey-alpha-500'
                      }`}
                    >
                      {String(item)}
                    </Text>
                    {isSelected && (
                      <Check
                        size={20}
                        color={colors.primary.purple}
                        strokeWidth={2.5}
                      />
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
}

export default function EditDateOfBirthScreen() {
  const [selectedMonth, setSelectedMonth] = useState('November');
  const [selectedDay, setSelectedDay] = useState(27);
  const [selectedYear, setSelectedYear] = useState(2004);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [showDayPicker, setShowDayPicker] = useState(false);
  const [showYearPicker, setShowYearPicker] = useState(false);

  const days = generateDays();
  const years = generateYears();

  async function handleUpdate() {
    try {
      setIsUpdating(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      // TODO: Call API to update date of birth
      await new Promise((resolve) => setTimeout(resolve, 500));

      // TODO: Update user context/state
      router.back();
    } catch (error) {
      console.error('Error updating date of birth:', error);
    } finally {
      setIsUpdating(false);
    }
  }

  function handleCancel() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  }

  return (
    <SafeAreaView className="flex-1 bg-grey-plain-50" edges={['top']}>
      {/* Header */}
      <View className="flex-row items-center justify-between border-b border-grey-plain-150 bg-white px-4 py-3">
        <TouchableOpacity
          onPress={handleCancel}
          className="flex-row items-center gap-2"
        >
          <X color={colors['grey-alpha']['500']} size={20} strokeWidth={2.5} />
          <Text className="text-base font-inter-semibold text-grey-alpha-500">
            Cancel
          </Text>
        </TouchableOpacity>
        <Button
          title="Update"
          onPress={handleUpdate}
          variant="primary"
          size="small"
          loading={isUpdating}
          disabled={isUpdating}
        />
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        <View className="px-4 pt-6">
          {/* Title */}
          <Text className="mb-2 text-2xl font-inter-bold text-grey-alpha-500">
            Date of birth
          </Text>

          {/* Description */}
          <Text className="mb-8 text-sm leading-5 text-grey-plain-550">
            You are important to us. We would like to always celebrate your
            special day with you.
          </Text>

          {/* Date Input Fields */}
          <View className="gap-4">
            {/* Month Field */}
            <View>
              <Text className="mb-2 text-xs font-inter-semibold text-grey-alpha-500">
                Month
              </Text>
              <Pressable
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setShowMonthPicker(true);
                }}
                className="flex-row items-center justify-between rounded-xl border bg-grey-plain-50 px-4"
                style={{
                  borderColor: colors['grey-alpha']['250'],
                  minHeight: 48,
                }}
              >
                <Text className="text-base text-grey-alpha-500">
                  {selectedMonth}
                </Text>
                <ChevronDown
                  color={colors['grey-alpha']['400']}
                  size={16}
                  strokeWidth={2}
                />
              </Pressable>
            </View>

            {/* Day Field */}
            <View>
              <Text className="mb-2 text-xs font-inter-semibold text-grey-alpha-500">
                Day
              </Text>
              <Pressable
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setShowDayPicker(true);
                }}
                className="flex-row items-center justify-between rounded-xl border bg-grey-plain-50 px-4"
                style={{
                  borderColor: colors['grey-alpha']['250'],
                  minHeight: 48,
                }}
              >
                <Text className="text-base text-grey-alpha-500">
                  {selectedDay}
                </Text>
                <ChevronDown
                  color={colors['grey-alpha']['400']}
                  size={16}
                  strokeWidth={2}
                />
              </Pressable>
            </View>

            {/* Year Field */}
            <View>
              <Text className="mb-2 text-xs font-inter-semibold text-grey-alpha-500">
                Year
              </Text>
              <Pressable
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setShowYearPicker(true);
                }}
                className="flex-row items-center justify-between rounded-xl border bg-grey-plain-50 px-4"
                style={{
                  borderColor: colors['grey-alpha']['250'],
                  minHeight: 48,
                }}
              >
                <Text className="text-base text-grey-alpha-500">
                  {selectedYear}
                </Text>
                <ChevronDown
                  color={colors['grey-alpha']['400']}
                  size={16}
                  strokeWidth={2}
                />
              </Pressable>
            </View>
          </View>

          {/* Privacy Note */}
          <View className="mt-6 flex-row items-start gap-2">
            <Info
              color={colors['grey-plain']['550']}
              size={16}
              strokeWidth={2}
            />
            <Text className="flex-1 text-xs text-grey-plain-550">
              Only you can see your year of birth
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Month Picker Modal */}
      <PickerModal
        visible={showMonthPicker}
        title="Select Month"
        items={MONTHS}
        selectedItem={selectedMonth}
        onSelect={(month) => setSelectedMonth(month as string)}
        onClose={() => setShowMonthPicker(false)}
      />

      {/* Day Picker Modal */}
      <PickerModal
        visible={showDayPicker}
        title="Select Day"
        items={days}
        selectedItem={selectedDay}
        onSelect={(day) => setSelectedDay(day as number)}
        onClose={() => setShowDayPicker(false)}
      />

      {/* Year Picker Modal */}
      <PickerModal
        visible={showYearPicker}
        title="Select Year"
        items={years}
        selectedItem={selectedYear}
        onSelect={(year) => setSelectedYear(year as number)}
        onClose={() => setShowYearPicker(false)}
      />
    </SafeAreaView>
  );
}
