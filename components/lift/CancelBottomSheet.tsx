import { useRef, useEffect } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { FileDown, Trash2, UserPen } from 'lucide-react-native';
import { colors } from '@/theme/colors';
import {
  BottomSheetComponent,
  BottomSheetRef,
} from '@/components/ui/BottomSheet';

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
  const bottomSheetRef = useRef<BottomSheetRef>(null);

  // Sync visibility with bottom sheet state
  useEffect(() => {
    if (visible) {
      bottomSheetRef.current?.expand();
    } else {
      bottomSheetRef.current?.close();
    }
  }, [visible]);

  const handleClose = () => {
    onContinueEditing();
  };

  return (
    <BottomSheetComponent
      title="want to finish your post later?"
      ref={bottomSheetRef}
      onClose={handleClose}
    >
      <View className="px-6">
        {/* Title */}
        {/* <Text className="mb-6 text-2xl font-bold text-grey-alpha-500">
          Want to finish your request lift later?
        </Text> */}

        {/* Options */}
        <View className="gap-4">
          {/* Save as draft */}
          <TouchableOpacity
            onPress={onSaveAsDraft}
            className="flex-row items-center gap-4"
            accessibilityRole="button"
            accessibilityLabel="Save as draft"
          >
            <View className=" items-center justify-center rounded-xl bg-grey-plain-100">
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
            className="flex-row items-center gap-4"
            accessibilityRole="button"
            accessibilityLabel="Discard post"
          >
            <View className="items-center justify-center rounded-xl bg-grey-plain-100">
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
            className="flex-row items-center gap-4"
            accessibilityRole="button"
            accessibilityLabel="Continue editing"
          >
            <View className="items-center justify-center rounded-xl bg-grey-plain-100">
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
    </BottomSheetComponent>
  );
}
