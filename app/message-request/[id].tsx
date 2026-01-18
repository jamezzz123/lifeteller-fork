import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import {
  CornerUpLeft,
  Video,
  Phone,
  MoreVertical,
  Flag,
  Ban,
  FlagOff,
  BadgeCheck,
} from 'lucide-react-native';
import { Avatar } from '@/components/ui/Avatar';
import { colors } from '@/theme/colors';
import { BlockUserConfirmationModal } from '@/components/profile/BlockUserConfirmationModal';
import { Button } from '@/components/ui/Button';
import { CONTACTS } from '@/components/request-lift/data';
import * as Haptics from 'expo-haptics';

export default function MessageRequestDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Find contact by ID - in production, this would come from API
  const contact = CONTACTS.find((c) => c.id === id) || CONTACTS[0];

  // Mock message request data - in production, this would come from API
  const messageRequest = {
    id: id || '1',
    contactId: contact.id,
    contactName: contact.name,
    contactUsername: contact.username,
    contactAvatar:
      typeof contact.avatar === 'object' && 'uri' in contact.avatar
        ? contact.avatar.uri
        : undefined,
    isVerified: contact.verified,
    previewMessage: 'This is the reply of the person',
    timestamp: '06:87am',
  };

  const handleAccept = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // TODO: Implement accept message request functionality
    console.log('Accept message request:', messageRequest.id);
    // Navigate to chat screen
    router.replace(`/chat/${messageRequest.contactId}` as any);
  };

  const handleDecline = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // TODO: Implement decline message request functionality
    console.log('Decline message request:', messageRequest.id);
    router.back();
  };

  const handleReportUser = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push({
      pathname: '/report-user',
      params: {
        userId: messageRequest.contactId,
        username: messageRequest.contactUsername,
      },
    } as any);
  };

  const handleBlockUser = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setShowBlockModal(true);
  };

  const handleReportAndBlock = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push({
      pathname: '/report-and-block-user',
      params: {
        userId: messageRequest.contactId,
        username: messageRequest.contactUsername,
      },
    } as any);
  };

  const handleConfirmBlock = () => {
    // TODO: Implement block user functionality
    console.log('Block user:', messageRequest.contactId);
    setShowBlockModal(false);
    router.back();
  };

  const handleDeleteConversation = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    // TODO: Implement delete conversation functionality
    console.log('Delete conversation:', messageRequest.id);
    setShowDeleteModal(false);
    router.back();
  };

  const handleAvatarPress = () => {
    router.push(`/user/${messageRequest.contactId}` as any);
  };

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

        {/* Contact Info */}
        <TouchableOpacity
          className="mr-3"
          onPress={handleAvatarPress}
          activeOpacity={0.7}
        >
          <View
            className="rounded-full border-2"
            style={{
              borderColor: colors.primary.purple,
              padding: 2,
            }}
          >
            <Avatar
              profileImage={messageRequest.contactAvatar}
              name={messageRequest.contactName}
              size={40}
              showBadge={true}
            />
          </View>
        </TouchableOpacity>

        <View className="flex-1">
          <View className="mb-0.5 flex-row items-center gap-1.5">
            <Text className="text-base font-semibold text-grey-alpha-500">
              {messageRequest.contactName}
            </Text>
            {messageRequest.isVerified && (
              <BadgeCheck color={colors.primary.purple} size={16} />
            )}
          </View>
          <Text className="text-sm text-grey-plain-550">
            @{messageRequest.contactUsername}
          </Text>
        </View>

        {/* Action Buttons */}
        <View className="flex-row items-center gap-4">
          <TouchableOpacity className="p-1">
            <Video color={colors['grey-plain']['550']} size={24} />
          </TouchableOpacity>
          <TouchableOpacity className="p-1">
            <Phone color={colors['grey-plain']['550']} size={24} />
          </TouchableOpacity>
          <TouchableOpacity className="p-1" onPress={handleDeleteConversation}>
            <MoreVertical color={colors['grey-plain']['550']} size={24} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Chat Content */}
      <ScrollView
        className="flex-1 bg-white"
        contentContainerStyle={{
          paddingVertical: 16,
          paddingHorizontal: 16,
          paddingBottom: 200, // Extra padding for fixed bottom buttons
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Date Separator */}
        <View className="mb-4 flex-row items-center">
          <View className="flex-1 border-t border-grey-plain-300" />
          <Text className="mx-3 text-xs text-grey-plain-550">Today</Text>
          <View className="flex-1 border-t border-grey-plain-300" />
        </View>

        {/* Message Preview */}
        <View className="mb-6 items-start">
          <View
            className="max-w-[80%] rounded-2xl px-4 py-3"
            style={{
              backgroundColor: colors['grey-plain']['150'],
            }}
          >
            <Text className="text-base text-grey-alpha-500">
              {messageRequest.previewMessage}
            </Text>
            <View className="mt-2">
              <Text className="text-xs text-grey-plain-550">
                {messageRequest.timestamp}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Report Action Buttons Row - Fixed at Bottom */}
      <View className=" px-4 py-3">
        <View className="flex-row gap-3">
          <TouchableOpacity
            onPress={handleReportUser}
            className="flex-1 items-center rounded-xl  bg-grey-plain-150 px-3 py-4"
            activeOpacity={0.7}
          >
            <Flag
              color={colors['grey-alpha']['500']}
              size={24}
              strokeWidth={2}
            />
            <Text
              className="mt-2 text-center text-sm font-medium"
              style={{ color: colors['grey-alpha']['500'] }}
              numberOfLines={2}
            >
              Report user
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleBlockUser}
            className="flex-1 items-center rounded-xl  bg-grey-plain-150 px-3 py-4"
            activeOpacity={0.7}
          >
            <Ban
              color={colors['grey-alpha']['500']}
              size={24}
              strokeWidth={2}
            />
            <Text
              className="mt-2 text-center text-sm font-medium"
              style={{ color: colors['grey-alpha']['500'] }}
              numberOfLines={2}
            >
              Block user
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleReportAndBlock}
            className="flex-1 items-center rounded-xl  bg-grey-plain-150 px-3 py-4"
            activeOpacity={0.7}
          >
            <FlagOff
              color={colors['grey-alpha']['500']}
              size={24}
              strokeWidth={2}
            />
            <Text
              className="mt-2 text-center text-sm font-medium"
              style={{ color: colors['grey-alpha']['500'] }}
              numberOfLines={2}
            >
              Report and Block user
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom Action Card */}
      <View className="border-t border-grey-plain-300 bg-grey-alpha-100 px-4 py-4">
        <View>
          <View className="flex-row items-center gap-3">
            <TouchableOpacity
              onPress={handleDecline}
              className="flex-1 items-center py-3"
              activeOpacity={0.7}
            >
              <Text
                className="text-base font-semibold"
                style={{ color: colors.state.red }}
              >
                Decline
              </Text>
            </TouchableOpacity>

            <View className="flex-1">
              <Button
                title="Accept"
                onPress={handleAccept}
                variant="outline"
                size="medium"
                className="w-full"
              />
            </View>
          </View>
        </View>
      </View>

      {/* Block User Confirmation Modal */}
      <BlockUserConfirmationModal
        visible={showBlockModal}
        username={messageRequest.contactUsername}
        onConfirm={handleConfirmBlock}
        onCancel={() => setShowBlockModal(false)}
      />

      {/* Delete Conversation Modal */}
      <Modal visible={showDeleteModal} transparent animationType="fade">
        <View className="flex-1 items-center justify-center bg-black/50 px-6">
          <View className="w-full rounded-2xl bg-white p-6">
            {/* Title */}
            <Text className="text-2xl font-semibold leading-8 text-grey-alpha-500">
              Delete conversation
            </Text>

            {/* Message */}
            <Text className="mt-3 text-sm leading-5 text-grey-alpha-400">
              Are you sure you want to delete this conversation?
            </Text>

            <View className="my-4 h-px bg-grey-plain-450/20" />

            {/* Action Buttons */}
            <View className="flex-row justify-end gap-4">
              <TouchableOpacity
                onPress={() => setShowDeleteModal(false)}
                className="px-4 py-2"
              >
                <Text
                  className="text-base font-semibold"
                  style={{ color: colors.primary.purple }}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleConfirmDelete}
                className="px-4 py-2"
              >
                <Text
                  className="text-base font-semibold"
                  style={{ color: colors.state.red }}
                >
                  Yes, delete
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
