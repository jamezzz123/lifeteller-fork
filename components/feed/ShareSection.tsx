import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { colors } from '@/theme/colors';
import { useUser } from '@/hooks/useUser';

export function ShareSection() {
  const { user } = useUser();

  const handlePress = () => {
    // TODO: Navigate to create post screen
    console.log('Navigate to create post');
  };

  return (
    <View className="flex-row items-center gap-3 bg-grey-plain-50 px-4 py-3">
      {/* User Avatar */}
      <TouchableOpacity className="h-10 w-10">
        <View className="size-10 overflow-hidden rounded-full bg-grey-plain-300">
          <Image
            source={user.profileImage}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
            }}
            contentFit="cover"
          />
        </View>
      </TouchableOpacity>

      {/* Text Input Placeholder */}
      <TouchableOpacity
        className="flex-1 rounded-full border border-grey-plain-300 bg-grey-plain-150 px-4 py-2.5"
        onPress={handlePress}
        activeOpacity={0.7}
      >
        <Text
          className="text-[14px] text-grey-plain-550"
          style={{ color: colors['grey-plain']['550'] }}
        >
          Share some uplifting words...
        </Text>
      </TouchableOpacity>
    </View>
  );
}
