import { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, TextInput as RNTextInput } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { CornerUpLeft, Check, Info } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/Button';
import { DatePickerField } from '@/components/ui/DatePickerField';
import { OTPVerificationBottomSheet } from '@/components/ui/OTPVerificationBottomSheet';
import { BottomSheetComponent, BottomSheetRef } from '@/components/ui/BottomSheet';
import { colors } from '@/theme/colors';
import * as Haptics from 'expo-haptics';

type VerificationOption = 'bvn' | 'nin' | null;

export default function UpgradeWalletScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ targetTier?: string }>();
  const targetTier = params.targetTier || 'tier-1';

  // Redirect to tier-3 screen if target tier is tier 3
  useEffect(() => {
    const normalizedTier = targetTier.toLowerCase().replace(/\s+/g, '-');
    if (normalizedTier === 'tier-3') {
      router.replace('/upgrade-wallet/tier-3' as any);
    }
  }, [targetTier, router]);

  const [selectedOption, setSelectedOption] =
    useState<VerificationOption>(null);

  // BVN form state
  const [bvn, setBvn] = useState('');

  // NIN form state
  const [nin, setNin] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [otherName, setOtherName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null);
  const [verifiedType, setVerifiedType] = useState<'bvn' | 'nin' | null>(null);
  const otpSheetRef = useRef<BottomSheetRef>(null);
  const successSheetRef = useRef<BottomSheetRef>(null);

  const handleGoBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  const handleSelectOption = (option: 'bvn' | 'nin') => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedOption(option);
    // Clear form fields when switching options
    if (option === 'bvn') {
      setNin('');
      setFirstName('');
      setLastName('');
      setOtherName('');
      setDateOfBirth(null);
    } else {
      setBvn('');
    }
  };

  const handleProceed = () => {
    if (!selectedOption) {
      console.log('No option selected');
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    if (selectedOption === 'bvn' && !isBVNFormValid) {
      console.log('BVN form not valid:', { bvn, isBVNFormValid });
      return;
    }
    if (selectedOption === 'nin' && !isNINFormValid) {
      console.log('NIN form not valid:', {
        nin,
        firstName,
        lastName,
        dateOfBirth,
        isNINFormValid,
      });
      return;
    }

    otpSheetRef.current?.expand();
  };

  const handleVerifyOtp = (otpValue: string) => {
    if (!otpValue) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    otpSheetRef.current?.close();
    setVerifiedType(selectedOption || 'bvn');
    setTimeout(() => {
      successSheetRef.current?.expand();
    }, 250);
  };

  const handleGoToWallet = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    successSheetRef.current?.close();
    setTimeout(() => {
      router.replace('/(tabs)/wallet');
    }, 300);
  };

  const handleUpgradeToNextTier = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    successSheetRef.current?.close();
    setTimeout(() => {
      router.replace({
        pathname: '/upgrade-wallet/liveliness-check' as any,
        params: {
          type: 'nin',
          targetTier: 'tier 2',
        },
      });
    }, 300);
  };

  const handleContactUs = () => {
    // TODO: Navigate to contact us
    console.log('Contact us');
  };

  const isBVNFormValid = bvn.trim().length >= 11;
  const isNINFormValid =
    nin.trim().length >= 11 &&
    firstName.trim().length > 0 &&
    lastName.trim().length > 0 &&
    !!dateOfBirth;

  const isFormValid =
    selectedOption === 'bvn' ? isBVNFormValid : isNINFormValid;

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'bottom']}>
      {/* Header */}
      <View className="flex-row items-center gap-4 border-b border-grey-plain-150 bg-white px-4 py-4">
        <TouchableOpacity onPress={handleGoBack} hitSlop={8}>
          <CornerUpLeft
            size={24}
            color={colors['grey-alpha']['500']}
            strokeWidth={2}
          />
        </TouchableOpacity>
        <Text className="flex-1 text-lg font-semibold text-grey-alpha-500">
          Upgrade to tier-1
        </Text>
      </View>

      {/* Content */}
      <KeyboardAwareScrollView
        className="flex-1 bg-grey-plain-50"
        contentContainerStyle={{ paddingBottom: 160 }}
        showsVerticalScrollIndicator={false}
        enableOnAndroid
        keyboardShouldPersistTaps="handled"
        extraScrollHeight={24}
      >
        <View className="rounded-t-3xl bg-white px-4 pt-6">
          {/* Choose an option */}
          <View className="mb-6">
            <Text className="mb-3 text-base font-medium text-grey-alpha-500">
              Choose an option
            </Text>

            {/* Options Container */}
            <View className="flex-row flex-wrap gap-3">
              {/* BVN Option */}
              <TouchableOpacity
                onPress={() => handleSelectOption('bvn')}
                className="rounded-xl px-3 py-2"
                style={{
                  backgroundColor:
                    selectedOption === 'bvn'
                      ? colors['primary-tints'].purple['100']
                      : colors['grey-alpha']['150'],
                }}
                activeOpacity={0.7}
              >
                <View className="flex-row items-center gap-2">
                  {selectedOption === 'bvn' && (
                    <Check
                      size={16}
                      color={colors['primary-shades']['purple']['200']}
                      strokeWidth={3}
                    />
                  )}
                  <Text
                    className="text-sm font-medium"
                    style={{
                      color:
                        selectedOption === 'bvn'
                          ? colors['primary-shades']['purple']['200']
                          : colors['grey-alpha']['450'],
                    }}
                  >
                    BVN
                  </Text>
                </View>
              </TouchableOpacity>

              {/* NIN Option */}
              <TouchableOpacity
                onPress={() => handleSelectOption('nin')}
                className="rounded-xl px-3 py-2"
                style={{
                  backgroundColor:
                    selectedOption === 'nin'
                      ? colors['primary-tints'].purple['100']
                      : colors['grey-alpha']['150'],
                }}
                activeOpacity={0.7}
              >
                <View className="flex-row items-center gap-2">
                  {selectedOption === 'nin' && (
                    <Check
                      size={16}
                      color={colors['primary-shades']['purple']['200']}
                      strokeWidth={3}
                    />
                  )}
                  <Text
                    className="text-sm font-medium"
                    style={{
                      color:
                        selectedOption === 'nin'
                          ? colors['primary-shades']['purple']['200']
                          : colors['grey-alpha']['450'],
                    }}
                  >
                    NIN
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* BVN Form */}
          {selectedOption === 'bvn' && (
            <View className="mb-6">
              <Text className="mb-2 text-base font-medium text-grey-alpha-500">
                Enter your BVN number
              </Text>

              <View
                className="rounded-xl border border-grey-plain-300 bg-white px-4 py-4"
                style={{ minHeight: 56 }}
              >
                <RNTextInput
                  value={bvn}
                  onChangeText={setBvn}
                  placeholder="Enter your BVN"
                  placeholderTextColor={colors['grey-alpha']['400']}
                  keyboardType="number-pad"
                  maxLength={11}
                  className="flex-1 text-base text-grey-alpha-500"
                  style={{ fontSize: 16 }}
                />
              </View>

              {/* Helper Text */}
              <View className="mt-3 flex-row items-start gap-2">
                <Info
                  size={16}
                  color={colors['grey-plain']['550']}
                  strokeWidth={2}
                />
                <Text className="flex-1 text-sm leading-5 text-grey-plain-550">
                  Dial *565*0# on your registered number to get your BVN.
                </Text>
              </View>
            </View>
          )}

          {/* NIN Form */}
          {selectedOption === 'nin' && (
            <View className="mb-6">
              {/* NIN */}
              <View className="mb-4">
                <Text className="mb-2 text-base font-medium text-grey-alpha-500">
                  NIN (National identity number)
                </Text>

                <View
                  className="rounded-xl border border-grey-plain-300 bg-white px-4 py-4"
                  style={{ minHeight: 56 }}
                >
                  <RNTextInput
                    value={nin}
                    onChangeText={setNin}
                    placeholder="Enter your NIN"
                    placeholderTextColor={colors['grey-alpha']['400']}
                    keyboardType="number-pad"
                    maxLength={11}
                    className="flex-1 text-base text-grey-alpha-500"
                    style={{ fontSize: 16 }}
                  />
                </View>

                {/* Helper Text */}
                <View className="mt-3 flex-row items-start gap-2">
                  <Info
                    size={16}
                    color={colors['grey-plain']['550']}
                    strokeWidth={2}
                  />
                  <Text className="flex-1 text-sm leading-5 text-grey-plain-550">
                    Dial *346# on your registered number to get your NIN.
                  </Text>
                </View>
              </View>

              {/* First name */}
              <View className="mb-4">
                <Text className="mb-2 text-base font-medium text-grey-alpha-500">
                  First name
                </Text>

                <View
                  className="rounded-xl border border-grey-plain-300 bg-white px-4 py-4"
                  style={{ minHeight: 56 }}
                >
                  <RNTextInput
                    value={firstName}
                    onChangeText={setFirstName}
                    placeholder="Enter your first name"
                    placeholderTextColor={colors['grey-alpha']['400']}
                    autoCapitalize="words"
                    className="flex-1 text-base text-grey-alpha-500"
                    style={{ fontSize: 16 }}
                  />
                </View>

                {/* Helper Text */}
                <View className="mt-3 flex-row items-start gap-2">
                  <Info
                    size={16}
                    color={colors['grey-plain']['550']}
                    strokeWidth={2}
                  />
                  <Text className="flex-1 text-sm leading-5 text-grey-plain-550">
                    Please enter your name as it appears in your NIN card.
                  </Text>
                </View>
              </View>

              {/* Last name */}
              <View className="mb-4">
                <Text className="mb-2 text-base font-medium text-grey-alpha-500">
                  Last name
                </Text>

                <View
                  className="rounded-xl border border-grey-plain-300 bg-white px-4 py-4"
                  style={{ minHeight: 56 }}
                >
                  <RNTextInput
                    value={lastName}
                    onChangeText={setLastName}
                    placeholder="Enter your last name"
                    placeholderTextColor={colors['grey-alpha']['400']}
                    autoCapitalize="words"
                    className="flex-1 text-base text-grey-alpha-500"
                    style={{ fontSize: 16 }}
                  />
                </View>
              </View>

              {/* Other name (optional) */}
              <View className="mb-4">
                <Text className="mb-2 text-base font-medium text-grey-alpha-500">
                  Other name (optional)
                </Text>

                <View
                  className="rounded-xl border border-grey-plain-300 bg-white px-4 py-4"
                  style={{ minHeight: 56 }}
                >
                  <RNTextInput
                    value={otherName}
                    onChangeText={setOtherName}
                    placeholder="Enter your other name"
                    placeholderTextColor={colors['grey-alpha']['400']}
                    autoCapitalize="words"
                    className="flex-1 text-base text-grey-alpha-500"
                    style={{ fontSize: 16 }}
                  />
                </View>
              </View>

              {/* Date of birth */}
              <DatePickerField
                containerClassName="mb-6"
                label="Date of birth"
                value={dateOfBirth}
                onChange={setDateOfBirth}
                placeholder="DD/MM/YYYY"
                maximumDate={new Date()}
              />
            </View>
          )}

        </View>
      </KeyboardAwareScrollView>

      {/* Contact Us */}
      <View
        className="absolute left-0 right-0 px-4"
        style={{ bottom: 84 }}
      >
        <Text className="text-center text-sm text-grey-plain-550">
          Kindly{' '}
          <Text onPress={handleContactUs} className="text-primary-purple underline">
            contact us
          </Text>{' '}
          if you are experiencing any issue.
        </Text>
      </View>

      {/* Footer */}
      <View className="absolute bottom-0 left-0 right-0 border-t border-grey-plain-150 bg-white px-4 py-4">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity onPress={handleGoBack} hitSlop={8}>
            <Text className="text-base font-medium text-grey-alpha-500">
              Go back
            </Text>
          </TouchableOpacity>
          <Button
            title="Proceed"
            onPress={handleProceed}
            variant="primary"
            size="medium"
            disabled={!selectedOption || !isFormValid}
          />
        </View>
      </View>

      <OTPVerificationBottomSheet
        ref={otpSheetRef}
        title={selectedOption === 'nin' ? 'Verify your NIN' : 'Verify your BVN'}
        phoneNumber="+2348134***778"
        otpLength={selectedOption === 'nin' ? 6 : 5}
        onVerify={handleVerifyOtp}
        onClose={() => otpSheetRef.current?.close()}
      />

      <BottomSheetComponent ref={successSheetRef} snapPoints={['50%']}>
        <View className="items-center px-6 pb-8 pt-4">
          <View className="mb-6 items-center">
            <View className="relative">
              <View
                className="h-16 w-16 items-center justify-center rounded-full"
                style={{ backgroundColor: colors.state.green }}
              >
                <Check color="#FFFFFF" size={32} strokeWidth={3} />
              </View>
              <View
                className="absolute -right-2 -top-2 h-3 w-3 rounded-full"
                style={{ backgroundColor: colors.primary.purple }}
              />
              <View
                className="absolute -bottom-2 -left-2 h-2 w-2 rounded-full"
                style={{ backgroundColor: colors.yellow['50'] }}
              />
              <View
                className="absolute -right-4 top-4 h-2 w-2 rounded-full"
                style={{ backgroundColor: colors.state.green }}
              />
            </View>
          </View>

          <Text className="mb-2 text-2xl font-bold text-grey-alpha-500">
            {verifiedType === 'nin'
              ? 'NIN verified successfully'
              : 'BVN verified successfully'}
          </Text>
          <Text className="mb-8 text-center text-base text-grey-plain-550">
            Your wallet has been upgraded to Tier 1. Continue to fully upgrade
            your account.
          </Text>

          <View className="w-full flex-row gap-3">
            <View className="flex-1">
              <Button
                title="Go to wallet"
                onPress={handleGoToWallet}
                variant="outline"
                className="w-full"
              />
            </View>
            <View className="flex-1">
              <Button
                title="Upgrade to tier 2"
                onPress={handleUpgradeToNextTier}
                variant="primary"
                className="w-full"
              />
            </View>
          </View>
        </View>
      </BottomSheetComponent>
    </SafeAreaView>
  );
}

