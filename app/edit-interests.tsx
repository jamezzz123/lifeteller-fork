import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { X, Check } from 'lucide-react-native';
import { colors } from '@/theme/colors';
import { Button } from '@/components/ui/Button';

const MAX_INTERESTS = 5;

const INTERESTS = [
  'Feeding',
  'Housing',
  'Education',
  'Health and Medical',
  'Faith-based',
  'Business',
  'Job support',
  'Skills development',
  'Capacity building',
  'Transportation',
  'Family',
  'Child support',
  'Emergency',
  'Celebrations',
];

export default function EditInterestsScreen() {
  // TODO: Get initial interests from user context/API
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    'Education',
    'Skills development',
    'Child support',
  ]);
  const [isUpdating, setIsUpdating] = useState(false);

  function toggleInterest(interest: string) {
    setSelectedInterests((prev: string[]) => {
      if (prev.includes(interest)) {
        // Deselect
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        return prev.filter((item: string) => item !== interest);
      } else {
        // Select (only if under limit)
        if (prev.length < MAX_INTERESTS) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          return [...prev, interest];
        } else {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          return prev;
        }
      }
    });
  }

  async function handleUpdate() {
    try {
      setIsUpdating(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      // TODO: Call API to update interests
      await new Promise((resolve) => setTimeout(resolve, 500));

      // TODO: Update user context/state
      router.back();
    } catch (error) {
      console.error('Error updating interests:', error);
    } finally {
      setIsUpdating(false);
    }
  }

  function handleCancel() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  }

  return (
    <SafeAreaView className="flex-1 bg-grey-plain-50" edges={['top']}>
      {/* Header */}
      <View className="flex-row items-center justify-between border-b border-grey-plain-150 bg-white px-4 py-3">
        <TouchableOpacity
          onPress={handleCancel}
          className="flex-row items-center gap-2"
        >
          <X
            color={colors['grey-alpha']['500']}
            size={20}
            strokeWidth={2.5}
          />
          <Text className="text-base font-inter-semibold text-grey-alpha-500">
            Cancel
          </Text>
        </TouchableOpacity>
        <Button
          title="Update"
          onPress={handleUpdate}
          variant="primary"
          size="small"
          loading={isUpdating}
          disabled={isUpdating}
        />
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        <View className="px-4 pt-6">
          {/* Title */}
          <Text className="mb-2 text-xl font-inter-bold text-grey-alpha-500">
            What are the things interests you?
          </Text>

          {/* Description */}
          <Text className="mb-8 text-sm leading-5 text-grey-plain-550">
            It will take a while for us to updated your feeds based on your
            newly selected interests.
          </Text>

          {/* Interests Grid */}
          <View className="flex-row flex-wrap gap-3">
            {INTERESTS.map((interest) => {
              const isSelected = selectedInterests.includes(interest);
              return (
                <Pressable
                  key={interest}
                  onPress={() => toggleInterest(interest)}
                  className="rounded-xl px-3 py-2"
                  style={{
                    backgroundColor: isSelected
                      ? colors['primary-tints'].purple['100']
                      : colors['grey-alpha']['150'],
                  }}
                >
                  <View className="flex-row items-center gap-2">
                    {isSelected && (
                      <Check
                        size={16}
                        color={colors['grey-alpha']['450']}
                        strokeWidth={3}
                      />
                    )}

                    <Text
                      className="text-sm font-inter-medium"
                      style={{
                        color: colors['grey-alpha']['450'],
                      }}
                    >
                      {interest}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </View>

          {/* Selection Limit Info */}
          <View className="mt-6">
            <Text className="text-sm text-grey-alpha-500">
              You can select up to{' '}
              <Text className="font-inter-bold">{MAX_INTERESTS}</Text> interests.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
