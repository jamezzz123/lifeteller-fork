import React, { useState, forwardRef } from 'react';
import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { X } from 'lucide-react-native';
import {
  BottomSheetComponent,
  BottomSheetRef,
} from '@/components/ui/BottomSheet';
import { TextInput } from '@/components/ui/TextInput';
import { TextButton } from '@/components/ui/TextButton';
import { Button } from '@/components/ui/Button';
import { colors } from '@/theme/colors';

interface VerifyWalletPasswordBottomSheetProps {
  onVerify: (password: string) => void;
  onCancel: () => void;
}

export const VerifyWalletPasswordBottomSheet = forwardRef<
  BottomSheetRef,
  VerifyWalletPasswordBottomSheetProps
>(({ onVerify, onCancel }, ref) => {
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
      onVerify(password);
      setPassword('');
    } catch (error) {
      setError('Incorrect password. Please try again.');
      console.error('Error verifying password:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    // TODO: Navigate to forgot password screen
    onCancel();
    // router.push('/(auth)/forgot-password');
  };

  return (
    <BottomSheetComponent ref={ref} snapPoints={['50%']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <View className="px-6 pb-6">
          {/* Header */}
          <View className="mb-6 flex-row items-center justify-between">
            <TouchableOpacity onPress={onCancel} className="p-1">
              <X
                color={colors['grey-plain']['550']}
                size={24}
                strokeWidth={2}
              />
            </TouchableOpacity>
            <Text className="text-lg font-inter-semibold text-grey-alpha-500">
              Verify your password
            </Text>
            <View style={{ width: 32 }} />
          </View>

          {/* Heading */}
          <Text className="mb-6 text-base font-inter-bold text-grey-alpha-500">
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
            />
            <TextButton
              title="Forgot password?"
              onPress={handleForgotPassword}
              className="self-start"
            />
          </View>

          {/* Action Buttons */}
          <View className="mt-4 flex-row gap-3">
            <TouchableOpacity
              onPress={onCancel}
              className="flex-1 items-center justify-center py-3"
              activeOpacity={0.7}
            >
              <Text className="text-base font-inter-semibold text-grey-alpha-500">
                Cancel
              </Text>
            </TouchableOpacity>
            <Button
              title="Deactivate wallet"
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
    </BottomSheetComponent>
  );
});

VerifyWalletPasswordBottomSheet.displayName = 'VerifyWalletPasswordBottomSheet';
