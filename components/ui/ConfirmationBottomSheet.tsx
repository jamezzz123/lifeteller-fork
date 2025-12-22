import React from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '@/theme/colors';
import { LucideIcon } from 'lucide-react-native';
import { Button } from './Button';

type ConfirmVariant = 'destructive' | 'primary';

interface ConfirmationBottomSheetProps {
  visible: boolean;
  icon: LucideIcon;
  title: string;
  description: string;
  cancelText?: string;
  confirmText?: string;
  confirmVariant?: ConfirmVariant;
  onCancel: () => void;
  onConfirm: () => void;
}

export function ConfirmationBottomSheet({
  visible,
  icon: Icon,
  title,
  description,
  cancelText = 'No, go back',
  confirmText = 'Yes, confirm',
  confirmVariant = 'primary',
  onCancel,
  onConfirm,
}: ConfirmationBottomSheetProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onCancel}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPress={onCancel}
        className="flex-1 justify-end bg-black/50"
      >
        <TouchableOpacity activeOpacity={1} onPress={() => {}}>
          <View className="rounded-t-3xl bg-white px-6 pb-8 pt-4">
            {/* Handle Bar */}
            <View className="mb-6 items-center">
              <View className="h-1 w-12 rounded-full bg-grey-plain-450" />
            </View>

            {/* Icon */}
            <View className="mb-6 items-center">
              <Icon
                color={colors['grey-alpha']['500']}
                size={48}
                strokeWidth={1.5}
              />
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
              {/* Cancel Button */}
              <View className="flex-1">
                <Button
                  title={cancelText}
                  onPress={onCancel}
                  variant="outline"
                  size="large"
                  className="w-full"
                />
              </View>

              {/* Confirm Button */}
              <View className="flex-1">
                <Button
                  title={confirmText}
                  onPress={onConfirm}
                  variant={confirmVariant}
                  size="large"
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
