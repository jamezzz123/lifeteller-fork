import React from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '@/theme/colors';
import { Check } from 'lucide-react-native';
import { Button } from './Button';

interface SuccessBottomSheetProps {
  visible: boolean;
  title: string;
  description: string;
  primaryActionText?: string;
  secondaryActionText?: string;
  onPrimaryAction: () => void;
  onSecondaryAction: () => void;
}

export function SuccessBottomSheet({
  visible,
  title,
  description,
  primaryActionText = 'Raise a lift',
  secondaryActionText = 'Go to feeds',
  onPrimaryAction,
  onSecondaryAction,
}: SuccessBottomSheetProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onSecondaryAction}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPress={onSecondaryAction}
        className="flex-1 justify-end bg-black/50"
      >
        <TouchableOpacity activeOpacity={1} onPress={() => {}}>
          <View className="items-center rounded-t-3xl bg-white px-6 pb-8 pt-4">
            {/* Handle Bar */}
            <View className="mb-6 items-center">
              <View className="h-1 w-12 rounded-full bg-grey-plain-450" />
            </View>

            {/* Success Icon with Badge */}
            <View className="mb-6 items-center">
              <View className="relative">
                {/* Green Checkmark Square */}
                <View
                  className="h-16 w-16 items-center justify-center rounded-2xl"
                  style={{ backgroundColor: colors.state.green }}
                >
                  <Check
                    color={colors['grey-plain']['50']}
                    size={32}
                    strokeWidth={3}
                  />
                </View>
              </View>
            </View>

            {/* Title */}
            <Text className="mb-2 text-2xl font-bold text-grey-alpha-500">
              {title}
            </Text>

            {/* Description */}
            <Text className="mb-8 text-base text-grey-plain-550">
              {description}
            </Text>

            {/* Buttons */}
            <View className="flex-row gap-3">
              {/* Secondary Action Button */}
              <View className="flex-1">
                <Button
                  title={secondaryActionText}
                  onPress={onSecondaryAction}
                  variant="outline"
                  className="w-full"
                />
              </View>

              {/* Primary Action Button */}
              <View className="flex-1">
                <Button
                  title={primaryActionText}
                  onPress={onPrimaryAction}
                  variant="primary"
                  className="w-full"
                />
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}
