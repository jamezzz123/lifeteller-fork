import { Modal, Text, View, TouchableOpacity } from 'react-native';
import { colors } from '@/theme/colors';

type ConfirmationModalProps = {
  visible: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmationModal({
  visible,
  title,
  message,
  confirmText = 'Yes',
  cancelText = 'Cancel',
  destructive = false,
  onConfirm,
  onCancel,
}: ConfirmationModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 items-center justify-center bg-black/50 px-6">
        <View className="w-full rounded-2xl bg-white p-6">
          {/* Title */}
          <Text className="text-2xl font-semibold leading-8 text-grey-alpha-500">
            {title}
          </Text>

          {/* Message */}
          <Text className="mt-3 text-sm leading-5 text-grey-alpha-400">
            {message}
          </Text>

          <View className="my-4 h-px bg-grey-plain-450/20" />

          {/* Action Buttons */}
          <View className="mt-3 flex-row justify-end gap-4">
            <TouchableOpacity onPress={onCancel}>
              <Text
                className="text-base font-semibold"
                style={{ color: colors.primary.purple }}
              >
                {cancelText}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onConfirm}>
              <Text
                className="text-base font-semibold"
                style={{
                  color: destructive ? colors.state.red : colors.primary.purple,
                }}
              >
                {confirmText}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
