import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { BadgeCheck } from 'lucide-react-native';
import { colors } from '@/theme/colors';
import { formatAmount } from '@/utils/formatAmount';
import { Avatar } from '../ui/Avatar';

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
  onPress?: (contributor: Contributor) => void;
}

export function RaiseLiftList({
  contributors,
  showDividers = true,
  onPress,
}: RaiseLiftListProps) {
  return (
    <View>
      {contributors.map((contributor, index) => {
        const formattedAmount = formatAmount(contributor.amount);
        const isLastItem = index === contributors.length - 1;

        return (
          <TouchableOpacity
            key={contributor.id}
            onPress={() => onPress?.(contributor)}
            className={`flex-row items-center gap-3 py-4 ${
              showDividers && !isLastItem
                ? 'border-b border-grey-plain-150'
                : ''
            }`}
          >
            {/* Profile Picture with Badge */}
            <View className="relative h-10 w-10">
              <Avatar size={40} profileImage={contributor.profileImage} />
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
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
