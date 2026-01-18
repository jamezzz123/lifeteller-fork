import React from 'react';
import { View, Text } from 'react-native';
import { calculatePasswordStrength } from '@/utils/password';

interface PasswordStrengthIndicatorProps {
  password: string;
  className?: string;
}

export function PasswordStrengthIndicator({
  password,
  className = '',
}: PasswordStrengthIndicatorProps) {
  const { strength, label, color } = calculatePasswordStrength(password);

  // Don't show if password is empty
  if (!password || password.length === 0) {
    return null;
  }

  return (
    <View className={`mt-2 ${className}`}>
      {/* Strength Bars */}
      <View className="mb-2 flex-row gap-1">
        {[0, 1, 2].map((index) => (
          <View
            key={index}
            className="h-1 flex-1 rounded-full"
            style={{
              backgroundColor:
                index <= strength
                  ? color
                  : '#E5E7EB', // grey-200
            }}
          />
        ))}
      </View>

      {/* Strength Label */}
      {label && (
        <Text
          className="text-sm font-inter-medium text-grey-alpha-500"
          style={{
            color: color,
          }}
        >
          {label} password
        </Text>
      )}
    </View>
  );
}

