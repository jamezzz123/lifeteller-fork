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
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import {
  CornerUpLeft,
  Video,
  Phone,
  MoreVertical,
  Smile,
  Paperclip,
  Camera,
  Mic,
  SendHorizontal,
  HandHelping,
  HandCoins,
  BadgeCheck,
  X,
  FileText,
  FileImage,
  FileAudio,
  FileVideo,
} from 'lucide-react-native';
import { ChatStarterCard } from '@/components/chat/ChatStarterCard';
import { Avatar } from '@/components/ui/Avatar';
import { colors } from '@/theme/colors';
import { AttachmentBottomSheet } from '@/components/chat/AttachmentBottomSheet';
import { ChatOptionsMenu } from '@/components/chat/ChatOptionsMenu';
import {
  MediaSelectionScreen,
  MediaItem,
} from '@/components/chat/MediaSelectionScreen';
import { MediaPreviewScreen } from '@/components/chat/MediaPreviewScreen';
import {
  LiftMessageCard,
  LiftMessageType,
} from '@/components/chat/LiftMessageCard';
import { Image } from 'expo-image';
import PdfIcon from '@/assets/images/file-type-pdf.svg';
import { MessageActionMenu } from '@/components/chat/MessageActionMenu';
import { CONTACTS } from '@/components/request-lift/data';
import * as Haptics from 'expo-haptics';

interface TextMessage {
  id: string;
  type: 'text';
  text: string;
  isSent: boolean;
  timestamp: string;
  isSeen?: boolean;
  isForwarded?: boolean;
}

interface LiftMessage {
  id: string;
  type: 'lift';
  liftType: LiftMessageType;
  title: string;
  amount: number;
  status?: 'pending' | 'offered' | 'accepted' | 'declined';
  isSent: boolean;
  timestamp: string;
  isSeen?: boolean;
  recipientName?: string; // For appreciation message
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

type Message = TextMessage | LiftMessage | MediaMessage | DocumentMessage;

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [message, setMessage] = useState('');
  const [showAttachmentSheet, setShowAttachmentSheet] = useState(false);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [showMediaSelection, setShowMediaSelection] = useState(false);
  const [showMediaPreview, setShowMediaPreview] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<MediaItem[]>([]);
  const [selectedDocuments, setSelectedDocuments] = useState<
    DocumentAttachment[]
  >([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [showMessageMenu, setShowMessageMenu] = useState(false);
  const attachmentSheetRef = useRef<any>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const hasMessage = message.trim().length > 0;
  const hasAttachment = selectedDocuments.length > 0;

  // Find contact by ID
  const contact = CONTACTS.find((c) => c.id === id) || CONTACTS[0];

  // Mock: Check if this is a new conversation
  // In production, this would come from API - check if conversation exists
  // For testing: contacts with IDs not in the first 3 will show as new conversations
  const isNewConversationMock = !['1', '2', '3'].includes(id || '');

  // Mock messages - in production, this would come from API
  // For new conversations, messages array will be empty
  const [messages, setMessages] = useState<Message[]>(
    isNewConversationMock
      ? [] // Empty array for new conversation
      : [
          {
            id: '1',
            type: 'text',
            text: 'Hello, Isaac. I hope you are doing well today',
            isSent: true,
            timestamp: '06:30am',
            isSeen: true,
          },
          {
            id: '2',
            type: 'text',
            text: 'Good day, Chief. How your side now?',
            isSent: false,
            timestamp: '06:35am',
          },
          {
            id: '3',
            type: 'text',
            text: 'Hi Isaac. Well done on the great work so far.',
            isSent: true,
            timestamp: '06:40am',
            isSeen: true,
          },
          // Lift Request - User receives a lift request
          {
            id: '4',
            type: 'lift',
            liftType: 'lift-request',
            title: 'Help Isaac build his workspace',
            amount: 10000,
            status: 'pending',
            isSent: false,
            timestamp: '06:45am',
          },
          // Lift Offer - User receives a lift offer
          {
            id: '5',
            type: 'lift',
            liftType: 'lift-offer',
            title: 'Help Isaac build his workspace',
            amount: 10000,
            status: 'pending',
            isSent: false,
            timestamp: '06:50am',
          },
          // Lift Collaboration - User receives a collaboration request
          {
            id: '6',
            type: 'lift',
            liftType: 'lift-collaboration',
            title: 'Help Isaac build his workspace',
            amount: 10000,
            status: 'pending',
            isSent: false,
            timestamp: '06:55am',
          },
          {
            id: '7',
            type: 'text',
            text: 'The guide "Thrive in Uncertainty with the Latest B2B SaaS Guide for Startups" outlines strategies for building and scaling a successful B2B SaaS company, even in challenging economic times. It emphasizes the importance of thorough market research to ensure product-market fit, early validation through MVPs, and targeting niche markets as SaaS shifts from horizontal to vertical solutions. Winning customers requires clear sales strategies, early lead qualification, and leveraging champions within target companies, while offering workshops or free trials can accelerate adoption. Pricing strategies should align with customer value, and growth should focus on metrics like churn and revenue retention (NRR) to ensure customer satisfaction and scalability. Startups are encouraged to outsource non-core...',
            isSent: false,
            timestamp: '07:00am',
          },
          // Lift Offer Sent - User has sent an offer (their perspective)
          {
            id: '8',
            type: 'lift',
            liftType: 'lift-offer-sent',
            title: 'Help Isaac build his workspace',
            amount: 10000,
            status: 'pending',
            isSent: true,
            timestamp: '07:05am',
            isSeen: true,
          },
          // Lift Request Offered - Request has been offered
          {
            id: '9',
            type: 'lift',
            liftType: 'lift-request-offered',
            title: 'Help Isaac build his workspace',
            amount: 10000,
            status: 'offered',
            isSent: true,
            timestamp: '07:10am',
            isSeen: true,
            recipientName: contact.name.split(' ')[0], // First name for appreciation message
          },
        ]
  );

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
      // TODO: Send message via API
      setMessage('');
    }
  };

