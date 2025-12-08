import { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { ArrowLeft } from 'lucide-react-native';
import LogoColor from '@/assets/images/logo/logo-color.svg';
import { Button } from '@/components/ui/Button';
import { TextButton } from '@/components/ui/TextButton';
import { IconButton } from '@/components/ui/IconButton';
import { ProgressIndicator } from '@/components/ui/ProgressIndicator';
import { ProfilePictureUploader } from '@/components/ui/ProfilePictureUploader';
import { colors } from '@/theme/colors';

export default function OnboardingStep2Screen() {
  const currentStep = 2;
  const totalSteps = 4;
  const [profileImageUri, setProfileImageUri] = useState<string | null>(null);
  // TODO: Get name from onboarding context/state
  const userName = 'Test User';

  function handleBack() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  }

  function handleSkip() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/(onboarding)/onboarding-step-3');
  }

  function handleImageSelected(uri: string) {
    setProfileImageUri(uri);
    // TODO: Save profile image to onboarding state/context
  }

  function handleContinue() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    console.log('profileImageUri', profileImageUri);
    // TODO: Save profile image if selected
    router.push('/(onboarding)/onboarding-step-3');
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'bottom']}>
      <ScrollView
        className="flex-1"
        contentContainerClassName="flex-grow"
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
            Update your profile picture
          </Text>
          <Text className="text-grey-alpha-400">
            This is how you will appear to other lifters.
          </Text>

          {/* Profile Picture Uploader */}
          <View className="mt-8">
            <ProfilePictureUploader
              initialName={userName}
              onImageSelected={handleImageSelected}
            />
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
    </SafeAreaView>
  );
}
