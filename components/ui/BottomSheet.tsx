import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BottomSheet, {
  BottomSheetView,
  BottomSheetScrollView,
  BottomSheetBackdrop,
  BottomSheetHandleProps,
  BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import { colors } from '@/theme/colors';

interface BottomSheetProps {
  title?: string;
  children: React.ReactNode;
  snapPoints?: (string | number)[];
  onClose?: () => void;
  keyboardBehavior?: 'interactive' | 'extend' | 'fillParent';
  keyboardBlurBehavior?: 'none' | 'restore';
  android_keyboardInputMode?: 'adjustResize' | 'adjustPan';
  /** Use scrollable content - recommended when bottom sheet has text inputs */
  scrollable?: boolean;
}

export interface BottomSheetRef {
  expand: () => void;
  close: () => void;
}

export const BottomSheetComponent = forwardRef<
  BottomSheetRef,
  BottomSheetProps
>(
  (
    {
      title,
      children,
      snapPoints,
      onClose,
      keyboardBehavior = 'interactive',
      keyboardBlurBehavior = 'restore',
      android_keyboardInputMode = 'adjustResize',
      scrollable = false,
    }: BottomSheetProps,
    ref: React.Ref<BottomSheetRef>
  ) => {
    const bottomSheetRef = useRef<BottomSheet>(null);
    const insets = useSafeAreaInsets();

    useImperativeHandle(ref, () => ({
      expand: () => {
        bottomSheetRef.current?.expand();
      },
      close: () => {
        bottomSheetRef.current?.close();
      },
    }));

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

    // Use dynamic sizing if snapPoints not provided, otherwise use provided snapPoints
    const sheetProps = snapPoints
      ? { snapPoints }
      : { enableDynamicSizing: true };

    return (
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        {...sheetProps}
        enablePanDownToClose
        handleComponent={renderHandle}
        backdropComponent={renderBackdrop}
        backgroundStyle={styles.container}
        onClose={onClose}
        keyboardBehavior={keyboardBehavior}
        keyboardBlurBehavior={keyboardBlurBehavior}
        android_keyboardInputMode={android_keyboardInputMode}
      >
        {scrollable ? (
          <BottomSheetScrollView
            style={styles.contentContainer}
            contentContainerStyle={{ paddingBottom: Math.max(insets.bottom, 32) }}
          >
            {title && (
              <View className="px-6 pb-4">
                <Text className="text-grey-alpha-550 text-lg font-inter-bold">
                  {title}
                </Text>
              </View>
            )}
            <View>{children}</View>
          </BottomSheetScrollView>
        ) : (
          <BottomSheetView
            style={[
              styles.contentContainer,
              { paddingBottom: Math.max(insets.bottom, 32) },
            ]}
          >
            {title && (
              <View className="px-6 pb-4">
                <Text className="text-grey-alpha-550 text-lg font-inter-bold">
                  {title}
                </Text>
              </View>
            )}
            <View>{children}</View>
          </BottomSheetView>
        )}
      </BottomSheet>
    );
  }
);

BottomSheetComponent.displayName = 'BottomSheet';

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors['grey-plain']['50'],
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  contentContainer: {
    // paddingBottom will be set dynamically using safe area insets
  },
});
