import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import {
  CornerUpLeft,
  Bell,
  UserX,
  Trash2,
  BadgeCheck,
  Phone,
  Video,
  Search,
} from 'lucide-react-native';
import { Button } from '@/components/ui/Button';
import { colors } from '@/theme/colors';
import { CONTACTS } from '@/components/request-lift/data';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Avatar } from '@/components/ui/Avatar';
import { Toast } from '@/components/ui/Toast';

export default function ChatInfoScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [showBlockConfirm, setShowBlockConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showBlockToast, setShowBlockToast] = useState(false);
  const [showDeleteToast, setShowDeleteToast] = useState(false);

  // Find contact by ID
  const contact = CONTACTS.find((c) => c.id === id) || CONTACTS[0];

  const handleViewFullProfile = () => {
    router.push(`/user/${contact.id}` as any);
  };

  const handleBlockUser = () => {
    setShowBlockConfirm(true);
  };

  const handleConfirmBlock = () => {
    // TODO: Implement block user functionality
    console.log('Block user:', contact.id);
    setShowBlockConfirm(false);
    setShowBlockToast(true);
  };

  const handleDeleteConversation = () => {
    setShowDeleteConfirm(true);
  };

  const handleCall = () => {
    // TODO: Implement call action
    console.log('Call user:', contact.id);
  };

  const handleVideoCall = () => {
    // TODO: Implement video call action
    console.log('Video call user:', contact.id);
  };

  const handleSearch = () => {
    // TODO: Implement search in conversation
    console.log('Search conversation with user:', contact.id);
  };

  const handleConfirmDelete = () => {
    // TODO: Implement delete conversation functionality
    console.log('Delete conversation:', contact.id);
    setShowDeleteConfirm(false);
    setShowDeleteToast(true);
  };

  const profileImage =
    typeof contact.avatar === 'object' && 'uri' in contact.avatar
      ? contact.avatar.uri
      : undefined;

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
        <Text className="text-lg font-semibold text-grey-alpha-500">
          View chat info
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        {/* Profile Section */}
        <View className="items-center bg-white px-4 pb-6 pt-8">
          {/* Avatar */}
          <View className="relative mb-4">
            <Avatar
              profileImage={profileImage}
              name={contact.name}
              size={88}
              showBadge={true}
              showRing={true}
            />
            {/* Online Status Dot */}
            <View
              className="absolute top-0 rounded-full border-2 border-white"
              style={{
                width: 16,
                height: 16,
                backgroundColor: colors.state.green,
                right: 10,
              }}
            />
          </View>

          {/* Name with Verified Badge */}
          <View className="mb-2 flex-row items-center gap-2">
            <Text className="text-2xl font-bold text-grey-alpha-500">
              {contact.name}
            </Text>
            {contact.verified && (
              <BadgeCheck color={colors.primary.purple} size={20} />
            )}
          </View>

          {/* Username */}
          <Text className="mb-5 text-base text-grey-plain-550">
            @{contact.username}
          </Text>

          {/* View Full Profile Button */}
          <Button
            title="View profile"
            onPress={handleViewFullProfile}
            variant="outline"
            size="medium"
            className="rounded-full border-primary"
          />

          {/* Quick Actions */}
          <View className="mt-6 w-full border-t border-grey-plain-150 pt-6">
            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={handleCall}
                className="flex-1 items-center rounded-2xl border border-grey-plain-150 bg-white py-4"
                activeOpacity={0.7}
              >
                <Phone color={colors.primary.purple} size={24} />
                <Text className="mt-2 text-sm font-medium text-grey-alpha-500">
                  Call
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleVideoCall}
                className="flex-1 items-center rounded-2xl border border-grey-plain-150 bg-white py-4"
                activeOpacity={0.7}
              >
                <Video color={colors.primary.purple} size={24} />
                <Text className="mt-2 text-sm font-medium text-grey-alpha-500">
                  Video
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSearch}
                className="flex-1 items-center rounded-2xl border border-grey-plain-150 bg-white py-4"
                activeOpacity={0.7}
              >
                <Search color={colors.primary.purple} size={24} />
                <Text className="mt-2 text-sm font-medium text-grey-alpha-500">
                  Search
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Settings Section */}
        <View className="mx-4 mt-6 rounded-2xl p-2" style={{ backgroundColor: colors['grey-plain']['150'] }}>
          <Text className="mb-4 ml-3 mt-2 text-base font-semibold text-grey-alpha-500">
            Settings
          </Text>

          {/* Notifications Toggle */}
          <View className="flex-row items-center justify-between rounded-xl bg-white px-4 py-4">
            <View className="flex-1 flex-row items-center gap-3">
              <View
                className="h-10 w-10 items-center justify-center rounded-full"
                style={{ backgroundColor: colors['grey-plain']['150'] }}
              >
                <Bell
                  color={colors['grey-plain']['550']}
                  size={24}
                  strokeWidth={2}
                />
              </View>
              <View className="flex-1">
                <Text className="text-base font-medium text-grey-alpha-500">
                  Notifications
                </Text>
                <Text className="text-sm text-grey-plain-550">
                  Receive notifications from user
                </Text>
              </View>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{
                false: colors['grey-plain']['300'],
                true: colors.primary.purple,
              }}
              thumbColor={colors['grey-plain']['50']}
              ios_backgroundColor={colors['grey-plain']['300']}
            />
          </View>

          {/* Block User Option */}
          <TouchableOpacity
            onPress={handleBlockUser}
            className="mt-2 flex-row items-center gap-3 rounded-xl bg-white px-4 py-4"
            activeOpacity={0.7}
          >
            <View
              className="h-10 w-10 items-center justify-center rounded-full"
              style={{ backgroundColor: colors['grey-plain']['150'] }}
            >
              <UserX
                color={colors.state.red}
                size={24}
                strokeWidth={2}
              />
            </View>
            <View className="flex-1">
              <Text
                className="text-base font-medium"
                style={{ color: colors.state.red }}
              >
                Block user
              </Text>
              <Text
                className="text-sm"
                style={{ color: colors.state.red }}
              >
                They won&apos;t be able to message you
              </Text>
            </View>
          </TouchableOpacity>

          {/* Delete Conversation Option */}
          <TouchableOpacity
            onPress={handleDeleteConversation}
            className="mt-2 flex-row items-center gap-3 rounded-xl bg-white px-4 py-4"
            activeOpacity={0.7}
          >
            <View
              className="h-10 w-10 items-center justify-center rounded-full"
              style={{ backgroundColor: colors['grey-plain']['150'] }}
            >
              <Trash2
                color={colors.state.red}
                size={24}
                strokeWidth={2}
              />
            </View>
            <View className="flex-1">
              <Text
                className="text-base font-medium"
                style={{ color: colors.state.red }}
              >
                Delete conversation
              </Text>
              <Text
                className="text-sm"
                style={{ color: colors.state.red }}
              >
                All messages will be permanently deleted
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Block User Confirmation */}
      <ConfirmDialog
        visible={showBlockConfirm}
        title="Block user?"
        message={`Are you sure you want to block ${contact.name}? They won't be able to message you.`}
        confirmText="Block"
        cancelText="Cancel"
        onConfirm={handleConfirmBlock}
        onCancel={() => setShowBlockConfirm(false)}
        destructive
      />

      {/* Delete Conversation Confirmation */}
      <ConfirmDialog
        visible={showDeleteConfirm}
        title="Delete conversation?"
        message="All messages will be permanently deleted. This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowDeleteConfirm(false)}
        destructive
      />

      <Toast
        visible={showBlockToast}
        message="User blocked successfully"
        onHide={() => setShowBlockToast(false)}
      />

      <Toast
        visible={showDeleteToast}
        message="Conversation deleted successfully"
        onHide={() => setShowDeleteToast(false)}
      />
    </SafeAreaView>
  );
}

