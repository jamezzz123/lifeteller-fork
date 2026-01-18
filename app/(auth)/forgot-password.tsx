import { useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import LogoColor from '@/assets/images/logo/logo-color.svg';
import { Button } from '@/components/ui/Button';
import { TextButton } from '@/components/ui/TextButton';
import { IconButton } from '@/components/ui/IconButton';
import { TextInput } from '@/components/ui/TextInput';
import { PhoneInput } from '@/components/ui/PhoneInput';
import {
  ContactUsSheet,
  ContactUsSheetRef,
} from '@/components/auth/ContactUsSheet';
import { SuccessBottomSheet } from '@/components/ui/SuccessBottomSheet';
import { colors } from '@/theme/colors';

export default function ForgotPasswordScreen() {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isMobileMode, setIsMobileMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessSheet, setShowSuccessSheet] = useState(false);
  const contactSheetRef = useRef<ContactUsSheetRef>(null);

  function handleBack() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.replace('/(auth)/login');
  }

  function handleLogin() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.replace('/(auth)/login');
  }

  function handleToggleInputMode() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsMobileMode(!isMobileMode);

    if (isMobileMode) {
      setPhoneNumber('');
    } else {
      setUsernameOrEmail('');
    }
  }

  function handleContactUs() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    contactSheetRef.current?.open();
  }

  async function handleSendResetLink() {
    const hasEmail = !isMobileMode && usernameOrEmail.trim().length > 0;
    const hasPhone = isMobileMode && phoneNumber.trim().length > 0;

    if (!hasEmail && !hasPhone) {
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsLoading(true);

    // TODO: Implement send reset link API call
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log('Sending reset link:', {
        usernameOrEmail: isMobileMode ? undefined : usernameOrEmail,
        phoneNumber: isMobileMode ? phoneNumber : undefined,
      });

      // Show success bottom sheet
      setShowSuccessSheet(true);
    } catch (error) {
      console.error('Send reset link error:', error);
    } finally {
      setIsLoading(false);
    }
  }

  function handleLogInNow() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setShowSuccessSheet(false);
    router.replace('/(auth)/login');
  }

  function handleOpenEmailApp() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setShowSuccessSheet(false);
    // Open default email app
    Linking.openURL('message:');
  }

  const hasEmail = !isMobileMode && usernameOrEmail.trim().length > 0;
  const hasPhone = isMobileMode && phoneNumber.trim().length > 0;
  const isFormValid = hasEmail || hasPhone;

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          className="flex-1"
          contentContainerClassName="flex-grow"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View className="flex-row items-center justify-between px-6 pb-6 pt-4">
            <View className="flex-row items-center gap-4">
              <LogoColor width={104} height={30} />
            </View>
            <Button
              title="Log in"
              onPress={handleLogin}
              variant="outline"
              size="small"
            />
          </View>

          {/* Back Button */}
          <View className="px-6 pb-4">
            <IconButton
              icon={
                <ArrowLeft
                  size={20}
                  color={colors['grey-alpha']['500']}
                  strokeWidth={2.5}
                />
              }
              onPress={handleBack}
              size={48}
              accessibilityLabel="Go back"
            />
          </View>

          {/* Form Content */}
          <View className="flex-1 px-6">
            <Text className="mb-2 text-2xl font-inter-bold text-grey-alpha-550">
              Forgot Password
            </Text>
            <Text className="mb-8 text-base text-grey-alpha-400">
              Fill out the form to reset your password
            </Text>

            {/* Username/Email or Mobile Number Input */}
            {isMobileMode ? (
              <PhoneInput
                label="Mobile number"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                placeholder="812 345 6789"
                containerClassName="mb-4"
              />
            ) : (
              <TextInput
                label="Username or Email address"
                value={usernameOrEmail}
                onChangeText={setUsernameOrEmail}
                autoCapitalize="none"
                autoCorrect={false}
                containerClassName="mb-4"
              />
            )}

            {/* Toggle Link */}
            <View className="mb-6">
              <TextButton
                title={isMobileMode ? 'Use email address' : 'Use mobile number'}
                onPress={handleToggleInputMode}
                underline
                className="self-start"
              />
            </View>

            {/* Send Reset Link Button */}
            <View className="mb-6">
              <Button
                title="Send reset link"
                onPress={handleSendResetLink}
                variant="primary"
                loading={isLoading}
                disabled={!isFormValid || isLoading}
                className="w-full"
              />
            </View>

            {/* Contact Us Link */}
            <View className="pb-8">
              <TextButton
                title="I can't remember my username or email address"
                onPress={handleContactUs}
                className="self-center"
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <ContactUsSheet ref={contactSheetRef} />

      {/* Password Reset Success Bottom Sheet */}
      <SuccessBottomSheet
        visible={showSuccessSheet}
        title="Password reset link sent"
        description={
          isMobileMode
            ? 'We have sent a link to reset your password to your phone number.'
            : 'We have sent a link to reset your password to your email.'
        }
        primaryActionText="Open email app"
        secondaryActionText="Log in now"
        onPrimaryAction={handleOpenEmailApp}
        onSecondaryAction={handleLogInNow}
      />
    </SafeAreaView>
  );
}
