import { useRef, useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import * as WebBrowser from 'expo-web-browser';
import { router } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import LogoLight from '@/assets/images/logo/logo-light.svg';
import GoogleIcon from '@/assets/icons/google.svg';
import { appConfig } from '@/config/app.config';
import { Button } from '@/components/ui/Button';
import {
  SocialOptionsSheet,
  SocialOptionsSheetRef,
} from '@/components/auth/SocialOptionsSheet';

const welcomeImage = require('@/assets/images/welcome/welcome.jpg');

export default function GetStartedScreen() {
  const socialSheetRef = useRef<SocialOptionsSheetRef>(null);
  const [showSocialSheet, setShowSocialSheet] = useState(false);
  const translateX = useSharedValue(-100);
  const opacity = useSharedValue(0);

  useEffect(() => {
    translateX.value = withTiming(0, {
      duration: 800,
      easing: Easing.out(Easing.cubic),
    });
    opacity.value = withTiming(1, {
      duration: 800,
      easing: Easing.out(Easing.cubic),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Open the sheet when it mounts
  useEffect(() => {
    if (showSocialSheet && socialSheetRef.current) {
      // Small delay to ensure the component is fully mounted
      setTimeout(() => {
        socialSheetRef.current?.open();
      }, 100);
    }
  }, [showSocialSheet]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
      opacity: opacity.value,
    };
  });

  async function handleGoogleSignIn() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // TODO: Implement Google OAuth
    // Simulate Google sign-in for testing
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log('Google sign in');
      // Navigate to onboarding after successful sign-in
      router.replace('/(onboarding)/onboarding-index');
    } catch (error) {
      console.error('Google sign-in error:', error);
    }
  }

  function handleEmailSignIn() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/(auth)/create-account');
  }

  function handleOtherSocials() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setShowSocialSheet(true);
  }

  function handleSocialSheetClose() {
    setShowSocialSheet(false);
  }

  async function handleSocialSelect(socialId: string) {
    // TODO: Implement social sign-in based on selected option
    // Simulate social sign-in for testing
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log('Selected social:', socialId);
      // Close and unmount the sheet
      setShowSocialSheet(false);
      // Navigate to onboarding after successful sign-in
      router.replace('/(onboarding)/onboarding-index');
    } catch (error) {
      console.error('Social sign-in error:', error);
    }
  }

  async function handleTermsPress() {
    await WebBrowser.openBrowserAsync(appConfig.links.termsOfUse);
  }

  async function handlePrivacyPress() {
    await WebBrowser.openBrowserAsync(appConfig.links.privacyPolicy);
  }

  return (
    <View className="flex-1">
      <Image
        source={welcomeImage}
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
        }}
        contentFit="cover"
      />

      <View
        className="absolute inset-0"
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
        }}
      />

      <SafeAreaView className="flex-1" edges={['top', 'bottom']}>
        <View className="flex-1 items-start justify-start px-6 pt-8">
          <View className="mb-4 flex-row items-center">
            <LogoLight width={104} height={30} />
          </View>
          <Animated.View style={animatedStyle}>
            <Text className="mt-4 text-[2.6rem] font-inter-black leading-[1.1] tracking-tighter text-white">
              <Text className="text-grey-plain-450">Where</Text> Connection
              {'\n'}
              <Text className="text-grey-plain-450">meets</Text> Compassion
            </Text>
          </Animated.View>
        </View>

        <View className="px-6 pb-8">
          <Button
            title="Continue with Google"
            onPress={handleGoogleSignIn}
            iconLeft={<GoogleIcon width={18} height={18} />}
            variant="secondary"
            className="mb-4 border-grey-plain-50"
            size="medium"
          />

          <Button
            title="Continue with Email or Mobile number"
            onPress={handleEmailSignIn}
            variant="primary"
            className="mb-4"
            size="medium"
          />

          <Button
            title="Continue with other Socials"
            onPress={handleOtherSocials}
            variant="outline"
            className="mb-10 border-grey-plain-50"
            size="medium"
          />

          <View className="items-center">
            <Text className="text-sm text-white">
              By continuing, you agree to our{' '}
              <Text
                onPress={handleTermsPress}
                className="underline"
                style={{ textDecorationLine: 'underline' }}
              >
                Terms of Use
              </Text>{' '}
              and{' '}
              <Text
                onPress={handlePrivacyPress}
                className="underline"
                style={{ textDecorationLine: 'underline' }}
              >
                Privacy Policy
              </Text>
            </Text>
          </View>
        </View>
      </SafeAreaView>

      {showSocialSheet && (
        <SocialOptionsSheet
          ref={socialSheetRef}
          onSelect={handleSocialSelect}
          onClose={handleSocialSheetClose}
        />
      )}
    </View>
  );
}
