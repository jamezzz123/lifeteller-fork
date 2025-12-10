import { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Slot, router, usePathname } from 'expo-router';
import { X } from 'lucide-react-native';

import { colors } from '@/theme/colors';
import { CancelBottomSheet } from '@/components/request-lift';
import { RequestLiftProvider, useRequestLift } from './context';

const TOTAL_STEPS = 8; // Update this based on your actual number of steps

// Map routes to step numbers
const ROUTE_TO_STEP: Record<string, number> = {
  '/request-lift': 1,
  '/request-lift/step-2': 2,
  '/request-lift/step-3': 3,
  '/request-lift/step-4': 4,
  '/request-lift/step-5': 5,
  '/request-lift/step-6': 6,
  '/request-lift/step-7': 7,
  '/request-lift/step-8': 8,
};

function LayoutContent() {
  const pathname = usePathname();
  const currentStep = ROUTE_TO_STEP[pathname] || 1;
  const progressWidth = (currentStep / TOTAL_STEPS) * 100;
  const [showCancelSheet, setShowCancelSheet] = useState(false);

  // Hide layout header for certain routes
  const hideLayoutHeader = pathname === '/request-lift/more-options';

  const {
    selectedContacts,
    liftTitle,
    liftDescription,
    liftType,
    headerTitle,
    nextButtonLabel,
    canProceed,
    onNextRef,
    reset,
  } = useRequestLift();

  // Check if user has entered any data
  const hasData =
    selectedContacts.length > 0 ||
    liftTitle.trim().length > 0 ||
    liftDescription.trim().length > 0 ||
    liftType !== null;

  const handleClose = () => {
    if (hasData) {
      setShowCancelSheet(true);
    } else {
      router.back();
    }
  };

  const handleSaveAsDraft = () => {
    // TODO: Implement save as draft functionality
    setShowCancelSheet(false);
    reset();
    router.back();
  };

  const handleDiscard = () => {
    setShowCancelSheet(false);
    reset();
    router.back();
  };

  const handleContinueEditing = () => {
    setShowCancelSheet(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View className="flex-1">
        {/* Header */}
        {!hideLayoutHeader && (
          <View className="flex-row items-center justify-between px-4 pb-3 pt-2">
            <TouchableOpacity
              onPress={handleClose}
              accessibilityLabel="Close request lift"
              hitSlop={10}
              className="pr-2"
            >
              <X
                size={20}
                color={colors['grey-alpha']['500']}
                strokeWidth={2.6}
              />
            </TouchableOpacity>
            <Text className="text-base font-semibold text-grey-alpha-500">
              {headerTitle}
            </Text>
            <TouchableOpacity
              onPress={() => onNextRef.current?.()}
              disabled={!canProceed}
              className="rounded-full px-6 py-2"
              style={{
                backgroundColor: canProceed
                  ? colors.primary.purple
                  : colors['grey-plain']['450'],
              }}
              accessibilityLabel={nextButtonLabel}
            >
              <Text
                className="text-sm font-semibold"
                style={{ color: canProceed ? '#FFFFFF' : colors['grey-alpha']['400'] }}
              >
                {nextButtonLabel}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Progress Bar */}
        {!hideLayoutHeader && (
          <View className="px-4">
            <View className="h-[3px] w-full rounded-full bg-grey-plain-450/60">
              <View
                className="h-[3px] rounded-full bg-primary"
                style={{ width: `${progressWidth}%` }}
              />
            </View>
          </View>
        )}

        {/* Content (each step) */}
        <Slot />
      </View>

      {/* Cancel Bottom Sheet */}
      <CancelBottomSheet
        visible={showCancelSheet}
        onSaveAsDraft={handleSaveAsDraft}
        onDiscard={handleDiscard}
        onContinueEditing={handleContinueEditing}
      />
    </SafeAreaView>
  );
}

export default function RequestLiftLayout() {
  return (
    <RequestLiftProvider>
      <LayoutContent />
    </RequestLiftProvider>
  );
}
