import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { CornerUpLeft } from 'lucide-react-native';
import { TextInput } from '@/components/ui/TextInput';
import { TextButton } from '@/components/ui/TextButton';
import { Button } from '@/components/ui/Button';
import { colors } from '@/theme/colors';

export default function PasswordScreen() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdatePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      // TODO: Show error message
      return;
    }

    if (newPassword !== confirmPassword) {
      // TODO: Show error message
      return;
    }

    if (newPassword.length < 8) {
      // TODO: Show error message
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Implement password update API call
      console.log('Updating password...');
      await new Promise((resolve) => setTimeout(resolve, 1000));
      router.back();
    } catch (error) {
      // TODO: Handle error
      console.error('Error updating password:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
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
            Password
          </Text>
        </View>

        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 24 }}
        >
          <View className="px-4 pt-6">
            {/* Current Password */}
            <View className="mb-6">
              <TextInput
                label="Current password"
                value={currentPassword}
                onChangeText={setCurrentPassword}
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

            {/* Create New Password */}
            <View className="mb-6">
              <TextInput
                label="Create new password"
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
                showPasswordToggle
                helperText="Password must at least be 8 characters"
              />
            </View>

            {/* Confirm New Password */}
            <View className="mb-8">
              <TextInput
                label="Type password again"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                showPasswordToggle
              />
            </View>
          </View>
        </ScrollView>

        {/* Update Password Button */}
        <View className="border-t border-grey-plain-150 bg-white px-4 pb-4 pt-4">
          <Button
            title="Update password"
            onPress={handleUpdatePassword}
            loading={isLoading}
            disabled={isLoading}
            variant="primary"
            size="large"
            className="w-full"
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

