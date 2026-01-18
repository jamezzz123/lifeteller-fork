import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { CornerUpLeft } from 'lucide-react-native';
import { TextInput } from '@/components/ui/TextInput';
import { TextButton } from '@/components/ui/TextButton';
import { Button } from '@/components/ui/Button';
import { colors } from '@/theme/colors';
import * as Haptics from 'expo-haptics';

export default function VerifyWalletPasswordScreen() {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const handleVerify = async () => {
    if (!password.trim()) {
      setError('Password is required');
      return;
    }

    setIsLoading(true);
    setError(undefined);
    try {
      // TODO: Verify password with backend
      await new Promise((resolve) => setTimeout(resolve, 500));
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      // Navigate to loading screen
      router.push('/wallet-deactivation-loading' as any);
    } catch (error) {
      setError('Incorrect password. Please try again.');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      console.error('Error verifying password:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // TODO: Navigate to forgot password screen
    router.push('/(auth)/forgot-password');
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        {/* Header */}
        <View className="flex-row items-center border-b border-grey-plain-150 bg-white px-4 py-3">
          <TouchableOpacity onPress={() => router.back()} className="mr-3">
            <CornerUpLeft
              color={colors['grey-plain']['550']}
              size={24}
              strokeWidth={2}
            />
          </TouchableOpacity>
          <Text className="text-lg font-semibold text-grey-alpha-500">
            Verify your password
          </Text>
        </View>

        <View className="flex-1 px-6 pt-6">
          {/* Heading */}
          <Text className="mb-6 text-base font-bold text-grey-alpha-500">
            Enter your Lifteller password
          </Text>

          {/* Password Input */}
          <View className="mb-4">
            <TextInput
              label="Password"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setError(undefined);
              }}
              secureTextEntry
              showPasswordToggle
              error={error}
              containerClassName="mb-2"
              autoFocus
            />
            <TextButton
              title="Forgot password?"
              onPress={handleForgotPassword}
              className="self-start"
            />
          </View>
        </View>

        {/* Action Buttons */}
        <View className="border-t border-grey-plain-150 bg-white px-6 pb-4 pt-4">
          <View className="flex-row gap-3">
            <TouchableOpacity
              onPress={() => router.back()}
              className="flex-1 items-center justify-center py-3"
              activeOpacity={0.7}
            >
              <Text className="text-base font-semibold text-grey-alpha-500">
                Cancel
              </Text>
            </TouchableOpacity>
            <Button
              title="Deactivate"
              onPress={handleVerify}
              loading={isLoading}
              disabled={!password.trim() || isLoading}
              variant="destructive"
              size="large"
              className="flex-1"
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
