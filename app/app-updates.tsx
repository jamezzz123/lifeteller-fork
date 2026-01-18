import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { CornerUpLeft } from 'lucide-react-native';
import UpdatesIllustration from '@/assets/images/updates.svg';
import { Button } from '@/components/ui/Button';
import { colors } from '@/theme/colors';

export default function AppUpdatesScreen() {
  function handleUpdate() {
    // TODO: Wire to app store / in-app update flow
    console.log('Update tapped');
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'bottom']}>
      {/* Header */}
      <View className="flex-row items-center justify-between border-b border-grey-plain-150 bg-white px-4 py-3">
        <View className="flex-row items-center gap-3">
          <TouchableOpacity onPress={() => router.back()} className="mr-3">
            <CornerUpLeft
              color={colors['grey-plain']['550']}
              size={24}
              strokeWidth={2}
            />
          </TouchableOpacity>
          <Text className="text-lg font-semibold text-grey-alpha-500">
            App updates
          </Text>
        </View>
      </View>

      <View className="flex-1 items-center justify-center px-6 pt-8">
        <View className="mb-12 items-center justify-start">
          <UpdatesIllustration width={320} height={260} />
        </View>

        <View className="items-center pb-8">
          <Text className="mb-2 text-2xl font-semibold text-grey-alpha-500">
            Update available
          </Text>
          <Text className="mb-6 px-6 text-center text-base text-grey-alpha-400">
            Update your Lifteller app to the latest version for the newest
            features and improvements.
          </Text>

          <Button
            title="Update"
            onPress={handleUpdate}
            variant="primary"
            className="w-40"
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
