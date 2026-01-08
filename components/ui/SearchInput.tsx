import React from 'react';
import { View, TextInput as RNTextInput } from 'react-native';
import { Search } from 'lucide-react-native';
import { colors } from '@/theme/colors';

export interface SearchInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  className?: string;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
}

export function SearchInput({
  value,
  onChangeText,
  placeholder = 'Search by username or name of user',
  className = '',
  autoCapitalize = 'none',
}: SearchInputProps) {
  return (
    <View className={`mx-4 mt-4 border-b border-grey-plain-300 pb-3 ${className}`}>
      <View className="flex-row items-center gap-3">
        <Search
          size={20}
          color={colors['grey-alpha']['400']}
          strokeWidth={2}
        />
        <RNTextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors['grey-alpha']['400']}
          className="flex-1 text-base text-grey-alpha-500"
          style={{ fontSize: 16 }}
          autoCapitalize={autoCapitalize}
        />
      </View>
    </View>
  );
}

