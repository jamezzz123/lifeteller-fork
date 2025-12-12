import { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { MaterialInput } from '@/components/ui/MaterialInput';
import { LiftCard } from '@/components/OfferLift/LiftCard';
import { QuickAmountButtons } from '@/components/OfferLift/QuickAmountButtons';
import { UserHeader } from '@/components/OfferLift/UserHeader';
import { PaymentBottomSheet } from '@/components/OfferLift/PaymentBottomSheet';
import { PasscodeBottomSheet } from '@/components/ui/PasscodeBottomSheet';
import { LiftSuccessBottomSheet } from '@/components/OfferLift/LiftSuccessBottomSheet';
import {
  LiftTypeSelector,
  type LiftType,
} from '@/components/OfferLift/LiftTypeSelector';
import {
  NonMonetaryItemInput,
  type NonMonetaryItem,
} from '@/components/OfferLift/NonMonetaryItemInput';
import { BottomSheetRef } from '@/components/ui/BottomSheet';
import { colors } from '@/theme/colors';

// Mock data - replace with actual data from router params or API
const LIFT_DATA = {
  user: {
    name: 'Isaac Tolulope',
    handle: 'dareytemy',
    // profileImage: require('../../assets/images/sample-profile.jpg'),
    profileImage: require('../../assets/images/welcome/collage-2.png'),
    verified: true,
  },
  timestamp: '10 seconds ago',
  lift: {
    title: 'John Medical Expenses',
    currentAmount: 60000,
    targetAmount: 100000,
    location: 'Ikeja, Lagos',
    daysLeft: 23,
    availableItems: ['Laptop', 'Mouse', 'Keyboard'],
    // Determines what types of lifts this request accepts
    // Can be: ['monetary'], ['non-monetary'], or ['monetary', 'non-monetary', 'both']
    acceptedLiftTypes: ['monetary', 'non-monetary', 'both'] as LiftType[],
  },
};

const QUICK_AMOUNTS = [5000, 10000, 20000, 30000, 50000, 100000];

export default function OfferLiftPage() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [liftAmount, setLiftAmount] = useState('');
  const [selectedQuickAmount, setSelectedQuickAmount] = useState<number | null>(
    null
  );
  const [selectedLiftType, setSelectedLiftType] = useState<LiftType>(
    LIFT_DATA.lift.acceptedLiftTypes[0]
  );
  const [nonMonetaryItems, setNonMonetaryItems] = useState<NonMonetaryItem[]>([
    { id: '1', itemName: '', quantity: 0 },
  ]);
  const [passcodeError, setPasscodeError] = useState<string | undefined>();
  const [passcodeMode, setPasscodeMode] = useState<'verify' | 'create'>(
    'verify'
  );

  const paymentBottomSheetRef = useRef<BottomSheetRef>(null);
  const passcodeBottomSheetRef = useRef<BottomSheetRef>(null);
  const successBottomSheetRef = useRef<BottomSheetRef>(null);

  // Mock user phone number - replace with actual user data
  const USER_PHONE = '+2348134***778';

  // Handle returning from OTP verification
  useEffect(() => {
    if (params.createPasscode === 'true') {
      // OTP was verified, open passcode in create mode
      setPasscodeMode('create');
      setPasscodeError(undefined);
      setTimeout(() => {
        passcodeBottomSheetRef.current?.expand();
      }, 300);
    }
  }, [params.createPasscode]);

  // Mock wallet balance - replace with actual wallet balance from API
  const WALLET_BALANCE = 49000;

  const handleQuickAmountPress = (amount: number) => {
    setSelectedQuickAmount(amount);
    setLiftAmount(amount.toString());
  };

  const handleLiftTypeChange = (type: LiftType) => {
    setSelectedLiftType(type);
    // Reset inputs when changing type
    if (type === 'monetary') {
      setNonMonetaryItems([{ id: '1', itemName: '', quantity: 0 }]);
    }
  };

  const handleItemChange = (id: string, itemName: string) => {
    setNonMonetaryItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, itemName } : item))
    );
  };

  const handleQuantityChange = (id: string, quantity: number) => {
    setNonMonetaryItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const handleRemoveItem = (id: string) => {
    setNonMonetaryItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAddItem = () => {
    const newId = (nonMonetaryItems.length + 1).toString();
    setNonMonetaryItems((prev) => [
      ...prev,
      { id: newId, itemName: '', quantity: 0 },
    ]);
  };

  const handleOfferLift = () => {
    paymentBottomSheetRef.current?.expand();
  };

  const handleFundWallet = () => {
    paymentBottomSheetRef.current?.close();
    // TODO: Navigate to fund wallet screen
    console.log('Navigate to fund wallet');
  };

  const handleProceedPayment = () => {
    paymentBottomSheetRef.current?.close();
    // Open passcode bottom sheet
    setTimeout(() => {
      passcodeBottomSheetRef.current?.expand();
    }, 300);
  };

  const handlePasscodeComplete = (passcode: string) => {
    console.log('Passcode entered:', passcode);

    if (passcodeMode === 'create') {
      // Creating new passcode
      // TODO: Save new passcode to backend
      console.log('New passcode created:', passcode);
      setPasscodeError(undefined);
      passcodeBottomSheetRef.current?.close();

      // Reset to verify mode and reopen for payment
      setPasscodeMode('verify');
      setTimeout(() => {
        passcodeBottomSheetRef.current?.expand();
      }, 300);
    } else {
      // Verifying existing passcode for payment
      console.log('Processing payment:', liftAmount);

      // Mock verification - replace with actual API call
      const CORRECT_PASSCODE = '123456';

      if (passcode === CORRECT_PASSCODE) {
        setPasscodeError(undefined);
        passcodeBottomSheetRef.current?.close();

        // Show success bottom sheet after passcode sheet closes
        setTimeout(() => {
          successBottomSheetRef.current?.expand();
        }, 300);
      } else {
        setPasscodeError('Please confirm your passcode and enter it again');
      }
    }
  };

  const handleForgotPasscode = () => {
    passcodeBottomSheetRef.current?.close();
    // Navigate to OTP verification screen
    router.push({
      pathname: '/verify-otp',
      params: { phoneNumber: USER_PHONE },
    });
  };

  const handleGoToFeeds = () => {
    successBottomSheetRef.current?.close();
    // TODO: Navigate to feeds
    console.log('Navigate to feeds');
  };

  const handleGoToMyLifts = () => {
    successBottomSheetRef.current?.close();
    // TODO: Navigate to my lifts
    console.log('Navigate to my lifts');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-background"
    >
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 20 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="px-4">
          {/* Lift Post Card */}

          <UserHeader
            name={LIFT_DATA.user.name}
            handle={LIFT_DATA.user.handle}
            timestamp={LIFT_DATA.timestamp}
            profileImage={LIFT_DATA.user.profileImage}
            verified={LIFT_DATA.user.verified}
          />

          <LiftCard
            title={LIFT_DATA.lift.title}
            currentAmount={LIFT_DATA.lift.currentAmount}
            targetAmount={LIFT_DATA.lift.targetAmount}
            location={LIFT_DATA.lift.location}
            daysLeft={LIFT_DATA.lift.daysLeft}
          />

          {/* Info Message for Non-monetary */}
          {LIFT_DATA.lift.availableItems &&
            LIFT_DATA.lift.availableItems.length > 0 && (
              <View className="mb-4 flex-row items-start gap-2">
                <View className="mt-0.5">
                  <View className="size-4 items-center justify-center rounded-full border border-grey-alpha-400">
                    <Text className="text-xs text-grey-alpha-400">i</Text>
                  </View>
                </View>
                <Text className="flex-1 text-sm text-grey-alpha-400">
                  You can offer multiple non-monetary lifts
                </Text>
              </View>
            )}

          <View className="-mx-4 mb-6 border-t border-grey-plain-450/60" />

          {/* Lift Type Selector */}
          <LiftTypeSelector
            selected={selectedLiftType}
            onSelect={handleLiftTypeChange}
            availableTypes={LIFT_DATA.lift.acceptedLiftTypes}
          />

          {/* Monetary Input */}
          {(selectedLiftType === 'monetary' || selectedLiftType === 'both') && (
            <>
              <MaterialInput
                label="Lift amount"
                prefix="₦"
                value={liftAmount}
                onChangeText={(text) => {
                  setLiftAmount(text);
                  setSelectedQuickAmount(null);
                }}
                placeholder="0"
                keyboardType="numeric"
                containerClassName="mb-6"
              />

              {/* Quick Amount Buttons - Only for monetary-only mode */}
              {selectedLiftType === 'monetary' && (
                <QuickAmountButtons
                  amounts={QUICK_AMOUNTS}
                  selectedAmount={selectedQuickAmount}
                  onSelect={handleQuickAmountPress}
                />
              )}
            </>
          )}

          {/* Non-monetary Input */}
          {(selectedLiftType === 'non-monetary' ||
            selectedLiftType === 'both') && (
            <View>
              {selectedLiftType === 'both' && (
                <Text className="mb-4 text-sm text-grey-alpha-400">
                  You can offer multiple lifts
                </Text>
              )}

              {nonMonetaryItems.map((item, index) => (
                <NonMonetaryItemInput
                  key={item.id}
                  item={item}
                  itemIndex={index}
                  availableItems={LIFT_DATA.lift.availableItems || []}
                  onItemChange={handleItemChange}
                  onQuantityChange={handleQuantityChange}
                  onRemove={
                    nonMonetaryItems.length > 1 ? handleRemoveItem : undefined
                  }
                  showLabel={selectedLiftType === 'non-monetary'}
                />
              ))}

              {/* Add Another Item Button */}
              <Button
                title="Add item"
                onPress={handleAddItem}
                variant="outline"
              />
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom Button */}
      <View className="border-t border-grey-alpha-250 bg-grey-plain-150 px-4 py-4">
        <Button
          title="Offer lift"
          className="w-1/2 items-end self-end"
          onPress={handleOfferLift}
          disabled={!liftAmount || parseFloat(liftAmount) <= 0}
        />
      </View>

      {/* Payment Bottom Sheet */}
      <PaymentBottomSheet
        ref={paymentBottomSheetRef}
        amount={parseFloat(liftAmount) || 0}
        walletBalance={WALLET_BALANCE}
        onFundWallet={handleFundWallet}
        onProceed={handleProceedPayment}
      />

      {/* Passcode Bottom Sheet */}
      <PasscodeBottomSheet
        ref={passcodeBottomSheetRef}
        mode={passcodeMode}
        onComplete={handlePasscodeComplete}
        onForgotPasscode={handleForgotPasscode}
        error={passcodeError}
      />

      {/* Success Bottom Sheet */}
      <LiftSuccessBottomSheet
        ref={successBottomSheetRef}
        recipientName={LIFT_DATA.user.name}
        onGoToFeeds={handleGoToFeeds}
        onGoToMyLifts={handleGoToMyLifts}
      />
    </KeyboardAvoidingView>
  );
}
