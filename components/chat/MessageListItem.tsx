import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import {
  BadgeCheck,
  HandHelping,
  ArrowRightLeft,
  Medal,
} from 'lucide-react-native';
import { Avatar } from '@/components/ui/Avatar';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { colors } from '@/theme/colors';
import { formatAmount } from '@/utils/formatAmount';

export interface Message {
  id: string;
  type: 'direct' | 'group' | 'lift-request' | 'lift-offer';
  contactId?: string;
  contactName?: string;
  contactUsername?: string;
  contactAvatar?: string;
  isVerified?: boolean;
  isOnline?: boolean;
  hasStories?: boolean;
  groupName?: string;
  groupMembers?: { id: string; avatar?: string }[];
  lastMessage?: string;
  timestamp: string;
  unreadCount?: number;
  // Lift-specific fields
  liftTitle?: string;
  liftAmount?: number;
  liftStatus?: 'pending' | 'accepted' | 'declined' | 'completed';
}

interface MessageListItemProps {
  message: Message;
  onPress: (message: Message) => void;
}

export function MessageListItem({ message, onPress }: MessageListItemProps) {
  const isGroup = message.type === 'group';
  const isLiftRequest = message.type === 'lift-request';
  const isLiftOffer = message.type === 'lift-offer';
  const hasUnread = (message.unreadCount || 0) > 0;

  const getStatusType = (): 'pending' | 'offered' | 'accepted' | 'declined' => {
    switch (message.liftStatus) {
      case 'accepted':
      case 'completed':
        return 'accepted';
      case 'declined':
        return 'declined';
      case 'pending':
      default:
        return 'pending';
    }
  };

  return (
    <TouchableOpacity
      onPress={() => onPress(message)}
      className="flex-row items-start border-b border-grey-plain-150 bg-white px-4 py-3"
      activeOpacity={0.7}
    >
      {/* Avatar */}
      <View className="relative mr-3">
        {isGroup ? (
          <View
            className="relative overflow-hidden rounded-full border-2"
            style={{
              width: 56,
              height: 56,
              borderColor: colors.primary.purple,
              backgroundColor: colors['grey-plain']['300'],
            }}
          >
            {message.groupMembers && message.groupMembers.length > 0 ? (
              <>
                {/* Top Left */}
                {message.groupMembers[0] && (
                  <View
                    className="absolute overflow-hidden"
                    style={{
                      left: 0,
                      top: 0,
                      width: 28,
                      height: 28,
                      borderTopLeftRadius: 28,
                    }}
                  >
                    <Image
                      source={{ uri: message.groupMembers[0].avatar || '' }}
                      style={{ width: 28, height: 28 }}
                      contentFit="cover"
                    />
                  </View>
                )}
                {/* Top Right */}
                {message.groupMembers[1] && (
                  <View
                    className="absolute overflow-hidden"
                    style={{
                      right: 0,
                      top: 0,
                      width: 28,
                      height: 28,
                      borderTopRightRadius: 28,
                    }}
                  >
                    <Image
                      source={{ uri: message.groupMembers[1].avatar || '' }}
                      style={{ width: 28, height: 28 }}
                      contentFit="cover"
                    />
                  </View>
                )}
                {/* Bottom Left */}
                {message.groupMembers[2] && (
                  <View
                    className="absolute overflow-hidden"
                    style={{
                      left: 0,
                      bottom: 0,
                      width: 28,
                      height: 28,
                      borderBottomLeftRadius: 28,
                    }}
                  >
                    <Image
                      source={{ uri: message.groupMembers[2].avatar || '' }}
                      style={{ width: 28, height: 28 }}
                      contentFit="cover"
                    />
                  </View>
                )}
                {/* Bottom Right */}
                {message.groupMembers[3] && (
                  <View
                    className="absolute overflow-hidden"
                    style={{
                      right: 0,
                      bottom: 0,
                      width: 28,
                      height: 28,
                      borderBottomRightRadius: 28,
                    }}
                  >
                    <Image
                      source={{ uri: message.groupMembers[3].avatar || '' }}
                      style={{ width: 28, height: 28 }}
                      contentFit="cover"
                    />
                  </View>
                )}
              </>
            ) : (
              <View
                className="h-full w-full items-center justify-center"
                style={{
                  backgroundColor: colors['grey-plain']['300'],
                }}
              >
                <Text
                  className="text-xs font-bold"
                  style={{ color: colors['grey-plain']['550'] }}
                >
                  G
                </Text>
              </View>
            )}
          </View>
        ) : (
          <View className="relative">
            {message.hasStories ? (
              <>
                <LinearGradient
                  colors={['#7538BA', '#CF2586']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.gradientBorder}
                >
                  <View style={styles.innerCircle}>
                    <Avatar
                      profileImage={message.contactAvatar}
                      name={message.contactName || ''}
                      size={44}
                      showBadge={false}
                    />
                  </View>
                </LinearGradient>
                {/* Medal Badge with "1" at bottom center */}
                <View
                  className="absolute items-center justify-center rounded-full border-2 border-white"
                  style={{
                    width: 20,
                    height: 20,
                    backgroundColor: colors['primary-tints'].purple['100'],
                    bottom: -2,
                    left: '50%',
                    transform: [{ translateX: -10 }],
                  }}
                >
                  <View
                    className="relative items-center justify-center"
                    style={{ width: 14, height: 14 }}
                  >
                    <Medal
                      color={colors.primary.purple}
                      size={14}
                      strokeWidth={1.5}
                      fill="none"
                    />
                    <Text
                      className="absolute text-[7px] font-bold"
                      style={{
                        color: colors.primary.purple,
                        top: 2.5,
                      }}
                    >
                      1
                    </Text>
                  </View>
                </View>
              </>
            ) : (
              <View
                className="rounded-full border-2"
                style={{
                  borderColor: colors.primary.purple,
                  padding: 2,
                }}
              >
                <Avatar
                  profileImage={message.contactAvatar}
                  name={message.contactName || ''}
                  size={48}
                  showBadge={true}
                />
              </View>
            )}
            {/* Online Status Dot - Upper Right */}
            {message.isOnline && (
              <View
                className="absolute rounded-full"
                style={{
                  width: 12,
                  height: 12,
                  backgroundColor: colors.state.green,
                  top: -2,
                  right: -2,
                }}
              />
            )}
          </View>
        )}
      </View>

      {/* Message Content */}
      <View className="flex-1">
        {/* Header Row */}
        <View className="mb-1 flex-row items-center justify-between">
          <View className="flex-1 flex-row items-center gap-1.5">
            {isGroup ? (
              <Text className="flex-1 text-base font-semibold text-grey-alpha-500">
                {message.groupName || 'Group Chat'}
              </Text>
            ) : (
              <>
                <Text className="text-base font-semibold text-grey-alpha-500">
                  {message.contactName}
                </Text>
                {message.isVerified && (
                  <BadgeCheck color={colors.primary.purple} size={16} />
                )}
                <Text className="text-sm text-grey-plain-550">
                  @{message.contactUsername}
                </Text>
              </>
            )}
          </View>
          <Text className="text-xs text-grey-plain-550">{message.timestamp}</Text>
        </View>

        {/* Last Message Preview (shown for all types) */}
        {message.lastMessage && (
          <Text
            className="mb-2 text-sm text-grey-plain-550"
            numberOfLines={1}
          >
            {message.lastMessage}
          </Text>
        )}

        {/* Lift Card (shown below message preview for lift messages) */}
        {(isLiftRequest || isLiftOffer) && (
          <View
            className="rounded-xl bg-white border border-grey-plain-300 px-3 py-2.5"
          >
            <View className="mb-1.5 flex-row items-center gap-2">
              {isLiftRequest ? (
                <HandHelping
                  color={colors.primary.purple}
                  size={16}
                  strokeWidth={2}
                />
              ) : (
                <ArrowRightLeft
                  color={colors.primary.purple}
                  size={16}
                  strokeWidth={2}
                />
              )}
              <Text className="text-sm font-semibold text-grey-alpha-500">
                {isLiftRequest ? 'Lift request' : 'Lift offer'}
              </Text>
            </View>
            {message.liftTitle && (
              <Text className="mb-1.5 text-base font-semibold text-grey-alpha-500">
                {message.liftTitle}
              </Text>
            )}
            <View className="flex-row items-center justify-between">
              {message.liftAmount && (
                <Text className="text-sm font-semibold text-grey-alpha-500">
                  {formatAmount(message.liftAmount)}
                </Text>
              )}
              <StatusBadge status={getStatusType()} size="small" />
            </View>
          </View>
        )}
      </View>

      {/* Unread Badge */}
      {hasUnread && (
        <View className="ml-2 items-center justify-center">
          <View
            className="items-center justify-center rounded-full"
            style={{
              minWidth: 24,
              height: 24,
              paddingHorizontal: 8,
              backgroundColor: colors.primary.purple,
            }}
          >
            <Text className="text-xs font-bold text-white">
              {message.unreadCount}
            </Text>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  gradientBorder: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 2,
  },
  innerCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: colors['grey-plain']['50'],
    borderWidth: 2,
    borderColor: colors['grey-plain']['50'],
  },
});

