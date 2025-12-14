import { Modal, Text, View } from 'react-native';
import { Button } from './Button';

type ConfirmationModalProps = {
  visible: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmationModal({
  visible,
  title,
  message,
  confirmText = 'Yes',
  cancelText = 'Cancel',
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
          <View className="mt-3 flex-row gap-3">
            <View className="flex-1">
              <Button
                size="small"
                title={cancelText}
                variant="outline"
                onPress={onCancel}
              />
            </View>
            <View className="flex-1">
              <Button
                size="small"
                title={confirmText}
                variant="primary"
                onPress={onConfirm}
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}
