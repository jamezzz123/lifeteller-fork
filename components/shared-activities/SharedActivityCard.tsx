import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import {
  HandHeart,
  MessageCircleMore,
  Heart,
  Handshake,
} from 'lucide-react-native';
import { colors } from '@/theme/colors';

export interface SharedActivity {
  id: string;
  type: 'supported-lift' | 'conversation' | 'co-raise' | 'liked-post';
  title: string;
  description: string;
  amount?: string;
  messageCount?: number;
  timestamp: string;
}

interface SharedActivityCardProps {
  activity: SharedActivity;
  onPress?: () => void;
}

export function SharedActivityCard({
  activity,
  onPress,
}: SharedActivityCardProps) {
  const getIcon = () => {
    switch (activity.type) {
      case 'supported-lift':
        return <HandHeart color={colors.primary.purple} size={24} />;
      case 'conversation':
        return <MessageCircleMore color={colors.primary.purple} size={24} />;
      case 'co-raise':
        return <Handshake color={colors.primary.purple} size={24} />;
      case 'liked-post':
        return <Heart color={colors.primary.purple} size={24} />;
      default:
        return null;
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      className="rounded-xl border border-grey-plain-300 bg-white p-4"
      activeOpacity={0.7}
    >
      <View className="flex-row gap-3">
        {/* Icon */}
        <View className="mt-1">{getIcon()}</View>

        {/* Content */}
        <View className="flex-1">
          {/* Title */}
          <Text className="mb-2 text-base font-inter-semibold text-grey-alpha-500">
            {activity.title}
          </Text>

          {/* Description */}
          <Text className="mb-2 text-sm leading-5 text-grey-plain-550">
            {activity.description}
          </Text>

          {/* Additional Info (Amount or Message Count) */}
          {(activity.amount || activity.messageCount) && (
            <Text className="mb-2 text-sm font-inter-medium text-grey-alpha-500">
              {activity.amount || `${activity.messageCount} messages`}
            </Text>
          )}

          {/* Timestamp */}
          <Text className="text-xs text-grey-plain-550">
            {activity.timestamp}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
