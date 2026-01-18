import { Text, TouchableOpacity, View } from 'react-native';
import { Image, ImageSource } from 'expo-image';
import { ChevronDown } from 'lucide-react-native';
import { colors } from '@/theme/colors';

type RequestMethodSelectorProps = {
  selectedCount: number;
  userAvatar?: ImageSource;
  onPress: () => void;
};

export function RequestMethodSelector({
  selectedCount,
  userAvatar,
  onPress,
}: RequestMethodSelectorProps) {
  const defaultAvatar = require('../../assets/images/welcome/collage-1.jpg');

  return (
    <View className="flex-row items-center gap-3 px-2">
      {/* User Avatar */}
      <Image
        source={userAvatar || defaultAvatar}
        style={{ width: 48, height: 48, borderRadius: 24 }}
        contentFit="cover"
      />

      {/* Dropdown Button */}
      <TouchableOpacity
        onPress={onPress}
        className="flex-row items-center justify-between gap-2 rounded-full border-2 border-primary px-4 py-1.5"
        accessibilityRole="button"
        accessibilityLabel={`Request via chat, ${selectedCount} contacts selected`}
      >
        <Text className="text-sm font-inter-semibold text-primary">
          Request via chat ({selectedCount})
        </Text>
        <ChevronDown
          size={20}
          color={colors.primary.purple}
          strokeWidth={2.5}
        />
      </TouchableOpacity>
    </View>
  );
}
