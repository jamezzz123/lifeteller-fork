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
import { Image } from 'expo-image';
import {
  CornerUpLeft,
  Bell,
  UserX,
  Trash2,
  ArrowUpRight,
  BadgeCheck,
} from 'lucide-react-native';
import { Button } from '@/components/ui/Button';
import { colors } from '@/theme/colors';
import { CONTACTS } from '@/components/request-lift/data';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';

export default function ChatInfoScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [showBlockConfirm, setShowBlockConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Find contact by ID
  const contact = CONTACTS.find((c) => c.id === id) || CONTACTS[0];

  // Mock user stats - in production, this would come from API
  const userStats = {
    lifts: 817,
    posts: 48,
    following: 1324,
    followers: 48200,
  };

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
    router.back();
  };

  const handleDeleteConversation = () => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    // TODO: Implement delete conversation functionality
    console.log('Delete conversation:', contact.id);
    setShowDeleteConfirm(false);
    router.back();
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
        <Text className="text-lg font-inter-semibold text-grey-alpha-500">
          Chat info
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        {/* Profile Section */}
        <View className="items-center bg-white px-4 py-8">
          {/* Avatar */}
          <View className="relative mb-4">
            <View
              className="h-24 w-24 overflow-hidden rounded-full bg-grey-plain-300"
              style={{
                borderWidth: 4,
                borderColor: colors.primary.purple,
              }}
            >
              {profileImage ? (
                <Image
                  source={{ uri: profileImage }}
                  style={{ width: 96, height: 96 }}
                  contentFit="cover"
                />
              ) : (
                <View
                  className="h-full w-full items-center justify-center"
                  style={{
                    backgroundColor: colors['primary-tints'].purple['100'],
                  }}
                >
                  <Text
                    className="text-2xl font-inter-bold"
                    style={{ color: colors.primary.purple }}
                  >
                    {contact.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </Text>
                </View>
              )}
            </View>
            {/* Online Status Dot */}
            <View
              className="absolute top-0 right-0 rounded-full border-2 border-white"
              style={{
                width: 16,
                height: 16,
                backgroundColor: colors.state.green,
              }}
            />
          </View>

          {/* Name with Verified Badge */}
          <View className="mb-2 flex-row items-center gap-2">
            <Text className="text-2xl font-inter-bold text-grey-alpha-500">
              {contact.name}
            </Text>
            {contact.verified && (
              <BadgeCheck color={colors.primary.purple} size={20} />
            )}
          </View>

          {/* Username */}
          <Text className="mb-6 text-base text-grey-plain-550">
            @{contact.username}
          </Text>

          {/* Statistics Grid */}
          <View className="mb-6 w-full flex-row flex-wrap gap-3">
            {/* Lifts Card */}
            <View className="flex-1 rounded-xl bg-white border border-grey-plain-300 p-4 min-w-[45%]">
              <Text className="mb-1 text-2xl font-inter-bold text-grey-alpha-500">
                {userStats.lifts.toLocaleString()}
              </Text>
              <Text className="text-xs font-inter-medium text-grey-plain-550">
                Lifts
              </Text>
            </View>

            {/* Posts Card */}
            <View className="flex-1 rounded-xl bg-white border border-grey-plain-300 p-4 min-w-[45%]">
              <Text className="mb-1 text-2xl font-inter-bold text-grey-alpha-500">
                {userStats.posts.toLocaleString()}
              </Text>
              <Text className="text-xs font-inter-medium text-grey-plain-550">
                Posts
              </Text>
            </View>

            {/* Following Card */}
            <TouchableOpacity
              className="relative flex-1 rounded-xl bg-white border border-grey-plain-300 p-4 min-w-[45%]"
              onPress={() =>
                router.push({
                  pathname: '/followers-following',
                  params: {
                    userName: contact.name,
                    userId: contact.id,
                    initialTab: 'following',
                  },
                } as any)
              }
              activeOpacity={0.7}
            >
              <View className="absolute right-2.5 top-2.5">
                <ArrowUpRight
                  color={colors['grey-plain']['550']}
                  size={14}
                  strokeWidth={2.5}
                />
              </View>
              <Text className="mb-1 text-2xl font-inter-bold text-grey-alpha-500">
                {userStats.following.toLocaleString()}
              </Text>
              <Text className="text-xs font-inter-medium text-grey-plain-550">
                Following
              </Text>
            </TouchableOpacity>

            {/* Followers Card */}
            <TouchableOpacity
              className="relative flex-1 rounded-xl bg-white border border-grey-plain-300 p-4 min-w-[45%]"
              onPress={() =>
                router.push({
                  pathname: '/followers-following',
                  params: {
                    userName: contact.name,
                    userId: contact.id,
                    initialTab: 'followers',
                  },
                } as any)
              }
              activeOpacity={0.7}
            >
              <View className="absolute right-2.5 top-2.5">
                <ArrowUpRight
                  color={colors['grey-plain']['550']}
                  size={14}
                  strokeWidth={2.5}
                />
              </View>
              <Text className="mb-1 text-2xl font-inter-bold text-grey-alpha-500">
                {(userStats.followers / 1000).toFixed(1)}k
              </Text>
              <Text className="text-xs font-inter-medium text-grey-plain-550">
                Followers
              </Text>
            </TouchableOpacity>
          </View>

          {/* View Full Profile Button */}
          <Button
            title="View full profile"
            onPress={handleViewFullProfile}
            variant="outline"
            size="medium"
            className="rounded-full border-primary"
          />
        </View>

        {/* Settings Section */}
        <View className="mx-4 mt-6 rounded-2xl p-2" style={{ backgroundColor: colors['grey-plain']['150'] }}>
          <Text className="mb-4 ml-3 mt-2 text-base font-inter-semibold text-grey-alpha-500">
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
                <Text className="text-base font-inter-medium text-grey-alpha-500">
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
                className="text-base font-inter-medium"
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
                className="text-base font-inter-medium"
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
    </SafeAreaView>
  );
}

