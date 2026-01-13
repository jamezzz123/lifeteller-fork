import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { colors } from '@/theme/colors';

export default function WalletDeactivationLoadingScreen() {
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Rotate animation for the asterisk/star icon
    Animated.loop(
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
    ).start();

    // Simulate deactivation process
    const timer = setTimeout(() => {
      // Navigate back to wallet with success toast
      router.replace({
        pathname: '/(tabs)/wallet',
        params: { walletDeactivated: 'true' },
      } as any);
    }, 3000);

    return () => clearTimeout(timer);
  }, [rotateAnim]);

  const handleCancel = () => {
    router.back();
  };

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'bottom']}>
      <View className="flex-1 items-center justify-center px-6">
        {/* Icon */}
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
        <Text className="mb-8 text-xl font-semibold text-grey-alpha-500">
          Wallet deactivation in progress
        </Text>

        {/* Cancel Link */}
        <TouchableOpacity onPress={handleCancel}>
          <Text className="text-base text-grey-alpha-500 underline">
            Cancel
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
