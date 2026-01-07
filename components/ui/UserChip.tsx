import { Text, TouchableOpacity, View } from 'react-native';
import { Image } from 'expo-image';
import { X } from 'lucide-react-native';

import { colors } from '@/theme/colors';
import { User } from '@/hooks/useUser';

type UserChipProps = {
  user: User;
  onRemove: (id: string) => void;
};

export function UserChip({ user, onRemove }: UserChipProps) {
  return (
    <View className="flex-row items-center gap-2 rounded-full border border-grey-plain-450 bg-grey-plain-50 px-3 py-2">
      <Image
        source={user.profileImage}
        style={{ width: 32, height: 32, borderRadius: 16 }}
        contentFit="cover"
      />
      <Text className="text-sm font-medium text-grey-alpha-500">
        {user.fullName}
      </Text>
      <TouchableOpacity
        onPress={() => onRemove(user.id)}
        accessibilityLabel={`Remove ${user.fullName}`}
        hitSlop={10}
      >
        <X size={16} color={colors['grey-alpha']['400']} strokeWidth={2.5} />
      </TouchableOpacity>
    </View>
  );
}
