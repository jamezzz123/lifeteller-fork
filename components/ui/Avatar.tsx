import React from 'react';
import { View, Text } from 'react-native';
import { Image } from 'expo-image';
import { Medal } from 'lucide-react-native';
import { colors } from '@/theme/colors';

interface AvatarProps {
  profileImage?: string;
  name?: string;
  size?: number;
  showBadge?: boolean;
  className?: string;
}

export function Avatar({
  profileImage,
  name = '',
  size = 48,
  showBadge = true,
  className = '',
}: AvatarProps) {
  // Get initials from name
  const getInitials = (name: string): string => {
    if (!name.trim()) return '';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const initials = getInitials(name);
  const badgeSize =
    size === 48 ? 20 : size === 40 ? 16 : Math.round(size * 0.42);
  const medalIconSize =
    size === 48 ? 12 : size === 40 ? 10 : Math.round(size * 0.25);
  const borderRadius = size / 2;

  return (
    <View
      className={`relative ${className}`}
      style={{ width: size, height: size }}
    >
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
      {/* Badge Overlay */}
      {showBadge && (
        <View
          className="absolute -bottom-0.5 left-3 h-5 w-5 items-center justify-center rounded-full border-2 border-white"
          style={{
            width: badgeSize,
            height: badgeSize,
            backgroundColor: colors['primary-tints'].purple['100'],
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
}
