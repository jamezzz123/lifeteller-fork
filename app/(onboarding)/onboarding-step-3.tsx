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
import { ArrowLeft, Info } from 'lucide-react-native';
import LogoColor from '@/assets/images/logo/logo-color.svg';
import { Button } from '@/components/ui/Button';
import { TextButton } from '@/components/ui/TextButton';
import { TextInput } from '@/components/ui/TextInput';
import { IconButton } from '@/components/ui/IconButton';
import { ProgressIndicator } from '@/components/ui/ProgressIndicator';
import { colors } from '@/theme/colors';
import { useOnboarding } from '@/context/onboarding';

const MAX_CHARACTERS = 100;

export default function OnboardingStep3Screen() {
  const currentStep = 3;
  const totalSteps = 4;
  const { data, updateData } = useOnboarding();
  const [tagline, setTagline] = useState(data.bio || '');

  function handleBack() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  }

  function handleSkip() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/(onboarding)/onboarding-step-4');
  }

  function handleContinue() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // Save bio to onboarding context
    updateData({ bio: tagline.trim() || undefined });
    router.push('/(onboarding)/onboarding-step-4');
  }

  function handleTaglineChange(text: string) {
    if (text.length <= MAX_CHARACTERS) {
      setTagline(text);
    }
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
          <View className="mt-4 px-6 pb-3 pt-4">
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
              Tagline/bio
            </Text>
            <Text className="mt-1 text-grey-alpha-400">
              Use something simple and relateable.
            </Text>

            {/* Tagline Input */}
            <View className="mt-8">
              <TextInput
                label="Tagline/bio"
                value={tagline}
                onChangeText={handleTaglineChange}
                maxLength={MAX_CHARACTERS}
                multiline
                numberOfLines={3}
                containerClassName="mb-3"
              />

              {/* Character Limit */}
              <View className="mb-3 flex-row items-center gap-1.5">
                <Info
                  size={14}
                  color={colors['grey-alpha']['500']}
                  strokeWidth={2}
                />
                <Text className="text-sm text-grey-alpha-500">
                  Maximum of {MAX_CHARACTERS} characters
                </Text>
              </View>

              {/* Helper Text */}
              <Text className="text-sm text-grey-alpha-400">
                A short, descriptive phrase that tells lifters about you.
              </Text>
            </View>

            {/* Action Buttons */}
            <View className="mt-20 flex-row items-center justify-between pb-8 pt-16">
              <TextButton title="Skip" onPress={handleSkip} />
              <View className="flex-row items-center gap-3">
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
                <Button
                  title="Save and continue"
                  onPress={handleContinue}
                  variant="primary"
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
