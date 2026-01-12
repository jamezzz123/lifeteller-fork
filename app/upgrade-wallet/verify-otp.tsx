import { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { X, Clock } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/Button';
import { colors } from '@/theme/colors';
import * as Haptics from 'expo-haptics';

export default function VerifyOTPScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ type?: string; phoneNumber?: string }>();
  const verificationType = params.type || 'bvn';
  const phoneNumber = params.phoneNumber || '+2348134***778';

  const otpLength = verificationType === 'bvn' ? 5 : 6;
  const resendTimeout = 180; // 3 minutes

  const [otp, setOtp] = useState<string[]>(Array(otpLength).fill(''));
  const [timeLeft, setTimeLeft] = useState(resendTimeout);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleChangeText = (text: string, index: number) => {
    // Only allow single digit
    if (text.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Auto-focus next input
    if (text && index < otpLength - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    // Handle backspace
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleClearInput = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setOtp(Array(otpLength).fill(''));
    inputRefs.current[0]?.focus();
  };

  const handleResend = () => {
    if (timeLeft > 0) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setTimeLeft(resendTimeout);
    // TODO: Request new OTP from backend
    console.log('Resending OTP...');
  };

  const handleConfirm = () => {
    const otpString = otp.join('');
    if (otpString.length === otpLength) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      // TODO: Verify OTP with backend
      console.log('OTP entered:', otpString);

      // Navigate to success screen
      router.push({
        pathname: '/upgrade-wallet/success' as any,
        params: {
          type: verificationType,
          tier: verificationType === 'bvn' ? 'Tier 1' : 'Tier 2',
        },
      });
    }
  };

  const handleClose = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  const isComplete = otp.every((digit) => digit !== '');

  const title =
    verificationType === 'bvn' ? 'Verify your BVN' : 'Verify your NIN';

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 px-6">
        {/* Header */}
        <View className="mb-6 flex-row items-center justify-between py-4">
          <Text className="text-lg font-semibold text-grey-alpha-500">
            {title}
          </Text>
          <TouchableOpacity onPress={handleClose} className="p-1">
            <X size={24} color={colors['grey-alpha']['500']} strokeWidth={2} />
          </TouchableOpacity>
        </View>

        {/* Description */}
        <Text className="mb-6 text-sm leading-5 text-grey-alpha-400">
          Enter the OTP sent to your mobile number{' '}
          <Text className="font-semibold text-grey-alpha-500">
            {phoneNumber}
          </Text>
          .
        </Text>

        {/* OTP Inputs */}
        <View className="mb-4 flex-row gap-2">
          {Array.from({ length: otpLength }).map((_, index) => (
            <TextInput
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              value={otp[index]}
              onChangeText={(text) => handleChangeText(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              keyboardType="number-pad"
              maxLength={1}
              className={`flex-1 rounded-lg border-2 bg-grey-plain-50 py-4 text-center text-xl font-semibold text-grey-alpha-500 ${
                otp[index] ? 'border-primary' : 'border-grey-alpha-250'
              }`}
              style={{
                aspectRatio: 1,
              }}
            />
          ))}
        </View>

        {/* Clear & Resend */}
        <View className="mb-8 flex-row items-center justify-between">
          <Pressable onPress={handleClearInput}>
            <Text className="text-sm font-medium text-grey-alpha-500">
              Clear input
            </Text>
          </Pressable>

          <Pressable
            onPress={handleResend}
            disabled={timeLeft > 0}
            className="flex-row items-center gap-1.5"
          >
            <Clock
              size={16}
              color={
                timeLeft > 0
                  ? colors['grey-alpha']['400']
                  : colors.primary.purple
              }
              strokeWidth={2}
            />
            <Text
              className={`text-sm font-medium ${
                timeLeft > 0 ? 'text-grey-alpha-400' : 'text-primary'
              }`}
            >
              Resend OTP {timeLeft > 0 ? `in ${formatTime(timeLeft)}` : ''}
            </Text>
          </Pressable>
        </View>

        {/* Spacer */}
        <View className="flex-1" />

        {/* Confirm Button */}
        <View className="pb-6">
          <Button
            title="Confirm OTP"
            onPress={handleConfirm}
            disabled={!isComplete}
            variant="primary"
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

