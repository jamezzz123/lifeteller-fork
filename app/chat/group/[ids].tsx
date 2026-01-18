import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput as RNTextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import {
  CornerUpLeft,
  MoreVertical,
  Smile,
  Paperclip,
  Camera,
  Mic,
} from 'lucide-react-native';
import { Avatar } from '@/components/ui/Avatar';
import { colors } from '@/theme/colors';
import { AttachmentBottomSheet } from '@/components/chat/AttachmentBottomSheet';
import { CONTACTS } from '@/components/request-lift/data';

export default function GroupChatScreen() {
  const { ids } = useLocalSearchParams<{ ids: string }>();
  const [message, setMessage] = useState('');
  const [showAttachmentSheet, setShowAttachmentSheet] = useState(false);
  const attachmentSheetRef = useRef<any>(null);

  // Parse contact IDs from route params
  const contactIds = ids?.split(',') || [];
  const groupMembers = CONTACTS.filter((contact) =>
    contactIds.includes(contact.id)
  );

  // Generate group name from member names
  const groupName =
    groupMembers.length > 0
      ? groupMembers
          .slice(0, 3)
          .map((m) => m.name.split(' ')[0])
          .join(', ') + (groupMembers.length > 3 ? '...' : '')
      : 'Group Chat';

  const memberCount = groupMembers.length;

  const handleSendMessage = () => {
    if (message.trim()) {
      // TODO: Send message via API
      setMessage('');
    }
  };

  const handleAttachmentSelect = (
    type: 'gallery' | 'camera' | 'document' | 'audio'
  ) => {
    // TODO: Handle attachment selection
    console.log('Selected attachment type:', type);
    setShowAttachmentSheet(false);
  };

  // Create group avatar from first few members
  const groupAvatarMembers = groupMembers.slice(0, 4);

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        {/* Header */}
        <View className="flex-row items-center border-b border-grey-plain-150 bg-white px-4 py-3">
          <TouchableOpacity onPress={() => router.back()} className="mr-3">
            <CornerUpLeft
              color={colors['grey-plain']['550']}
              size={24}
              strokeWidth={2}
            />
          </TouchableOpacity>

          {/* Group Avatar - Collage of member avatars */}
          <View className="mr-3">
            <View
              className="relative overflow-hidden rounded-full border-2 border-white"
              style={{
                width: 40,
                height: 40,
                backgroundColor: colors['grey-plain']['300'],
              }}
            >
              {groupAvatarMembers.length > 0 ? (
                <>
                  {/* Top Left */}
                  {groupAvatarMembers[0] && (
                    <View
                      className="absolute overflow-hidden"
                      style={{
                        left: 0,
                        top: 0,
                        width: 20,
                        height: 20,
                        borderTopLeftRadius: 20,
                      }}
                    >
                      <Avatar
                        profileImage={
                          typeof groupAvatarMembers[0].avatar === 'object' &&
                          'uri' in groupAvatarMembers[0].avatar
                            ? groupAvatarMembers[0].avatar.uri
                            : undefined
                        }
                        name={groupAvatarMembers[0].name}
                        size={20}
                        showBadge={false}
                      />
                    </View>
                  )}
                  {/* Top Right */}
                  {groupAvatarMembers[1] && (
                    <View
                      className="absolute overflow-hidden"
                      style={{
                        right: 0,
                        top: 0,
                        width: 20,
                        height: 20,
                        borderTopRightRadius: 20,
                      }}
                    >
                      <Avatar
                        profileImage={
                          typeof groupAvatarMembers[1].avatar === 'object' &&
                          'uri' in groupAvatarMembers[1].avatar
                            ? groupAvatarMembers[1].avatar.uri
                            : undefined
                        }
                        name={groupAvatarMembers[1].name}
                        size={20}
                        showBadge={false}
                      />
                    </View>
                  )}
                  {/* Bottom Left */}
                  {groupAvatarMembers[2] && (
                    <View
                      className="absolute overflow-hidden"
                      style={{
                        left: 0,
                        bottom: 0,
                        width: 20,
                        height: 20,
                        borderBottomLeftRadius: 20,
                      }}
                    >
                      <Avatar
                        profileImage={
                          typeof groupAvatarMembers[2].avatar === 'object' &&
                          'uri' in groupAvatarMembers[2].avatar
                            ? groupAvatarMembers[2].avatar.uri
                            : undefined
                        }
                        name={groupAvatarMembers[2].name}
                        size={20}
                        showBadge={false}
                      />
                    </View>
                  )}
                  {/* Bottom Right */}
                  {groupAvatarMembers[3] && (
                    <View
                      className="absolute overflow-hidden"
                      style={{
                        right: 0,
                        bottom: 0,
                        width: 20,
                        height: 20,
                        borderBottomRightRadius: 20,
                      }}
                    >
                      <Avatar
                        profileImage={
                          typeof groupAvatarMembers[3].avatar === 'object' &&
                          'uri' in groupAvatarMembers[3].avatar
                            ? groupAvatarMembers[3].avatar.uri
                            : undefined
                        }
                        name={groupAvatarMembers[3].name}
                        size={20}
                        showBadge={false}
                      />
                    </View>
                  )}
                </>
              ) : (
                <View
                  className="h-full w-full items-center justify-center"
                  style={{
                    backgroundColor: colors['grey-plain']['300'],
                  }}
                >
                  <Text
                    className="text-xs font-inter-bold"
                    style={{ color: colors['grey-plain']['550'] }}
                  >
                    G
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Group Info */}
          <View className="flex-1">
            <Text className="text-base font-inter-semibold text-grey-alpha-500">
              {groupName}
            </Text>
            <Text className="text-sm text-grey-plain-550">
              {memberCount} {memberCount === 1 ? 'person' : 'people'}
            </Text>
          </View>

          {/* More Options */}
          <TouchableOpacity className="p-1">
            <MoreVertical color={colors['grey-plain']['550']} size={24} />
          </TouchableOpacity>
        </View>

        {/* Chat Content */}
        <ScrollView
          className="flex-1 bg-white"
          contentContainerStyle={{
            flexGrow: 1,
            paddingVertical: 16,
            paddingHorizontal: 16,
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* Delivery Notice */}
          <View className="mb-4 items-center">
            <View
              className="rounded-2xl px-4 py-3"
              style={{ backgroundColor: colors['grey-plain']['150'] }}
            >
              <Text className="text-center text-sm text-grey-plain-550">
                Your message will deliver individually
              </Text>
            </View>
          </View>

          {/* Messages will appear here */}
          {/* TODO: Add group messages */}
        </ScrollView>

        {/* Message Input Bar */}
        <View className="border-t border-grey-plain-150 bg-white px-4 py-3">
          <View className="flex-row items-center gap-3">
            <TouchableOpacity className="p-1">
              <Smile color={colors['grey-plain']['550']} size={24} />
            </TouchableOpacity>

            <View className="flex-1 flex-row items-center rounded-full border border-grey-plain-300 bg-grey-plain-50 px-4 py-2">
              <RNTextInput
                value={message}
                onChangeText={setMessage}
                placeholder="Start a message..."
                placeholderTextColor={colors['grey-alpha']['400']}
                className="flex-1 text-base text-grey-alpha-500"
                style={{ fontSize: 16 }}
                multiline
                maxLength={500}
              />
            </View>

            <TouchableOpacity
              onPress={() => setShowAttachmentSheet(true)}
              className="p-1"
            >
              <Paperclip color={colors['grey-plain']['550']} size={24} />
            </TouchableOpacity>

            <TouchableOpacity className="p-1">
              <Camera color={colors['grey-plain']['550']} size={24} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSendMessage}
              className="items-center justify-center rounded-full"
              style={{
                width: 48,
                height: 48,
                backgroundColor: colors.primary.purple,
              }}
            >
              <Mic color={colors['grey-plain']['50']} size={24} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Attachment Bottom Sheet */}
        <AttachmentBottomSheet
          ref={attachmentSheetRef}
          visible={showAttachmentSheet}
          onSelectAttachment={handleAttachmentSelect}
          onClose={() => setShowAttachmentSheet(false)}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
