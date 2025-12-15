import React from 'react';
import { View } from 'react-native';
import { Image } from 'expo-image';

interface ProfileStackProps {
  profiles: string[];
  maxVisible?: number;
  size?: number;
  overlap?: number;
  className?: string;
}

export function ProfileStack({
  profiles,
  maxVisible = 3,
  size = 32,
  overlap = 12,
  className = '',
}: ProfileStackProps) {
  const visibleProfiles = profiles.slice(0, maxVisible);

  return (
    <View className={`flex-row ${className}`}>
      {visibleProfiles.map((imageUri, index) => (
        <View
          key={index}
          className="overflow-hidden rounded-full border-2 border-white bg-grey-plain-300"
          style={{
            width: size,
            height: size,
            marginLeft: index > 0 ? -overlap : 0,
          }}
        >
          <Image
            source={{ uri: imageUri }}
            style={{ width: size, height: size }}
            contentFit="cover"
          />
        </View>
      ))}
    </View>
  );
}
