import {
  ChevronLeft,
  ChevronRight,
  Clock,
  CornerUpLeft,
  Info,
  Tag,
} from 'lucide-react-native';
import { TouchableOpacity, View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/theme/colors';
import { Button } from '@/components/ui/Button';
import { router, Href } from 'expo-router';
import { RequestSuccessBottomSheet } from '@/components/lift';
import { useCallback, useRef, useState } from 'react';
import { BottomSheetRef } from '@/components/ui/BottomSheet';
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import { useLiftDraft } from '@/context/LiftDraftContext';
import { ConfirmationModal } from '../ui/ConfirmationModal';
import { PasscodeBottomSheet } from '../ui/PasscodeBottomSheet';
import { PaymentBottomSheet } from './PaymentBottomSheet';

interface PreviewOfferLiftScreenProps {
  onSuccess?: () => void;
  onEdit?: () => void;
  successRoute?: Href;
}

export default function PreviewOfferLiftScreen({
  onSuccess,
  onEdit,
  successRoute = '/(tabs)/home' as Href,
}: PreviewOfferLiftScreenProps) {
  const {
    selectedMedia,
    category,
    title,
    description,
    liftAmount,
    audienceType,
    numberOfRecipients,
  } = useLiftDraft();

  const successSheetRef = useRef<BottomSheetRef>(null);
  const passcodeBottomSheetRef = useRef<BottomSheetRef>(null);
  const paymentSheetRef = useRef<BottomSheetRef>(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const handleEditDetails = () => {
    if (onEdit) {
      onEdit();
    } else {
      router.back();
    }
  };

  const handleOfferLift = () => {
    paymentSheetRef.current?.expand();
  };

  const handlePaymentProceed = () => {
    paymentSheetRef.current?.close();
    setTimeout(() => {
      setShowConfirmationModal(true);
    }, 300);
  };

  const handleConfirmLift = () => {
    setShowConfirmationModal(false);
    // Add a small delay to allow modal to close before opening sheet
    setTimeout(() => {
      passcodeBottomSheetRef.current?.expand();
    }, 300);
  };

  const handleCancelLift = () => {
    setShowConfirmationModal(false);
  };

  const handlePasscodeComplete = () => {
    passcodeBottomSheetRef.current?.close();
    // Simulate API call success
    setTimeout(() => {
      if (onSuccess) {
        onSuccess();
      } else {
        successSheetRef.current?.expand();
      }
    }, 500);
  };

  const handleGoToFeeds = () => {
    successSheetRef.current?.close();
    router.replace(successRoute);
  };

  const handleShareOffer = async () => {
    // Implement share functionality
    console.log('Share offer');
  };

  // Format audience type for display
  // const getAudienceDisplayText = () => {
  //   switch (audienceType) {
  //     case 'everyone':
  //       return 'Everyone';
  //     case 'friends':
  //       return 'Friends';
  //     default:
  //       return 'Everyone';
  //   }
  // };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'bottom']}>
      <ScrollView>
        {/* Header */}
        <View className="flex-row items-center justify-between border-b border-grey-plain-150 bg-white px-4 py-3">
          <View className="flex-row items-center gap-3">
            <TouchableOpacity onPress={() => router.back()}>
              <CornerUpLeft
                color={colors['grey-plain']['550']}
                size={24}
                strokeWidth={2}
              />
            </TouchableOpacity>
            <Text className="text-lg font-semibold text-grey-alpha-500">
              Preview Lift
            </Text>
          </View>
        </View>

        {/* Content */}
        <View className="px-5 pt-6">
          {/* Offer to Section */}
          <View className="mb-6">
            <Text className="mb-2 text-sm font-medium text-grey-alpha-450">
              Offer to:
            </Text>
            <View className="h-10 w-10 items-center justify-center rounded-full bg-grey-plain-150">
              <Text className="text-base">
                {numberOfRecipients}
              </Text>
            </View>
          </View>

          {/* Title & Description */}
          <View className="mb-6">
            <Text className="mb-2 text-2xl font-semibold text-grey-alpha-550">{title}</Text>
            <Text className="text-base leading-snug text-grey-alpha-450">
              {description}
            </Text>
          </View>

          <View className="mb-6 w-full border-b w-3 border-grey-plain-300" />

          {/* Amount Section */}
          <View className="mb-6">
            <Text className="mb-1 text-sm text-grey-plain-500">Amount</Text>
            <Text className="mb-2 text-xl text-grey-alpha-550 font-bold text-black">
              {new Intl.NumberFormat('en-NG', {
                style: 'currency',
                currency: 'NGN',
              }).format(Number(liftAmount))}
            </Text>
            <View className="flex-row items-center gap-2">
              <Info size={16} color={colors['grey-plain']['600']} />
              <Text className="text-sm text-grey-plain-500">
                Each recipients will get{' '}
                {new Intl.NumberFormat('en-NG', {
                  style: 'currency',
                  currency: 'NGN',
                }).format(
                  Number(liftAmount) / (Number(numberOfRecipients))
                )}{' '}
                each
              </Text>
            </View>
          </View>

          {/* Settings */}
          <View className="mb-6">
            <Text className="mb-1 text-sm text-grey-plain-500">
              Lift settings
            </Text>
            <Text className="text-base text-grey-alpha-550 font-semibold text-black">
              One-to-many
            </Text>
          </View>

          {/* Configuration */}
          <View className="mb-6">
            <Text className="mb-1 text-sm text-grey-plain-500">
              Lift configuration
            </Text>
            <Text className="text-base text-grey-alpha-550 font-semibold text-black">
              Anonymous
            </Text>
          </View>
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
              title="Lift offer successfully posted"
              description="We have created and posted your lift offer. We will notify you of all interaction with your offer."
              primaryButtonTitle="Share lift offer"
              secondaryButtonTitle="Go to feeds"
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
              title={`You are about to lift ${
                Number(numberOfRecipients) > 1
                  ? `${numberOfRecipients} people`
                  : 'this person'
              } with ₦${Number(liftAmount).toLocaleString()}`}
              message="They will receive the monetary value of your lift in their wallet."
              confirmText="Yes, lift"
              cancelText="Cancel"
              onConfirm={handleConfirmLift}
              onCancel={handleCancelLift}
            />

            {/* Payment Bottom Sheet */}
            <PaymentBottomSheet
              ref={paymentSheetRef}
              amount={Number(liftAmount)}
              walletBalance={500000}
              onFundWallet={() => console.log('Fund wallet')}
              onProceed={handlePaymentProceed}
            />
    </SafeAreaView>
  );
}
