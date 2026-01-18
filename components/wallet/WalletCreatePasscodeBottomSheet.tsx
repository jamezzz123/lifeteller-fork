import { forwardRef, useState, useEffect } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { Check, Delete } from 'lucide-react-native';

import {
  BottomSheetComponent,
  BottomSheetRef,
} from '@/components/ui/BottomSheet';
import { colors } from '@/theme/colors';

type WalletCreatePasscodeBottomSheetProps = {
  onComplete: (passcode: string) => void;
  onClose?: () => void;
};

export const WalletCreatePasscodeBottomSheet = forwardRef<
  BottomSheetRef,
  WalletCreatePasscodeBottomSheetProps
>(({ onComplete, onClose }, ref) => {
  const passcodeLength = 6;
  const [passcode, setPasscode] = useState('');
  const [confirmPasscode, setConfirmPasscode] = useState('');
  const [isConfirming, setIsConfirming] = useState(false);
  const [error, setError] = useState('');

  // Reset when sheet opens
  useEffect(() => {
    setPasscode('');
    setConfirmPasscode('');
    setIsConfirming(false);
    setError('');
  }, []);

  const handleNumberPress = (num: string) => {
    if (isConfirming) {
      if (confirmPasscode.length < passcodeLength) {
        const newConfirmPasscode = confirmPasscode + num;
        setConfirmPasscode(newConfirmPasscode);
        setError('');
      }
    } else {
      if (passcode.length < passcodeLength) {
        const newPasscode = passcode + num;
        setPasscode(newPasscode);
      }
    }
  };

  const handleDelete = () => {
    if (isConfirming) {
      if (confirmPasscode.length > 0) {
        setConfirmPasscode(confirmPasscode.slice(0, -1));
        setError('');
      } else {
        // Go back to first passcode if confirm is empty
        setIsConfirming(false);
      }
    } else {
      if (passcode.length > 0) {
        setPasscode(passcode.slice(0, -1));
      }
    }
  };

  const handleSubmit = () => {
    if (isConfirming) {
      if (confirmPasscode.length === passcodeLength) {
        if (confirmPasscode === passcode) {
          onComplete(passcode);
        } else {
          setError('Passcodes do not match');
          setTimeout(() => {
            setConfirmPasscode('');
          }, 500);
        }
      }
    } else {
      if (passcode.length === passcodeLength) {
        setIsConfirming(true);
      }
    }
  };

  const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
  const currentPasscode = isConfirming ? confirmPasscode : passcode;
  const isComplete = currentPasscode.length === passcodeLength;

  return (
    <BottomSheetComponent ref={ref} snapPoints={['90%']} onClose={onClose}>
      <View className="px-6 pb-6">
        {/* Title */}
        <Text className="mb-6 text-center text-lg font-semibold text-grey-alpha-500">
          {isConfirming ? 'Enter your passcode again' : 'Create your passcode'}
        </Text>

        {/* First Passcode Field */}
        {!isConfirming && (
          <View className="mb-4">
            <View className="mb-2 flex-row items-center justify-center gap-3 rounded-full bg-grey-alpha-150 px-8 py-4">
              {Array.from({ length: passcodeLength }).map((_, index) => (
                <View
                  key={index}
                  className={`size-4 rounded-full ${
                    index < passcode.length
                      ? 'bg-primary'
                      : 'bg-grey-alpha-250'
                  }`}
                />
              ))}
            </View>
          </View>
        )}

        {/* Second Passcode Field (Confirmation) */}
        {isConfirming && (
          <View className="mb-4">
            {/* First passcode - all filled */}
            <View className="mb-3 flex-row items-center justify-center gap-3 rounded-full bg-grey-alpha-150 px-8 py-4">
              {Array.from({ length: passcodeLength }).map((_, index) => (
                <View
                  key={index}
                  className="size-4 rounded-full bg-primary"
                />
              ))}
            </View>

            {/* Confirm passcode - partially filled */}
            <View
              className={`flex-row items-center justify-center gap-3 rounded-full px-8 py-4 ${
                error ? 'bg-red-50' : 'bg-grey-alpha-150'
              }`}
            >
              {Array.from({ length: passcodeLength }).map((_, index) => (
                <View
                  key={index}
                  className={`size-4 rounded-full ${
                    index < confirmPasscode.length
                      ? error
                        ? 'bg-red-500'
                        : 'bg-primary'
                      : 'bg-grey-alpha-250'
                  }`}
                />
              ))}
            </View>

            {/* Error Message */}
            {error && (
              <Text className="mt-2 text-center text-sm text-red-500">
                {error}
              </Text>
            )}
          </View>
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
              disabled={currentPasscode.length === 0}
            >
              <Delete
                size={24}
                color={
                  currentPasscode.length === 0
                    ? colors['grey-alpha']['250']
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
                isComplete
                  ? 'bg-grey-alpha-500'
                  : 'bg-grey-alpha-150'
              }`}
              activeOpacity={0.7}
              disabled={!isComplete}
            >
              <Check
                size={24}
                color={
                  isComplete ? '#FFFFFF' : colors['grey-alpha']['250']
                }
                strokeWidth={2.5}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </BottomSheetComponent>
  );
});

WalletCreatePasscodeBottomSheet.displayName = 'WalletCreatePasscodeBottomSheet';

