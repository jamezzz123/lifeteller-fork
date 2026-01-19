import { useState, useEffect } from 'react';
import { WelcomeScreen } from '@/components/welcome/WelcomeScreen';
import { Redirect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, ActivityIndicator } from 'react-native';
import { hasCompletedOnboarding } from '@/utils/onboardingStorage';
import { useAuth } from '@/context/auth';

export default function Index() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasCompleted, setHasCompleted] = useState(false);
  const { isAuthenticated, isLoading: authLoading, onboardingComplete } = useAuth();

  useEffect(() => {
    async function checkOnboardingStatus() {
      try {
        const completed = await hasCompletedOnboarding();
        setHasCompleted(completed);
      } catch (error) {
        console.error('Error checking onboarding status:', error);
        // Default to showing onboarding on error
        setHasCompleted(false);
      } finally {
        setIsLoading(false);
      }
    }

    checkOnboardingStatus();
  }, []);

  // Wait for auth to finish loading
  if (authLoading || isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" />
        </View>
      </SafeAreaView>
    );
  }

  // If user is authenticated, check onboarding status
  if (isAuthenticated) {
    // If onboarding is not complete, redirect to onboarding
    if (!onboardingComplete) {
      return <Redirect href="/(onboarding)/onboarding-index" />;
    }
    // Otherwise go to tabs
    return <Redirect href="/(tabs)" />;
  }

  // If onboarding is completed (but not logged in), redirect to get-started
  if (hasCompleted) {
    return <Redirect href="/(auth)/get-started" />;
  }

  // Show onboarding slides for first-time users
  return (
    <SafeAreaView className="flex-1 bg-background">
      <WelcomeScreen />
    </SafeAreaView>
  );
}
