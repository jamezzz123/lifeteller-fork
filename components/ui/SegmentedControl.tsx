import { View, Text, TouchableOpacity } from 'react-native';
import { colors } from '@/theme/colors';

export type SegmentOption = {
  label: string;
  value: string;
};

type SegmentedControlProps = {
  options: SegmentOption[];
  selectedValue: string;
  onValueChange: (value: string) => void;
};

export function SegmentedControl({
  options,
  selectedValue,
  onValueChange,
}: SegmentedControlProps) {
  return (
    <View className="flex-row rounded-full border border-grey-plain-300 bg-grey-alpha-150  p-1">
      {options.map((option) => {
        const isSelected = option.value === selectedValue;
        return (
          <TouchableOpacity
            key={option.value}
            onPress={() => onValueChange(option.value)}
            className="flex-1 items-center justify-center rounded-full px-6 py-3"
            style={{
              backgroundColor: isSelected ? 'white' : 'transparent',
            }}
            accessibilityRole="button"
            accessibilityState={{ selected: isSelected }}
          >
            <Text
              className="text-sm"
              style={{
                color: isSelected
                  ? colors['grey-alpha']['500']
                  : colors['grey-alpha']['400'],
                fontWeight: isSelected ? '600' : '400',
              }}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
