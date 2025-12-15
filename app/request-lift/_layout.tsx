import { useState, useEffect } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Slot, router, usePathname } from 'expo-router';
import { X } from 'lucide-react-native';

import { colors } from '@/theme/colors';
import { CancelBottomSheet } from '@/components/lift';
import { Button } from '@/components/ui/Button';
import {
  AudienceOfferType,
  RequestLiftProvider,
  useRequestLift,
} from './context';
import { useLocalSearchParams } from 'expo-router';

const TOTAL_STEPS = 4;

// Map routes to step numbers
const ROUTE_TO_STEP: Record<string, number> = {
  '/request-lift': 1,
  '/request-lift/step-2': 2,
  '/request-lift/step-3': 3,
  '/request-lift/step-4': 4,
};

function LayoutContent() {
  const pathname = usePathname();
  const currentStep = ROUTE_TO_STEP[pathname] || 1;
  const progressWidth = (currentStep / TOTAL_STEPS) * 100;
  const [showCancelSheet, setShowCancelSheet] = useState(false);

  // Hide layout header for certain routes
  const hideLayoutHeader = pathname === '/request-lift/more-options';
  // Hide next button for step 4 (has its own button at the bottom)
  const hideNextButton = pathname === '/request-lift/step-4';

  const { headerText, audience } = useLocalSearchParams<{
    headerText?: string;
    audience?: AudienceOfferType;
  }>();

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
    setAudienceOfferType,
    setHeaderTitle,
  } = useRequestLift();

  // Set audience type and header title from URL params
  useEffect(() => {
    if (audience) {
      setAudienceOfferType(audience);
    }
    if (headerText) {
      setHeaderTitle(headerText);
    }
  }, [audience, headerText, setAudienceOfferType, setHeaderTitle]);

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
            <View className="flex-row space-x-2">
              <TouchableOpacity
                onPress={handleClose}
                accessibilityLabel="Close request lift"
                hitSlop={10}
                className="pr-2"
              >
                <X
                  size={20}
                  color={colors['grey-alpha']['450']}
                  strokeWidth={2.6}
                />
              </TouchableOpacity>
              <Text className="text-base font-semibold text-grey-alpha-450">
                {headerTitle}
              </Text>
            </View>
            {!hideNextButton && (
              <Button
                title={nextButtonLabel}
                onPress={() => onNextRef.current?.()}
                size="small"
                disabled={!canProceed}
                // className="min-w-[110px]"
              />
            )}
          </View>
        )}

        {/* Progress Bar */}
        {!hideLayoutHeader && (
          <View className="">
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
