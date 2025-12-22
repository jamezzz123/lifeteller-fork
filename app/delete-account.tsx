import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { X, Trash2 } from 'lucide-react-native';
import { colors } from '@/theme/colors';
import { Button } from '@/components/ui/Button';
import { ConfirmationBottomSheet } from '@/components/ui/ConfirmationBottomSheet';

const bulletPoints = [
  'Your account will be immediately hidden from the public.',
  'If you log back in within 30 days, your deletion request will be canceled, and your account will be fully restored.',
  'If you do not log back in within 30 days, your account and all associated data will be permanently wiped from our systems.',
];

export default function DeleteAccountScreen() {
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleDelete = () => {
    // TODO: Implement actual deletion logic
    // This should navigate to a password verification screen first
    console.log('Account deletion initiated');
    setShowConfirmation(false);
    // Navigate to password verification or login screen
    router.replace('/(auth)/get-started');
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'bottom']}>
      {/* Header */}
      <View className="flex-row items-center border-b border-grey-plain-150 bg-white px-4 py-3">
        <TouchableOpacity onPress={() => router.back()} className="mr-3">
          <X color={colors['grey-plain']['550']} size={24} strokeWidth={2} />
        </TouchableOpacity>
        <Text className="text-lg font-semibold text-grey-alpha-500">
          Delete account
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="px-4 pt-6">
          {/* Title */}
          <Text className="mb-4 text-xl font-bold text-grey-alpha-500">
            Delete your Lifteller account
          </Text>

          {/* Warning */}
          <Text className="mb-4 text-base leading-6">
            <Text style={{ color: colors.state.red }} className="font-bold">
              WARNING
            </Text>
            <Text style={{ color: colors.state.red }}>: </Text>
            <Text className="text-grey-plain-550">
              This action is irreversible. Deleting your account will
              permanently remove all your posts, messages, likes, and followers.
            </Text>
          </Text>

          {/* Description */}
          <Text className="mb-4 text-base leading-6 text-grey-plain-550">
            You are initiating a process that will lead to the complete deletion
            of your data.
          </Text>

          {/* Bullet Points */}
          <View className="mb-6">
            {bulletPoints.map((point, index) => (
              <View key={index} className="mb-3 flex-row">
                <Text className="mr-2 text-base text-grey-plain-550">•</Text>
                <Text className="flex-1 text-base leading-6 text-grey-plain-550">
                  {point}
                </Text>
              </View>
            ))}
          </View>

          {/* Instructions */}
          <Text className="mb-4 text-base leading-6 text-grey-plain-550">
            To proceed, please tap &apos;Delete Account&apos; below and enter
            your password on the next screen.
          </Text>

          {/* Question */}
          <Text className="text-base font-medium text-grey-alpha-500">
            Do you want to continue?
          </Text>
        </View>
      </ScrollView>

      {/* Bottom Buttons */}
      <View
        className="absolute bottom-0 left-0 right-0 flex-row gap-3 border-t border-grey-plain-150 px-4 pb-8 pt-4"
        style={{ backgroundColor: colors['grey-plain']['150'] }}
      >
        <View className="flex-1">
          <Button
            title="Cancel"
            onPress={() => router.back()}
            variant="outline"
            size="large"
            className="w-full"
          />
        </View>
        <View className="flex-1">
          <Button
            title="Yes, delete"
            onPress={() => setShowConfirmation(true)}
            variant="destructive"
            size="large"
            className="w-full"
          />
        </View>
      </View>

      {/* Confirmation Bottom Sheet */}
      <ConfirmationBottomSheet
        visible={showConfirmation}
        icon={Trash2}
        title="Delete account"
        description="Are you sure you want to permanently delete your account? This action cannot be undone."
        cancelText="No, go back"
        confirmText="Yes, delete"
        confirmVariant="destructive"
        onCancel={() => setShowConfirmation(false)}
        onConfirm={handleDelete}
      />
    </SafeAreaView>
  );
}
