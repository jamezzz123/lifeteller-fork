import { View, Text, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Svg, {
  LinearGradient,
  Stop,
  TSpan,
  Text as SvgText,
} from 'react-native-svg';
import LogoColor from '@/assets/images/logo/logo-color.svg';
import { Button } from '@/components/ui/Button';
import { themeConfig } from '@/theme/config';
import { useAuth } from '@/context/auth';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const onboardingIllustration = require('@/assets/images/welcome/illustration-1.png');

export default function OnboardingWelcomeScreen() {
  const { user } = useAuth();
  const username = user?.username || 'there';

  function handleContinue() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/(onboarding)/onboarding-step-1');
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'bottom']}>
      <View className="flex-1 px-6">
        {/* Header */}
        <View className="mt-4 pb-3 pt-4">
          <LogoColor width={104} height={30} />
        </View>

        {/* Illustration */}
        <View className="mt-8 flex-1 items-center justify-center">
          <Image
            source={onboardingIllustration}
            style={{
              width: '100%',
              maxWidth: 280,
              height: 280,
            }}
            contentFit="contain"
          />
        </View>

        {/* Welcome Message */}
        <View className="mb-8">
          <Text className="text-base text-grey-alpha-400">Hi {username},</Text>
          <View className="mt-2">
            <Text className="text-4xl font-black text-grey-alpha-500">
              Welcome to
            </Text>
            <View>
              <Svg height="48" width={SCREEN_WIDTH - 48}>
                <LinearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <Stop offset="0%" stopColor="#7538BA" stopOpacity="1" />
                  <Stop offset="100%" stopColor="#CF2586" stopOpacity="1" />
                </LinearGradient>
                <SvgText
                  x="0"
                  y="38"
                  fontSize="36"
                  fontWeight="800"
                  fill="url(#gradient)"
                  fontFamily={themeConfig.typography.primary.extraBold}
                >
                  <TSpan>Lifteller</TSpan>
                </SvgText>
              </Svg>
            </View>
          </View>
          <Text
            className="mt-4 text-base text-grey-alpha-400"
            style={{
              fontFamily: themeConfig.typography.primary.normal,
            }}
          >
            Please complete your onboarding to enjoy maximum experience on
            Lifteller.
          </Text>
        </View>

        {/* Continue Button */}
        <View className="pb-8">
          <Button
            title="Continue onboarding"
            onPress={handleContinue}
            variant="primary"
            className="w-full"
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
