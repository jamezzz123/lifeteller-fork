import React from 'react';
import { View, Text } from 'react-native';
import { Image } from 'expo-image';
import { BadgeCheck } from 'lucide-react-native';
import { colors } from '@/theme/colors';

interface UserHeaderProps {
  name: string;
  handle: string;
  timestamp: string;
  profileImage: string;
  verified?: boolean;
}

export function UserHeader({
  name,
  handle,
  timestamp,
  profileImage,
  verified = false,
}: UserHeaderProps) {
  return (
    <View className="mb-3 flex-row items-center gap-3 py-4">
      <View className="h-10 w-10 overflow-hidden rounded-full bg-grey-plain-300">
        <Image
          source={{ uri: profileImage }}
          style={{ width: 40, height: 40 }}
          contentFit="cover"
        />
      </View>
      <View className="flex-1">
        <View className="flex-row items-center gap-1">
          <Text className="text-[15px] font-semibold text-grey-alpha-500">
            {name}
          </Text>
          {verified && <BadgeCheck color={colors.primary.purple} size={16} />}
        </View>
        <View className="flex-row items-center gap-1">
          <Text className="text-[13px] text-grey-plain-550">@{handle}</Text>
          <View className="h-1 w-1 rounded-full bg-grey-plain-550" />
          <Text className="text-[13px] text-grey-plain-550">{timestamp}</Text>
        </View>
      </View>
    </View>
  );
}
