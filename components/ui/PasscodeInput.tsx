import React, { useState, useRef, useEffect } from 'react';
import { View, TextInput, Platform } from 'react-native';
import { colors } from '@/theme/colors';

interface PasscodeInputProps {
  value: string;
  onChangeText: (text: string) => void;
  length?: number;
  autoFocus?: boolean;
  onComplete?: (passcode: string) => void;
}

export function PasscodeInput({
  value,
  onChangeText,
  length = 6,
  autoFocus = false,
  onComplete,
}: PasscodeInputProps) {
  const [focusedIndex, setFocusedIndex] = useState<number | null>(
    autoFocus ? 0 : null
  );
  const inputRefs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [autoFocus]);

  useEffect(() => {
    if (value.length === length && onComplete) {
      onComplete(value);
    }
  }, [value, length, onComplete]);

  const handleChangeText = (text: string, index: number) => {
    // Only allow single digit
    if (text.length > 1) return;

    const newValue = value.split('');
    newValue[index] = text;
    const newPasscode = newValue.join('').slice(0, length);
    onChangeText(newPasscode);

    // Auto-focus next input
    if (text && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
      setFocusedIndex(index + 1);
    } else if (text) {
      setFocusedIndex(null);
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    // Handle backspace
    if (e.nativeEvent.key === 'Backspace' && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
      setFocusedIndex(index - 1);
    }
  };

  const handleFocus = (index: number) => {
    setFocusedIndex(index);
  };

  const handleBlur = () => {
    setFocusedIndex(null);
  };

  return (
    <View className="flex-row gap-2">
      {Array.from({ length }).map((_, index) => {
        const digit = value[index] || '';
        const isFocused = focusedIndex === index;
        const hasValue = !!digit;

        return (
          <TextInput
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            value={digit}
            onChangeText={(text) => handleChangeText(text, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
            onFocus={() => handleFocus(index)}
            onBlur={handleBlur}
            keyboardType="number-pad"
            maxLength={1}
            className="flex-1 rounded-lg border-2 bg-white text-xl font-inter-bold"
            style={{
              aspectRatio: 1,
              borderColor:
                hasValue || isFocused
                  ? colors.primary.purple
                  : colors['grey-plain']['300'],
              color: colors.primary.purple,
              textAlign: 'center',
              paddingVertical: 0,
              paddingHorizontal: 0,
              ...(Platform.OS === 'android' && {
                textAlignVertical: 'center',
                includeFontPadding: false,
              }),
            }}
          />
        );
      })}
    </View>
  );
}
