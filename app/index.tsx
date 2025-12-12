import { WelcomeScreen } from '@/components/welcome/WelcomeScreen';
import { Redirect, router, Href } from 'expo-router';
import { View, TouchableOpacity, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Index() {
  const isLoggedIn = false;

  if (isLoggedIn) {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <WelcomeScreen />

      {/* Quick Test Button - positioned at bottom */}
      <View className="absolute bottom-8 left-0 right-0 px-4">
        <TouchableOpacity
          onPress={() => router.push('/offer-lift-profile' as Href)}
          className="rounded-full border-2 border-primary bg-primary py-4"
          activeOpacity={0.8}
        >
          <Text className="text-center text-base font-bold text-white">
            Test Offer Lift Profile Flow
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
