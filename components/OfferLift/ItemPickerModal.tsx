import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, Check } from 'lucide-react-native';
import { colors } from '@/theme/colors';

interface ItemPickerModalProps {
  visible: boolean;
  items: string[];
  selectedItem: string;
  onSelect: (item: string) => void;
  onClose: () => void;
}

export function ItemPickerModal({
  visible,
  items,
  selectedItem,
  onSelect,
  onClose,
}: ItemPickerModalProps) {
  const handleSelect = (item: string) => {
    onSelect(item);
    onClose();
  };

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
              <Text className="text-base font-semibold text-grey-alpha-500">
                Select an item
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
                    key={item}
                    onPress={() => handleSelect(item)}
                    className="flex-row items-center justify-between border-b border-grey-alpha-150 py-4"
                    activeOpacity={0.7}
                  >
                    <Text
                      className={`text-base ${
                        isSelected
                          ? 'font-semibold text-primary'
                          : 'text-grey-alpha-500'
                      }`}
                    >
                      {item}
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
