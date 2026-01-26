import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import {
  CornerUpLeft,
  MoreVertical,
  FileText,
  FileImage,
  FileAudio,
  FileVideo,
  X,
} from 'lucide-react-native';
import { Avatar } from '@/components/ui/Avatar';
import { colors } from '@/theme/colors';
import { AttachmentBottomSheet } from '@/components/chat/AttachmentBottomSheet';
import {
  MediaSelectionScreen,
  MediaItem,
} from '@/components/chat/MediaSelectionScreen';
import { MediaPreviewScreen } from '@/components/chat/MediaPreviewScreen';
import { CONTACTS } from '@/components/request-lift/data';
import { ChatMessageBar } from '@/components/chat/ChatMessageBar';
import { Image } from 'expo-image';
import PdfIcon from '@/assets/images/file-type-pdf.svg';

interface TextMessage {
  id: string;
  type: 'text';
  text: string;
  isSent: boolean;
  timestamp: string;
  isSeen?: boolean;
}

interface MediaMessage {
  id: string;
  type: 'media';
  media: MediaItem[];
  caption?: string;
  isSent: boolean;
  timestamp: string;
  isSeen?: boolean;
}

interface DocumentAttachment {
  uri: string;
  name: string;
  size?: number;
  mimeType?: string;
}

interface DocumentMessage {
  id: string;
  type: 'document';
  document: DocumentAttachment;
  isSent: boolean;
  timestamp: string;
  isSeen?: boolean;
}

type Message = TextMessage | MediaMessage | DocumentMessage;

