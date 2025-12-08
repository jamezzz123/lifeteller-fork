import { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AlertCircle, Check } from 'lucide-react-native';
import LogoColor from '@/assets/images/logo/logo-color.svg';
import { colors } from '@/theme/colors';
import { themeConfig } from '@/theme/config';

const SETUP_STEPS = [
  'Gathering your details',
  'Getting your details ready',
  'Saving your details',
  'Populating your feed',
];

export default function OnboardingLoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    // Simulate progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 2;
        if (newProgress >= 100) {
          clearInterval(interval);
          // Navigate to main app after completion
          // setTimeout(() => {
          //   router.replace('/(tabs)/home'); // TODO: Update with actual main app route
          // }, 500);
          return 100;
        }
        return newProgress;
      });
    }, 100);

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    // Update current step based on progress
    const newIndex = Math.min(
      Math.floor((progress / 100) * SETUP_STEPS.length),
      SETUP_STEPS.length - 1
    );
    setCurrentStepIndex(newIndex);
  }, [progress]);

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'bottom']}>
      <View className="flex-1 px-6">
        {/* Header */}
        <View className="pt-4">
          <LogoColor width={104} height={30} />
        </View>

        {/* Content */}
        <View className="mt-16 flex-1">
          <Text className="text-xl font-bold text-grey-alpha-500">
            Please be patient while we set up your profile
          </Text>

          {/* Setup Steps Card */}
          <View className="mt-8 rounded-2xl bg-primary-tints-100 p-6">
            {/* Steps List */}
            <View className="gap-3">
              {SETUP_STEPS.map((step, index) => {
                const isCompleted = index < currentStepIndex;
                const isCurrent = index === currentStepIndex;
                const isPending = index > currentStepIndex;

                return (
                  <View key={index} className="flex-row items-center gap-3">
                    {/* Icon */}
                    <View
                      className="h-6 w-6 items-center justify-center rounded"
                      style={{
                        backgroundColor: isCompleted
                          ? colors.primary.purple
                          : 'transparent',
                      }}
                    >
                      {isCompleted ? (
                        <Check
                          size={16}
                          color={colors['grey-plain']['50']}
                          strokeWidth={3}
                        />
                      ) : isCurrent ? (
                        <ActivityIndicator
                          size="small"
                          color={colors.primary.purple}
                        />
                      ) : null}
                    </View>

                    {/* Step Text */}
                    <Text
                      className="flex-1 text-base"
                      style={{
                        color: isPending
                          ? colors['grey-alpha']['400']
                          : colors['grey-alpha']['500'],
                        fontFamily: themeConfig.typography.primary.normal,
                        opacity: isPending ? 0.5 : 1,
                      }}
                    >
                      {step}
                      {isCurrent && '...'}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>

          {/* Progress Bar */}
          <View className="mt-8">
            <View
              className="h-2 w-full rounded-full"
              style={{
                backgroundColor: colors['grey-plain']['300'],
              }}
            >
              <View
                className="h-full rounded-full"
                style={{
                  width: `${progress}%`,
                  backgroundColor: colors.primary.purple,
                }}
              />
            </View>
            <Text className="mt-3 text-center text-base font-medium text-grey-alpha-400">
              {Math.round(progress)}%
            </Text>
          </View>

          {/* Warning */}
          <View className="mt-auto flex-row items-center gap-2 pb-8">
            <AlertCircle size={20} color="#965408" />
            <Text
              className="flex-1 text-sm text-[#965408]"
              style={{
                fontFamily: themeConfig.typography.primary.normal,
              }}
            >
              Please do not close the Lifteller mobile app
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
