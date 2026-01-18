import React from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '@/theme/colors';

interface DeactivateWalletConfirmationModalProps {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeactivateWalletConfirmationModal({
  visible,
  onConfirm,
  onCancel,
}: DeactivateWalletConfirmationModalProps) {
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
            <Text className="mb-3 text-2xl font-bold text-grey-alpha-500">
              Deactivate wallet
            </Text>

            {/* Description */}
            <Text className="mb-6 text-base text-grey-alpha-400">
              This will immediately remove access to all wallet activities. You
              won&apos;t be able to perform any lift transaction until your
              wallet is reactivated.
            </Text>

            {/* Divider */}
            <View className="mb-6 h-px bg-grey-plain-300" />

            {/* Action Buttons */}
            <View className="flex-row justify-end gap-4">
              <TouchableOpacity onPress={onCancel}>
                <Text
                  className="text-base font-semibold"
                  style={{ color: colors.primary.purple }}
                >
                  No
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={onConfirm}>
                <Text
                  className="text-base font-semibold"
                  style={{ color: colors.state.red }}
                >
                  Yes, deactivate
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}
