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

export default function WalletVerifyScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const phoneNumber = (params.phoneNumber as string) || '+2348134***778';
  const maskedPhoneNumber = phoneNumber.replace(
    /(\+\d{3})(\d{3})(\d{3})(\d{3})/,
    '$1$2***$4'
  );
  const otpLength = 6;
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

    // Auto-submit when complete
    if (newOtp.every((digit) => digit !== '') && text) {
      const otpString = newOtp.join('');
      setTimeout(() => {
        handleConfirm(otpString);
      }, 100);
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    // Handle backspace
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleClearInput = () => {
    setOtp(Array(otpLength).fill(''));
    inputRefs.current[0]?.focus();
  };

  const handleResend = () => {
    if (timeLeft > 0) return;
    setTimeLeft(resendTimeout);
    // TODO: Request new OTP from backend
    console.log('Resending OTP...');
  };

  const handleConfirm = (otpString?: string) => {
    const code = otpString || otp.join('');
    if (code.length === otpLength) {
      // TODO: Verify OTP with backend
      console.log('OTP entered:', code);

      // Navigate to loading screen
      router.push('/wallet-activation-loading' as any);
    }
  };

  const handleClose = () => {
    router.back();
  };

  const isComplete = otp.every((digit) => digit !== '');

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 px-6">
        {/* Header */}
        <View className="mb-6 flex-row items-center justify-between py-4">
          <Text className="text-lg font-inter-semibold text-grey-alpha-500">
            Verify yourself
          </Text>
          <TouchableOpacity onPress={handleClose} className="p-1">
            <X size={24} color={colors['grey-alpha']['500']} strokeWidth={2} />
          </TouchableOpacity>
        </View>

        {/* Description */}
        <Text className="mb-2 text-sm leading-5 text-grey-alpha-400">
          Enter the OTP sent to your mobile number
        </Text>
        <Text className="mb-6 text-sm font-inter-semibold leading-5 text-grey-alpha-500">
          {maskedPhoneNumber}
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
              className={`flex-1 rounded-lg border-2 bg-grey-plain-50 py-4 text-center text-xl font-inter-semibold text-grey-alpha-500 ${
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
            <Text className="text-sm font-inter-medium text-grey-alpha-500">
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
              className={`text-sm font-inter-medium ${
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
            onPress={() => handleConfirm()}
            disabled={!isComplete}
            variant="primary"
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

