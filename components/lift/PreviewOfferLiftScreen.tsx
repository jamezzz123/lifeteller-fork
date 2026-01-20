import { CornerUpLeft, Info } from 'lucide-react-native';
import { TouchableOpacity, View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/theme/colors';
import { Button } from '@/components/ui/Button';
import { router, Href } from 'expo-router';
import { RequestSuccessBottomSheet } from '@/components/lift';
import { useRef, useState } from 'react';
import { BottomSheetRef } from '@/components/ui/BottomSheet';
import { useLiftDraft } from '@/context/LiftDraftContext';
import { ConfirmationModal } from '../ui/ConfirmationModal';
import { PasscodeBottomSheet } from '../ui/PasscodeBottomSheet';
import { PaymentBottomSheet } from './PaymentBottomSheet';
import { LiftProgressBar } from '../ui/LiftProgressBar';
import { UserInfoRow } from '@/components/ui/UserInfoRow';

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
  const { title, description, liftAmount, numberOfRecipients, offerTo } =
    useLiftDraft();

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
            <Text className="font-inter-semibold text-lg text-grey-alpha-500">
              Preview Lift
            </Text>
          </View>
        </View>

        {/* Content */}
        <View className="px-5 pt-6">
          {/* Title & Description */}
          <View className="mb-6">
            <Text className="mb-2 font-inter-semibold text-2xl text-grey-alpha-550">
              {title}
            </Text>
            <Text className="font-inter text-base leading-snug text-grey-alpha-450">
              {description}
            </Text>
          </View>

          <View
            className="mb-4 rounded-2xl border p-4"
            style={{
              backgroundColor: colors['grey-plain']['50'],
              borderColor: colors['grey-plain']['300'],
            }}
          >
            <Text className="mb-3 text-2xl font-bold text-grey-alpha-500">
              ₦100000
            </Text>

            {/* Progress Bar */}
            <LiftProgressBar
              currentAmount={500}
              targetAmount={10000}
              showAmount={false}
            />
          </View>

          <View className="mb-6 w-3 w-full border-b border-grey-plain-300" />

          {/* Offer to Section */}
          <View className="mb-6">
            <Text className="mb-2 font-inter-medium text-sm text-grey-alpha-450">
              Offer to:
            </Text>
            {offerTo ? (
              <UserInfoRow user={offerTo} />
            ) : (
              <View className="h-10 w-10 items-center justify-center rounded-full bg-grey-plain-150">
                <Text className="font-inter text-base">
                  {numberOfRecipients}
                </Text>
              </View>
            )}
          </View>
          {/* Amount Section */}
          <View className="mb-6">
            <Text className="text-grey-plain-500 mb-1 font-inter text-sm">
              Amount
            </Text>
            <Text className="mb-2 font-inter-bold text-xl text-black text-grey-alpha-550">
              {new Intl.NumberFormat('en-NG', {
                style: 'currency',
                currency: 'NGN',
              }).format(Number(liftAmount))}
            </Text>
            <View className="flex-row items-center gap-2">
              <Info size={16} color={colors['grey-plain']['600']} />
              <Text className="text-grey-plain-500 font-inter text-sm">
                Each recipients will get{' '}
                {new Intl.NumberFormat('en-NG', {
                  style: 'currency',
                  currency: 'NGN',
                }).format(Number(liftAmount) / Number(numberOfRecipients))}{' '}
                each
              </Text>
            </View>
          </View>

          {/* Settings */}
          <View className="mb-6">
            <Text className="text-grey-plain-500 mb-1 font-inter text-sm">
              Lift settings
            </Text>
            <Text className="font-inter-semibold text-base text-black text-grey-alpha-550">
              One-to-many
            </Text>
          </View>

          {/* Configuration */}
          <View className="mb-6">
            <Text className="text-grey-plain-500 mb-1 font-inter text-sm">
              Lift configuration
            </Text>
            <Text className="font-inter-semibold text-base text-black text-grey-alpha-550">
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
