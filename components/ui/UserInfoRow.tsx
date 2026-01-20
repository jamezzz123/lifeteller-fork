import { View, Text } from 'react-native';
import { Image, ImageSource } from 'expo-image';
import { BadgeCheck } from 'lucide-react-native';

import { colors } from '@/theme/colors';

export interface UserDisplayInfo {
  id: string;
  fullName: string;
  handle: string;
  profileImage: ImageSource | string;
  isVerified?: boolean;
}

interface UserInfoRowProps {
  user: UserDisplayInfo;
  avatarSize?: number;
}

export function UserInfoRow({ user, avatarSize = 40 }: UserInfoRowProps) {
  return (
    <View className="flex-row items-center gap-3">
      <View
        className="overflow-hidden rounded-full bg-grey-plain-300"
        style={{ width: avatarSize, height: avatarSize }}
      >
        <Image
          source={user.profileImage}
          style={{ width: avatarSize, height: avatarSize }}
          contentFit="cover"
        />
      </View>
      <View>
        <View className="flex-row items-center gap-1">
          <Text className="font-inter-semibold text-[15px] text-grey-alpha-500">
            {user.fullName}
          </Text>
          {user.isVerified && (
            <BadgeCheck
              color={colors.primary.purple}
              size={16}
              fill={colors.primary.purple}
              stroke="white"
            />
          )}
        </View>
        <Text className="font-inter text-[13px] text-grey-plain-550">
          @{user.handle}
        </Text>
      </View>
    </View>
  );
}
