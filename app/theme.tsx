import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { CornerUpLeft } from 'lucide-react-native';
import { SvgProps } from 'react-native-svg';
import LightThemePreview from '@/assets/images/theme/light.svg';
import SystemThemePreview from '@/assets/images/theme/system.svg';
import DarkThemePreview from '@/assets/images/theme/dark.svg';
import { colors } from '@/theme/colors';

type ThemeOption = 'light' | 'system' | 'dark';

interface ThemeCardProps {
  preview: React.ComponentType<SvgProps>;
  label: string;
  checked: boolean;
  onPress: () => void;
}

function ThemeCard({
  preview: Preview,
  label,
  checked,
  onPress,
}: ThemeCardProps) {
  const { width } = Dimensions.get('window');
  const cardWidth = (width - 64) / 3; // 3 cards with margins
  const previewSize = cardWidth - 24; // Account for padding

  return (
    <TouchableOpacity
      onPress={onPress}
      className="items-center"
      activeOpacity={0.7}
      style={{ width: cardWidth }}
    >
      <View
        className="rounded-xl"
        style={{
          borderWidth: 2,
          borderColor: checked
            ? colors.primary.purple
            : colors['grey-plain']['300'],
          padding: 12,
          backgroundColor: colors['grey-plain']['50'],
        }}
      >
        <Preview width={previewSize} height={previewSize * 0.96} />
      </View>
      <Text className="mt-3 text-sm font-semibold text-grey-alpha-500">
        {label}
      </Text>
      <View className="mt-2 items-center">
        <View
          className="size-5 items-center justify-center rounded-full border-2"
          style={{
            borderColor: checked
              ? colors.primary.purple
              : colors['grey-plain']['300'],
          }}
        >
          {checked && (
            <View
              className="size-2.5 rounded-full"
              style={{ backgroundColor: colors.primary.purple }}
            />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function ThemeScreen() {
  const [selectedTheme, setSelectedTheme] = useState<ThemeOption>('light');

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'bottom']}>
      {/* Header */}
      <View className="flex-row items-center border-b border-grey-plain-150 bg-white px-4 py-3">
        <TouchableOpacity onPress={() => router.back()} className="mr-3">
          <CornerUpLeft
            color={colors['grey-plain']['550']}
            size={24}
            strokeWidth={2}
          />
        </TouchableOpacity>
        <Text className="text-lg font-semibold text-grey-alpha-500">Theme</Text>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        <View className="flex-row justify-between px-4 pt-8">
          <ThemeCard
            preview={LightThemePreview}
            label="Light"
            checked={selectedTheme === 'light'}
            onPress={() => setSelectedTheme('light')}
          />
          <ThemeCard
            preview={SystemThemePreview}
            label="System"
            checked={selectedTheme === 'system'}
            onPress={() => setSelectedTheme('system')}
          />
          <ThemeCard
            preview={DarkThemePreview}
            label="Dark"
            checked={selectedTheme === 'dark'}
            onPress={() => setSelectedTheme('dark')}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
