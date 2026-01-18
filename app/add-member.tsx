import React, { useState, useMemo, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { X } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { ContactChip } from '@/components/lift/ContactChip';
import { ContactRow } from '@/components/lift/ContactRow';
import { Contact } from '@/components/lift/types';
import { CONTACTS } from '@/components/lift/data';
import { Button } from '@/components/ui/Button';
import { BottomSheetRef } from '@/components/ui/BottomSheet';
import { ListMembersBottomSheet } from '@/components/my-list/ListMembersBottomSheet';
import { ListNameBottomSheet } from '@/components/my-list/ListNameBottomSheet';
import { colors } from '@/theme/colors';

export default function AddMemberScreen() {
  const params = useLocalSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<Contact[]>(() => {
    // Initialize with existing members if coming from review screen
    if (params.existingMemberIds) {
      try {
        const memberIds: string[] = JSON.parse(
          params.existingMemberIds as string
        );
        return CONTACTS.filter((contact) => memberIds.includes(contact.id));
      } catch {
        return [];
      }
    }
    return [];
  });
  const searchInputRef = useRef<TextInput>(null);
  const membersSheetRef = useRef<BottomSheetRef>(null);
  const nameSheetRef = useRef<BottomSheetRef>(null);

  const filteredContacts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return [];

    return CONTACTS.filter(
      (contact) =>
        contact.name.toLowerCase().includes(query) ||
        contact.username.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const handleSelectContact = (contact: Contact) => {
    // Check if already selected
    if (selectedMembers.find((item) => item.id === contact.id)) {
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedMembers([...selectedMembers, contact]);
    setSearchQuery('');
    searchInputRef.current?.blur();
  };

  const handleRemoveMember = (contactId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedMembers(
      selectedMembers.filter((contact) => contact.id !== contactId)
    );
  };

  const handleAddUsers = () => {
    if (selectedMembers.length === 0) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    membersSheetRef.current?.expand();
  };

  const handleRemoveMemberFromSheet = (contactId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedMembers(
      selectedMembers.filter((contact) => contact.id !== contactId)
    );
  };

  const handleProceed = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (membersSheetRef.current) {
      membersSheetRef.current.close();
    }
    // Wait for members sheet to close before opening name sheet
    setTimeout(() => {
      if (nameSheetRef.current) {
        nameSheetRef.current.expand();
      }
    }, 400);
  };

  const handleAddMember = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    nameSheetRef.current?.close();
    // Focus back on search input
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 300);
  };

  const handleCreateList = (listName: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // TODO: Save list to backend
    console.log('Creating list:', listName, 'with members:', selectedMembers);
    nameSheetRef.current?.close();
    setTimeout(() => {
      router.replace('/my-list');
    }, 300);
  };

  const handleCloseMembersSheet = () => {
    // Just close the sheet, stay on the screen
  };

  const handleCloseNameSheet = () => {
    // Just close the sheet, stay on the screen
  };

  const isContactSelected = (contactId: string) =>
    selectedMembers.some((m) => m.id === contactId);

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <SafeAreaView className="flex-1 bg-background" edges={['top', 'bottom']}>
        {/* Header */}
        <View className="flex-row items-center justify-between border-b border-grey-plain-150 bg-white px-4 py-3">
          <View className="flex-row items-center">
            <TouchableOpacity
              onPress={() => router.back()}
              className="mr-3"
              hitSlop={10}
            >
              <X
                color={colors['grey-alpha']['500']}
                size={20}
                strokeWidth={2.6}
              />
            </TouchableOpacity>
            <Text className="text-base font-inter-semibold text-grey-alpha-500">
              Add member
            </Text>
          </View>
          <Button
            title="Add users"
            onPress={handleAddUsers}
            variant="primary"
            size="small"
            disabled={selectedMembers.length === 0}
          />
        </View>

        <ScrollView
          className="flex-1"
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="px-4 pt-4">
            {/* Find User Label */}
            <Text className="mb-3 text-sm font-inter-medium text-grey-alpha-500">
              Find user
            </Text>

            {/* Search Input with Selected Chips */}
            <View className="mb-4">
              <View className="min-h-[48px] rounded-lg border border-grey-plain-300 bg-white px-3 py-2">
                {/* Selected Chips - Wrapping */}
                {selectedMembers.length > 0 && (
                  <View className="mb-2 flex-row flex-wrap gap-2">
                    {selectedMembers.map((member) => (
                      <ContactChip
                        key={member.id}
                        contact={member}
                        onRemove={handleRemoveMember}
                      />
                    ))}
                  </View>
                )}
                {/* Search Input */}
                <View className="flex-row items-center">
                  <TextInput
                    ref={searchInputRef}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    placeholder={
                      selectedMembers.length === 0
                        ? 'Search by name of username'
                        : ''
                    }
                    placeholderTextColor={colors['grey-plain']['300']}
                    className="flex-1 text-base text-grey-alpha-500"
                    style={{
                      padding: 0,
                      minWidth: selectedMembers.length === 0 ? 200 : 100,
                    }}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
              </View>
            </View>

            {/* Search Results */}
            {searchQuery.trim().length > 0 && (
              <View className="mt-2 rounded-lg bg-white">
                {filteredContacts.length === 0 ? (
                  <View className="py-4">
                    <Text className="text-center text-sm text-grey-plain-550">
                      No users found
                    </Text>
                  </View>
                ) : (
                  <>
                    {filteredContacts.map((contact, index) => {
                      const isSelected = isContactSelected(contact.id);
                      return (
                        <ContactRow
                          key={contact.id}
                          contact={contact}
                          onSelect={handleSelectContact}
                          disabled={isSelected}
                          isSelected={isSelected}
                        />
                      );
                    })}
                  </>
                )}
              </View>
            )}
          </View>
        </ScrollView>

        {/* List Members Bottom Sheet */}
        <ListMembersBottomSheet
          ref={membersSheetRef}
          members={selectedMembers}
          onRemove={handleRemoveMemberFromSheet}
          onProceed={handleProceed}
          onClose={handleCloseMembersSheet}
        />

        {/* List Name Bottom Sheet */}
        <ListNameBottomSheet
          ref={nameSheetRef}
          memberCount={selectedMembers.length}
          onAddMember={handleAddMember}
          onCreateList={handleCreateList}
          onClose={handleCloseNameSheet}
        />
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
