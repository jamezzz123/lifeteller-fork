import React from 'react';
import { View, Text } from 'react-native';
import { Image } from 'expo-image';
import { BadgeCheck, Medal } from 'lucide-react-native';
import { colors } from '@/theme/colors';
import { formatAmount } from '@/utils/formatAmount';

export interface Contributor {
  id: string;
  username: string;
  handle: string;
  timestamp: string;
  profileImage: string;
  amount: number;
}

interface RaiseLiftListProps {
  contributors: Contributor[];
  showDividers?: boolean;
}

export function RaiseLiftList({
  contributors,
  showDividers = true,
}: RaiseLiftListProps) {
  return (
    <View>
      {contributors.map((contributor, index) => {
        const formattedAmount = formatAmount(contributor.amount);
        const isLastItem = index === contributors.length - 1;

        return (
          <View
            key={contributor.id}
            className={`flex-row items-center gap-3 py-4 ${
              showDividers && !isLastItem
                ? 'border-b border-grey-plain-150'
                : ''
            }`}
          >
            {/* Profile Picture with Badge */}
            <View className="relative h-10 w-10">
              <View className="h-10 w-10 overflow-hidden rounded-full bg-grey-plain-300">
                <Image
                  source={{ uri: contributor.profileImage }}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                  }}
                  contentFit="cover"
                />
              </View>
              {/* Badge Overlay */}
              <View
                className="absolute -bottom-0.5 right-0 h-4 w-4 items-center justify-center rounded-full border-2 border-white"
                style={{
                  backgroundColor: colors['primary-tints'].purple['100'],
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Medal
                  color={colors.primary.purple}
                  size={10}
                  style={{ alignSelf: 'center' }}
                />
              </View>
            </View>

            {/* User Info */}
            <View className="flex-1">
              <View className="mb-0.5 flex-row items-center gap-1.5">
                <Text className="text-[14px] font-semibold text-grey-alpha-500">
                  {contributor.username}
                </Text>
                <BadgeCheck color={colors.primary.purple} size={14} />
              </View>
              <View className="flex-row items-center gap-1">
                <Text className="text-[12px] text-grey-plain-550">
                  @{contributor.handle}
                </Text>
                <View className="h-1 w-1 rounded-full bg-grey-plain-550" />
                <Text className="text-[12px] text-grey-plain-550">
                  {contributor.timestamp}
                </Text>
              </View>
            </View>

            {/* Amount */}
            <View className="rounded-full bg-grey-plain-150 px-3 py-1.5">
              <Text className="text-[14px] font-semibold text-grey-alpha-500">
                {formattedAmount}
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}
