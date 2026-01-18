import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useEffect,
} from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import BottomSheet, {
  BottomSheetView,
  BottomSheetBackdrop,
  BottomSheetHandleProps,
  BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import { Image, Camera, FileText, Headphones } from 'lucide-react-native';
import { colors } from '@/theme/colors';

interface AttachmentBottomSheetProps {
  visible: boolean;
  onSelectAttachment: (
    type: 'gallery' | 'camera' | 'document' | 'audio'
  ) => void;
  onClose?: () => void;
}

export interface AttachmentBottomSheetRef {
  expand: () => void;
  close: () => void;
}

export const AttachmentBottomSheet = forwardRef<
  AttachmentBottomSheetRef,
  AttachmentBottomSheetProps
>(({ visible, onSelectAttachment, onClose }, ref) => {
  const bottomSheetRef = useRef<BottomSheet>(null);

  useImperativeHandle(ref, () => ({
    expand: () => {
      bottomSheetRef.current?.expand();
    },
    close: () => {
      bottomSheetRef.current?.close();
    },
  }));

  // Sync visibility with bottom sheet state
  useEffect(() => {
    if (visible) {
      bottomSheetRef.current?.expand();
    } else {
      bottomSheetRef.current?.close();
    }
  }, [visible]);

  function renderHandle(props: BottomSheetHandleProps) {
    return (
      <View className="w-full items-center py-3" {...props}>
        <View className="h-1 w-12 rounded-full bg-grey-plain-450" />
      </View>
    );
  }

  function renderBackdrop(props: BottomSheetBackdropProps) {
    return (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
      />
    );
  }

  const handleSelect = (type: 'gallery' | 'camera' | 'document' | 'audio') => {
    onSelectAttachment(type);
    bottomSheetRef.current?.close();
  };

  const attachmentOptions = [
    {
      type: 'gallery' as const,
      icon: Image,
      label: 'Gallery',
    },
    {
      type: 'camera' as const,
      icon: Camera,
      label: 'Camera',
    },
    {
      type: 'document' as const,
      icon: FileText,
      label: 'Document',
    },
    {
      type: 'audio' as const,
      icon: Headphones,
      label: 'Audio',
    },
  ];

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={['25%']}
      enablePanDownToClose
      handleComponent={renderHandle}
      backdropComponent={renderBackdrop}
      backgroundStyle={styles.container}
      onClose={onClose}
    >
      <BottomSheetView style={styles.contentContainer}>
        <View className="px-6 pb-6">
          <Text className="mb-6 text-lg font-bold text-grey-alpha-550">
            Attachment
          </Text>

          <View className="flex-row justify-between">
            {attachmentOptions.map((option) => {
              const Icon = option.icon;
              return (
                <TouchableOpacity
                  key={option.type}
                  onPress={() => handleSelect(option.type)}
                  className="items-center"
                  activeOpacity={0.7}
                >
                  <View
                    className="items-center justify-center rounded-full"
                    style={{
                      width: 64,
                      height: 64,
                      backgroundColor: colors['grey-plain']['150'],
                    }}
                  >
                    <Icon
                      color={colors['grey-plain']['550']}
                      size={28}
                      strokeWidth={2}
                    />
                  </View>
                  <Text className="mt-3 text-sm font-medium text-grey-plain-550">
                    {option.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
});

AttachmentBottomSheet.displayName = 'AttachmentBottomSheet';

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors['grey-plain']['50'],
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  contentContainer: {
    paddingBottom: 32,
  },
});
