import { useState, useEffect, useMemo } from 'react';
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
import { InterestSkeleton } from '@/components/ui/InterestSkeleton';
import { colors } from '@/theme/colors';
import { useOnboarding } from '@/context/onboarding';
import { useInterests } from '@/lib/hooks/queries/useInterests';
import type { Interest } from '@/lib/api/schemas';

const MAX_INTERESTS = 5;

export default function OnboardingStep4Screen() {
  const currentStep = 4;
  const totalSteps = 4;
  const { data, updateData } = useOnboarding();
  const {
    data: interestsData,
    isLoading: isLoadingInterests,
    error: interestsError,
  } = useInterests();
  const [selectedInterests, setSelectedInterests] = useState<string[]>(
    data.interests || []
  );

  // Update context when interests change
  useEffect(() => {
    updateData({ interests: selectedInterests });
  }, [selectedInterests, updateData]);

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

  function toggleInterest(interestId: string) {
    setSelectedInterests((prev: string[]) => {
      if (prev.includes(interestId)) {
        // Deselect
        return prev.filter((item: string) => item !== interestId);
      } else {
        // Select (only if under limit)
        if (prev.length < MAX_INTERESTS) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          return [...prev, interestId];
        } else {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          return prev;
        }
      }
    });
  }

  const interests: Interest[] = useMemo(
    () => interestsData?.data?.results || [],
    [interestsData?.data?.results]
  );
  
  // Debug: Log interests data
  useEffect(() => {
    if (interestsData) {
      console.log('Interests data:', interestsData);
      console.log('Interests array:', interests);
    }
    if (interestsError) {
      console.error('Interests error:', interestsError);
    }
  }, [interestsData, interests, interestsError]);

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
            {isLoadingInterests ? (
              <InterestSkeleton count={12} />
            ) : interestsError ? (
              <View className="py-8">
                <Text className="text-center text-grey-alpha-400">
                  Failed to load interests. Please try again.
                </Text>
              </View>
            ) : interests.length === 0 ? (
              <View className="py-8">
                <Text className="text-center text-grey-alpha-400">
                  No interests available
                </Text>
              </View>
            ) : (
              <View className="flex-row flex-wrap gap-3">
                {interests.map((interest) => {
                  const isSelected = selectedInterests.includes(interest.id);
                  return (
                    <Pressable
                      key={interest.id}
                      onPress={() => toggleInterest(interest.id)}
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
                          {interest.name}
                        </Text>
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            )}

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
