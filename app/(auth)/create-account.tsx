import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
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
import { colors } from '@/theme/colors';

export default function CreateAccountScreen() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [isMobileMode, setIsMobileMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  function handleBack() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.replace('/(auth)/get-started');
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
      setEmail('');
    }
  }

  async function handleCreateAccount() {
    const hasEmail = !isMobileMode && email.trim().length > 0;
    const hasPhone = isMobileMode && phoneNumber.trim().length > 0;

    if (!username.trim() || (!hasEmail && !hasPhone) || !password.trim()) {
      return;
    }

    if (password.length < 8) {
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsLoading(true);

    // TODO: Implement account creation API call
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log('Creating account:', {
        username,
        email: isMobileMode ? undefined : email,
        phoneNumber: isMobileMode ? phoneNumber : undefined,
      });
      
      // Navigate to onboarding after successful account creation
      router.replace('/(onboarding)/onboarding-index');
    } catch (error) {
      console.error('Account creation error:', error);
      setIsLoading(false);
    }
  }

  const hasEmail = !isMobileMode && email.trim().length > 0;
  const hasPhone = isMobileMode && phoneNumber.trim().length > 0;
  const isFormValid =
    username.trim().length > 0 &&
    (hasEmail || hasPhone) &&
    password.length >= 8;

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
            <Text className="text-2xl font-bold text-grey-alpha-550">
              Join Lifteller today
            </Text>
            <Text className="mb-8 text-base text-grey-alpha-400">
              Where connection meets compassion.
            </Text>

            {/* Username Input */}
            <TextInput
              label="Username"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              containerClassName="mb-6"
              autoCorrect={false}
            />

            {/* Email or Mobile Number Input */}
            {isMobileMode ? (
              <PhoneInput
                label="Mobile number"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                placeholder="812 345 6789"
              />
            ) : (
              <TextInput
                label="Email address"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="email"
              />
            )}

            {/* Toggle Link */}
            <View className="mb-4">
              <TextButton
                title={isMobileMode ? 'Use email address' : 'Use mobile number'}
                onPress={handleToggleInputMode}
                underline
                className="self-start"
              />
            </View>

            {/* Password Input */}
            <TextInput
              label="Create password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              showPasswordToggle
              helperText="Password must at least be 8 characters"
            />

            {/* Create Account Button */}
            <View className="mt-16 pb-8">
              <Button
                title="Create account"
                onPress={handleCreateAccount}
                variant="primary"
                loading={isLoading}
                disabled={!isFormValid || isLoading}
                className="w-full"
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
