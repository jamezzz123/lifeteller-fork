import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Plus } from 'lucide-react-native';
import { colors } from '@/theme/colors';
import { useAuth } from '@/context/auth';
import { getInitials, getFullName } from '@/utils/user';

export function MessagesStoriesSection() {
  const { user } = useAuth();

  // Get user data with fallbacks
  const fullName = user ? getFullName(user.first_name, user.last_name) : '';
  const initials = getInitials(fullName);
  const avatarUrl = user?.avatar_url;

  const stories = [
    { id: 'your-story', name: 'Your story', isYourStory: true },
    {
      id: '1',
      name: 'eboolatowe...',
      image: 'https://i.pravatar.cc/150?img=12',
    },
    {
      id: '2',
      name: 'eboolatowe...',
      image: 'https://i.pravatar.cc/150?img=5',
    },
    {
      id: '3',
      name: 'eboolatowe...',
      image: 'https://i.pravatar.cc/150?img=9',
    },
    {
      id: '4',
      name: 'eboolatowe...',
      image: 'https://i.pravatar.cc/150?img=20',
    },
  ];

  return (
    <View className="bg-grey-plain-50 py-3">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 16 }}
      >
        {stories.map((story) => (
          <TouchableOpacity
            key={story.id}
            className="w-[70px] items-center"
            activeOpacity={0.7}
          >
            <View className="mb-1 h-[60px] w-[60px]">
              {story.isYourStory ? (
                <View className="relative h-[60px] w-[60px]">
                  {/* White Circle for Your Story */}
                  <View
                    className="h-full w-full items-center justify-center rounded-full border-2"
                    style={{
                      borderColor: colors['grey-plain']['300'],
                      backgroundColor: colors['grey-plain']['50'],
                    }}
                  >
                    {avatarUrl ? (
                      <Image
                        source={{ uri: avatarUrl }}
                        style={styles.profileImage}
                        contentFit="cover"
                      />
                    ) : initials ? (
                      <View
                        style={[
                          styles.profileImage,
                          {
                            backgroundColor:
                              colors['primary-tints'].purple['100'],
                            alignItems: 'center',
                            justifyContent: 'center',
                          },
                        ]}
                      >
                        <Text
                          style={{
                            fontSize: 20,
                            fontWeight: 'bold',
                            color: colors.primary.purple,
                          }}
                        >
                          {initials}
                        </Text>
                      </View>
                    ) : (
                      <View
                        style={[
                          styles.profileImage,
                          { backgroundColor: colors['grey-plain']['450'] },
                        ]}
                      />
                    )}
                  </View>
                  {/* Add Icon Overlay */}
                  <View className="absolute bottom-0 right-0 h-6 w-6 items-center justify-center rounded-full bg-white border-2 border-grey-plain-50">
                    <Plus
                      color={colors['grey-alpha']['500']}
                      size={16}
                      strokeWidth={3}
                    />
                  </View>
                </View>
              ) : (
                <LinearGradient
                  colors={['#7538BA', '#CF2586']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.gradientBorder}
                >
                  <View style={styles.innerCircle}>
                    <Image
                      source={{ uri: story.image }}
                      style={styles.profileImage}
                      contentFit="cover"
                    />
                  </View>
                </LinearGradient>
              )}
            </View>
            <Text
              className="text-center text-xs text-grey-alpha-500"
              numberOfLines={1}
            >
              {story.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  gradientBorder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 2,
  },
  innerCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
    backgroundColor: colors['grey-plain']['50'],
    borderWidth: 2,
    borderColor: colors['grey-plain']['50'],
  },
  profileImage: {
    width: 52,
    height: 52,
    borderRadius: 26,
  },
});

