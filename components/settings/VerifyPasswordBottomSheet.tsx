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

interface VerifyPasswordBottomSheetProps {
  deviceName?: string;
  onVerify: (password: string) => void;
  onCancel: () => void;
}

export const VerifyPasswordBottomSheet = forwardRef<
  BottomSheetRef,
  VerifyPasswordBottomSheetProps
>(({ deviceName, onVerify, onCancel }, ref) => {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRemoveDevice = async () => {
    if (!password.trim()) {
      // TODO: Show error message
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Verify password with backend
      await new Promise((resolve) => setTimeout(resolve, 500));
      onVerify(password);
      setPassword('');
    } catch (error) {
      // TODO: Handle error
      console.error('Error verifying password:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    // TODO: Navigate to forgot password screen
    console.log('Forgot password');
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
            <Text className="text-lg font-semibold text-grey-alpha-500">
              Verify your password
            </Text>
            <View style={{ width: 32 }} />
          </View>

          {/* Heading */}
          <Text className="mb-6 text-base font-bold text-grey-alpha-500">
            Enter your Lifteller password
          </Text>

          {/* Password Input */}
          <View className="mb-4">
            <TextInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              showPasswordToggle
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
              <Text className="text-base font-semibold text-grey-alpha-500">
                Cancel
              </Text>
            </TouchableOpacity>
            <Button
              title="Remove device"
              onPress={handleRemoveDevice}
              loading={isLoading}
              disabled={!password.trim() || isLoading}
              variant="primary"
              size="large"
              className="flex-1"
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </BottomSheetComponent>
  );
});

VerifyPasswordBottomSheet.displayName = 'VerifyPasswordBottomSheet';

