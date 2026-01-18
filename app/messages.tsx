import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { CornerUpLeft, Search, Settings } from 'lucide-react-native';
import MessagingIllustration from '@/assets/images/messaging.svg';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { FilterTabs } from '@/components/ui/FilterTabs';
import { FloatingActionButton } from '@/components/feed/FloatingActionButton';
import { MessagesStoriesSection } from '@/components/chat/MessagesStoriesSection';
import { MessageListItem, Message } from '@/components/chat/MessageListItem';
import {
  MessageRequestItem,
  MessageRequest,
} from '@/components/chat/MessageRequestItem';
import { colors } from '@/theme/colors';
import { CONTACTS } from '@/components/request-lift/data';

export default function MessagesScreen() {
  const [activeFilter, setActiveFilter] = useState('all');

  // Mock message requests data - in production, this would come from API
  const messageRequests: MessageRequest[] = [
    {
      id: 'req-1',
      contactId: CONTACTS[1]?.id || '',
      contactName: CONTACTS[1]?.name || 'Isaac Tolulope',
      contactUsername: CONTACTS[1]?.username || 'dareytemy',
      contactAvatar:
        typeof CONTACTS[1]?.avatar === 'object' && 'uri' in CONTACTS[1].avatar
          ? CONTACTS[1].avatar.uri
          : undefined,
      isVerified: CONTACTS[1]?.verified,
      previewMessage: 'This is the reply of the person',
      timestamp: '06:87am',
    },
  ];

  // Mock messages data - in production, this would come from API
  const allMessages: Message[] = [
    {
      id: '1',
      type: 'direct',
      contactId: CONTACTS[0].id,
      contactName: CONTACTS[0].name,
      contactUsername: CONTACTS[0].username,
      contactAvatar:
        typeof CONTACTS[0].avatar === 'object' && 'uri' in CONTACTS[0].avatar
          ? CONTACTS[0].avatar.uri
          : undefined,
      isVerified: CONTACTS[0].verified,
      isOnline: true,
      hasStories: true,
      lastMessage: 'Last sent/received message goes here',
      timestamp: '10:09am',
      unreadCount: 4,
    },
    {
      id: '2',
      type: 'lift-request',
      contactId: CONTACTS[0].id,
      contactName: CONTACTS[0].name,
      contactUsername: CONTACTS[0].username,
      contactAvatar:
        typeof CONTACTS[0].avatar === 'object' && 'uri' in CONTACTS[0].avatar
          ? CONTACTS[0].avatar.uri
          : undefined,
      isVerified: CONTACTS[0].verified,
      isOnline: true,
      liftTitle: 'Help Isaac build his workspace',
      liftAmount: 10000,
      liftStatus: 'pending',
      timestamp: '10:09am',
    },
    {
      id: '3',
      type: 'group',
      groupName: 'Isaac Akinyemi, Tolu Ayoade',
      groupMembers: [
        { id: '1', avatar: 'https://i.pravatar.cc/150?img=1' },
        { id: '2', avatar: 'https://i.pravatar.cc/150?img=12' },
        { id: '3', avatar: 'https://i.pravatar.cc/150?img=5' },
      ],
      lastMessage: 'Last sent message goes here. A group...',
      timestamp: '10:09am',
    },
    {
      id: '4',
      type: 'direct',
      contactId: CONTACTS[1]?.id,
      contactName: CONTACTS[1]?.name,
      contactUsername: CONTACTS[1]?.username,
      contactAvatar:
        typeof CONTACTS[1]?.avatar === 'object' && 'uri' in CONTACTS[1].avatar
          ? CONTACTS[1].avatar.uri
          : undefined,
      isVerified: CONTACTS[1]?.verified,
      lastMessage: 'Last sent/received message goes here',
      timestamp: '09:45am',
      unreadCount: 2,
    },
    {
      id: '5',
      type: 'lift-offer',
      contactId: CONTACTS[0].id,
      contactName: CONTACTS[0].name,
      contactUsername: CONTACTS[0].username,
      contactAvatar:
        typeof CONTACTS[0].avatar === 'object' && 'uri' in CONTACTS[0].avatar
          ? CONTACTS[0].avatar.uri
          : undefined,
      isVerified: CONTACTS[0].verified,
      liftTitle: 'Help Isaac build his workspace',
      liftAmount: 10000,
      liftStatus: 'pending',
      timestamp: '08:30am',
    },
  ];

  const filters = [
    { id: 'all', label: 'All', count: allMessages.length },
    {
      id: 'unread',
      label: 'Unread',
      count: allMessages.filter((m) => m.unreadCount && m.unreadCount > 0)
        .length,
    },
    {
      id: 'lifts',
      label: 'Lifts',
      count: allMessages.filter(
        (m) => m.type === 'lift-request' || m.type === 'lift-offer'
      ).length,
    },
    {
      id: 'groups',
      label: 'Groups',
      count: allMessages.filter((m) => m.type === 'group').length,
    },
    {
      id: 'requests',
      label: 'Message Requests',
      count: messageRequests.length,
    },
  ];

  const filteredMessages = allMessages.filter((message) => {
    switch (activeFilter) {
      case 'unread':
        return (message.unreadCount || 0) > 0;
      case 'lifts':
        return message.type === 'lift-request' || message.type === 'lift-offer';
      case 'groups':
        return message.type === 'group';
      case 'requests':
        return false; // Don't show regular messages when viewing requests
      default:
        return true;
    }
  });

  const handleMessageRequestPress = (request: MessageRequest) => {
    router.push(`/message-request/${request.id}` as any);
  };

  const hasMessages = allMessages.length > 0;

  const handleStartConversation = () => {
    router.push('/new-message' as any);
  };

  const handleMessagePress = (message: Message) => {
    if (message.type === 'group' && message.groupMembers) {
      const groupId = message.groupMembers.map((m) => m.id).join(',');
      router.push(`/chat/group/${groupId}` as any);
    } else if (message.contactId) {
      router.push(`/chat/${message.contactId}` as any);
    }
  };

  const handleFABPress = () => {
    router.push('/new-message' as any);
  };

  // Empty State View
  if (!hasMessages) {
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
            Messages
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
              <MessagingIllustration width={150} height={150} />
            </View>

            {/* Title */}
            <Text className="mb-4 text-center text-lg font-inter-semibold text-grey-alpha-500">
              No messages yet
            </Text>

            {/* Description */}
            <Text className="mb-8 text-center text-sm leading-5 text-grey-plain-550">
              Chat with people, receive requests, accept or decline offers,
              manage collaboration invites, and more.
            </Text>

            {/* User Avatars Row */}
            <View className="mb-8 flex-row items-center">
              {['Alex', 'Sam', 'Jordan', 'Taylor', 'Casey'].map(
                (name, index) => (
                  <View
                    key={name}
                    className="rounded-full border-2 border-white"
                    style={{
                      marginLeft: index > 0 ? -12 : 0,
                      zIndex: 5 - index,
                    }}
                  >
                    <Avatar size={40} showBadge={false} name={name} />
                  </View>
                )
              )}
            </View>

            {/* Start Conversation Button */}
            <Button
              title="Start a conversation"
              onPress={handleStartConversation}
              variant="primary"
              size="medium"
              className="min-w-[200px]"
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Messages List View
  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'bottom']}>
      {/* Header */}
      <View className="flex-row items-center justify-between border-b border-grey-plain-150 bg-white px-4 py-3">
        <View className="flex-1 flex-row items-center">
          <TouchableOpacity onPress={() => router.back()} className="mr-3">
            <CornerUpLeft
              color={colors['grey-plain']['550']}
              size={24}
              strokeWidth={2}
            />
          </TouchableOpacity>
          <Text className="text-lg font-inter-semibold text-grey-alpha-500">
            Messages
          </Text>
        </View>
        <View className="flex-row items-center gap-4">
          <TouchableOpacity className="p-1">
            <Search
              color={colors['grey-plain']['550']}
              size={24}
              strokeWidth={2}
            />
          </TouchableOpacity>
          <TouchableOpacity className="p-1">
            <Settings
              color={colors['grey-plain']['550']}
              size={24}
              strokeWidth={2}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Stories Section */}
      <MessagesStoriesSection />

      {/* Filter Tabs */}
      <FilterTabs
        filters={filters}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        showCounts={true}
        scrollable={true}
        contentContainerClassName="py-3"
      />

      {/* Messages List */}
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {activeFilter === 'requests' ? (
          messageRequests.length > 0 ? (
            messageRequests.map((request) => (
              <MessageRequestItem
                key={request.id}
                request={request}
                onPress={handleMessageRequestPress}
              />
            ))
          ) : (
            <View className="flex-1 items-center justify-center px-6 py-12">
              <Text className="mb-2 text-center text-base font-inter-semibold text-grey-alpha-500">
                No message requests
              </Text>
              <Text className="text-center text-sm text-grey-plain-550">
                You don&apos;t have any pending message requests at the moment.
              </Text>
            </View>
          )
        ) : filteredMessages.length > 0 ? (
          filteredMessages.map((message) => (
            <MessageListItem
              key={message.id}
              message={message}
              onPress={handleMessagePress}
            />
          ))
        ) : (
          <View className="flex-1 items-center justify-center px-6 py-12">
            <Text className="mb-2 text-center text-base font-inter-semibold text-grey-alpha-500">
              No messages
            </Text>
            <Text className="text-center text-sm text-grey-plain-550">
              You don&apos;t have any messages in this category.
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Floating Action Button */}
      <FloatingActionButton onPress={handleFABPress} visible={true} />
    </SafeAreaView>
  );
}
