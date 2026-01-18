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
import { PasscodeInput } from '@/components/ui/PasscodeInput';
import { TextButton } from '@/components/ui/TextButton';
import { Button } from '@/components/ui/Button';
import { colors } from '@/theme/colors';

export default function WalletPasscodeScreen() {
  const [currentPasscode, setCurrentPasscode] = useState('');
  const [newPasscode, setNewPasscode] = useState('');
  const [confirmPasscode, setConfirmPasscode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdatePasscode = async () => {
    if (!currentPasscode || !newPasscode || !confirmPasscode) {
      // TODO: Show error message
      return;
    }

    if (currentPasscode.length !== 6) {
      // TODO: Show error message
      return;
    }

    if (newPasscode.length !== 6) {
      // TODO: Show error message
      return;
    }

    if (newPasscode !== confirmPasscode) {
      // TODO: Show error message
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Implement passcode update API call
      console.log('Updating wallet passcode...');
      await new Promise((resolve) => setTimeout(resolve, 1000));
      router.back();
    } catch (error) {
      // TODO: Handle error
      console.error('Error updating wallet passcode:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPasscode = () => {
    // TODO: Navigate to forgot passcode screen or show recovery options
    console.log('Forgot passcode');
  };

  const isFormValid =
    currentPasscode.length === 6 &&
    newPasscode.length === 6 &&
    confirmPasscode.length === 6 &&
    newPasscode === confirmPasscode;

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
          <Text className="text-lg font-inter-semibold text-grey-alpha-500">
            Wallet passcode
          </Text>
        </View>

        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 24 }}
        >
          <View className="px-4 pt-6">
            {/* Enter Current Passcode */}
            <View className="mb-6">
              <Text className="mb-4 text-sm font-inter-medium text-grey-alpha-400">
                Enter current passcode
              </Text>
              <PasscodeInput
                value={currentPasscode}
                onChangeText={setCurrentPasscode}
                length={6}
                autoFocus={true}
              />
              <View className="mt-3">
                <TextButton
                  title="Forgot passcode?"
                  onPress={handleForgotPasscode}
                  className="self-start"
                />
              </View>
            </View>

            {/* Create New Passcode */}
            <View className="mb-6">
              <Text className="mb-4 text-sm font-inter-medium text-grey-alpha-400">
                Create new passcode
              </Text>
              <PasscodeInput
                value={newPasscode}
                onChangeText={setNewPasscode}
                length={6}
              />
            </View>

            {/* Confirm New Passcode */}
            <View className="mb-8">
              <Text className="mb-4 text-sm font-inter-medium text-grey-alpha-400">
                Type passcode again
              </Text>
              <PasscodeInput
                value={confirmPasscode}
                onChangeText={setConfirmPasscode}
                length={6}
              />
            </View>
          </View>
        </ScrollView>

        {/* Update Passcode Button */}
        <View className="border-t border-grey-plain-150 bg-white px-4 pb-4 pt-4">
          <Button
            title="Update passcode"
            onPress={handleUpdatePasscode}
            loading={isLoading}
            disabled={!isFormValid || isLoading}
            variant="primary"
            size="large"
            className="w-full"
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

