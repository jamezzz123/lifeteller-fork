import {
  Text,
  TouchableOpacity,
  View,
  ImageSourcePropType,
} from 'react-native';
import { Image } from 'expo-image';
import { ChevronDown } from 'lucide-react-native';
import { colors } from '@/theme/colors';

type RequestMethodSelectorProps = {
  selectedCount: number;
  userAvatar?: ImageSourcePropType;
  onPress: () => void;
};

export function RequestMethodSelector({
  selectedCount,
  userAvatar,
  onPress,
}: RequestMethodSelectorProps) {
  const defaultAvatar = require('../../assets/images/welcome/collage-1.jpg');

  return (
    <View className="flex-row items-center gap-3 px-4">
      {/* User Avatar */}
      <Image
        source={userAvatar || defaultAvatar}
        className="size-12 rounded-full"
        contentFit="cover"
        transition={150}
      />

      {/* Dropdown Button */}
      <TouchableOpacity
        onPress={onPress}
        className="flex-row items-center justify-between gap-2 rounded-full border-2 border-primary px-4 py-2.5"
        accessibilityRole="button"
        accessibilityLabel={`Request via chat, ${selectedCount} contacts selected`}
      >
        <Text className="text-sm font-semibold text-primary">
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
