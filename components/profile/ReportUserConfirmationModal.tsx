import React from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import { colors } from '@/theme/colors';

interface ReportUserConfirmationModalProps {
  visible: boolean;
  username: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ReportUserConfirmationModal({
  visible,
  username,
  onConfirm,
  onCancel,
}: ReportUserConfirmationModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 items-center justify-center bg-black/50 px-6">
        <View className="w-full rounded-2xl bg-white p-6">
          {/* Title */}
          <Text className="text-2xl font-inter-semibold leading-8 text-grey-alpha-500">
            Confirm and Report User
          </Text>

          {/* Message */}
          <Text className="mt-3 text-sm leading-5 text-grey-alpha-400">
            We will investigate this user promptly and notify you of the outcome.
          </Text>

          <View className="my-4 h-px bg-grey-plain-450/20" />

          {/* Action Buttons */}
          <View className="flex-row justify-end gap-4">
            <TouchableOpacity onPress={onCancel} className="px-4 py-2">
              <Text
                className="text-base font-inter-semibold"
                style={{ color: colors.primary.purple }}
              >
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onConfirm} className="px-4 py-2">
              <Text
                className="text-base font-inter-semibold"
                style={{ color: colors.primary.purple }}
              >
                Report user
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

