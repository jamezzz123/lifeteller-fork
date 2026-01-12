import { View, Text } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRef, useEffect, forwardRef } from 'react';
import { Check } from 'lucide-react-native';

import { Button } from '@/components/ui/Button';
import {
  BottomSheetComponent,
  BottomSheetRef,
} from '@/components/ui/BottomSheet';
import { colors } from '@/theme/colors';
import * as Haptics from 'expo-haptics';

const UpgradeSuccessBottomSheet = forwardRef<
  BottomSheetRef,
  {
    title: string;
    description: string;
    primaryButtonTitle: string;
    secondaryButtonTitle: string;
    onPrimaryPress: () => void;
    onSecondaryPress: () => void;
  }
>(
  (
    {
      title,
      description,
      primaryButtonTitle,
      secondaryButtonTitle,
      onPrimaryPress,
      onSecondaryPress,
    },
    ref
  ) => {
    return (
      <BottomSheetComponent ref={ref} snapPoints={['50%']}>
        <View className="items-center px-6 pb-8 pt-4">
          {/* Success Icon with Confetti Effect */}
          <View className="mb-6 items-center">
            <View className="relative">
              {/* Green Checkmark Circle */}
              <View
                className="h-16 w-16 items-center justify-center rounded-full"
                style={{ backgroundColor: colors.state.green }}
              >
                <Check
                  color="#FFFFFF"
                  size={32}
                  strokeWidth={3}
                />
              </View>
              {/* Confetti elements (simplified) */}
              <View
                className="absolute -right-2 -top-2 h-3 w-3 rounded-full"
                style={{ backgroundColor: colors.primary.purple }}
              />
              <View
                className="absolute -bottom-2 -left-2 h-2 w-2 rounded-full"
                style={{ backgroundColor: colors.yellow['50'] }}
              />
              <View
                className="absolute -right-4 top-4 h-2 w-2 rounded-full"
                style={{ backgroundColor: colors.state.green }}
              />
            </View>
          </View>

          {/* Title */}
          <Text className="mb-2 text-2xl font-bold text-grey-alpha-500">
            {title}
          </Text>

          {/* Description */}
          <Text className="mb-8 text-center text-base text-grey-plain-550">
            {description}
          </Text>

          {/* Buttons */}
          <View className="w-full flex-row gap-3">
            {/* Secondary Action Button */}
            <View className="flex-1">
              <Button
                title={primaryButtonTitle}
                onPress={onPrimaryPress}
                variant="outline"
                className="w-full"
              />
            </View>

            {/* Primary Action Button */}
            <View className="flex-1">
              <Button
                title={secondaryButtonTitle}
                onPress={onSecondaryPress}
                variant="primary"
                className="w-full"
              />
            </View>
          </View>
        </View>
      </BottomSheetComponent>
    );
  }
);

UpgradeSuccessBottomSheet.displayName = 'UpgradeSuccessBottomSheet';

export default function UpgradeWalletSuccessScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ type?: string; tier?: string }>();
  const verificationType = params.type || 'bvn';
  const tier = params.tier || 'Tier 1';

  const successSheetRef = useRef<BottomSheetRef>(null);

  useEffect(() => {
    // Open success bottom sheet on mount
    setTimeout(() => {
      successSheetRef.current?.expand();
    }, 100);
  }, []);

  const handleGoToWallet = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    successSheetRef.current?.close();
    setTimeout(() => {
      router.replace('/(tabs)/wallet');
    }, 300);
  };

  const handleUpgradeToNextTier = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    successSheetRef.current?.close();
    setTimeout(() => {
      // Navigate to next tier upgrade
      const nextTier = tier === 'Tier 1' ? 'tier 2' : 'tier 3';
      router.replace({
        pathname: '/upgrade-wallet' as any,
        params: { targetTier: nextTier },
      });
    }, 300);
  };

  const successMessage =
    verificationType === 'bvn'
      ? 'BVN verified successfully'
      : 'NIN verified successfully';

  const description = `Your wallet has been upgraded to ${tier}. Continue to fully upgrade your account.`;

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-center text-lg text-grey-alpha-500">
          {successMessage}
        </Text>
      </View>

      <UpgradeSuccessBottomSheet
        ref={successSheetRef}
        title={successMessage}
        description={description}
        primaryButtonTitle="Go to wallet"
        secondaryButtonTitle={`Upgrade to ${tier === 'Tier 1' ? 'tier 2' : 'tier 3'}`}
        onPrimaryPress={handleGoToWallet}
        onSecondaryPress={handleUpgradeToNextTier}
      />
    </SafeAreaView>
  );
}

