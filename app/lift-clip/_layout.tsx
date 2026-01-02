import { Stack } from 'expo-router';
import { RequestLiftProvider } from '@/context/request-lift';

export default function LiftClipLayout() {
  return (
    <RequestLiftProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="preview" />
        <Stack.Screen name="link-clip" />
        <Stack.Screen name="post" />
        <Stack.Screen name="final-preview" />
      </Stack>
    </RequestLiftProvider>
  );
}
