import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Slot, router } from 'expo-router';
import { CornerUpLeft } from 'lucide-react-native';
import { colors } from '@/theme/colors';
import { OfferLiftProvider, useOfferLift } from '@/context/offer-lift';

function LayoutContent() {
  const { headerTitle } = useOfferLift();

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View className="flex-1">
        {/* Header */}
        <View className="flex-row items-center py-6 px-4 pb-3 pt-2 border-b border-grey-alpha-250 ">
          <TouchableOpacity
            onPress={handleBack}
            accessibilityLabel="Go back"
            hitSlop={10}
            className="flex-row items-center "
          >
            <CornerUpLeft
              size={20}
              color={colors['grey-alpha']['450']}
              strokeWidth={2.6}
            />
            <Text className="text-base font-medium text-grey-alpha-450 mx-2">
              {headerTitle}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <Slot />
      </View>
    </SafeAreaView>
  );
}

export default function OfferLiftLayout() {
  return (
    <OfferLiftProvider>
      <LayoutContent />
    </OfferLiftProvider>
  );
}
