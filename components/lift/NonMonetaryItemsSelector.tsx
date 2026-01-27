import { View, Text, TouchableOpacity } from 'react-native';
import { Package, Plus, ChevronRight } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { colors } from '@/theme/colors';

interface NonMonetaryItemsSelectorProps {
  items: { id: string; name: string; quantity: number }[];
  onAddItemsPress: () => void;
}

export function NonMonetaryItemsSelector({
  items,
  onAddItemsPress,
}: NonMonetaryItemsSelectorProps) {
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onAddItemsPress();
  };

  const getItemsDisplayText = () => {
    if (items.length === 0) return null;
    if (items.length === 1) return items[0].name;
    return `${items[0].name} and ${items.length - 1} other${items.length - 1 > 1 ? 's' : ''}`;
  };

  const displayText = getItemsDisplayText();

  const totalItems = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <View className=" px-4 py-4">
      {/* Header */}
      <View className="mb-3 flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <Package
            size={20}
            color={colors['grey-alpha']['500']}
            strokeWidth={2}
          />
          <Text className="text-base font-medium text-grey-alpha-500">
            Lift items
          </Text>
        </View>
        {!displayText && (
          <TouchableOpacity
            onPress={handlePress}
            className="flex-row items-center gap-1.5"
          >
            <Plus size={16} color={colors.primary.purple} strokeWidth={2.5} />
            <Text className="text-sm font-medium text-primary">Add item</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Items Display */}
      {displayText && (
        <TouchableOpacity
          onPress={handlePress}
          className="flex-row items-center justify-between"
        >
          <Text className="flex-1 text-base text-grey-alpha-500">
            {displayText}
          </Text>
          <View className="flex-row items-center gap-1">
            <Text className="rounded bg-grey-plain-200  px-2 py-1 text-sm font-inter-medium text-grey-alpha-450">
              {totalItems} in total
            </Text>
            <ChevronRight
              size={20}
              color={colors['grey-alpha']['400']}
              strokeWidth={2}
            />
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
}
