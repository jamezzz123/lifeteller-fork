import { Stack } from 'expo-router';
import { LiftDraftProvider } from '@/context/LiftDraftContext';

export default function LiftsLayout() {
  return (
    <LiftDraftProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </LiftDraftProvider>
  );
}