  const handleAttachmentSelect = (
    type: 'gallery' | 'camera' | 'document' | 'audio'
  ) => {
    setShowAttachmentSheet(false);

    if (type === 'gallery') {
      setShowMediaSelection(true);
    } else if (type === 'camera') {
      handleOpenCamera();
    } else if (type === 'document') {
      handlePickDocument();
    } else if (type === 'audio') {
      handlePickAudio();
    } else {
      // TODO: Handle document and audio attachments
      console.log('Selected attachment type:', type);
    }
  };

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

  const handleMediaSelected = (media: MediaItem[]) => {
    setSelectedMedia(media);
    setShowMediaSelection(false);
    setShowMediaPreview(true);
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

  const handleSendMedia = (caption: string) => {
    // TODO: Send message with media via API
    console.log('Sending media:', selectedMedia, 'with caption:', caption);

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

    // Reset state
    setSelectedMedia([]);
    setShowMediaPreview(false);
    setMessage('');
  };

  const handleRequestLift = () => {
    // TODO: Navigate to request lift flow
    router.push('/request-lift' as any);
  };

  const handleOfferLift = () => {
    // TODO: Navigate to offer lift flow
    router.push('/offer-lift' as any);
  };

  const handleProfilePress = () => {
    // Navigate to user profile
    router.push(`/user/${contact.id}` as any);
  };

  const handleViewInfo = () => {
    router.push(`/chat/info/${contact.id}` as any);
  };

  const handleChatSettings = () => {
    // TODO: Navigate to chat settings screen
    console.log('Chat settings');
  };

  const handleViewProfile = () => {
    router.push(`/user/${contact.id}` as any);
  };

  const handleDeleteConversation = () => {
    // TODO: Show confirmation dialog and delete conversation
    console.log('Delete conversation');
  };

  const handleOfferLiftFromMessage = (liftId: string) => {
    // TODO: Navigate to offer lift flow with lift ID
    router.push('/offer-lift' as any);
  };

  const handleAcceptLift = (liftId: string) => {
    // TODO: Handle accept lift action
    console.log('Accept lift:', liftId);
  };

  const handleDeclineLift = (liftId: string) => {
    // TODO: Handle decline lift action
    console.log('Decline lift:', liftId);
  };

  const handleCancelOffer = (liftId: string) => {
    // TODO: Handle cancel offer action
    console.log('Cancel offer:', liftId);
  };

  const handleLongPressMessage = (msg: Message) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedMessage(msg);
    setShowMessageMenu(true);
  };

