import { Modal, Text, TouchableOpacity, View } from 'react-native';
import { FileDown, Trash2, UserPen } from 'lucide-react-native';
import { colors } from '@/theme/colors';

type CancelBottomSheetProps = {
  visible: boolean;
  onSaveAsDraft: () => void;
  onDiscard: () => void;
  onContinueEditing: () => void;
};

export function CancelBottomSheet({
  visible,
  onSaveAsDraft,
  onDiscard,
  onContinueEditing,
}: CancelBottomSheetProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onContinueEditing}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPress={onContinueEditing}
        className="flex-1 justify-end bg-black/50"
      >
        <TouchableOpacity activeOpacity={1} onPress={() => {}}>
          <View className="rounded-t-3xl bg-background px-6 pb-8 pt-6">
            {/* Handle Bar */}
            <View className="mb-6 items-center">
              <View className="h-1 w-20 rounded-full bg-grey-plain-450" />
            </View>

            {/* Title */}
            <Text className="mb-6 text-2xl font-bold text-grey-alpha-500">
              Want to finish your request lift later?
            </Text>

            {/* Options */}
            <View className="gap-4">
              {/* Save as draft */}
              <TouchableOpacity
                onPress={onSaveAsDraft}
                className="flex-row items-center gap-4 py-2"
                accessibilityRole="button"
                accessibilityLabel="Save as draft"
              >
                <View className="size-12 items-center justify-center rounded-xl bg-grey-plain-100">
                  <FileDown
                    size={24}
                    color={colors['grey-alpha']['500']}
                    strokeWidth={2}
                  />
                </View>
                <Text className="text-lg font-medium text-grey-alpha-500">
                  Save as draft
                </Text>
              </TouchableOpacity>

              {/* Discard post */}
              <TouchableOpacity
                onPress={onDiscard}
                className="flex-row items-center gap-4 py-2"
                accessibilityRole="button"
                accessibilityLabel="Discard post"
              >
                <View className="size-12 items-center justify-center rounded-xl bg-grey-plain-100">
                  <Trash2
                    size={24}
                    color={colors['grey-alpha']['500']}
                    strokeWidth={2}
                  />
                </View>
                <Text className="text-lg font-medium text-grey-alpha-500">
                  Discard post
                </Text>
              </TouchableOpacity>

              {/* Continue editing */}
              <TouchableOpacity
                onPress={onContinueEditing}
                className="flex-row items-center gap-4 py-2"
                accessibilityRole="button"
                accessibilityLabel="Continue editing"
              >
                <View className="size-12 items-center justify-center rounded-xl bg-grey-plain-100">
                  <UserPen
                    size={24}
                    color={colors['grey-alpha']['500']}
                    strokeWidth={2}
                  />
                </View>
                <Text className="text-lg font-medium text-grey-alpha-500">
                  Continue editing
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}