export default function GroupChatScreen() {
  const { ids } = useLocalSearchParams<{ ids: string }>();
  const [message, setMessage] = useState('');
  const [showAttachmentSheet, setShowAttachmentSheet] = useState(false);
  const [showMediaSelection, setShowMediaSelection] = useState(false);
  const [showMediaPreview, setShowMediaPreview] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<MediaItem[]>([]);
  const [pendingMediaPreview, setPendingMediaPreview] = useState(false);
  const [selectedDocuments, setSelectedDocuments] = useState<
    DocumentAttachment[]
  >([]);
  const [messages, setMessages] = useState<Message[]>([]);
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
    if (selectedDocuments.length > 0) {
      const timestamp = formatTimestamp(new Date());
      setMessages((prev) => [
        ...prev,
        ...selectedDocuments.map((doc, index) => ({
          id: `${Date.now()}-${index}`,
          type: 'document' as const,
          document: doc,
          isSent: true,
          isSeen: true,
          timestamp,
        })),
      ]);
      setSelectedDocuments([]);
      setMessage('');
      return;
    }

    if (message.trim()) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          type: 'text',
          text: message.trim(),
          isSent: true,
          isSeen: true,
          timestamp: formatTimestamp(new Date()),
        },
      ]);
      setMessage('');
    }
  };

  const handleAttachmentSelect = (
    type: 'gallery' | 'camera' | 'document' | 'audio'
  ) => {
    setShowAttachmentSheet(false);
    if (type === 'gallery' || type === 'camera') {
      if (type === 'camera') {
        handleOpenCamera();
        return;
      }
      setShowMediaSelection(true);
      return;
    }
    if (type === 'document') {
      handlePickDocument();
      return;
    }
    if (type === 'audio') handlePickAudio();
  };

  const handleMediaSelected = (media: MediaItem[]) => {
    setSelectedMedia(media);
    setShowMediaSelection(false);
    setPendingMediaPreview(true);
  };

  useEffect(() => {
    if (!pendingMediaPreview) return;
    if (showMediaSelection) return;
    if (selectedMedia.length === 0) return;
    const timeout = setTimeout(() => {
      setShowMediaPreview(true);
      setPendingMediaPreview(false);
    }, 250);
    return () => clearTimeout(timeout);
  }, [pendingMediaPreview, selectedMedia.length, showMediaSelection]);

  const handleOpenCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('Camera permission is required to take a photo or video.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      const captured: MediaItem = {
        id: Date.now().toString(),
        uri: asset.uri,
        type: asset.type === 'video' ? 'video' : 'image',
        fileName: asset.fileName ?? undefined,
      };
      setSelectedMedia([captured]);
      setShowMediaPreview(true);
    }
  };

  const handlePickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        multiple: true,
        copyToCacheDirectory: true,
      });

      if (result.canceled) return;
      const files = result.assets.map((file) => ({
        uri: file.uri,
        name: file.name,
        size: file.size,
        mimeType: file.mimeType,
      }));
      setSelectedDocuments((prev) => [...prev, ...files]);
    } catch (error) {
      console.log('Document picker error:', error);
    }
  };

  const handlePickAudio = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        multiple: true,
        copyToCacheDirectory: true,
        type: ['audio/*'],
      });

      if (result.canceled) return;
      const files = result.assets.map((file) => ({
        uri: file.uri,
        name: file.name,
        size: file.size,
        mimeType: file.mimeType,
      }));
      setSelectedDocuments((prev) => [...prev, ...files]);
    } catch (error) {
      console.log('Audio picker error:', error);
    }
  };

  const formatTimestamp = (date: Date) => {
    return date
      .toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      })
      .replace(' ', '')
      .toLowerCase();
  };

  const formatFileSize = (size?: number) => {
    if (!size) return '';
    const kb = size / 1024;
    if (kb < 1024) return `${Math.round(kb)}kb`;
    return `${(kb / 1024).toFixed(1)}mb`;
  };

  const renderDocumentIcon = (mimeType?: string, size = 22) => {
    if (mimeType?.includes('pdf')) return <PdfIcon width={size} height={size} />;
    if (mimeType?.startsWith('image/'))
      return <FileImage size={size} color={colors['grey-plain']['50']} />;
    if (mimeType?.startsWith('audio/'))
      return <FileAudio size={size} color={colors['grey-plain']['50']} />;
    if (mimeType?.startsWith('video/'))
      return <FileVideo size={size} color={colors['grey-plain']['50']} />;
    return <FileText size={size} color={colors['grey-plain']['50']} />;
  };

  const handleRemoveSelectedDocument = (uri: string) => {
    setSelectedDocuments((prev) => prev.filter((doc) => doc.uri !== uri));
  };

  const handleSendMedia = (caption: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        type: 'media',
        media: selectedMedia,
        caption: caption.trim() ? caption.trim() : undefined,
        isSent: true,
        isSeen: true,
        timestamp: formatTimestamp(new Date()),
      },
    ]);
    setShowMediaPreview(false);
    setSelectedMedia([]);
    setMessage('');
  };

  const handleOpenAttachmentSheet = () => {
    setShowAttachmentSheet(true);
    attachmentSheetRef.current?.expand();
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
                    className="text-xs font-bold"
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
            <Text className="text-base font-semibold text-grey-alpha-500">
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
          {messages.map((msg) => {
            if (msg.type === 'media') {
              const preview = msg.media[0];
              return (
                <View
                  key={msg.id}
                  className={`mb-4 ${msg.isSent ? 'items-end' : 'items-start'}`}
                >
                  <View className="max-w-[80%] rounded-2xl bg-grey-plain-150 p-3">
                    <View className="overflow-hidden rounded-2xl">
                      {preview?.type === 'image' ? (
                        <Image
                          source={{ uri: preview.uri }}
                          style={{ width: 220, height: 220 }}
                          contentFit="cover"
                        />
                      ) : (
                        <View className="items-center justify-center bg-black">
                          <Text className="text-white">Video preview</Text>
                        </View>
                      )}
                    </View>
                    {msg.media.length > 1 && (
                      <View
                        className="absolute right-4 top-4 rounded-full px-2 py-1"
                        style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
                      >
                        <Text className="text-xs font-medium text-white">
                          1 of {msg.media.length}
                        </Text>
                      </View>
                    )}
                    {msg.caption && (
                      <Text className="mt-2 text-base text-grey-alpha-500">
                        {msg.caption}
                      </Text>
                    )}
                    <View className="mt-2 flex-row items-center gap-2">
                      <Text className="text-xs text-grey-plain-550">
                        {msg.timestamp}
                      </Text>
                      {msg.isSent && msg.isSeen && (
                        <Text className="text-xs text-grey-plain-550">
                          • Seen
                        </Text>
                      )}
                    </View>
                  </View>
                </View>
              );
            }

            if (msg.type === 'document') {
              return (
                <View
                  key={msg.id}
                  className={`mb-4 ${msg.isSent ? 'items-end' : 'items-start'}`}
                >
                  <View className="max-w-[85%] rounded-2xl bg-grey-plain-150 p-4">
                    <View className="flex-row items-center justify-between">
                      <View className="flex-row items-center gap-3">
                        <View
                          className="items-center justify-center rounded-2xl"
                          style={{
                            width: 56,
                            height: 56,
                            backgroundColor: colors.primary.purple,
                          }}
                        >
                          {renderDocumentIcon(msg.document.mimeType, 28)}
                        </View>
                        <View className="flex-1">
                          <Text
                            className="text-base font-semibold text-grey-alpha-500"
                            numberOfLines={1}
                          >
                            {msg.document.name}
                          </Text>
                          <Text className="text-sm text-grey-plain-550">
                            {msg.document.mimeType?.toUpperCase() || 'FILE'}
                            {msg.document.size
                              ? ` • ${formatFileSize(msg.document.size)}`
                              : ''}
                          </Text>
                        </View>
                      </View>
                    </View>
                    <View className="mt-3 flex-row items-center gap-2">
                      <Text className="text-xs text-grey-plain-550">
                        {msg.timestamp}
                      </Text>
                      {msg.isSent && msg.isSeen && (
                        <Text className="text-xs text-grey-plain-550">
                          • Seen
                        </Text>
                      )}
                    </View>
                  </View>
                </View>
              );
            }

            return (
              <View
                key={msg.id}
                className={`mb-4 ${msg.isSent ? 'items-end' : 'items-start'}`}
              >
                <View className="max-w-[80%] rounded-2xl bg-grey-plain-150 px-4 py-3">
                  <Text className="text-base text-grey-alpha-500">
                    {msg.text}
                  </Text>
                  <View className="mt-2 flex-row items-center gap-2">
                    <Text className="text-xs text-grey-plain-550">
                      {msg.timestamp}
                    </Text>
                    {msg.isSent && msg.isSeen && (
                      <Text className="text-xs text-grey-plain-550">
                        • Seen
                      </Text>
                    )}
                  </View>
                </View>
              </View>
            );
          })}
        </ScrollView>

        {selectedDocuments.length > 0 && (
          <View className="border-t border-grey-plain-150 bg-white px-4 pt-3">
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 12 }}
            >
              {selectedDocuments.map((doc) => (
                <View
                  key={doc.uri}
                  className="flex-row items-center gap-3 rounded-2xl px-3 py-2"
                  style={{ backgroundColor: colors['grey-plain']['100'] }}
                >
                  <View
                    className="items-center justify-center rounded-xl"
                    style={{
                      width: 36,
                      height: 36,
                      backgroundColor: colors.primary.purple,
                    }}
                  >
                    {renderDocumentIcon(doc.mimeType, 18)}
                  </View>
                  <View style={{ maxWidth: 180 }}>
                    <Text
                      className="text-sm font-semibold text-grey-alpha-500"
                      numberOfLines={1}
                    >
                      {doc.name}
                    </Text>
                    <Text className="text-xs text-grey-plain-550">
                      {doc.mimeType?.toUpperCase() || 'FILE'}
                      {doc.size ? ` • ${formatFileSize(doc.size)}` : ''}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => handleRemoveSelectedDocument(doc.uri)}
                    className="items-center justify-center rounded-full"
                    style={{
                      width: 28,
                      height: 28,
                      backgroundColor: colors['grey-plain']['150'],
                    }}
                  >
                    <X size={16} color={colors['grey-plain']['550']} />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        <ChatMessageBar
          message={message}
          onChangeMessage={setMessage}
          onSend={handleSendMessage}
          onOpenAttachments={handleOpenAttachmentSheet}
          onOpenCamera={handleOpenAttachmentSheet}
          hasAttachments={selectedDocuments.length > 0}
        />

        {/* Attachment Bottom Sheet */}
        <AttachmentBottomSheet
          ref={attachmentSheetRef}
          visible={showAttachmentSheet}
          onSelectAttachment={handleAttachmentSelect}
          onClose={() => setShowAttachmentSheet(false)}
        />

        <MediaSelectionScreen
          visible={showMediaSelection}
          onClose={() => setShowMediaSelection(false)}
          onProceed={handleMediaSelected}
          maxSelection={10}
          autoProceedOnPick
        />

        <MediaPreviewScreen
          visible={showMediaPreview}
          media={selectedMedia}
          onClose={() => {
            setShowMediaPreview(false);
            setSelectedMedia([]);
          }}
          onSend={handleSendMedia}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
