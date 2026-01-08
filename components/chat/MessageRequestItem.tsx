import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { BadgeCheck } from 'lucide-react-native';
import { Avatar } from '@/components/ui/Avatar';
import { colors } from '@/theme/colors';

export interface MessageRequest {
  id: string;
  contactId: string;
  contactName: string;
  contactUsername: string;
  contactAvatar?: string;
  isVerified?: boolean;
  previewMessage: string;
  timestamp: string;
}

interface MessageRequestItemProps {
  request: MessageRequest;
  onPress: (request: MessageRequest) => void;
}

export function MessageRequestItem({
  request,
  onPress,
}: MessageRequestItemProps) {
  return (
    <TouchableOpacity
      onPress={() => onPress(request)}
      className="flex-row items-start border-b border-grey-plain-150 bg-white px-4 py-3"
      activeOpacity={0.7}
    >
      {/* Avatar */}
      <View className="relative mr-3">
        <View
          className="rounded-full border-2"
          style={{
            borderColor: colors.primary.purple,
            padding: 2,
          }}
        >
          <Avatar
            profileImage={request.contactAvatar}
            name={request.contactName}
            size={48}
            showBadge={true}
          />
        </View>
      </View>

      {/* Message Content */}
      <View className="flex-1">
        {/* Header Row */}
        <View className="mb-1 flex-row items-center justify-between">
          <View className="flex-1 flex-row items-center gap-1.5">
            <Text className="text-base font-semibold text-grey-alpha-500">
              {request.contactName}
            </Text>
            {request.isVerified && (
              <BadgeCheck color={colors.primary.purple} size={16} />
            )}
            <Text className="text-sm text-grey-plain-550">
              @{request.contactUsername}
            </Text>
          </View>
          <Text className="text-xs text-grey-plain-550">
            {request.timestamp}
          </Text>
        </View>

        {/* Preview Message */}
        <Text
          className="text-sm text-grey-plain-550"
          numberOfLines={2}
        >
          {request.previewMessage}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

