import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="onboarding-index" />
      <Stack.Screen name="onboarding-step-1" />
      <Stack.Screen name="onboarding-step-2" />
      <Stack.Screen name="onboarding-step-3" />
      <Stack.Screen name="onboarding-step-4" />
      <Stack.Screen name="onboarding-loading" />
    </Stack>
  );
}
