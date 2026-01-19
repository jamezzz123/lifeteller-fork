import { Redirect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, ActivityIndicator } from 'react-native';
import { useAuth } from '@/context/auth';

export default function Index() {
  const { isAuthenticated, isLoading: authLoading, onboardingComplete } = useAuth();

  // Wait for auth to finish loading
  if (authLoading) {
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

  // If not authenticated, redirect to get-started
  return <Redirect href="/(auth)/get-started" />;
}
