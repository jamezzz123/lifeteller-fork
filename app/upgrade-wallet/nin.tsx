import { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput as RNTextInput } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useRouter } from 'expo-router';
import { CornerUpLeft, Info } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/Button';
import { DatePickerField } from '@/components/ui/DatePickerField';
import { colors } from '@/theme/colors';
import * as Haptics from 'expo-haptics';

export default function NINFormScreen() {
  const router = useRouter();
  const [nin, setNin] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [otherName, setOtherName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null);

  const handleGoBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  const handleProceed = () => {
    if (!isFormValid) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Navigate to OTP verification
    router.push({
      pathname: '/upgrade-wallet/verify-otp' as any,
      params: { type: 'nin', phoneNumber: '+2348134***778' },
    });
  };

  const handleContactUs = () => {
    // TODO: Navigate to contact us
    console.log('Contact us');
  };

  const isFormValid =
    nin.trim().length >= 11 &&
    firstName.trim().length > 0 &&
    lastName.trim().length > 0 &&
    !!dateOfBirth;

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
          Upgrade to tier 1
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

          {/* Contact Us */}
          <View className="mb-8">
            <Text className="text-center text-sm text-grey-plain-550">
              Kindly{' '}
              <TouchableOpacity onPress={handleContactUs}>
                <Text className="text-primary-purple underline">contact us</Text>
              </TouchableOpacity>{' '}
              if you are experiencing any issue.
            </Text>
          </View>
        </View>
      </KeyboardAwareScrollView>

      {/* Footer */}
      <View className="absolute bottom-0 left-0 right-0 flex-row items-center justify-between border-t border-grey-plain-150 bg-white px-4 py-4">
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
          disabled={!isFormValid}
        />
      </View>
    </SafeAreaView>
  );
}

