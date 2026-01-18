import { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Slot, router, usePathname } from 'expo-router';
import { X, ChevronLeft } from 'lucide-react-native';

import { colors } from '@/theme/colors';
import { CancelBottomSheet } from '@/components/lift';
import { Button } from '@/components/ui/Button';
import { OfferLiftProfileProvider, useOfferLiftProfile } from './context';

const TOTAL_STEPS = 3;

// Map routes to step numbers
const ROUTE_TO_STEP: Record<string, number> = {
  '/offer-lift-profile': 1,
  '/offer-lift-profile/step-2': 2,
  '/offer-lift-profile/step-3': 3,
};

function LayoutContent() {
  const pathname = usePathname();
  const currentStep = ROUTE_TO_STEP[pathname] || 1;
  const progressWidth = (currentStep / TOTAL_STEPS) * 100;
  const [showCancelSheet, setShowCancelSheet] = useState(false);

  // Hide next button for step 3 (preview - has its own button at the bottom)
  const hideNextButton = pathname === '/offer-lift-profile/step-3';
  const isPreviewStep = pathname === '/offer-lift-profile/step-3';

  const {
    selectedRecipient,
    offerMessage,
    offerAmount,
    headerTitle,
    nextButtonLabel,
    canProceed,
    onNextRef,
    reset,
  } = useOfferLiftProfile();

  // Check if user has entered any data
  const hasData =
    selectedRecipient !== null ||
    offerMessage.trim().length > 0 ||
    offerAmount > 0;

  const handleClose = () => {
    if (hasData) {
      setShowCancelSheet(true);
    } else {
      router.back();
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handleSaveAsDraft = () => {
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
        <View className="flex-row items-center justify-between px-4 pb-3 pt-2">
          <View className="flex-row items-center space-x-2">
            <TouchableOpacity
              onPress={isPreviewStep ? handleBack : handleClose}
              accessibilityLabel={isPreviewStep ? 'Go back' : 'Close offer lift'}
              hitSlop={10}
              className="pr-2"
            >
              {isPreviewStep ? (
                <ChevronLeft
                  size={24}
                  color={colors['grey-alpha']['450']}
                  strokeWidth={2}
                />
              ) : (
                <X
                  size={20}
                  color={colors['grey-alpha']['450']}
                  strokeWidth={2.6}
                />
              )}
            </TouchableOpacity>
            <Text className="text-base font-inter-semibold text-grey-alpha-450">
              {headerTitle}
            </Text>
          </View>
          {!hideNextButton && (
            <Button
              title={nextButtonLabel}
              onPress={() => onNextRef.current?.()}
              size="small"
              disabled={!canProceed}
            />
          )}
        </View>

        {/* Progress Bar */}
        <View className="">
          <View className="h-[3px] w-full rounded-full bg-grey-plain-450/60">
            <View
              className="h-[3px] rounded-full bg-primary"
              style={{ width: `${progressWidth}%` }}
            />
          </View>
        </View>

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

export default function OfferLiftProfileLayout() {
  return (
    <OfferLiftProfileProvider>
      <LayoutContent />
    </OfferLiftProfileProvider>
  );
}
