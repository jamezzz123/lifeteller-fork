import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { Minus, Plus, ChevronDown } from 'lucide-react-native';
import { colors } from '@/theme/colors';
import { ItemPickerModal } from './ItemPickerModal';

export interface NonMonetaryItem {
  id: string;
  itemName: string;
  quantity: number;
}

interface NonMonetaryItemInputProps {
  item: NonMonetaryItem;
  itemIndex: number;
  availableItems: string[];
  onItemChange: (id: string, itemName: string) => void;
  onQuantityChange: (id: string, quantity: number) => void;
  onRemove?: (id: string) => void;
  showLabel?: boolean;
}

export function NonMonetaryItemInput({
  item,
  itemIndex,
  availableItems,
  onItemChange,
  onQuantityChange,
  onRemove,
  showLabel = true,
}: NonMonetaryItemInputProps) {
  const [showPicker, setShowPicker] = useState(false);

  const handleIncrement = () => {
    onQuantityChange(item.id, item.quantity + 1);
  };

  const handleDecrement = () => {
    if (item.quantity > 1) {
      onQuantityChange(item.id, item.quantity - 1);
    }
  };

  const handleQuantityInputChange = (text: string) => {
    const numericValue = parseInt(text.replace(/[^0-9]/g, ''), 10);
    onQuantityChange(
      item.id,
      Number.isNaN(numericValue) ? 1 : Math.max(1, numericValue)
    );
  };

  const handleItemSelect = (selectedItem: string) => {
    onItemChange(item.id, selectedItem);
  };

  return (
    <View
      className="mb-4 rounded-2xl px-4 py-3"
      style={{
        backgroundColor: colors['grey-plain']['150'],
      }}
    >
      {showLabel && (
        <View className="flex-row items-center justify-between">
          <Text className="text-sm font-inter-semibold text-grey-alpha-500">
            Item #{itemIndex + 1}
          </Text>
          {onRemove && itemIndex > 0 && (
            <TouchableOpacity onPress={() => onRemove(item.id)}>
              <Text
                className="text-sm font-inter-semibold"
                style={{ color: colors.state.red }}
              >
                Remove item
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      <View
        className={`rounded-lg bg-white p-2 ${showLabel ? 'mt-3' : ''}`}
      >
        {/* Item Name Dropdown */}
        <View className="mt-4">
          <Text className="text-xs font-inter-semibold text-grey-alpha-400">
            Item name
          </Text>
          <TouchableOpacity
            onPress={() => setShowPicker(true)}
            className="mt-2 h-12 flex-row items-center justify-between rounded-xl border border-grey-alpha-250 bg-grey-plain-150 px-3"
            activeOpacity={0.7}
          >
            <Text
              className={`text-base ${
                item.itemName ? 'text-grey-alpha-500' : 'text-grey-alpha-250'
              }`}
            >
              {item.itemName || '- Select an option -'}
            </Text>
            <ChevronDown
              size={20}
              color={colors['grey-alpha']['400']}
              strokeWidth={2}
            />
          </TouchableOpacity>
        </View>

        {/* Quantity Input */}
        <View className="mt-4">
          <Text className="text-xs font-inter-semibold text-grey-alpha-400">
            Quantity needed
          </Text>
          <View className="mt-2 flex-row overflow-hidden rounded-xl border border-grey-plain-450/60 bg-grey-plain-150">
            <TextInput
              value={item.quantity.toString()}
              onChangeText={handleQuantityInputChange}
              keyboardType="numeric"
              className="w-16 flex-1 px-3 py-3 text-base text-grey-alpha-500"
            />
            <View className="h-12 w-px bg-grey-plain-450/60" />
            <TouchableOpacity
              onPress={handleDecrement}
              disabled={item.quantity <= 1}
              className="w-12 items-center justify-center"
            >
              <Minus
                size={18}
                color={colors['grey-alpha']['500']}
                strokeWidth={2.6}
                opacity={item.quantity <= 1 ? 0.4 : 1}
              />
            </TouchableOpacity>
            <View className="h-12 w-px bg-grey-plain-450/60" />
            <TouchableOpacity
              onPress={handleIncrement}
              className="w-12 items-center justify-center"
            >
              <Plus
                size={18}
                color={colors['grey-alpha']['500']}
                strokeWidth={2.6}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Item Picker Modal */}
      <ItemPickerModal
        visible={showPicker}
        items={availableItems}
        selectedItem={item.itemName}
        onSelect={handleItemSelect}
        onClose={() => setShowPicker(false)}
      />
    </View>
  );
}