  const handleReply = () => {
    if (selectedMessage) {
      // TODO: Implement reply functionality
      console.log('Reply to message:', selectedMessage.id);
      // Could set a reply context or navigate to reply composer
    }
  };

  const handleCopy = () => {
    if (selectedMessage && selectedMessage.type === 'text') {
      // TODO: Copy to clipboard using Clipboard API
      console.log('Copy message:', selectedMessage.text);
    }
  };

  const handleForward = () => {
    if (selectedMessage) {
      // TODO: Navigate to forward screen
      console.log('Forward message:', selectedMessage.id);
      router.push('/new-message' as any);
    }
  };

  const handleDelete = () => {
    if (selectedMessage) {
      // TODO: Show confirmation dialog and delete message
      console.log('Delete message:', selectedMessage.id);
      setMessages((prev) => prev.filter((m) => m.id !== selectedMessage.id));
    }
  };

  const handleReact = (emoji: string) => {
    if (selectedMessage) {
      // TODO: Send reaction via API
      console.log(
        'React with emoji:',
        emoji,
        'to message:',
        selectedMessage.id
      );
    }
  };

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

          {/* Contact Info */}
          <TouchableOpacity
            className="mr-3"
            onPress={handleProfilePress}
            activeOpacity={0.7}
          >
            <Avatar
              profileImage={
                typeof contact.avatar === 'object' && 'uri' in contact.avatar
                  ? contact.avatar.uri
                  : undefined
              }
              name={contact.name}
              size={40}
              showBadge={true}
            />
            {/* Online Status Dot */}
            <View
              className="absolute bottom-0 right-0 rounded-full border-2 border-white"
              style={{
                width: 12,
                height: 12,
                backgroundColor: colors.state.green,
              }}
            />
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-1"
            onPress={handleProfilePress}
            activeOpacity={0.7}
          >
            <View className="mb-0.5 flex-row items-center gap-1.5">
              <Text className="text-base font-semibold text-grey-alpha-500">
                {contact.name}
              </Text>
              {contact.verified && (
                <BadgeCheck color={colors.primary.purple} size={16} />
              )}
            </View>
            <Text className="text-sm text-grey-plain-550">
              @{contact.username}
            </Text>
          </TouchableOpacity>

