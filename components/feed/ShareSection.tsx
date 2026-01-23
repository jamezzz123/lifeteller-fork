import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { colors } from '@/theme/colors';
import { useAuth } from '@/context/auth';
import { getInitials, getFullName } from '@/utils/user';

export function ShareSection() {
  const { user } = useAuth();

  const handlePress = () => {
    router.push('/share-uplifting-words');
  };

  // Get user's full name and initials
  const fullName = user ? getFullName(user.first_name, user.last_name) : '';
  const initials = getInitials(fullName);
  const avatarUrl = user?.avatar_url;

  return (
    <View className="flex-row items-center gap-3 border-b border-grey-plain-300 bg-grey-plain-50  px-4 py-4">
      {/* User Avatar */}
      <TouchableOpacity className="h-10 w-10">
        <View className="size-10 overflow-hidden rounded-full bg-grey-plain-300">
          {avatarUrl ? (
            <Image
              source={{ uri: avatarUrl }}
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
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
                  fontSize: 16,
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
      </TouchableOpacity>

      {/* Text Input Placeholder */}
      <TouchableOpacity
        className="flex-1 rounded-full border border-grey-plain-300 bg-grey-plain-100 px-4 py-2.5"
        onPress={handlePress}
        activeOpacity={0.7}
      >
        <Text
          className="text-[14px] text-grey-plain-550"
          style={{ color: colors['grey-plain']['400'] }}
        >
          Share some uplifting words...
        </Text>
      </TouchableOpacity>
    </View>
  );
}
