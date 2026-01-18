import React, { forwardRef, useImperativeHandle, useRef, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, BackHandler, Platform } from 'react-native';
import {
  HandHeart,
  HandHelping,
  Video,
  ChevronRight,
  HandCoins,
  Hand,
} from 'lucide-react-native';
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
  BottomSheetHandleProps,
  BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '@/theme/colors';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';

interface LiftOption {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  route: string;
}

const LIFT_OPTIONS: LiftOption[] = [
  {
    id: 'raise-lift',
    title: 'Raise lift',
    description: 'Help/support for others or a cause',
    icon: <HandHeart size={20} color={colors.primary.purple} />,
    // route: '/request-lift/step-2?headerText=Raise Lift&audience=everyone',
    route: '/screens/lifts/raise',
  },
  {
    id: 'request-lift',
    title: 'Request lift',
    description: 'Request help/support from others',
    icon: <HandHelping size={20} color={colors.primary.purple} />,
    route: '/screens/lifts/request',
  },
  {
    id: 'offer-lift',
    title: 'Offer lift',
    description: 'Give back to the community today.',
    icon: <HandCoins size={20} color={colors.primary.purple} />,
    route: '/screens/lifts/offer',
  },
  {
    id: 'share-words',
    title: 'Share some uplifting words',
    description: 'When you gave or received a lift',
    icon: <Hand size={20} color={colors.primary.purple} />,
    route: '/share-words', // Update this route as needed
  },
  {
    id: 'lift-clips',
    title: 'LiftClips',
    description: 'Use video to request and tell your lift story',
    icon: <Video size={20} color={colors.primary.purple} />,
    route: '/lift-clips', // Update this route as needed
  },
];

export interface LiftOptionsBottomSheetRef {
  open: () => void;
  close: () => void;
}

interface LiftOptionsBottomSheetProps {
  onSheetChange?: (isOpen: boolean) => void;
}

export const LiftOptionsBottomSheet = forwardRef<
  LiftOptionsBottomSheetRef,
  LiftOptionsBottomSheetProps
>(({ onSheetChange }, ref) => {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const insets = useSafeAreaInsets();
  const [isOpen, setIsOpen] = useState(false);

  // Handle Android back button
  useEffect(() => {
    if (Platform.OS !== 'android') return;

    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (isOpen) {
        bottomSheetModalRef.current?.dismiss();
        return true; // Prevent default back behavior
      }
      return false; // Allow default back behavior
    });

    return () => backHandler.remove();
  }, [isOpen]);

  useImperativeHandle(ref, () => ({
    open: () => {
      bottomSheetModalRef.current?.present();
      setIsOpen(true);
      onSheetChange?.(true);
    },
    close: () => {
      bottomSheetModalRef.current?.dismiss();
      setIsOpen(false);
      onSheetChange?.(false);
    },
  }));

  function handleOptionPress(option: LiftOption) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    bottomSheetModalRef.current?.dismiss();
    setIsOpen(false);
    onSheetChange?.(false);
    // Navigate after a short delay to allow the bottom sheet to close smoothly
    setTimeout(() => {
      router.push(option.route as any);
    }, 200);
  }

  function handleClose() {
    bottomSheetModalRef.current?.dismiss();
    setIsOpen(false);
    onSheetChange?.(false);
  }

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

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      enableDynamicSizing
      enablePanDownToClose
      handleComponent={renderHandle}
      backdropComponent={renderBackdrop}
      backgroundStyle={styles.container}
      onDismiss={handleClose}
      onAnimate={(fromIndex, toIndex) => {
        // Update isOpen state based on sheet position
        // -1 means closed, any other index means open
        const willBeOpen = toIndex !== -1;
        if (isOpen !== willBeOpen) {
          setIsOpen(willBeOpen);
          onSheetChange?.(willBeOpen);
        }
      }}
    >
      <BottomSheetView
        style={[
          styles.contentContainer,
          { paddingBottom: Math.max(insets.bottom, 32) },
        ]}
      >
        <View className="px-6 pb-2">
          <Text className="text-grey-alpha-550 text-xl font-medium">
            Select an option to proceed
          </Text>
        </View>
        <View className="px-6">
          {LIFT_OPTIONS.map((option, index) => (
            <TouchableOpacity
              key={option.id}
              onPress={() => handleOptionPress(option)}
              className={`flex-row items-center justify-between py-3 ${
                index !== LIFT_OPTIONS.length - 1
                  ? 'border-b border-grey-plain-300'
                  : ''
              }`}
            >
              <View className="flex-1 flex-row items-center">
                <View
                  className="mr-3 size-12 items-center justify-center rounded-full"
                  style={{
                    backgroundColor: colors['primary-tints']['purple']['100'],
                  }}
                >
                  {option.icon}
                </View>
                <View className="flex-1">
                  <Text className="mb-1 text-sm font-semibold text-grey-alpha-550">
                    {option.title}
                  </Text>
                  <Text className="text-xs text-grey-alpha-400">
                    {option.description}
                  </Text>
                </View>
              </View>
              <ChevronRight
                size={20}
                color={colors['grey-alpha']['400']}
                strokeWidth={2}
              />
            </TouchableOpacity>
          ))}
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
});

LiftOptionsBottomSheet.displayName = 'LiftOptionsBottomSheet';

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
