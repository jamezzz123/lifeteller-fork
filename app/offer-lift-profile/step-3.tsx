import { useEffect, useCallback, useRef, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { router, Href } from 'expo-router';
import * as Haptics from 'expo-haptics';

import { Button } from '@/components/ui/Button';
import { BottomSheetRef } from '@/components/ui/BottomSheet';
import {
  RequestSuccessBottomSheet,
  ContactRow,
} from '@/components/request-lift';
import { useOfferLiftProfile } from './context';
import { PasscodeBottomSheet } from '@/components/ui/PasscodeBottomSheet';
import { ConfirmationModal } from '@/components/ui/ConfirmationModal';

export default function Step3Screen() {
  const {
    selectedRecipient,
    offerAmount,
    isAnonymous,
    setHeaderTitle,
  } = useOfferLiftProfile();

  const successSheetRef = useRef<BottomSheetRef>(null);
  const passcodeBottomSheetRef = useRef<BottomSheetRef>(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  // Set header title on mount
  useEffect(() => {
    setHeaderTitle('Preview lift');
  }, [setHeaderTitle]);

  const handleOfferLift = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // Show confirmation modal
    setShowConfirmationModal(true);
  }, []);

  const handleConfirmLift = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setShowConfirmationModal(false);
    // Show passcode bottom sheet
    passcodeBottomSheetRef.current?.expand();
  }, []);

  const handleCancelLift = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowConfirmationModal(false);
  }, []);

  const handleEditDetails = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  }, []);

  function handleGoToFeeds() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    successSheetRef.current?.close();
    router.replace('/(tabs)/home' as Href);
  }

  function handleShareOffer() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // Implement share functionality
    successSheetRef.current?.close();
  }

  function handlePasscodeComplete() {
    passcodeBottomSheetRef.current?.close();
    successSheetRef.current?.expand();
  }

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Offer To */}
        <View className="px-4 pt-5">
          <Text className="mb-3 text-sm font-medium text-grey-alpha-400">
            Offer to:
          </Text>
          {selectedRecipient && (
            <ContactRow
              contact={selectedRecipient}
              onSelect={() => {}}
              disabled={true}
              isSelected={false}
            />
          )}
        </View>

        {/* Message */}
        <View className="mt-6 px-4">
          <Text className="mt-2 text-sm leading-5 text-grey-alpha-400">
            It is my guy&apos;s birthday. I love him do much.
          </Text>
        </View>

        {/* Divider */}
        <View className="mt-6 h-[1px] bg-grey-plain-450/20" />

        {/* Amount */}
        <View className="mt-6 px-4">
          <Text className="text-sm text-grey-alpha-400">Amount</Text>
          <Text className="mt-1 text-base font-semibold text-grey-alpha-500">
            ₦{offerAmount.toLocaleString()}
          </Text>
        </View>

        {/* Lift Settings */}
        <View className="mt-8 px-4">
          <Text className="text-sm text-grey-alpha-400">Lift settings</Text>
          <Text className="mt-1 text-base font-semibold text-grey-alpha-500">
            One-to-one
          </Text>
        </View>

        {/* Lift Configuration */}
        <View className="mt-6 px-4">
          <Text className="text-sm text-grey-alpha-400">
            Lift configuration
          </Text>
          <Text className="mt-1 text-base font-semibold text-grey-alpha-500">
            {isAnonymous ? 'Anonymous' : 'Public'}
          </Text>
        </View>
      </ScrollView>

      {/* Bottom Action Buttons */}
      <View className="border-t border-grey-plain-450/20 bg-background px-4 pb-6 pt-4">
        <View className="flex-row gap-3">
          <View className="flex-1">
            <Button
              title="Edit details"
              variant="outline"
              onPress={handleEditDetails}
            />
          </View>
          <View className="flex-1">
            <Button
              title="Offer lift"
              onPress={handleOfferLift}
              variant="primary"
            />
          </View>
        </View>
      </View>

      {/* Success Bottom Sheet */}
      <RequestSuccessBottomSheet
        ref={successSheetRef}
        onGoToFeeds={handleGoToFeeds}
        onShareRequest={handleShareOffer}
      />

      {/* Passcode Bottom Sheet */}
      <PasscodeBottomSheet
        ref={passcodeBottomSheetRef}
        mode="verify"
        onComplete={handlePasscodeComplete}
      />

      {/* Confirmation Modal */}
      <ConfirmationModal
        visible={showConfirmationModal}
        title={`You are about to lift ${selectedRecipient?.name || 'this person'} with ₦${offerAmount.toLocaleString()}`}
        message="They will receive the monetary value of your lift in their wallet."
        confirmText="Yes, lift"
        cancelText="Cancel"
        onConfirm={handleConfirmLift}
        onCancel={handleCancelLift}
      />
    </View>
  );
}
