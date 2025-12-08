import { useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { ArrowLeft, Check } from 'lucide-react-native';
import LogoColor from '@/assets/images/logo/logo-color.svg';
import { Button } from '@/components/ui/Button';
import { TextButton } from '@/components/ui/TextButton';
import { IconButton } from '@/components/ui/IconButton';
import { ProgressIndicator } from '@/components/ui/ProgressIndicator';
import { colors } from '@/theme/colors';

const MAX_INTERESTS = 5;

const INTERESTS = [
  'Education',
  'Skills development',
  'Child support',
  'Feeding',
  'Housing',
  'Health and Medical',
  'Faith-based',
  'Business',
  'Job support',
  'Capacity building',
  'Transportation',
  'Family',
  'Emergency',
  'Celebrations',
];

export default function OnboardingStep4Screen() {
  const currentStep = 4;
  const totalSteps = 4;
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  function handleBack() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  }

  function handleSkip() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/(onboarding)/onboarding-loading');
  }

  function handleFinish() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // TODO: Save interests to onboarding state/context
    router.push('/(onboarding)/onboarding-loading');
  }

  function toggleInterest(interest: string) {
    setSelectedInterests((prev: string[]) => {
      if (prev.includes(interest)) {
        // Deselect
        return prev.filter((item: string) => item !== interest);
      } else {
        // Select (only if under limit)
        if (prev.length < MAX_INTERESTS) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          return [...prev, interest];
        } else {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          return prev;
        }
      }
    });
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
            What are the things that interest you?
          </Text>
          <Text className="mt-1 text-grey-alpha-400">
            This helps us show you relatable contents.
          </Text>

          {/* Interests Grid */}
          <View className="mt-8">
            <View className="flex-row flex-wrap gap-3">
              {INTERESTS.map((interest) => {
                const isSelected = selectedInterests.includes(interest);
                return (
                  <Pressable
                    key={interest}
                    onPress={() => toggleInterest(interest)}
                    className="rounded-xl px-3 py-2"
                    style={{
                      backgroundColor: isSelected
                        ? colors['primary-tints'].purple['100']
                        : colors['grey-alpha']['150'],
                    }}
                  >
                    <View className="flex-row items-center gap-2">
                      {isSelected && (
                        <Check
                          size={16}
                          color={colors['grey-alpha']['450']}
                          strokeWidth={3}
                        />
                      )}

                      <Text
                        className="text-sm font-medium"
                        style={{
                          color: colors['grey-alpha']['450'],
                        }}
                      >
                        {interest}
                      </Text>
                    </View>
                  </Pressable>
                );
              })}
            </View>

            {/* Selection Limit Info */}
            <View className="mt-6">
              <Text className="text-sm text-grey-alpha-500">
                You can select up to{' '}
                <Text className="font-bold">{MAX_INTERESTS}</Text> interests.
              </Text>
            </View>
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
              <Button title="Finish" onPress={handleFinish} variant="primary" />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
