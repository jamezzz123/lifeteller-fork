import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { X, Trash2 } from 'lucide-react-native';
import { BottomSheetComponent, BottomSheetRef } from '@/components/ui/BottomSheet';
import { Contact } from '@/components/lift/types';
import { Button } from '@/components/ui/Button';
import { colors } from '@/theme/colors';

interface ListMembersBottomSheetProps {
  ref: React.RefObject<BottomSheetRef>;
  members: Contact[];
  onRemove: (contactId: string) => void;
  onProceed: () => void;
  onClose: () => void;
}

export const ListMembersBottomSheet = React.forwardRef<
  BottomSheetRef,
  Omit<ListMembersBottomSheetProps, 'ref'>
>(({ members, onRemove, onProceed, onClose }, ref) => {
  return (
    <BottomSheetComponent
      ref={ref}
      snapPoints={['70%']}
      onClose={onClose}
    >
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 pb-4">
        <Text className="text-lg font-inter-semibold text-grey-alpha-500">
          List members
        </Text>
        <TouchableOpacity
          onPress={onClose}
          hitSlop={10}
          accessibilityLabel="Close"
        >
          <X
            size={24}
            color={colors['grey-alpha']['500']}
            strokeWidth={2.6}
          />
        </TouchableOpacity>
      </View>

      {/* Members List */}
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {members.map((member) => (
          <View
            key={member.id}
            className="flex-row items-center justify-between border-b border-grey-plain-450/20 px-6 py-4"
          >
            <View className="flex-1 flex-row items-center gap-3">
              <Image
                source={member.avatar}
                style={{ width: 48, height: 48, borderRadius: 24 }}
                contentFit="cover"
              />
              <View className="flex-1">
                <View className="flex-row items-center gap-2">
                  <Text className="text-base font-inter-semibold text-grey-alpha-500">
                    {member.name}
                  </Text>
                  {member.verified && (
                    <View className="size-4 items-center justify-center rounded-full bg-primary">
                      <Text className="text-[10px] text-white">✓</Text>
                    </View>
                  )}
                </View>
                <Text className="text-sm text-grey-alpha-400">
                  @{member.username}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={() => onRemove(member.id)}
              hitSlop={10}
              accessibilityLabel="Remove member"
            >
              <Trash2
                size={20}
                color={colors['grey-alpha']['400']}
                strokeWidth={2}
              />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      {/* Proceed Button */}
      <View className="absolute bottom-0 left-0 right-0 bg-white px-6 pb-8 pt-4">
        <View className="flex w-1/2 items-end justify-end self-end">
          <Button
            title="Proceed"
            onPress={onProceed}
            disabled={members.length === 0}
            variant="primary"
            size="medium"
          />
        </View>
      </View>
    </BottomSheetComponent>
  );
});

ListMembersBottomSheet.displayName = 'ListMembersBottomSheet';

