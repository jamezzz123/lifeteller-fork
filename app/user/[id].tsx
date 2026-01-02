import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { OtherUserProfile } from '@/components/profile/OtherUserProfile';

// Mock user data - Replace with actual API call
function getUserById(id: string) {
  // This would typically be an API call
  // For now, return mock data
  return {
    id,
    fullName: 'Isaac Tolulope',
    handle: 'dareytemy',
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    bio: 'Lazy Philanthropist. Touching lives one by one.',
    followersCount: 1234,
    followingCount: 1324,
    liftsCount: 817,
    postsCount: 48,
    isVerified: true,
    followsYou: true,
    isFollowing: false,
    badge: 'Lift Captain',
    interests: [
      'Religion-based',
      'Education',
      'Faith',
      'Healthcare and Medical',
      'Family',
    ],
    dateOfBirth: '12th December, 2005',
    dateJoined: '12/12/2021 • 10:09pm',
    dateVerified: '12/12/2021 • 10:09pm',
  };
}

export default function UserProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  if (!id) {
    return (
      <SafeAreaView className="flex-1 bg-grey-plain-50">
        <View className="flex-1 items-center justify-center">
          <Text className="text-grey-plain-550">User not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const user = getUserById(id);

  return <OtherUserProfile user={user} />;
}

