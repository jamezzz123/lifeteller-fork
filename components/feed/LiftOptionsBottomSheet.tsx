import React, { forwardRef, useImperativeHandle } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import {
  HandHeart,
  HandHelping,
  Video,
  ChevronRight,
  HandCoins,
  Hand,
} from 'lucide-react-native';
import {
  BottomSheetComponent,
  BottomSheetRef,
} from '@/components/ui/BottomSheet';
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
    icon: <HandHeart size={24} color={colors.primary.purple} />,
    // route: '/request-lift/step-2?headerText=Raise Lift&audience=everyone',
    route: '/screens/lifts/raise',
  },
  {
    id: 'request-lift',
    title: 'Request lift',
    description: 'Request help/support from others',
    icon: <HandHelping size={24} color={colors.primary.purple} />,
    route: '/request-lift',
  },
  {
    id: 'offer-lift',
    title: 'Offer lift',
    description: 'Give back to the community today.',
    icon: <HandCoins size={24} color={colors.primary.purple} />,
    route: '/offer-lift-profile',
  },
  {
    id: 'share-words',
    title: 'Share some uplifting words',
    description: 'When you gave or received a lift',
    icon: <Hand size={24} color={colors.primary.purple} />,
    route: '/share-words', // Update this route as needed
  },
  {
    id: 'lift-clips',
    title: 'Lift clips',
    description: 'Use video to request and tell your lift story',
    icon: <Video size={24} color={colors.primary.purple} />,
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
  const bottomSheetRef = React.useRef<BottomSheetRef>(null);

  useImperativeHandle(ref, () => ({
    open: () => {
      bottomSheetRef.current?.expand();
      onSheetChange?.(true);
    },
    close: () => {
      bottomSheetRef.current?.close();
      onSheetChange?.(false);
    },
  }));

  function handleOptionPress(option: LiftOption) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    bottomSheetRef.current?.close();
    onSheetChange?.(false);
    // Navigate after a short delay to allow the bottom sheet to close smoothly
    setTimeout(() => {
      router.push(option.route as any);
    }, 200);
  }

  function handleClose() {
    bottomSheetRef.current?.close();
    onSheetChange?.(false);
  }

  return (
    <BottomSheetComponent
      ref={bottomSheetRef}
      title="Select an option to proceed"
      onClose={handleClose}
    >
      <View className="px-6">
        {LIFT_OPTIONS.map((option, index) => (
          <TouchableOpacity
            key={option.id}
            onPress={() => handleOptionPress(option)}
            className={`flex-row items-center justify-between py-4 ${
              index !== LIFT_OPTIONS.length - 1
                ? 'border-b border-grey-plain-300'
                : ''
            }`}
          >
            <View className="flex-1 flex-row items-center">
              <View
                className="mr-4 size-12 items-center justify-center rounded-full"
                style={{
                  backgroundColor: colors['primary-tints']['purple']['100'],
                }}
              >
                {option.icon}
              </View>
              <View className="flex-1">
                <Text className="mb-1 text-base font-semibold text-grey-alpha-550">
                  {option.title}
                </Text>
                <Text className="text-sm text-grey-alpha-400">
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
    </BottomSheetComponent>
  );
});

LiftOptionsBottomSheet.displayName = 'LiftOptionsBottomSheet';
