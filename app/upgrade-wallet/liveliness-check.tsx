import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Modal,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { CornerUpLeft, Check } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors } from '@/theme/colors';
import * as Haptics from 'expo-haptics';
import LiveCheckSvg from '@/assets/images/livecheck.svg';
import { Button } from '@/components/ui/Button';
import {
  BottomSheetComponent,
  BottomSheetRef,
} from '@/components/ui/BottomSheet';

export default function LivelinessCheckScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ type?: string; targetTier?: string }>();
  const targetTier = params.targetTier || 'Tier 2';

  const [showLoading, setShowLoading] = useState(false);
  const [showSuccessSheet, setShowSuccessSheet] = useState(false);
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);
  const successSheetRef = useRef<BottomSheetRef>(null);

  const handleGoBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  const handleSvgPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowLoading(true);

    // Start rotation animation
    animationRef.current = Animated.loop(
      Animated.sequence([
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    );
    animationRef.current.start();

    // Simulate verification process (3 seconds)
    setTimeout(() => {
      if (animationRef.current) {
        animationRef.current.stop();
      }
      setShowLoading(false);
      setShowSuccessSheet(true);
      setTimeout(() => {
        successSheetRef.current?.expand();
      }, 100);
    }, 3000);
  };

  const handleCancelLoading = () => {
    if (animationRef.current) {
      animationRef.current.stop();
    }
    setShowLoading(false);
  };

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
      const nextTier = targetTier === 'tier 2' ? 'tier 3' : 'tier 3';
      router.replace({
        pathname: '/upgrade-wallet' as any,
        params: { targetTier: nextTier },
      });
    }, 300);
  };

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'bottom']}>
      {/* Navigation Bar */}
      <View className="flex-row items-center gap-4 px-4 py-4">
        <TouchableOpacity onPress={handleGoBack} hitSlop={8}>
          <CornerUpLeft
            size={24}
            color={colors['grey-alpha']['500']}
            strokeWidth={2}
          />
        </TouchableOpacity>
        <Text className="flex-1 text-lg font-inter-semibold text-grey-alpha-500">
          Liveliness check
        </Text>
      </View>

      {/* Main Content */}
      <View className="flex-1 px-4 pt-6">
        {/* Title */}
        <Text className="mb-3 text-2xl font-inter-bold text-grey-alpha-500">
          Take a lively selfie
        </Text>

        {/* Instructions */}
        <Text className="text-base leading-6 text-grey-alpha-500">
          Please fit your face in the circle and wait until the green circle is
          completely rounded.
        </Text>

        {/* Face Guide Area */}
        <View className="flex-1 items-center justify-center pb-8">
          <TouchableOpacity
            onPress={handleSvgPress}
            activeOpacity={0.9}
            style={styles.faceGuideContainer}
          >
            {/* Circular Face Guide with SVG */}
            <View style={styles.circleContainer}>
              <LiveCheckSvg width={364} height={328} />
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Loading Overlay */}
      <Modal
        visible={showLoading}
        transparent
        animationType="fade"
        onRequestClose={handleCancelLoading}
      >
        <SafeAreaView
          className="flex-1 items-center justify-center bg-white px-6"
          edges={['top', 'bottom']}
        >
          {/* Rotating Asterisk Icon */}
          <Animated.View
            style={{
              transform: [{ rotate }],
              marginBottom: 24,
            }}
          >
            <Text
              style={{
                fontSize: 64,
                color: colors.primary.purple,
                fontWeight: 'bold',
              }}
            >
              ✱
            </Text>
          </Animated.View>

          {/* Title */}
          <Text className="mb-8 text-xl font-inter-semibold text-grey-alpha-500">
            Verification in progress
          </Text>

          {/* Cancel Link */}
          <TouchableOpacity onPress={handleCancelLoading}>
            <Text className="text-base text-grey-alpha-500 underline">
              Cancel
            </Text>
          </TouchableOpacity>
        </SafeAreaView>
      </Modal>

      {/* Success Bottom Sheet */}
      {showSuccessSheet && (
        <UpgradeSuccessBottomSheet
          ref={successSheetRef}
          title="Verification successful"
          description={`Your wallet has been upgraded to ${targetTier}. Continue to fully upgrade your account.`}
          primaryButtonTitle="Go to wallet"
          secondaryButtonTitle={`Upgrade to ${targetTier === 'tier 2' ? 'tier 3' : 'tier 3'}`}
          onPrimaryPress={handleGoToWallet}
          onSecondaryPress={handleUpgradeToNextTier}
        />
      )}
    </SafeAreaView>
  );
}

// Success Bottom Sheet Component
const UpgradeSuccessBottomSheet = React.forwardRef<
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
                <Check color="#FFFFFF" size={32} strokeWidth={3} />
              </View>
              {/* Confetti elements */}
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
          <Text className="mb-2 text-2xl font-inter-bold text-grey-alpha-500">
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

const styles = StyleSheet.create({
  faceGuideContainer: {
    width: 364,
    height: 328,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleContainer: {
    width: 364,
    height: 328,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bracket: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderColor: colors['grey-alpha']['500'],
    borderWidth: 2.5,
  },
  bracketTopLeft: {
    top: -8,
    left: -8,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  bracketTopRight: {
    top: -8,
    right: -8,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  bracketBottomLeft: {
    bottom: -8,
    left: -8,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  bracketBottomRight: {
    bottom: -8,
    right: -8,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
});
