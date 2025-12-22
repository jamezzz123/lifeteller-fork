import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { X , UserX } from 'lucide-react-native';
import { colors } from '@/theme/colors';
import { Button } from '@/components/ui/Button';
import { ConfirmationBottomSheet } from '@/components/ui/ConfirmationBottomSheet';

const bulletPoints = [
  'Your account data will be held for 30 days. If you log back in during this period, your account will be restored and the deactivation will be canceled.',
  'If you do not log in within 30 days, your account will be permanently deleted.',
  'Some profile information may remain visible on third-party search engines like Google or Bing until they cache new results.',
];

export default function DeactivateAccountScreen() {
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleDeactivate = () => {
    // TODO: Implement actual deactivation logic
    console.log('Account deactivated');
    setShowConfirmation(false);
    // Navigate to login/get-started screen
    router.replace('/(auth)/get-started');
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'bottom']}>
      {/* Header */}
      <View className="flex-row items-center border-b border-grey-plain-150 bg-white px-4 py-3">
        <TouchableOpacity onPress={() => router.back()} className="mr-3">
          <X
            color={colors['grey-plain']['550']}
            size={24}
            strokeWidth={2}
          />
        </TouchableOpacity>
        <Text className="text-lg font-semibold text-grey-alpha-500">
          Deactivate account
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
            Deactivate your Lifteller account
          </Text>

          {/* Description */}
          <Text className="mb-4 text-base leading-6 text-grey-plain-550">
            You are about to start the process of deactivating your account.
            Your display name, username, and public profile will be immediately
            removed from X.
          </Text>

          {/* What Happens Next */}
          <Text className="mb-4 text-base font-semibold text-grey-alpha-500">
            What Happens Next:
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
            title="Yes, deactivate"
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
        icon={UserX}
        title="Deactivate account"
        description="Are you sure you want to deactivate your account? You can reactivate within 30 days by logging back in."
        cancelText="No, go back"
        confirmText="Yes, deactivate"
        confirmVariant="destructive"
        onCancel={() => setShowConfirmation(false)}
        onConfirm={handleDeactivate}
      />
    </SafeAreaView>
  );
}

