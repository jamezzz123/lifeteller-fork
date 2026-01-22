import { View, Text, TouchableOpacity } from 'react-native';
import { Check } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { colors } from '@/theme/colors';

interface QuantitySelectorProps {
  selectedQuantity: string;
  onQuantityChange: (quantity: string) => void;
  onCustomValuePress: () => void;
}

const QUICK_OPTIONS = ['1', '3', '5', '7', '9', 'Unlimited'];

export function QuantitySelector({
  selectedQuantity,
  onQuantityChange,
  onCustomValuePress,
}: QuantitySelectorProps) {
  const handleOptionPress = (option: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onQuantityChange(option);
  };

  const handleCustomPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onCustomValuePress();
  };

  const isCustomValue =
    selectedQuantity && !QUICK_OPTIONS.includes(selectedQuantity);

  return (
    <View className="py-4">
      {/* Header */}
      <View className="mb-3 flex-row items-center justify-between">
        <Text className="font-inter-medium text-sm text-grey-alpha-450">
          Quantity a user can request
        </Text>
        <TouchableOpacity
          className="rounded-sm border border-grey-plain-300 px-3 py-1.5"
          onPress={handleCustomPress}
        >
          <Text className="font-inter-medium text-sm text-grey-alpha-450">
            Custom value
          </Text>
        </TouchableOpacity>
      </View>

      {/* Options */}
      <View className="flex-row gap-2">
        {QUICK_OPTIONS.map((option) => {
          const isSelected =
            selectedQuantity === option ||
            (isCustomValue && option === selectedQuantity);
          return (
            <TouchableOpacity
              key={option}
              onPress={() => handleOptionPress(option)}
              className={`flex-row items-center justify-center gap-1.5 rounded-lg px-4 py-2.5 ${
                isSelected ? 'bg-primary-tints-100' : 'bg-grey-plain-150'
              }`}
            >
              {isSelected && (
                <Check
                  size={16}
                  color={colors.primary.purple}
                  strokeWidth={2.5}
                />
              )}
              <Text
                className={`font-inter-medium text-sm ${
                  isSelected ? 'text-primary' : 'text-grey-alpha-500'
                }`}
              >
                {option}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Show custom value if selected */}
      {isCustomValue && (
        <View className="mt-3">
          <TouchableOpacity
            onPress={handleCustomPress}
            className="flex-row items-center gap-1.5 self-start rounded-lg bg-primary-tints-100 px-4 py-2.5"
          >
            <Check size={16} color={colors.primary.purple} strokeWidth={2.5} />
            <Text className="font-inter-medium text-sm text-primary">
              {selectedQuantity}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
