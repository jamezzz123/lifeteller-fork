import { forwardRef, useState, useRef, useEffect } from 'react';
import { Text, View, TextInput, Pressable, TouchableOpacity } from 'react-native';
import { X, Clock } from 'lucide-react-native';

import { Button } from '@/components/ui/Button';
import {
  BottomSheetComponent,
  BottomSheetRef,
} from '@/components/ui/BottomSheet';
import { colors } from '@/theme/colors';

type OTPVerificationBottomSheetProps = {
  title?: string;
  phoneNumber: string;
  otpLength?: number;
  onVerify: (otp: string) => void;
  onResendOTP?: () => Promise<number | void> | void;
  onClose?: () => void;
  resendTimeout?: number; // in seconds
};

export const OTPVerificationBottomSheet = forwardRef<
  BottomSheetRef,
  OTPVerificationBottomSheetProps
>(
  (
    {
      title = 'Verify yourself',
      phoneNumber,
      otpLength = 6,
      onVerify,
      onResendOTP,
      onClose,
      resendTimeout = 180, // 3 minutes default
    },
    ref
  ) => {
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
          onVerify(otpString);
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

    const handleResend = async () => {
      if (timeLeft > 0) return;
      setTimeLeft(resendTimeout);
      try {
        const updatedTimeout = await onResendOTP?.();
        if (typeof updatedTimeout === 'number' && updatedTimeout > 0) {
          setTimeLeft(updatedTimeout);
        }
      } catch {
        setTimeLeft(0);
      }
    };

    const handleConfirm = () => {
      const otpString = otp.join('');
      if (otpString.length === otpLength) {
        onVerify(otpString);
      }
    };

    const isComplete = otp.every((digit) => digit !== '');

    return (
      <BottomSheetComponent ref={ref} snapPoints={['90%']}>
        <View className="flex-1 px-6">
          {/* Header */}
          <View className="mb-6 flex-row items-center justify-between">
            <Text className="text-lg font-semibold text-grey-alpha-500">
              {title}
            </Text>
            <TouchableOpacity onPress={onClose} className="p-1">
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
                ref={(el) => { inputRefs.current[index] = el; }}
                value={otp[index]}
                onChangeText={(text) => handleChangeText(text, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                keyboardType="number-pad"
                maxLength={1}
                className={`flex-1 rounded-lg border-2 bg-grey-plain-50 py-4 text-center text-xl font-semibold text-grey-alpha-500 ${
                  otp[index]
                    ? 'border-primary'
                    : 'border-grey-alpha-250'
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
          <View className="self-end pb-6" style={{ width: 200 }}>
            <Button
              title="Confirm OTP"
              onPress={handleConfirm}
              disabled={!isComplete}
              variant="primary"
            />
          </View>
        </View>
      </BottomSheetComponent>
    );
  }
);

OTPVerificationBottomSheet.displayName = 'OTPVerificationBottomSheet';
