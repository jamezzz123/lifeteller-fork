import React, { useRef, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { CornerUpLeft, ChevronRight, UserCog } from 'lucide-react-native';
import { colors } from '@/theme/colors';
import { BottomSheetComponent, BottomSheetRef } from '@/components/ui/BottomSheet';

export default function MessageSettingsScreen() {
  const activityStatusSheetRef = useRef<BottomSheetRef>(null);
  const activityStatuses = [
    {
      id: 'default',
      title: 'Default',
      description: 'Online when you are online, and offline when you are offline.',
      color: colors['grey-plain']['450'],
    },
    {
      id: 'online',
      title: 'Online',
      description: 'Always online even when you are offline.',
      color: colors.state.green,
    },
    {
      id: 'offline',
      title: 'Offline',
      description: 'Always offline even when you are online.',
      color: colors.state.red,
    },
    {
      id: 'away',
      title: 'Away',
      description: 'Always away',
      color: colors.state.orange,
    },
  ];
  const [selectedStatusId, setSelectedStatusId] = useState('default');
  const selectedStatus =
    activityStatuses.find((status) => status.id === selectedStatusId) ??
    activityStatuses[0];

  const handleOpenActivityStatus = () => {
    activityStatusSheetRef.current?.expand();
  };

  const handleSelectStatus = (statusId: string) => {
    setSelectedStatusId(statusId);
    activityStatusSheetRef.current?.close();
  };

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
            Message settings
          </Text>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        <View
          className="mx-4 mt-6 rounded-2xl p-2"
          style={{ backgroundColor: colors['grey-plain']['150'] }}
        >
          <Text className="mb-4 ml-3 mt-2 text-base font-semibold text-grey-alpha-500">
            Availability status
          </Text>

          <View className="overflow-hidden rounded-xl bg-white">
            <TouchableOpacity
              className="flex-row items-center justify-between px-4 py-4"
              activeOpacity={0.7}
              onPress={handleOpenActivityStatus}
            >
              <View className="flex-row items-center gap-3">
                <View
                  className="h-10 w-10 items-center justify-center rounded-full"
                  style={{ backgroundColor: colors['primary-tints'].purple['50'] }}
                >
                  <UserCog color={colors.primary.purple} size={20} strokeWidth={2} />
                </View>
                <View>
                  <Text className="text-base font-semibold text-grey-alpha-500">
                    Activity status
                  </Text>
                  <Text className="text-sm text-grey-plain-550">
                    Configure your status
                  </Text>
                </View>
              </View>

              <View className="flex-row items-center gap-3">
                <View
                  className="flex-row items-center gap-2 rounded-full px-3 py-1"
                  style={{ backgroundColor: colors['grey-plain']['150'] }}
                >
                  <View
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: selectedStatus.color }}
                  />
                  <Text className="text-sm font-semibold text-grey-alpha-500">
                    {selectedStatus.title}
                  </Text>
                </View>
                <ChevronRight color={colors['grey-plain']['550']} size={20} />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <BottomSheetComponent
        ref={activityStatusSheetRef}
        title="Set your activity status"
        snapPoints={['45%']}
      >
        <View className="px-4">
          {activityStatuses.map((status, index) => {
            const isSelected = status.id === selectedStatusId;

            return (
            <View key={status.id} className="relative">
              {isSelected && (
                <View
                  className="absolute h-6 w-2 rounded-r-full"
                  style={{
                    backgroundColor: colors.primary.purple,
                    left: -16,
                    top: '50%',
                    transform: [{ translateY: -12 }],
                  }}
                  pointerEvents="none"
                />
              )}
              <TouchableOpacity
                className="flex-row items-center justify-between py-4"
                activeOpacity={0.7}
                onPress={() => handleSelectStatus(status.id)}
              >
                <View className="flex-1 pr-4">
                  <Text
                    className="text-base font-semibold"
                    style={{
                      color: isSelected
                        ? colors.primary.purple
                        : colors['grey-alpha']['500'],
                    }}
                  >
                    {status.title}
                  </Text>
                  <Text className="mt-1 text-sm text-grey-plain-550">
                    {status.description}
                  </Text>
                </View>
                <ChevronRight
                  color={
                    isSelected ? colors.primary.purple : colors['grey-plain']['550']
                  }
                  size={20}
                />
              </TouchableOpacity>
              {index !== activityStatuses.length - 1 && (
                <View className="h-px bg-grey-plain-150" />
              )}
            </View>
          );
          })}
        </View>
      </BottomSheetComponent>
    </SafeAreaView>
  );
}
