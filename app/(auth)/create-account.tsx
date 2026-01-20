import { useState, useEffect, useRef , useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, CheckCircle2 } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import LogoColor from '@/assets/images/logo/logo-color.svg';
import { Button } from '@/components/ui/Button';
import { TextButton } from '@/components/ui/TextButton';
import { IconButton } from '@/components/ui/IconButton';
import { TextInput } from '@/components/ui/TextInput';
import { PhoneInput } from '@/components/ui/PhoneInput';
import { colors } from '@/theme/colors';
import { useRegister } from '@/lib/hooks/mutations/useRegister';
import { useCheckUsername } from '@/lib/hooks/queries/useCheckUsername';
import { EmailVerificationBottomSheet } from '@/components/auth/EmailVerificationBottomSheet';
import { OTPVerificationBottomSheet } from '@/components/ui/OTPVerificationBottomSheet';
import { BottomSheetRef } from '@/components/ui/BottomSheet';
import { PasswordStrengthIndicator } from '@/components/ui/PasswordStrengthIndicator';

export default function CreateAccountScreen() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [isMobileMode, setIsMobileMode] = useState(false);

  const registerMutation = useRegister();
  const emailVerificationSheetRef = useRef<BottomSheetRef>(null);
  const phoneVerificationSheetRef = useRef<BottomSheetRef>(null);
  const isSubmittingRef = useRef(false);
  const [showEmailVerificationSheet, setShowEmailVerificationSheet] = useState(false);
  const [showPhoneVerificationSheet, setShowPhoneVerificationSheet] = useState(false);

  // Username validation with debouncing
  const [usernameValidationStatus, setUsernameValidationStatus] = useState<
    'idle' | 'checking' | 'available' | 'taken'
  >('idle');
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Only check username if it's at least 3 characters and not empty
  const trimmedUsername = username.trim();
  const shouldCheckUsername =
    trimmedUsername.length >= 3 && !username.includes(' ');
  const {
    data: usernameCheckData,
    isLoading: isCheckingUsername,
    error: usernameCheckError,
    isSuccess,
    isError,
  } = useCheckUsername(trimmedUsername, shouldCheckUsername);

  // Log query state changes
  useEffect(() => {
    console.log('Query state changed:', {
      username: trimmedUsername,
      shouldCheckUsername,
      isCheckingUsername,
      isSuccess,
      isError,
      hasData: !!usernameCheckData,
      data: usernameCheckData,
      error: usernameCheckError,
    });
  }, [
    trimmedUsername,
    shouldCheckUsername,
    isCheckingUsername,
    isSuccess,
    isError,
    usernameCheckData,
    usernameCheckError,
  ]);

  // Handle username validation
  useEffect(() => {
    // Clear previous timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Check for spaces in username
    if (username.includes(' ')) {
      setUsernameValidationStatus('idle');
      return;
    }

    if (!shouldCheckUsername) {
      setUsernameValidationStatus('idle');
      return;
    }

    // Debounce the validation check
    debounceTimerRef.current = setTimeout(() => {
      console.log('Username validation effect:', {
        isCheckingUsername,
        isSuccess,
        isError,
        usernameCheckData,
        usernameCheckError,
        username,
        trimmedUsername,
      });

      if (isCheckingUsername) {
        console.log('Setting status to checking');
        setUsernameValidationStatus('checking');
      } else if (usernameCheckError || isError) {
        console.log('Username check error:', usernameCheckError);
        setUsernameValidationStatus('idle');
      } else if (isSuccess && usernameCheckData?.data) {
        const isAvailable = usernameCheckData.data.is_available;
        console.log('Setting status based on data (success):', {
          isAvailable,
          data: usernameCheckData.data,
          fullResponse: usernameCheckData,
        });
        setUsernameValidationStatus(isAvailable ? 'available' : 'taken');
      } else if (usernameCheckData) {
        // Fallback: check if data structure is different
        console.log(
          'UsernameCheckData structure (fallback):',
          usernameCheckData
        );
        const isAvailable =
          (usernameCheckData as any).data?.is_available ?? false;
        setUsernameValidationStatus(isAvailable ? 'available' : 'taken');
      }
    }, 300);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [
    username,
    usernameCheckData,
    isCheckingUsername,
    usernameCheckError,
    shouldCheckUsername,
    isSuccess,
    isError,
    trimmedUsername,
  ]);

  // Reset validation when username changes
  useEffect(() => {
    if (username.trim().length < 3) {
      setUsernameValidationStatus('idle');
    }
  }, [username]);

  // Open email verification sheet when it mounts
  useEffect(() => {
    if (showEmailVerificationSheet && emailVerificationSheetRef.current) {
      // Small delay to ensure the component is fully mounted
      setTimeout(() => {
        emailVerificationSheetRef.current?.expand();
      }, 100);
    }
  }, [showEmailVerificationSheet]);

  // Open phone verification sheet when it mounts
  useEffect(() => {
    if (showPhoneVerificationSheet && phoneVerificationSheetRef.current) {
      // Small delay to ensure the component is fully mounted
      setTimeout(() => {
        phoneVerificationSheetRef.current?.expand();
      }, 100);
    }
  }, [showPhoneVerificationSheet]);

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

  const handleCreateAccount = useCallback(async () => {
    // Prevent double submission - check multiple conditions
    if (isSubmittingRef.current) {
      console.log('Registration already in progress (ref check), ignoring duplicate call');
      return;
    }

    if (registerMutation.isPending) {
      console.log('Registration already in progress (mutation pending), ignoring duplicate call');
      return;
    }

    if (registerMutation.isSuccess) {
      console.log('Registration already successful, ignoring duplicate call');
      return;
    }

    const hasEmail = !isMobileMode && email.trim().length > 0;
    const hasPhone = isMobileMode && phoneNumber.trim().length > 0;

    if (!username.trim() || (!hasEmail && !hasPhone) || !password.trim()) {
      return;
    }

    if (password.length < 8) {
      return;
    }

    // Check if password contains at least one special character (matching backend requirement)
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    if (!hasSpecialChar) {
      Alert.alert(
        'Invalid Password',
        'Password must contain at least one special character (!@#$%^&*(),.?":{}|<>)'
      );
      return;
    }

    // Check if username is available
    if (usernameValidationStatus === 'taken') {
      Alert.alert('Username Taken', 'Please choose a different username.');
      return;
    }

    if (usernameValidationStatus === 'checking' || isCheckingUsername) {
      Alert.alert('Please wait', 'Checking username availability...');
      return;
    }

    // Set submitting flag BEFORE any async operations
    isSubmittingRef.current = true;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      console.log('Calling registration API...', {
        username: username.trim(),
        hasEmail,
        hasPhone,
        timestamp: new Date().toISOString(),
      });
      const response = await registerMutation.mutateAsync({
        username: username.trim(),
        email: hasEmail && email.trim() ? email.trim() : "",
        phone_number: hasPhone && phoneNumber.trim() ? phoneNumber.trim() : "",
        password: password.trim(),
      });
      console.log('Registration successful:', response);

      // Check what needs verification
      const needsEmailVerification = !response.data.is_email_verified;
      const needsPhoneVerification = !response.data.is_phone_verified;

      if (needsEmailVerification) {
        setShowEmailVerificationSheet(true);
      } else if (needsPhoneVerification) {
        setShowPhoneVerificationSheet(true);
      } else {
        // Both verified, go to onboarding
        router.replace('/(onboarding)/onboarding-index');
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      console.log('Registration error details:', {
        status: error?.response?.status,
        statusText: error?.response?.statusText,
        data: error?.response?.data,
        message: error?.message,
      });

      // Extract error message from various possible response formats
      let errorMessage = 'Failed to create account. Please try again.';
      const status = error?.response?.status;

      if (error?.response?.data) {
        const responseData = error.response.data;

        // Check for 'detail' field (common in FastAPI/DRF-style APIs)
        if (responseData.detail) {
          // Handle detail as array (FastAPI validation errors)
          if (Array.isArray(responseData.detail)) {
            // Extract messages from validation error array
            const messages = responseData.detail.map((err: any) => {
              if (err.msg) return err.msg;
              if (err.message) return err.message;
              return JSON.stringify(err);
            });
            errorMessage = messages.join('\n');
          } else if (typeof responseData.detail === 'string') {
            errorMessage = responseData.detail;
          } else {
            errorMessage = JSON.stringify(responseData.detail);
          }
        } else if (responseData.error) {
          errorMessage = responseData.error;
        } else if (responseData.message) {
          errorMessage = responseData.message;
        } else if (typeof responseData === 'string') {
          // Handle server errors (500) with tracebacks - extract useful info
          if (status === 500) {
            console.log('Server error:', responseData);
            // Check for specific database errors in the traceback
            if (responseData.includes('duplicate key value violates unique constraint')) {
              if (responseData.includes('email')) {
                errorMessage = 'This email is already registered. Please use a different email or try logging in.';
              } else if (responseData.includes('username')) {
                errorMessage = 'This username is already taken. Please choose a different username.';
              } else if (responseData.includes('phone')) {
                errorMessage = 'This phone number is already registered. Please use a different number.';
              } else {
                errorMessage = 'This account already exists. Please try logging in instead.';
              }
            } else {
              errorMessage = 'Server error occurred. Please try again later.';
            }
          } else {
            // For non-500 string responses, show a generic message
            errorMessage = 'Failed to create account. Please try again.';
          }
        }
      } else if (error?.message) {
        errorMessage = error.message;
      }

      Alert.alert('Error', errorMessage);
    } finally {
      // Reset submitting flag after a small delay to prevent rapid re-submissions
      setTimeout(() => {
        isSubmittingRef.current = false;
      }, 1000);
    }
  }, [
    isMobileMode,
    email,
    phoneNumber,
    username,
    password,
    usernameValidationStatus,
    isCheckingUsername,
    registerMutation,
  ]);

  function handleEmailVerificationClose() {
    setShowEmailVerificationSheet(false);
    emailVerificationSheetRef.current?.close();
    // Navigate to login or onboarding
    router.replace('/(auth)/login');
  }

  async function handlePhoneVerification(otp: string) {
    try {
      // TODO: Verify OTP with backend API
      // Example: await verifyPhoneOTP({ phone_number: phoneNumber, otp });

      // For now, assume verification is successful
      // After successful verification, the user is already logged in from registration
      setShowPhoneVerificationSheet(false);
      phoneVerificationSheetRef.current?.close();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace('/(onboarding)/onboarding-index');
    } catch {
      Alert.alert('Error', 'Invalid OTP. Please try again.');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  }

  async function handleResendOTP() {
    try {
      // TODO: Resend OTP to phone number via API
      // Example: await resendPhoneOTP({ phone_number: phoneNumber });
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      Alert.alert('Error', 'Failed to resend OTP. Please try again.');
    }
  }

  // Format phone number for display (mask middle digits)
  function formatPhoneForDisplay(phone: string): string {
    if (phone.length <= 7) return phone;
    const start = phone.slice(0, 4);
    const end = phone.slice(-3);
    return `${start}***${end}`;
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
              error={
                username.includes(' ')
                  ? 'Username cannot have space'
                  : usernameValidationStatus === 'taken'
                    ? 'Username already taken'
                    : undefined
              }
              showLoading={
                (usernameValidationStatus === 'checking' ||
                  isCheckingUsername) &&
                username.trim().length >= 3 &&
                !username.includes(' ')
              }
              rightIcon={
                usernameValidationStatus === 'available' &&
                !username.includes(' ') ? (
                  <CheckCircle2
                    color={colors.state.green}
                    size={20}
                    strokeWidth={2.5}
                  />
                ) : undefined
              }
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
            <View className="mb-6">
              <TextInput
                label="Create password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                showPasswordToggle
                helperText="Password must be at least 8 characters and include a special character"
              />
              <PasswordStrengthIndicator password={password} />
            </View>

            {/* Create Account Button */}
            <View className="mt-16 pb-8">
              <Button
                title="Create account"
                onPress={handleCreateAccount}
                variant="primary"
                loading={registerMutation.isPending}
                disabled={
                  !isFormValid ||
                  registerMutation.isPending ||
                  usernameValidationStatus === 'taken' ||
                  usernameValidationStatus === 'checking' ||
                  isCheckingUsername
                }
                className="w-full"
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Email Verification Bottom Sheet */}
      {showEmailVerificationSheet && (
        <EmailVerificationBottomSheet
          ref={emailVerificationSheetRef}
          email={email}
          onLoginNow={handleEmailVerificationClose}
          onOpenEmailApp={() => {
            // Email app opened, user can verify
          }}
          onClose={handleEmailVerificationClose}
        />
      )}

      {/* Phone Verification Bottom Sheet */}
      {showPhoneVerificationSheet && (
        <OTPVerificationBottomSheet
          ref={phoneVerificationSheetRef}
          phoneNumber={formatPhoneForDisplay(phoneNumber)}
          onVerify={handlePhoneVerification}
          onResendOTP={handleResendOTP}
          onClose={() => {
            setShowPhoneVerificationSheet(false);
            phoneVerificationSheetRef.current?.close();
          }}
        />
      )}
    </SafeAreaView>
  );
}
