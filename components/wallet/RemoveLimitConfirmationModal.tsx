import React from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '@/theme/colors';

interface RemoveLimitConfirmationModalProps {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  limitType?: 'daily' | 'one-time';
}

export function RemoveLimitConfirmationModal({
  visible,
  onConfirm,
  onCancel,
  limitType = 'daily',
}: RemoveLimitConfirmationModalProps) {
  const limitTypeText =
    limitType === 'daily'
      ? 'daily cumulative transaction limit'
      : 'one-time transaction limit';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPress={onCancel}
        className="flex-1 items-center justify-center bg-black/50 px-6"
      >
        <TouchableOpacity activeOpacity={1} onPress={() => {}}>
          <View className="w-full rounded-2xl bg-white p-6">
            {/* Title */}
            <Text className="mb-3 text-2xl font-inter-bold text-grey-alpha-500">
              Remove transaction limit
            </Text>

            {/* Description */}
            <Text className="mb-6 text-base text-grey-alpha-400">
              Are you sure you want to remove your {limitTypeText}?
            </Text>

            {/* Divider */}
            <View className="mb-6 h-px bg-grey-plain-300" />

            {/* Action Buttons */}
            <View className="flex-row justify-end gap-4">
              <TouchableOpacity onPress={onCancel}>
                <Text
                  className="text-base font-inter-semibold"
                  style={{ color: colors.primary.purple }}
                >
                  No
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={onConfirm}>
                <Text
                  className="text-base font-inter-semibold"
                  style={{ color: colors.state.red }}
                >
                  Yes, remove
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}
