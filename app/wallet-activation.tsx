import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Linking } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { CornerUpLeft, Info } from 'lucide-react-native';
import { TextInput } from '@/components/ui/TextInput';
import { PhoneInput } from '@/components/ui/PhoneInput';
import { Checkbox } from '@/components/ui/Checkbox';
import { Button } from '@/components/ui/Button';
import { colors } from '@/theme/colors';

export default function WalletActivationScreen() {
  const [firstName, setFirstName] = useState('Isaac');
  const [lastName, setLastName] = useState('Akinyemi');
  const [email, setEmail] = useState('isaac.a@lifteller.com');
  const [phoneNumber, setPhoneNumber] = useState('812 345 6789');
  const [isConfirmed, setIsConfirmed] = useState(false);

  const handleBack = () => {
    router.back();
  };

  const handleActivate = () => {
    if (!isConfirmed) return;

    // Navigate to OTP verification
    router.push({
      pathname: '/wallet-verify',
      params: { phoneNumber: `+234${phoneNumber.replace(/\s/g, '')}` },
    } as any);
  };

  const handleWalletTermsPress = () => {
    // TODO: Navigate to wallet terms
    Linking.openURL('https://lifteller.com/wallet-terms');
  };

  const handlePrivacyPolicyPress = () => {
    // TODO: Navigate to privacy policy
    router.push('/privacy-policy' as any);
  };

  const isFormValid = firstName.trim() && lastName.trim() && email.trim() && phoneNumber.trim() && isConfirmed;

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'bottom']}>
      {/* Header */}
      <View className="flex-row items-center border-b border-grey-plain-150 bg-white px-4 py-3">
        <TouchableOpacity onPress={handleBack} className="mr-3">
          <CornerUpLeft
            color={colors['grey-plain']['550']}
            size={24}
            strokeWidth={2}
          />
        </TouchableOpacity>
        <Text className="text-lg font-semibold text-grey-alpha-500">
          Wallet activation
        </Text>
      </View>

      <KeyboardAwareScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingTop: 24,
          paddingBottom: 32,
        }}
        showsVerticalScrollIndicator={false}
        enableOnAndroid
        keyboardShouldPersistTaps="handled"
        extraScrollHeight={24}
      >
        {/* Title */}
        <Text className="mb-4 text-2xl font-bold text-grey-alpha-500">
          Confirm identity and activate wallet
        </Text>

        {/* Instructional Text */}
        <Text className="mb-6 text-sm leading-5 text-grey-plain-550">
          To comply with necessary financial regulations and protect your funds,
          we require confirmation that the personal details linked to your wallet
          are accurate and up-to-date. These details are required for identity
          verification and transaction security.
        </Text>

        {/* Information Alert */}
        <View
          className="mb-6 flex-row items-start gap-3 rounded-xl p-4"
          style={{ backgroundColor: colors['yellow-tint']['50'] }}
        >
          <Info size={20} color={colors.yellow['50']} strokeWidth={2} />
          <Text className="flex-1 text-sm leading-5 text-grey-alpha-500">
            Kindly edit and confirm your details below
          </Text>
        </View>

        {/* Form Fields */}
        <View className="mb-6 gap-4">
          <TextInput
            label="First name"
            value={firstName}
            onChangeText={setFirstName}
            placeholder="Enter your first name"
          />

          <TextInput
            label="Last name"
            value={lastName}
            onChangeText={setLastName}
            placeholder="Enter your last name"
          />

          <TextInput
            label="Email address"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="Enter your email address"
          />

          <PhoneInput
            label="Mobile number"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            placeholder="812 345 6789"
          />
        </View>

        {/* Confirmation Checkbox */}
        <View className="mb-4">
          <Checkbox
            checked={isConfirmed}
            onPress={() => setIsConfirmed(!isConfirmed)}
            label="I confirm that the Full Name, Email Address, and Phone Number displayed above are correct and represent my true legal identity."
            className="items-start"
          />
        </View>

        {/* Terms and Privacy Policy */}
        <View className="mb-8">
          <Text className="text-sm leading-5 text-grey-plain-550">
            By activating your wallet, you agree to our{' '}
            <Text
              onPress={handleWalletTermsPress}
              className="underline"
              style={{ color: colors.primary.purple }}
            >
              Wallet terms
            </Text>{' '}
            and{' '}
            <Text
              onPress={handlePrivacyPolicyPress}
              className="underline"
              style={{ color: colors.primary.purple }}
            >
              Privacy Policy
            </Text>
            .
          </Text>
        </View>

        {/* Activate Wallet Button */}
        <Button
          title="Activate wallet"
          onPress={handleActivate}
          variant="primary"
          disabled={!isFormValid}
          className="mb-8 self-center"
        />
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

