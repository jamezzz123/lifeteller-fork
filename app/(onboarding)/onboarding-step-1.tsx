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
import * as Haptics from 'expo-haptics';
import LogoColor from '@/assets/images/logo/logo-color.svg';
import { Button } from '@/components/ui/Button';
import { TextButton } from '@/components/ui/TextButton';
import { TextInput } from '@/components/ui/TextInput';
import { ProgressIndicator } from '@/components/ui/ProgressIndicator';

export default function OnboardingStep1Screen() {
  const [name, setName] = useState('');
  const currentStep = 1;
  const totalSteps = 4;

  function handleSkip() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/(onboarding)/onboarding-step-2');
  }

  function handleContinue() {
    if (!name.trim()) {
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // TODO: Save name to onboarding state/context
    router.push('/(onboarding)/onboarding-step-2');
  }

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
          <View className="px-6 pt-4">
            <LogoColor width={104} height={30} />
          </View>

          {/* Progress Indicator */}
          <View className="mt-8 px-6">
            <ProgressIndicator
              currentStep={currentStep}
              totalSteps={totalSteps}
            />
          </View>

          {/* Content */}
          <View className="mt-6 flex-1 px-6">
            <Text className="text-xl font-bold text-grey-alpha-500">
              What is your name?
            </Text>
            <Text className="text-grey-alpha-400">
              This is what lifters will use to identify you.
            </Text>

            {/* Name Input */}
            <View className="mt-8">
              <TextInput
                label="Your name"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
                containerClassName="mb-4"
              />
              <Text className="text-sm text-grey-alpha-400">
                You can use your personal name or that of your organisation,
                school, or community.
              </Text>
            </View>

            {/* Action Buttons */}
            <View className="mt-20 flex-row items-center justify-between pb-8">
              <TextButton title="Skip" onPress={handleSkip} />
              <Button
                title="Save and continue"
                onPress={handleContinue}
                variant="primary"
                disabled={!name.trim()}
                className="ml-4"
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
