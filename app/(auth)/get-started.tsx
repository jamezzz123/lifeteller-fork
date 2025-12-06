import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function GetStartedScreen() {
  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-background">
      <Text className="text-2xl font-bold text-primary">
        Get Started Screen
      </Text>
      <Text className="mt-4 text-base text-grey-alpha-400">
        This screen will be implemented next
      </Text>
    </SafeAreaView>
  );
}
