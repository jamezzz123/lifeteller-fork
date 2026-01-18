import React, { useState, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { CornerUpLeft, ChevronRight, Check, Trash2 } from 'lucide-react-native';
import EmptyListIllustration from '@/assets/images/empty-list.svg';
import { Button } from '@/components/ui/Button';
import {
  BottomSheetComponent,
  BottomSheetRef,
} from '@/components/ui/BottomSheet';
import { colors } from '@/theme/colors';

interface List {
  id: string;
  title: string;
  members: string[];
  totalMembers: number;
}

export default function MyListScreen() {
  const [selectedListId, setSelectedListId] = useState<string | null>(null);
  const bottomSheetRef = useRef<BottomSheetRef>(null);

  // Mock data - replace with actual data fetching
  const hasLists = true;
  const lists: List[] = [
    {
      id: '1',
      title: 'Close friends',
      members: ['Isaac Tolulope', 'Toba Freeman'],
      totalMembers: 7,
    },
    {
      id: '2',
      title: 'My Geezzz from Day 1',
      members: ['Isaac Tolulope', 'Toba Freeman'],
      totalMembers: 7,
    },
  ];

  const handleCreateList = () => {
    router.push('/add-member');
  };

  const handleListPress = (listId: string) => {
    setSelectedListId(listId);
    bottomSheetRef.current?.expand();
  };

  const handleEditList = () => {
    bottomSheetRef.current?.close();
    // TODO: Navigate to edit list screen
    console.log('Edit list:', selectedListId);
  };

  const handleDeleteList = () => {
    bottomSheetRef.current?.close();
    // TODO: Show confirmation dialog and delete list
    console.log('Delete list:', selectedListId);
  };

  const handleCloseBottomSheet = () => {
    setSelectedListId(null);
  };

  const formatMembersText = (members: string[], totalMembers: number) => {
    if (totalMembers <= 2) {
      return members.join(', ');
    }
    const othersCount = totalMembers - members.length;
    return `${members.join(', ')}, and ${othersCount} other${othersCount > 1 ? 's' : ''}`;
  };

  // Empty State View
  if (!hasLists) {
    return (
      <SafeAreaView className="flex-1 bg-background" edges={['top', 'bottom']}>
        {/* Header */}
        <View className="flex-row items-center border-b border-grey-plain-150 bg-white px-4 py-3">
          <TouchableOpacity onPress={() => router.back()} className="mr-3">
            <CornerUpLeft
              color={colors['grey-plain']['550']}
              size={24}
              strokeWidth={2}
            />
          </TouchableOpacity>
          <Text className="text-lg font-inter-semibold text-grey-alpha-500">
            My list
          </Text>
        </View>

        {/* Empty State Content */}
        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 24,
            paddingBottom: 32,
          }}
          showsVerticalScrollIndicator={false}
        >
          <View className="items-center">
            {/* Illustration */}
            <View className="mb-8">
              <EmptyListIllustration width={150} height={150} />
            </View>

            {/* Title */}
            <Text className="mb-4 text-center text-lg font-inter-semibold text-grey-alpha-500">
              No list available
            </Text>

            {/* Description */}
            <Text className="mb-8 text-center text-sm leading-5 text-grey-plain-550">
              You are yet to create a list or interact with users on the
              Lifteller app.
            </Text>

            {/* Create List Button */}
            <Button
              title="Create list"
              onPress={handleCreateList}
              variant="primary"
              size="medium"
              className="min-w-[200px]"
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Lists View
  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'bottom']}>
      {/* Header */}
      <View className="flex-row items-center justify-between border-b border-grey-plain-150 bg-white px-4 py-3">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.back()} className="mr-3">
            <CornerUpLeft
              color={colors['grey-plain']['550']}
              size={24}
              strokeWidth={2}
            />
          </TouchableOpacity>
          <Text className="text-lg font-inter-semibold text-grey-alpha-500">
            My list
          </Text>
        </View>
        <Button
          title="Create new"
          onPress={handleCreateList}
          variant="primary"
          size="small"
        />
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* List Count Card */}
        <View
          className="mx-4 mt-6 rounded-2xl p-2"
          style={{ backgroundColor: colors['grey-plain']['150'] }}
        >
          <Text className="mb-4 ml-3 mt-2 text-base font-inter-semibold text-grey-alpha-500">
            You have <Text className="font-inter-bold">{lists.length}</Text> lists
          </Text>

          {/* Lists */}
          <View className="gap-1">
            {lists.map((list, index) => (
              <TouchableOpacity
                key={list.id}
                onPress={() => handleListPress(list.id)}
                className="flex-row items-center justify-between rounded-xl bg-white px-4 py-4"
                activeOpacity={0.7}
              >
                <View className="flex-1">
                  <Text className="mb-1 text-base font-inter-semibold text-grey-alpha-500">
                    {list.title}
                  </Text>
                  <Text className="text-sm text-grey-plain-550">
                    {formatMembersText(list.members, list.totalMembers)}
                  </Text>
                </View>
                <ChevronRight
                  color={colors['grey-plain']['550']}
                  size={20}
                  strokeWidth={2}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* List Options Bottom Sheet */}
      <BottomSheetComponent
        ref={bottomSheetRef}
        snapPoints={['25%']}
        onClose={handleCloseBottomSheet}
      >
        <View className="px-6 pb-6">
          <TouchableOpacity
            onPress={handleEditList}
            className="flex-row items-center gap-3 border-b border-grey-plain-300 py-4"
            activeOpacity={0.7}
          >
            <Check
              color={colors['grey-alpha']['500']}
              size={20}
              strokeWidth={2}
            />
            <Text className="text-base text-grey-alpha-500">
              Edit list - Add and remove members
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleDeleteList}
            className="flex-row items-center gap-3 py-4"
            activeOpacity={0.7}
          >
            <Trash2
              color={colors['grey-alpha']['500']}
              size={20}
              strokeWidth={2}
            />
            <Text className="text-base text-grey-alpha-500">Delete list</Text>
          </TouchableOpacity>
        </View>
      </BottomSheetComponent>
    </SafeAreaView>
  );
}
