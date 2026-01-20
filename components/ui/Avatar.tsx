import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Medal } from 'lucide-react-native';
import { colors } from '@/theme/colors';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { getInitials } from '@/utils/user';

interface AvatarProps {
  profileImage?: string;
  name?: string;
  size?: number;
  showBadge?: boolean;
  showRing?: boolean;
  className?: string;
  userId?: string;
  onPress?: () => void;
}

export function Avatar({
  profileImage,
  name = '',
  size = 48,
  showBadge = true,
  showRing = false,
  className = '',
  userId,
  onPress,
}: AvatarProps) {
  const initials = getInitials(name);
  const ringPadding = 2;
  const innerBorderWidth = 2;
  const ringContentSize = size - ringPadding * 2;
  const imageSize = showRing
    ? ringContentSize - innerBorderWidth * 2
    : size;
  const badgeSize =
    size === 48 ? 20 : size === 40 ? 16 : Math.round(size * 0.42);
  const medalIconSize =
    size === 48 ? 12 : size === 40 ? 10 : Math.round(size * 0.25);
  const borderRadius = size / 2;

  const handlePress = () => {
    if (userId) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      router.push(`/user/${userId}` as any);
    }
    onPress?.();
  };

  function renderAvatarContent() {
    if (showRing) {
      return (
        <LinearGradient
          colors={['#7538BA', '#CF2586']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            width: size,
            height: size,
            borderRadius,
            alignItems: 'center',
            justifyContent: 'center',
            padding: ringPadding,
          }}
        >
          <View
            style={{
              width: ringContentSize,
              height: ringContentSize,
              borderRadius: ringContentSize / 2,
              overflow: 'hidden',
              backgroundColor: colors['grey-plain']['50'],
              borderWidth: innerBorderWidth,
              borderColor: colors['grey-plain']['50'],
            }}
          >
            {profileImage ? (
              <Image
                source={{ uri: profileImage }}
                style={{
                  width: imageSize,
                  height: imageSize,
                  borderRadius: imageSize / 2,
                }}
                contentFit="cover"
              />
            ) : initials ? (
              <View
                style={{
                  width: imageSize,
                  height: imageSize,
                  borderRadius: imageSize / 2,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: colors['primary-tints'].purple['100'],
                }}
              >
                <Text
                  style={{
                    fontSize: imageSize * 0.4,
                    fontWeight: 'bold',
                    color: colors.primary.purple,
                  }}
                >
                  {initials}
                </Text>
              </View>
            ) : (
              <View
                style={{
                  width: imageSize,
                  height: imageSize,
                  borderRadius: imageSize / 2,
                  backgroundColor: colors['grey-plain']['450'],
                }}
              />
            )}
          </View>
        </LinearGradient>
      );
    }

    return (
      <View
        className="overflow-hidden rounded-full"
        style={{
          width: size,
          height: size,
          borderRadius,
          backgroundColor: colors['grey-plain']['300'],
        }}
      >
        {profileImage ? (
          <Image
            source={{ uri: profileImage }}
            style={{
              width: size,
              height: size,
              borderRadius,
            }}
            contentFit="cover"
          />
        ) : initials ? (
          <View
            className="h-full w-full items-center justify-center"
            style={{
              backgroundColor: colors['primary-tints'].purple['100'],
            }}
          >
            <Text
              style={{
                fontSize: size * 0.4,
                fontWeight: 'bold',
                color: colors.primary.purple,
              }}
            >
              {initials}
            </Text>
          </View>
        ) : (
          <View
            className="h-full w-full"
            style={{ backgroundColor: colors['grey-plain']['450'] }}
          />
        )}
      </View>
    );
  }

  const AvatarContent = (
    <View
      className={`relative ${className}`}
      style={{ width: size, height: size, overflow: 'visible' }}
    >
      {renderAvatarContent()}
      {/* Badge Overlay */}
      {showBadge && (
        <View
          className="absolute items-center justify-center rounded-full border-2 border-white"
          style={{
            width: badgeSize,
            height: badgeSize,
            backgroundColor: colors['primary-tints'].purple['100'],
            bottom: -15,
            left: '50%',
            transform: [{ translateX: -badgeSize / 2 }],
          }}
        >
          <Medal
            color={colors.primary.purple}
            size={medalIconSize}
            style={{ alignSelf: 'center' }}
          />
        </View>
      )}
    </View>
  );

  if (userId || onPress) {
    return (
      <TouchableOpacity
        onPress={handlePress}
        disabled={!userId && !onPress}
        activeOpacity={0.7}
      >
        {AvatarContent}
      </TouchableOpacity>
    );
  }

  return AvatarContent;
}
