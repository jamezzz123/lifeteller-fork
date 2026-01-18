import React, { useState, useMemo, forwardRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import { Search, ChevronRight } from 'lucide-react-native';
import {
  BottomSheetComponent,
  BottomSheetRef,
} from '@/components/ui/BottomSheet';
import { colors } from '@/theme/colors';

const LANGUAGES = [
  'English',
  'French',
  'Spanish',
  'Portuguese',
  'Chinese',
  'Japanese',
  'German',
  'Italian',
  'Russian',
  'Arabic',
  'Hindi',
  'Korean',
  'Turkish',
  'Dutch',
  'Swedish',
  'Polish',
  'Vietnamese',
  'Thai',
  'Indonesian',
  'Hebrew',
];

interface LanguageBottomSheetProps {
  selectedLanguage: string;
  onSelectLanguage: (language: string) => void;
}

export const LanguageBottomSheet = forwardRef<
  BottomSheetRef,
  LanguageBottomSheetProps
>(({ selectedLanguage, onSelectLanguage }, ref) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLanguages = useMemo(() => {
    if (!searchQuery.trim()) {
      return LANGUAGES;
    }
    const query = searchQuery.toLowerCase();
    return LANGUAGES.filter((lang) => lang.toLowerCase().includes(query));
  }, [searchQuery]);

  return (
    <BottomSheetComponent ref={ref} snapPoints={['70%']}>
      <View className="px-6 pb-4">
        <Text className="mb-4 text-lg font-bold text-grey-alpha-500">
          Choose preferred language
        </Text>

        {/* Search Bar */}
        <View className="mb-4 flex-row items-center gap-3 rounded-full border border-grey-plain-300 bg-white px-4 py-3">
          <Search
            size={20}
            color={colors['grey-alpha']['400']}
            strokeWidth={2}
          />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search for a language"
            placeholderTextColor={colors['grey-alpha']['400']}
            className="flex-1 text-base text-grey-alpha-500"
            style={{ fontSize: 16 }}
          />
        </View>

        {/* Language List */}
        <ScrollView className="max-h-96" showsVerticalScrollIndicator={false}>
          {filteredLanguages.map((language) => {
            const isSelected = language === selectedLanguage;
            return (
              <TouchableOpacity
                key={language}
                onPress={() => onSelectLanguage(language)}
                className="flex-row items-center justify-between border-b border-grey-plain-300/20 py-4"
                activeOpacity={0.7}
              >
                <View className="flex-1 flex-row items-center">
                  {isSelected && (
                    <View
                      className="mr-3 h-full"
                      style={{
                        width: 4,
                        backgroundColor: colors.primary.purple,
                        borderRadius: 2,
                      }}
                    />
                  )}
                  {!isSelected && <View className="mr-3 w-1" />}
                  <Text
                    className="text-base"
                    style={{
                      color: colors['grey-alpha']['500'],
                      fontWeight: isSelected ? '600' : '400',
                    }}
                  >
                    {language}
                  </Text>
                </View>
                <ChevronRight
                  size={20}
                  color={colors['grey-alpha']['400']}
                  strokeWidth={2}
                />
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    </BottomSheetComponent>
  );
});

LanguageBottomSheet.displayName = 'LanguageBottomSheet';
