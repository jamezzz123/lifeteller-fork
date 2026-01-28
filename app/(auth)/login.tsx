import { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import LogoColor from '@/assets/images/logo/logo-color.svg';
import GoogleIcon from '@/assets/icons/google.svg';
import { Button } from '@/components/ui/Button';
import { TextButton } from '@/components/ui/TextButton';
import { IconButton } from '@/components/ui/IconButton';
import { TextInput } from '@/components/ui/TextInput';
import { Checkbox } from '@/components/ui/Checkbox';
import {
  SocialOptionsSheet,
  SocialOptionsSheetRef,
} from '@/components/auth/SocialOptionsSheet';
import { colors } from '@/theme/colors';
import { useLogin } from '@/lib/hooks/mutations/useLogin';
import { useAuth } from '@/context/auth';
import type { AxiosError } from 'axios';
import type { ApiError } from '@/lib/api/endpoints';
import * as SecureStore from 'expo-secure-store';

export default function LoginScreen() {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const [showSocialSheet, setShowSocialSheet] = useState(false);
  const socialSheetRef = useRef<SocialOptionsSheetRef>(null);
  const loginMutation = useLogin();
  const { login: setAuthState } = useAuth();

  function handleBack() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.replace('/(auth)/get-started');
  }

  function handleSignUp() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.replace('/(auth)/create-account');
  }

  function handleGoogleLogin() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // TODO: Implement Google OAuth
    router.replace('/(tabs)');
  }

  // Open the sheet when it mounts
  useEffect(() => {
    if (showSocialSheet && socialSheetRef.current) {
      // Small delay to ensure the component is fully mounted
      setTimeout(() => {
        socialSheetRef.current?.open();
      }, 100);
    }
  }, [showSocialSheet]);

  function handleOtherSocials() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setShowSocialSheet(true);
  }

  function handleSocialSheetClose() {
    setShowSocialSheet(false);
  }

  function handleSocialSelect(socialId: string) {
    // TODO: Implement social sign-in based on selected option
    console.log('Selected social:', socialId);
    // Close and unmount the sheet
    setShowSocialSheet(false);
  }

  function handleForgotPassword() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/(auth)/forgot-password');
  }

  async function handleLogin() {
    const trimmedLogin = usernameOrEmail.trim();

    if (!trimmedLogin || !password.trim()) {
      return;
    }

    if (/\s/.test(trimmedLogin)) {
      Alert.alert(
        'Invalid login',
        'Spaces are not allowed in username, email, or mobile number.'
      );
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      const response = await loginMutation.mutateAsync({
        login: trimmedLogin,
        password: password.trim(),
      });

      // Store "keep me logged in" preference
      await SecureStore.setItemAsync(
        'keep_logged_in',
        keepLoggedIn ? 'true' : 'false'
      );

      // Update auth context state with onboarding status
      await setAuthState({
        access: response.data.access,
        refresh: response.data.refresh,
        userId: response.data.user_id,
        onboardingComplete: response.onboarding_complete,
      });

      // Navigate based on onboarding status after auth state is updated
      if (response.onboarding_complete) {
        router.replace('/(tabs)');
      } else {
        router.replace('/(onboarding)/onboarding-index');
      }
    } catch (error) {
      console.error('Login error:', error);

      // Handle API errors
      const axiosError = error as AxiosError<
        ApiError | { detail?: string; message?: string }
      >;

      // Extract error message from various possible response formats
      let errorMessage = 'Login failed. Please try again.';

      if (axiosError.response?.data) {
        const errorData = axiosError.response.data as ApiError & {
          detail?: string;
          message?: string;
        };
        // Check for 'detail' field
        if (errorData.detail) {
          errorMessage = errorData.detail;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        } else if (errorData.message) {
          errorMessage = errorData.message;
        }
      } else if (axiosError.message) {
        errorMessage = axiosError.message;
      }

      Alert.alert('Login Failed', errorMessage);
    }
  }

  const isFormValid =
    usernameOrEmail.trim().length > 0 && password.trim().length > 0;
  const isLoading = loginMutation.isPending;

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'bottom']}>
      <KeyboardAvoidingView behavior="padding" className="flex-1">
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
              title="Sign up"
              onPress={handleSignUp}
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
              Login
            </Text>
            <Text className="mb-8 text-base text-grey-alpha-400">
              Let us continue the liftings
            </Text>

            {/* Social Login Buttons */}
            <View className="mb-6 w-full flex-row items-center justify-between gap-4">
              <Button
                title="Continue with Google"
                onPress={handleGoogleLogin}
                iconLeft={<GoogleIcon width={18} height={18} />}
                variant="secondary"
                className="flex-1 border-grey-plain-50"
                size="medium"
              />

              <Button
                title="Other socials"
                onPress={handleOtherSocials}
                variant="outline"
                size="medium"
              />
            </View>

            {/* OR Divider */}
            <View className="mb-6 flex-row items-center">
              <View className="h-px flex-1 bg-grey-plain-300" />
              <Text className="mx-4 text-sm text-grey-alpha-400">OR</Text>
              <View className="h-px flex-1 bg-grey-plain-300" />
            </View>

            {/* Username/Email/Mobile Input */}
            <TextInput
              label="Username or Email or Mobile number"
              value={usernameOrEmail}
              onChangeText={setUsernameOrEmail}
              autoCapitalize="none"
              autoCorrect={false}
              containerClassName="mb-4"
            />

            {/* Password Input */}
            <TextInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              showPasswordToggle
              containerClassName="mb-4"
            />

            {/* Keep me logged in and Forgot password */}
            <View className="mb-6 flex-row items-center justify-between">
              <Checkbox
                label="Keep me logged in"
                checked={keepLoggedIn}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setKeepLoggedIn(!keepLoggedIn);
                }}
              />
              <TextButton
                title="Forgot password?"
                onPress={handleForgotPassword}
                className="self-end"
              />
            </View>

            {/* Login Button */}
            <View className="mt-4 pb-8">
              <Button
                title="Log in"
                onPress={handleLogin}
                variant="primary"
                loading={isLoading}
                disabled={!isFormValid || isLoading}
                className="w-full"
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {showSocialSheet && (
        <SocialOptionsSheet
          ref={socialSheetRef}
          onSelect={handleSocialSelect}
          onClose={handleSocialSheetClose}
        />
      )}
    </SafeAreaView>
  );
}
