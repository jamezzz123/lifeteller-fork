import { forwardRef } from 'react';
import { View, Text, Linking } from 'react-native';
import { Mail, CheckCircle2 } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { Button } from '@/components/ui/Button';
import {
  BottomSheetComponent,
  BottomSheetRef,
} from '@/components/ui/BottomSheet';
import { colors } from '@/theme/colors';

interface EmailVerificationBottomSheetProps {
  email: string;
  onLoginNow?: () => void;
  onOpenEmailApp?: () => void;
  onClose?: () => void;
}

export const EmailVerificationBottomSheet = forwardRef<
  BottomSheetRef,
  EmailVerificationBottomSheetProps
>(
  (
    {
      email,
      onLoginNow,
      onOpenEmailApp,
      onClose,
    }: EmailVerificationBottomSheetProps,
    ref
  ) => {
    const handleOpenEmailApp = async () => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      // Try to open default email app
      const emailUrl = `mailto:${email}`;
      const canOpen = await Linking.canOpenURL(emailUrl);

      if (canOpen) {
        await Linking.openURL(emailUrl);
      } else {
        // Fallback: try to open mailto without email
        await Linking.openURL('mailto:');
      }

      onOpenEmailApp?.();
    };

    const handleLoginNow = () => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      onLoginNow?.();
    };

    return (
      <BottomSheetComponent ref={ref} snapPoints={['50%']} onClose={onClose}>
        <View className="px-6">
          {/* Success Icon with Confetti Effect */}
          <View className="mb-6 items-center">
            <View className="relative">
              <View className="bg-state-green h-20 w-20 items-center justify-center rounded-full">
                <CheckCircle2 color={colors['grey-plain']['50']} size={40} />
              </View>
              {/* Confetti dots around the icon */}
              <View className="bg-state-green absolute -left-2 -top-2 h-3 w-3 rounded-full opacity-60" />
              <View className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-primary opacity-60" />
              <View className="absolute -bottom-1 -left-1 h-2.5 w-2.5 rounded-full bg-primary opacity-60" />
              <View className="bg-state-green absolute -bottom-2 -right-2 h-2 w-2 rounded-full opacity-60" />
            </View>
          </View>

          {/* Title */}
          <Text className="mb-3 text-center text-2xl font-inter-bold text-grey-alpha-500">
            Email verification sent
          </Text>

          {/* Description */}
          <Text className="mb-8 text-center text-base leading-6 text-grey-plain-550">
            We have sent a verification link to your email address.
          </Text>

          {/* Email Display */}
          <View className="mb-8 flex-row items-center justify-center gap-2 rounded-xl bg-grey-plain-150 px-4 py-3">
            <Mail
              color={colors['grey-alpha']['500']}
              size={18}
              strokeWidth={2}
            />
            <Text className="text-sm font-inter-medium text-grey-alpha-500">
              {email}
            </Text>
          </View>

          {/* Action Buttons */}
          <View className="flex-row gap-3">
            <View className="flex-1">
              <Button
                title="Log in now"
                onPress={handleLoginNow}
                variant="outline"
                size="large"
              />
            </View>
            <View className="flex-1">
              <Button
                title="Open mail"
                onPress={handleOpenEmailApp}
                variant="primary"
                size="large"
              />
            </View>
          </View>
        </View>
      </BottomSheetComponent>
    );
  }
);

EmailVerificationBottomSheet.displayName = 'EmailVerificationBottomSheet';