          {/* Action Buttons */}
          <View className="flex-row items-center gap-4">
            <TouchableOpacity className="p-1">
              <Video color={colors['grey-plain']['550']} size={24} />
            </TouchableOpacity>
            <TouchableOpacity className="p-1">
              <Phone color={colors['grey-plain']['550']} size={24} />
            </TouchableOpacity>
            <TouchableOpacity
              className="p-1"
              onPress={() => setShowOptionsMenu(true)}
            >
              <MoreVertical color={colors['grey-plain']['550']} size={24} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Chat Content */}
        <ScrollView
          ref={scrollViewRef}
          className="flex-1 bg-white"
          contentContainerStyle={{
            paddingVertical: 16,
            paddingHorizontal: 16,
            paddingBottom: 100, // Extra padding for fixed starter cards
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* Date Separator - Show only if there are messages */}
          {messages.length > 0 && (
            <View className="mb-4 flex-row items-center">
              <View className="flex-1 border-t border-grey-plain-300" />
              <Text className="mx-3 text-xs text-grey-plain-550">Today</Text>
              <View className="flex-1 border-t border-grey-plain-300" />
            </View>
          )}

          {/* Messages */}
          {messages.map((msg) => {
            if (msg.type === 'lift') {
              return (
                <TouchableOpacity
                  key={msg.id}
                  className={`mb-4 ${msg.isSent ? 'items-end' : 'items-start'}`}
                  onLongPress={() => handleLongPressMessage(msg)}
                  activeOpacity={0.9}
                  delayLongPress={300}
                >
                  <View className="max-w-[85%]">
                    <LiftMessageCard
                      type={msg.liftType}
                      title={msg.title}
                      amount={msg.amount}
                      status={msg.status}
                      timestamp={msg.timestamp}
                      recipientName={msg.recipientName}
                      isSent={msg.isSent}
                      onOfferLift={() => handleOfferLiftFromMessage(msg.id)}
                      onAccept={() => handleAcceptLift(msg.id)}
                      onDecline={() => handleDeclineLift(msg.id)}
                      onCancelOffer={() => handleCancelOffer(msg.id)}
                    />
                    {msg.isSent && msg.isSeen && (
                      <Text className="mt-1 text-right text-xs text-grey-plain-550">
                        Seen
                      </Text>
                    )}
                  </View>
                </TouchableOpacity>
              );
            }

            if (msg.type === 'media') {
              const preview = msg.media[0];
              return (
                <TouchableOpacity
                  key={msg.id}
                  className={`mb-4 ${msg.isSent ? 'items-end' : 'items-start'}`}
                  onLongPress={() => handleLongPressMessage(msg)}
                  activeOpacity={0.9}
                  delayLongPress={300}
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
                </TouchableOpacity>
              );
            }

            if (msg.type === 'document') {
              return (
                <TouchableOpacity
                  key={msg.id}
                  className={`mb-4 ${msg.isSent ? 'items-end' : 'items-start'}`}
                  onLongPress={() => handleLongPressMessage(msg)}
                  activeOpacity={0.9}
                  delayLongPress={300}
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
                </TouchableOpacity>
              );
            }

            // Text message
            return (
              <TouchableOpacity
                key={msg.id}
                className={`mb-4 ${msg.isSent ? 'items-end' : 'items-start'}`}
                onLongPress={() => handleLongPressMessage(msg)}
                activeOpacity={0.9}
                delayLongPress={300}
              >
                <View
                  className="max-w-[80%] rounded-2xl px-4 py-3"
                  style={{
                    backgroundColor: msg.isSent
                      ? colors['grey-plain']['150']
                      : colors['grey-plain']['150'],
                  }}
                >
                  {msg.isForwarded && (
                    <Text className="mb-1 text-xs italic text-grey-plain-550">
                      Forwarded
                    </Text>
                  )}
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
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Starter Messages and Action Cards - Only show when there are no messages */}
        {messages.length === 0 && (
          <View className="border-t border-grey-plain-150 bg-white px-4 py-3">
            {/* Starter Messages */}
            <View className="mb-4 gap-3">
              {[
                'Hello, Isaac. I hope you are doing well today',
                'Good day, Chief. How your side now?',
                'Hi Isaac. Well done on the great work so far.',
              ].map((starterText, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    setMessage(starterText);
                    // Auto-scroll to input
                    setTimeout(() => {
                      scrollViewRef.current?.scrollToEnd({
                        animated: true,
                      });
                    }, 100);
                  }}
                  className="items-start"
                  activeOpacity={0.7}
                >
                  <View
                    className="max-w-[80%] rounded-2xl px-4 py-3"
                    style={{
                      backgroundColor: colors['grey-plain']['150'],
                    }}
                  >
                    <Text className="text-base text-grey-alpha-500">
                      {starterText}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            {/* Starter Action Cards */}
            <View className="flex-row gap-3">
              <ChatStarterCard
                icon={HandHelping}
                title="Request lift"
                subtitle={`Request lift from ${contact.name.split(' ')[0]}`}
                onPress={handleRequestLift}
              />
              <ChatStarterCard
                icon={HandCoins}
                title="Offer lift"
                subtitle={`Offer ${contact.name.split(' ')[0]} lift`}
                onPress={handleOfferLift}
              />
            </View>
          </View>
        )}

        {/* Message Input Bar */}
        <View className="border-t border-grey-plain-150 bg-white px-4 py-3">
          {selectedDocuments.length > 0 && (
            <View className="mb-3 gap-2">
              {selectedDocuments.map((doc, index) => (
                <View
                  key={`${doc.uri}-${index}`}
                  className="rounded-2xl bg-grey-plain-150 p-3"
                >
                  <View className="flex-row items-center justify-between">
                    <View className="flex-1 flex-row items-center gap-3 pr-3">
                      <View
                        className="items-center justify-center rounded-2xl"
                        style={{
                          width: 48,
                          height: 48,
                          backgroundColor: colors.primary.purple,
                        }}
                      >
                        {renderDocumentIcon(doc.mimeType, 22)}
                      </View>
                      <View className="flex-1">
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
                    </View>
                    <TouchableOpacity
                      onPress={() =>
                        setSelectedDocuments((prev) =>
                          prev.filter((_, itemIndex) => itemIndex !== index)
                        )
                      }
                      className="size-8 items-center justify-center rounded-full bg-grey-plain-300"
                    >
                      <X size={18} color={colors['grey-plain']['600']} />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}
          <View className="flex-row items-start gap-3">
            <TouchableOpacity className="p-1">
              <Smile color={colors['grey-plain']['550']} size={24} />
            </TouchableOpacity>

            <View className="flex-1 flex-row items-center rounded-3xl border border-grey-plain-300 bg-grey-plain-50 px-4 py-2">
              <RNTextInput
                value={message}
                onChangeText={setMessage}
                placeholder="Start a message..."
                placeholderTextColor={colors['grey-alpha']['400']}
                className="flex-1 text-base text-grey-alpha-500"
                style={{
                  fontSize: 16,
                  textAlignVertical: 'center',
                  paddingVertical: 0,
                  minHeight: 20,
                }}
                multiline
                maxLength={500}
              />
            </View>

            <View className="flex flex-row items-center gap-3">
              <TouchableOpacity
                onPress={() => setShowAttachmentSheet(true)}
                className="p-1"
              >
                <Paperclip color={colors['grey-plain']['550']} size={24} />
              </TouchableOpacity>

              <TouchableOpacity className="p-1" onPress={handleOpenCamera}>
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
                {hasMessage || hasAttachment ? (
                  <SendHorizontal color={colors['grey-plain']['50']} size={24} />
                ) : (
                  <Mic color={colors['grey-plain']['50']} size={24} />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Attachment Bottom Sheet */}
        <AttachmentBottomSheet
          ref={attachmentSheetRef}
          visible={showAttachmentSheet}
          onSelectAttachment={handleAttachmentSelect}
          onClose={() => setShowAttachmentSheet(false)}
        />

        {/* Chat Options Menu */}
        <ChatOptionsMenu
          visible={showOptionsMenu}
          onClose={() => setShowOptionsMenu(false)}
          onViewInfo={handleViewInfo}
          onChatSettings={handleChatSettings}
          onViewProfile={handleViewProfile}
          onDeleteConversation={handleDeleteConversation}
        />

        {/* Media Selection Screen */}
        <MediaSelectionScreen
          visible={showMediaSelection}
          onClose={() => setShowMediaSelection(false)}
          onProceed={handleMediaSelected}
          maxSelection={10}
        />

        {/* Media Preview Screen */}
        <MediaPreviewScreen
          visible={showMediaPreview}
          media={selectedMedia}
          onClose={() => {
            setShowMediaPreview(false);
            setSelectedMedia([]);
          }}
          onSend={handleSendMedia}
        />

        {/* Message Action Menu */}
        <MessageActionMenu
          visible={showMessageMenu}
          messageId={selectedMessage?.id || ''}
          messageText={
            selectedMessage?.type === 'text' ? selectedMessage.text : undefined
          }
          timestamp={selectedMessage?.timestamp || ''}
          isSent={selectedMessage?.isSent || false}
          onClose={() => {
            setShowMessageMenu(false);
            setSelectedMessage(null);
          }}
          onReply={handleReply}
          onCopy={handleCopy}
          onForward={handleForward}
          onDelete={handleDelete}
          onReact={handleReact}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
