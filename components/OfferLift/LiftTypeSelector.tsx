import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Check } from 'lucide-react-native';
import { colors } from '@/theme/colors';

export type LiftType = 'monetary' | 'non-monetary' | 'both';

interface LiftTypeSelectorProps {
  selected: LiftType;
  onSelect: (type: LiftType) => void;
  availableTypes: LiftType[];
}

export function LiftTypeSelector({
  selected,
  onSelect,
  availableTypes,
}: LiftTypeSelectorProps) {
  const options: { value: LiftType; label: string }[] = [
    { value: 'monetary', label: 'Monetary' },
    { value: 'non-monetary', label: 'Non-monetary' },
    { value: 'both', label: 'Both' },
  ];

  // Filter to only show available types
  const visibleOptions = options.filter((opt) =>
    availableTypes.includes(opt.value)
  );

  // Don't render if only one option available
  if (visibleOptions.length <= 1) {
    return null;
  }

  return (
    <View className="mb-6">
      <Text className="mb-3 text-sm font-inter-semibold text-grey-alpha-450">
        Select an option
      </Text>
      <View className="flex-row gap-3">
        {visibleOptions.map((option) => {
          const isSelected = selected === option.value;
          return (
            <TouchableOpacity
              key={option.value}
              onPress={() => onSelect(option.value)}
              className="flex-row items-center gap-2 rounded-xl px-4 py-2.5"
              style={{
                backgroundColor: isSelected
                  ? colors['primary-tints'].purple['100']
                  : colors['grey-alpha']['150'],
              }}
              activeOpacity={0.7}
            >
              {isSelected && (
                <Check
                  size={16}
                  color={colors['grey-alpha']['450']}
                  strokeWidth={3}
                />
              )}
              <Text className="text-sm font-inter-semibold text-grey-alpha-450">
                {option.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
