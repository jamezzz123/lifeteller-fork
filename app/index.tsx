import { WelcomeScreen } from '@/components/welcome/WelcomeScreen';
import { Redirect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Index() {
  const isLoggedIn = false;

  if (isLoggedIn) {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <WelcomeScreen />
    </SafeAreaView>
  );
}
