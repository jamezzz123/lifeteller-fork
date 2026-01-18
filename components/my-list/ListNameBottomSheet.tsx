import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { X, UserPlus } from 'lucide-react-native';
import { BottomSheetComponent, BottomSheetRef } from '@/components/ui/BottomSheet';
import { Button } from '@/components/ui/Button';
import { colors } from '@/theme/colors';

interface ListNameBottomSheetProps {
  ref: React.RefObject<BottomSheetRef>;
  memberCount: number;
  onAddMember: () => void;
  onCreateList: (listName: string) => void;
  onClose: () => void;
}

export const ListNameBottomSheet = React.forwardRef<
  BottomSheetRef,
  Omit<ListNameBottomSheetProps, 'ref'>
>(({ memberCount, onAddMember, onCreateList, onClose }, ref) => {
  const [listName, setListName] = useState('');

  const handleCreateList = () => {
    if (listName.trim().length === 0) return;
    onCreateList(listName.trim());
    setListName('');
  };

  return (
    <BottomSheetComponent
      ref={ref}
      snapPoints={['50%']}
      onClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
      >
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 pb-4">
        <Text className="text-lg font-inter-semibold text-grey-alpha-500">
          Give your list a name
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

        <View className="flex-1 px-6 pt-6">
          {/* Name Input */}
          <View className="mb-6">
            <Text className="mb-3 text-sm font-inter-medium text-grey-alpha-500">
              Name of list
            </Text>
            <TextInput
              value={listName}
              onChangeText={setListName}
              placeholder="Type name of list here..."
              placeholderTextColor={colors['grey-plain']['300']}
              className="rounded-lg border border-grey-plain-300 bg-white px-4 py-3 text-base text-grey-alpha-500"
              autoCapitalize="words"
              autoFocus
            />
          </View>

          {/* Member Count and Add Member Link */}
          <View className="mb-6 flex-row items-center justify-between">
            <Text className="text-sm font-inter-medium text-primary">
              {memberCount} {memberCount === 1 ? 'person' : 'people'} added
            </Text>
            <TouchableOpacity
              onPress={onAddMember}
              className="flex-row items-center gap-2"
              hitSlop={10}
            >
              <UserPlus
                size={18}
                color={colors.primary.purple}
                strokeWidth={2}
              />
              <Text
                className="text-sm font-inter-medium text-primary"
                style={{ textDecorationLine: 'underline' }}
              >
                Add new member
              </Text>
            </TouchableOpacity>
          </View>

          {/* Create List Button */}
          <View className="flex w-1/2 items-end justify-end self-end">
            <Button
              title="Create list"
              onPress={handleCreateList}
              disabled={listName.trim().length === 0}
              variant="primary"
              size="medium"
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </BottomSheetComponent>
  );
});

ListNameBottomSheet.displayName = 'ListNameBottomSheet';

