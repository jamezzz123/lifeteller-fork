import React from 'react';
import { ScrollView, View, Text, TouchableOpacity } from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  ArrowLeft,
  Search,
  EllipsisVertical,
  CornerUpLeft,
} from 'lucide-react-native';
import { colors } from '@/theme/colors';
import { mockLifts } from '@/data/mockLifts';
import { RaiseLiftList } from '@/components/lift/RaiseLiftList';

export default function LiftedByScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();

  // Get lift data from mockLifts
  const liftData = mockLifts.find((lift) => lift.id === id);

  if (!liftData) {
    return (
      <SafeAreaView className="flex-1 bg-grey-plain-50">
        <View className="flex-1 items-center justify-center">
          <Text className="text-grey-plain-550">Lift not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Get contributors from coRaisers
  const contributors =
    liftData.monetary?.coRaisers?.map((raiser) => ({
      id: raiser.id,
      username: raiser.name,
      handle: raiser.name.toLowerCase().replace(/\s+/g, ''),
      timestamp: '10 seconds ago',
      profileImage: raiser.avatar,
      amount: raiser.amount || 0,
    })) || [];

  const totalLifters = contributors.length;

  return (
    <SafeAreaView className="flex-1 bg-grey-plain-50" edges={['top']}>
      {/* Header */}
      <View className="flex-row items-center justify-between border-b border-grey-plain-150 bg-white px-4 py-3">
        <View className="flex-row items-center gap-3">
          <TouchableOpacity onPress={() => router.back()}>
            <CornerUpLeft color={colors['grey-plain']['550']} size={24} />
          </TouchableOpacity>
          <Text className="text-lg font-semibold text-grey-alpha-500">
            Lifted by
          </Text>
        </View>
        <View className="flex-row items-center gap-3">
          <TouchableOpacity>
            <Search color={colors['grey-plain']['550']} size={24} />
          </TouchableOpacity>
          <TouchableOpacity>
            <EllipsisVertical color={colors['grey-plain']['550']} size={24} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Count */}
      <View className="bg-white px-4 py-4">
        <Text className="text-base text-grey-alpha-500">
          <Text className="font-bold">{totalLifters}</Text>{' '}
          <Text className="font-normal text-grey-plain-550">Lifters</Text>
        </Text>
      </View>

      {/* Contributors List */}
      <ScrollView
        className="flex-1 bg-white"
        showsVerticalScrollIndicator={false}
      >
        {contributors.length > 0 ? (
          <View className="px-4">
            <RaiseLiftList contributors={contributors} />
          </View>
        ) : (
          <View className="flex-1 items-center justify-center py-20">
            <Text className="text-grey-plain-550">No contributors yet</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
