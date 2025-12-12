import { forwardRef, useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, Pressable } from 'react-native';
import { Check, Delete, AlertCircle } from 'lucide-react-native';

import {
  BottomSheetComponent,
  BottomSheetRef,
} from '@/components/ui/BottomSheet';
import { colors } from '@/theme/colors';

type PasscodeBottomSheetProps = {
  title?: string;
  description?: string;
  passcodeLength?: number;
  onComplete: (passcode: string) => void;
  onForgotPasscode?: () => void;
  error?: string;
  showForgotLink?: boolean;
  mode?: 'verify' | 'create'; // verify = enter existing, create = set new
};

export const PasscodeBottomSheet = forwardRef<
  BottomSheetRef,
  PasscodeBottomSheetProps
>(
  (
    {
      title,
      description,
      passcodeLength = 6,
      onComplete,
      onForgotPasscode,
      error,
      showForgotLink = true,
      mode = 'verify',
    },
    ref
  ) => {
    const defaultTitle = mode === 'create' ? 'Create your passcode' : 'Enter your passcode';
    const [passcode, setPasscode] = useState('');

    const handleNumberPress = (num: string) => {
      if (passcode.length < passcodeLength) {
        const newPasscode = passcode + num;
        setPasscode(newPasscode);

        // Auto-submit when passcode is complete
        if (newPasscode.length === passcodeLength) {
          setTimeout(() => {
            onComplete(newPasscode);
          }, 100);
        }
      }
    };

    const handleDelete = () => {
      setPasscode(passcode.slice(0, -1));
    };

    const handleSubmit = () => {
      if (passcode.length === passcodeLength) {
        onComplete(passcode);
      }
    };

    // Reset passcode when error changes
    useEffect(() => {
      if (error) {
        const timer = setTimeout(() => {
          setPasscode('');
        }, 500);
        return () => clearTimeout(timer);
      }
    }, [error]);

    const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

    return (
      <BottomSheetComponent ref={ref}>
        <View className="px-6 pb-6">
          {/* Title */}
          <Text className="mb-6 text-center text-lg font-semibold text-grey-alpha-500">
            {title || defaultTitle}
          </Text>

          {/* Passcode Dots */}
          <View
            className={`mb-3 flex-row items-center justify-center gap-3 rounded-full px-8 py-4 ${
              error ? 'bg-red-50' : 'bg-grey-alpha-150'
            }`}
          >
            {Array.from({ length: passcodeLength }).map((_, index) => (
              <View
                key={index}
                className={`size-4 rounded-full ${
                  index < passcode.length
                    ? error
                      ? 'bg-red-500'
                      : 'bg-primary'
                    : 'bg-grey-alpha-250'
                }`}
              />
            ))}
          </View>

          {/* Error Message or Description */}
          {error ? (
            <View className="mb-4 flex-row items-center justify-center gap-2">
              <AlertCircle size={16} color="#EF4444" strokeWidth={2} />
              <Text className="text-sm text-red-500">{error}</Text>
            </View>
          ) : description ? (
            <Text className="mb-4 text-center text-sm text-grey-alpha-400">
              {description}
            </Text>
          ) : (
            <View className="mb-4" />
          )}

          {/* Forgot Passcode Link - Only show in verify mode */}
          {showForgotLink && mode === 'verify' && (
            <Pressable
              onPress={onForgotPasscode}
              className="mb-6 items-center"
            >
              <Text className="text-sm font-medium text-grey-alpha-500 underline">
                Forgot passcode?
              </Text>
            </Pressable>
          )}

          {/* Number Pad */}
          <View className="gap-3">
            {/* Rows 1-3 */}
            {[0, 1, 2].map((rowIndex) => (
              <View key={rowIndex} className="flex-row gap-3">
                {numbers.slice(rowIndex * 3, rowIndex * 3 + 3).map((num) => (
                  <TouchableOpacity
                    key={num}
                    onPress={() => handleNumberPress(num)}
                    className="flex-1 items-center rounded-full bg-grey-alpha-150 py-5"
                    activeOpacity={0.7}
                  >
                    <Text className="text-2xl font-semibold text-grey-alpha-500">
                      {num}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            ))}

            {/* Bottom Row: Delete, 0, Submit */}
            <View className="flex-row gap-3">
              {/* Delete Button */}
              <TouchableOpacity
                onPress={handleDelete}
                className="flex-1 items-center rounded-full bg-grey-alpha-150 py-5"
                activeOpacity={0.7}
                disabled={passcode.length === 0}
              >
                <Delete
                  size={24}
                  color={
                    passcode.length === 0
                      ? colors['grey-alpha']['300']
                      : colors['grey-alpha']['500']
                  }
                  strokeWidth={2}
                />
              </TouchableOpacity>

              {/* 0 Button */}
              <TouchableOpacity
                onPress={() => handleNumberPress('0')}
                className="flex-1 items-center rounded-full bg-grey-alpha-150 py-5"
                activeOpacity={0.7}
              >
                <Text className="text-2xl font-semibold text-grey-alpha-500">
                  0
                </Text>
              </TouchableOpacity>

              {/* Submit Button */}
              <TouchableOpacity
                onPress={handleSubmit}
                className={`flex-1 items-center rounded-full py-5 ${
                  passcode.length === passcodeLength
                    ? 'bg-grey-alpha-500'
                    : 'bg-grey-alpha-150'
                }`}
                activeOpacity={0.7}
                disabled={passcode.length !== passcodeLength}
              >
                <Check
                  size={24}
                  color={
                    passcode.length === passcodeLength
                      ? '#FFFFFF'
                      : colors['grey-alpha']['300']
                  }
                  strokeWidth={2.5}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </BottomSheetComponent>
    );
  }
);

PasscodeBottomSheet.displayName = 'PasscodeBottomSheet';
