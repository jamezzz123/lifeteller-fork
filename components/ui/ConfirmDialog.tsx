import { Modal, Text, TouchableOpacity, View } from 'react-native';

import { colors } from '@/theme/colors';

type ConfirmDialogProps = {
  visible: boolean;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  onConfirm: () => void;
  onCancel: () => void;
  destructive?: boolean;
  cancelTextColor?: string;
};

export function ConfirmDialog({
  visible,
  title,
  message,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
  destructive = false,
  cancelTextColor,
}: ConfirmDialogProps) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 items-center justify-center bg-black/50 px-6">
        <View className="w-full rounded-2xl bg-white p-6">
          <Text className="mb-2 text-lg font-bold text-grey-alpha-500">
            {title}
          </Text>
          <Text className="mb-6 text-sm text-grey-alpha-400">{message}</Text>

          <View className="flex-row justify-end gap-4">
            <TouchableOpacity onPress={onCancel} className="px-4 py-2">
              <Text
                className="text-base font-semibold"
                style={{
                  color: cancelTextColor || colors['grey-alpha']['500'],
                }}
              >
                {cancelText}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onConfirm} className="px-4 py-2">
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
