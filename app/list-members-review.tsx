import React, { useState, useEffect, useRef } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { ListMembersBottomSheet } from '@/components/my-list/ListMembersBottomSheet';
import { ListNameBottomSheet } from '@/components/my-list/ListNameBottomSheet';
import { Contact } from '@/components/lift/types';
import { CONTACTS } from '@/components/lift/data';
import { BottomSheetRef } from '@/components/ui/BottomSheet';
import * as Haptics from 'expo-haptics';

export default function ListMembersReviewScreen() {
  const params = useLocalSearchParams();
  const [members, setMembers] = useState<Contact[]>([]);
  const [showNameSheet, setShowNameSheet] = useState(false);
  const membersSheetRef = useRef<BottomSheetRef>(null);
  const nameSheetRef = useRef<BottomSheetRef>(null);

  useEffect(() => {
    // Parse member IDs from params
    if (params.memberIds) {
      try {
        const memberIds: string[] = JSON.parse(params.memberIds as string);
        const selectedMembers = CONTACTS.filter((contact) =>
          memberIds.includes(contact.id)
        );
        setMembers(selectedMembers);
        // Open members sheet
        setTimeout(() => {
          membersSheetRef.current?.expand();
        }, 100);
      } catch (error) {
        console.error('Error parsing member IDs:', error);
        router.back();
      }
    } else if (params.existingMemberIds) {
      // Coming back from add-member with updated members
      try {
        const memberIds: string[] = JSON.parse(params.existingMemberIds as string);
        const selectedMembers = CONTACTS.filter((contact) =>
          memberIds.includes(contact.id)
        );
        setMembers(selectedMembers);
        // Open members sheet
        setTimeout(() => {
          membersSheetRef.current?.expand();
        }, 100);
      } catch (error) {
        console.error('Error parsing existing member IDs:', error);
        router.back();
      }
    }
  }, [params.memberIds, params.existingMemberIds]);

  const handleRemoveMember = (contactId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setMembers(members.filter((member) => member.id !== contactId));
  };

  const handleProceed = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    membersSheetRef.current?.close();
    setTimeout(() => {
      setShowNameSheet(true);
      nameSheetRef.current?.expand();
    }, 300);
  };

  const handleAddMember = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    nameSheetRef.current?.close();
    setTimeout(() => {
      router.push({
        pathname: '/add-member',
        params: {
          existingMemberIds: JSON.stringify(members.map((m) => m.id)),
        },
      });
    }, 300);
  };

  const handleCreateList = (listName: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // TODO: Save list to backend
    console.log('Creating list:', listName, 'with members:', members);
    nameSheetRef.current?.close();
    setTimeout(() => {
      router.replace('/my-list');
    }, 300);
  };

  const handleCloseMembersSheet = () => {
    if (!showNameSheet) {
      router.back();
    }
  };

  const handleCloseNameSheet = () => {
    setShowNameSheet(false);
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'bottom']}>
      <View className="flex-1" />

      {/* List Members Bottom Sheet */}
      {!showNameSheet && (
        <ListMembersBottomSheet
          ref={membersSheetRef}
          members={members}
          onRemove={handleRemoveMember}
          onProceed={handleProceed}
          onClose={handleCloseMembersSheet}
        />
      )}

      {/* List Name Bottom Sheet */}
      {showNameSheet && (
        <ListNameBottomSheet
          ref={nameSheetRef}
          memberCount={members.length}
          onAddMember={handleAddMember}
          onCreateList={handleCreateList}
          onClose={handleCloseNameSheet}
        />
      )}
    </SafeAreaView>
  );
}

