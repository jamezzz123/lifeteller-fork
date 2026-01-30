import React, { useMemo, useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  TextInput,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import {
  CornerUpLeft,
  BellDot,
  MessageSquareOff,
  CircleSlash,
  Trash2,
  BadgeCheck,
  Phone,
  Video,
  Search,
  ChevronRight,
  Headphones,
  FileText,
  Play,
  Star,
  Palette,
  CaseSensitive,
  CircleDotDashed,
  MessageSquareDashed,
  Pin,
  Pencil,
  Image as ImageIcon,
  Check,
  Users,
  ChevronDown,
  Share2,
  UserRoundPlus,
  Heart,
  CircleSlash2,
  MessageSquare,
  Link,
} from 'lucide-react-native';
import { SvgProps } from 'react-native-svg';
import LightThemePreview from '@/assets/images/theme/light.svg';
import SystemThemePreview from '@/assets/images/theme/system.svg';
import DarkThemePreview from '@/assets/images/theme/dark.svg';
import WhatsappIcon from '@/assets/icons/whatsapp.svg';
import InstagramIcon from '@/assets/icons/instagram.svg';
import TelegramIcon from '@/assets/icons/telegram.svg';
import MessengerIcon from '@/assets/icons/messenger.svg';
import FacebookIcon from '@/assets/icons/facebook.svg';
import SnapchatIcon from '@/assets/icons/snapchat.svg';
import { Button } from '@/components/ui/Button';
import { colors } from '@/theme/colors';
import { CONTACTS } from '@/components/request-lift/data';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { ConfirmationModal } from '@/components/ui/ConfirmationModal';
import { Avatar } from '@/components/ui/Avatar';
import { Toast } from '@/components/ui/Toast';
import { BottomSheetComponent, BottomSheetRef } from '@/components/ui/BottomSheet';
import { ToggleSwitch } from '@/components/ui/ToggleSwitch';

export default function ChatInfoScreen() {
  const { width } = Dimensions.get('window');
  const themeCardWidth = (width - 88) / 4;
  const themePreviewSize = themeCardWidth - 20;
  const { id } = useLocalSearchParams<{ id: string }>();
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [muteUserEnabled, setMuteUserEnabled] = useState(false);
  const [muteUserValue, setMuteUserValue] = useState('Off');
  const [muteUserDraft, setMuteUserDraft] = useState('Off');
  const [showMuteToast, setShowMuteToast] = useState(false);
  const [blockScreenshotsEnabled, setBlockScreenshotsEnabled] = useState(false);
  const [pendingBlockScreenshots, setPendingBlockScreenshots] = useState(false);
  const [showBlockScreenshotsConfirm, setShowBlockScreenshotsConfirm] =
    useState(false);
  const [showScreenshotsBlockedToast, setShowScreenshotsBlockedToast] =
    useState(false);
  const [showScreenshotsUnblockedToast, setShowScreenshotsUnblockedToast] =
    useState(false);
  const [disappearingMessagesEnabled, setDisappearingMessagesEnabled] =
    useState(false);
  const [disappearingMessagesValue, setDisappearingMessagesValue] =
    useState('Off');
  const [disappearingMessagesDraft, setDisappearingMessagesDraft] =
    useState('Off');
  const [showDisappearingToast, setShowDisappearingToast] = useState(false);
  const [pinChatEnabled, setPinChatEnabled] = useState(false);
  const [showPinToast, setShowPinToast] = useState(false);
  const [nickname, setNickname] = useState('');
  const [nicknameDraft, setNicknameDraft] = useState('');
  const [showEditNickname, setShowEditNickname] = useState(false);
  const [showDeleteNicknameConfirm, setShowDeleteNicknameConfirm] =
    useState(false);
  const [showNicknameUpdatedToast, setShowNicknameUpdatedToast] =
    useState(false);
  const [showNicknameDeletedToast, setShowNicknameDeletedToast] =
    useState(false);
  const [showBlockConfirm, setShowBlockConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showBlockToast, setShowBlockToast] = useState(false);
  const [showDeleteToast, setShowDeleteToast] = useState(false);
  const [isFavourite, setIsFavourite] = useState(false);
  const [showAddFavouriteToast, setShowAddFavouriteToast] = useState(false);
  const [showRemoveFavouriteToast, setShowRemoveFavouriteToast] =
    useState(false);
  const [selectedTheme, setSelectedTheme] = useState<
    'light' | 'system' | 'dark' | 'image'
  >('light');
  const nicknameSheetRef = useRef<BottomSheetRef>(null);
  const chatThemeSheetRef = useRef<BottomSheetRef>(null);
  const disappearingSheetRef = useRef<BottomSheetRef>(null);
  const muteSheetRef = useRef<BottomSheetRef>(null);
  const shareSheetRef = useRef<BottomSheetRef>(null);

  // Find contact by ID
  const contact = CONTACTS.find((c) => c.id === id) || CONTACTS[0];

  const resolvedNickname = nickname;

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

  const handleChatTheme = () => {
    chatThemeSheetRef.current?.expand();
  };

  const handleToggleBlockScreenshots = (nextValue: boolean) => {
    setPendingBlockScreenshots(nextValue);
    setShowBlockScreenshotsConfirm(true);
  };

  const handleConfirmBlockScreenshots = () => {
    setBlockScreenshotsEnabled(pendingBlockScreenshots);
    setShowBlockScreenshotsConfirm(false);
    if (pendingBlockScreenshots) {
      setShowScreenshotsBlockedToast(true);
    } else {
      setShowScreenshotsUnblockedToast(true);
    }
  };

  const handleCancelBlockScreenshots = () => {
    setShowBlockScreenshotsConfirm(false);
  };

  const handleNickname = () => {
    setNicknameDraft(resolvedNickname);
    nicknameSheetRef.current?.expand();
  };

  const handleOpenDisappearingMessages = () => {
    setDisappearingMessagesDraft(disappearingMessagesValue);
    disappearingSheetRef.current?.expand();
  };

  const handleConfirmDisappearingMessages = () => {
    setDisappearingMessagesValue(disappearingMessagesDraft);
    setDisappearingMessagesEnabled(disappearingMessagesDraft !== 'Off');
    disappearingSheetRef.current?.close();
    setShowDisappearingToast(true);
  };

  const handleOpenMuteUser = () => {
    setMuteUserDraft(muteUserValue);
    muteSheetRef.current?.expand();
  };

  const handleConfirmMuteUser = () => {
    setMuteUserValue(muteUserDraft);
    setMuteUserEnabled(muteUserDraft !== 'Off');
    muteSheetRef.current?.close();
    if (muteUserDraft !== 'Off') {
      setShowMuteToast(true);
    }
  };

  const handleTogglePinChat = (nextValue: boolean) => {
    setPinChatEnabled(nextValue);
    if (nextValue) {
      setShowPinToast(true);
    }
  };

  const handleToggleFavourite = () => {
    const nextValue = !isFavourite;
    setIsFavourite(nextValue);
    if (nextValue) {
      setShowAddFavouriteToast(true);
    } else {
      setShowRemoveFavouriteToast(true);
    }
  };

  const handleShareProfile = () => {
    shareSheetRef.current?.expand();
  };

  const handleCreateGroup = () => {
    router.push('/create-group' as any);
  };

  const handleReportUser = () => {
    router.push({
      pathname: '/report-user',
      params: { userId: contact.id, username: contact.username },
    } as any);
  };

  const handleOpenStarredMessages = () => {
    router.push(`/chat/starred/${contact.id}` as any);
  };

  const handleOpenEditNickname = () => {
    setNicknameDraft(resolvedNickname);
    setShowEditNickname(true);
  };

  const handleUpdateNickname = () => {
    const updatedNickname = nicknameDraft.trim();
    setNickname(updatedNickname);
    setShowEditNickname(false);
    setShowNicknameUpdatedToast(true);
  };

  const handleConfirmDeleteNickname = () => {
    setNickname('');
    setShowDeleteNicknameConfirm(false);
    setShowNicknameDeletedToast(true);
  };

  const mediaItems = useMemo(
    () => [
      {
        id: 'audio-1',
        type: 'audio' as const,
        label: '1:37',
      },
      {
        id: 'image-1',
        type: 'image' as const,
        source: require('../../../assets/images/welcome/collage-1.jpg'),
      },
      {
        id: 'doc-1',
        type: 'document' as const,
        label: '137kb',
      },
      {
        id: 'video-1',
        type: 'video' as const,
        source: require('../../../assets/images/welcome/collage-3.jpg'),
      },
    ],
    []
  );

  const groupsInCommon = useMemo(
    () => [
      {
        id: 'group-1',
        name: '{name of group goes here}',
        members: 'Member 1, Member 2, Member 3, Member 4',
        avatars: [
          require('../../../assets/images/welcome/collage-1.jpg'),
          require('../../../assets/images/welcome/collage-2.png'),
          require('../../../assets/images/welcome/collage-3.jpg'),
        ],
      },
      {
        id: 'group-2',
        name: '{name of group goes here}',
        members: 'Member 1, Member 2, Member 3, Member 4',
        avatars: [
          require('../../../assets/images/welcome/collage-4.jpg'),
          require('../../../assets/images/welcome/collage-5.jpg'),
          require('../../../assets/images/welcome/collage-6.jpg'),
        ],
      },
      {
        id: 'group-3',
        name: '{name of group goes here}',
        members: 'Member 1, Member 2, Member 3, Member 4',
        avatars: [
          require('../../../assets/images/welcome/collage-7.jpg'),
          require('../../../assets/images/welcome/collage-8.jpg'),
          require('../../../assets/images/welcome/collage-1.jpg'),
        ],
      },
    ],
    []
  );

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

        {/* Media, links, and docs Section  */}
        <View
          className="mx-4 mt-5 rounded-2xl p-2"
          style={{ backgroundColor: colors['grey-plain']['150'] }}
        >
            <TouchableOpacity
              className="flex-row items-center justify-between mb-4 ml-3 mt-2"
              activeOpacity={0.7}
            >
              <Text className="text-base font-semibold text-grey-alpha-500">
                Media, links, and docs
              </Text>
              <View className="flex-row items-center gap-2">
                <Text className="text-sm font-semibold text-grey-plain-550">
                  230
                </Text>
                <ChevronRight color={colors['grey-plain']['550']} size={18} />
              </View>
            </TouchableOpacity>
          <View className="rounded-xl bg-white p-2">
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
            >
              {mediaItems.map((item) => {
                if (item.type === 'audio') {
                  return (
                    <View
                      key={item.id}
                      className="mr-2 h-20 w-24 items-center justify-center rounded-xl"
                      style={{ backgroundColor: colors.primary.purple + '15' }}
                    >
                      <Headphones color={colors.primary.purple} size={24} />
                      <Text className="mt-2 text-sm font-semibold text-grey-alpha-500">
                        {item.label}
                      </Text>
                    </View>
                  );
                }

                if (item.type === 'document') {
                  return (
                    <View
                      key={item.id}
                      className="mr-2 h-20 w-24 items-center justify-center rounded-xl"
                      style={{ backgroundColor: colors.primary.purple + '15' }}
                    >
                      <FileText color={colors.primary.purple} size={24} />
                      <Text className="mt-2 text-sm font-semibold text-grey-alpha-500">
                        {item.label}
                      </Text>
                    </View>
                  );
                }

                if (item.type === 'video') {
                  return (
                    <View key={item.id} className="mr-2 h-20 w-24">
                      <Image
                        source={item.source}
                        className="h-20 w-24 rounded-xl"
                        resizeMode="cover"
                      />
                      <View className="absolute inset-0 items-center justify-center">
                        <View className="h-10 w-10 items-center justify-center rounded-full bg-white/90">
                          <Play
                            color={colors['grey-plain']['600']}
                            size={20}
                            fill={colors['grey-plain']['600']}
                          />
                        </View>
                      </View>
                    </View>
                  );
                }

                return (
                  <View key={item.id} className="mr-2 h-20 w-24">
                    <Image
                      source={item.source}
                      className="h-20 w-24 rounded-xl"
                      resizeMode="cover"
                    />
                  </View>
                );
              })}
            </ScrollView>
          </View>

          <TouchableOpacity
            onPress={handleOpenStarredMessages}
            className="mt-2 flex-row items-center justify-between rounded-xl bg-white px-4 py-4"
            activeOpacity={0.7}
          >
            <View className="flex-row items-center gap-3">
              <View
                className="h-11 w-11 items-center justify-center rounded-full"
                style={{ backgroundColor: colors.primary.purple + '15' }}
              >
                <Star color={colors.primary.purple} size={22} />
              </View>
              <View>
                <Text className="text-base font-semibold text-grey-alpha-500">
                  Starred messages
                </Text>
                <Text className="text-sm text-grey-plain-550">
                  No messages starred yet
                </Text>
              </View>
            </View>
            <ChevronRight color={colors['grey-plain']['550']} size={20} />
          </TouchableOpacity>
        </View>

        {/* Customization Section  */}
        <View
          className="mx-4 mt-5 rounded-2xl p-2"
          style={{ backgroundColor: colors['grey-plain']['150'] }}
        >
          <Text className="mb-4 ml-3 mt-2 text-base font-semibold text-grey-alpha-500">
            Customisation
          </Text>

          <View className="overflow-hidden rounded-xl bg-white">
            <TouchableOpacity
              onPress={handleChatTheme}
              className="flex-row items-center justify-between px-4 py-4"
              activeOpacity={0.7}
            >
              <View className="flex-1 flex-row items-center gap-3">
                <View
                  className="h-10 w-10 items-center justify-center rounded-full"
                  style={{ backgroundColor: colors['grey-plain']['150'] }}
                >
                  <Palette
                    color={colors.primary.purple}
                    size={22}
                    strokeWidth={2}
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-base font-medium text-grey-alpha-500">
                    Chat theme
                  </Text>
                  <Text className="text-sm text-grey-plain-550">
                    Customise your background
                  </Text>
                </View>
              </View>
              <View className="flex-row items-center gap-3">
                <View className="h-8 w-8 overflow-hidden rounded-full border border-grey-plain-300">
                  <View className="absolute inset-0 flex-row">
                    <View className="flex-1 bg-white" />
                    <View className="flex-1 bg-black" />
                  </View>
                </View>
              </View>
            </TouchableOpacity>

            <View className="h-px bg-grey-plain-150" />

            <TouchableOpacity
              onPress={handleNickname}
              className="flex-row items-center justify-between px-4 py-4"
              activeOpacity={0.7}
            >
              <View className="flex-1 flex-row items-center gap-3">
                <View
                  className="h-10 w-10 items-center justify-center rounded-full"
                  style={{ backgroundColor: colors['grey-plain']['150'] }}
                >
                  <CaseSensitive
                    color={colors.primary.purple}
                    size={22}
                    strokeWidth={2}
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-base font-medium text-grey-alpha-500">
                    Add nickname
                  </Text>
                  <Text className="text-sm text-grey-plain-550">
                    {nickname ? nickname : 'Not added'}
                  </Text>
                </View>
              </View>
              <ChevronRight color={colors['grey-plain']['550']} size={20} />
            </TouchableOpacity>

            <View className="h-px bg-grey-plain-150" />

            <View className="flex-row items-center justify-between px-4 py-4">
              <View className="flex-1 flex-row items-center gap-3">
                <View
                  className="h-10 w-10 items-center justify-center rounded-full"
                  style={{ backgroundColor: colors['grey-plain']['150'] }}
                >
                  <CircleDotDashed
                    color={colors.primary.purple}
                    size={22}
                    strokeWidth={2}
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-base font-medium text-grey-alpha-500">
                    Block screenshots
                  </Text>
                  <Text className="text-sm text-grey-plain-550">
                    Protect your messages
                  </Text>
                </View>
              </View>
              <ToggleSwitch
                value={blockScreenshotsEnabled}
                onValueChange={handleToggleBlockScreenshots}
              />
            </View>

            <View className="h-px bg-grey-plain-150" />

            <View className="flex-row items-center justify-between px-4 py-4">
              <View className="flex-1 flex-row items-center gap-3">
                <View
                  className="h-10 w-10 items-center justify-center rounded-full"
                  style={{ backgroundColor: colors['grey-plain']['150'] }}
                >
                  <MessageSquareDashed
                    color={colors.primary.purple}
                    size={22}
                    strokeWidth={2}
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-base font-medium text-grey-alpha-500">
                    Disappearing messages
                  </Text>
                  <Text className="text-sm text-grey-plain-550">
                    {disappearingMessagesValue}
                  </Text>
                </View>
              </View>
              <ToggleSwitch
                value={disappearingMessagesEnabled}
                onValueChange={handleOpenDisappearingMessages}
              />
            </View>

            <View className="h-px bg-grey-plain-150" />

            <View className="flex-row items-center justify-between px-4 py-4">
              <View className="flex-1 flex-row items-center gap-3">
                <View
                  className="h-10 w-10 items-center justify-center rounded-full"
                  style={{ backgroundColor: colors['grey-plain']['150'] }}
                >
                  <Pin
                    color={colors.primary.purple}
                    size={22}
                    strokeWidth={2}
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-base font-medium text-grey-alpha-500">
                    Pin chat
                  </Text>
                  <Text className="text-sm text-grey-plain-550">Off</Text>
                </View>
              </View>
              <ToggleSwitch
                value={pinChatEnabled}
                onValueChange={handleTogglePinChat}
              />
            </View>
          </View>
        </View>

        {/* Privacy settings Section  */}
        <View
          className="mx-4 mt-5 rounded-2xl p-2"
          style={{ backgroundColor: colors['grey-plain']['150'] }}
        >
          <Text className="mb-4 ml-3 mt-2 text-base font-semibold text-grey-alpha-500">
            Privacy settings
          </Text>

          <View className="overflow-hidden rounded-xl bg-white">
            {/* Notifications Toggle */}
            <View className="flex-row items-center justify-between px-4 py-4">
              <View className="flex-1 flex-row items-center gap-3">
                <View
                  className="h-10 w-10 items-center justify-center rounded-full"
                  style={{ backgroundColor: colors['grey-plain']['150'] }}
                >
                  <BellDot
                    color={colors.primary.purple}
                    size={22}
                    strokeWidth={2}
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-base font-medium text-grey-alpha-500">
                    Notifications
                  </Text>
                  <Text className="text-sm text-grey-plain-550">
                    Receive chat notifications from user
                  </Text>
                </View>
              </View>
              <ToggleSwitch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
              />
            </View>

            <View className="h-px bg-grey-plain-150" />

            {/* Mute User Toggle */}
            <View className="flex-row items-center justify-between px-4 py-4">
              <View className="flex-1 flex-row items-center gap-3">
                <View
                  className="h-10 w-10 items-center justify-center rounded-full"
                  style={{ backgroundColor: colors['grey-plain']['150'] }}
                >
                  <MessageSquareOff
                    color={colors.primary.purple}
                    size={22}
                    strokeWidth={2}
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-base font-medium text-grey-alpha-500">
                    Mute user
                  </Text>
                  <Text className="text-sm text-grey-plain-550">
                    Chat from this user will not show
                  </Text>
                </View>
              </View>
              <ToggleSwitch
                value={muteUserEnabled}
                onValueChange={handleOpenMuteUser}
              />
            </View>

            <View className="h-px bg-grey-plain-150" />

            {/* Block User Option */}
            <TouchableOpacity
              onPress={handleBlockUser}
              className="flex-row items-center justify-between px-4 py-4"
              activeOpacity={0.7}
            >
              <View className="flex-1 flex-row items-center gap-3">
                <View
                  className="h-10 w-10 items-center justify-center rounded-full"
                  style={{ backgroundColor: colors['red-tint']['150'] }}
                >
                  <CircleSlash color={colors.state.red} size={22} strokeWidth={2} />
                </View>
                <View className="flex-1">
                  <Text
                    className="text-base font-medium"
                    style={{ color: colors.state.red }}
                  >
                    Block user
                  </Text>
                  <Text className="text-sm" style={{ color: colors.state.red }}>
                    They won&apos;t be able to message you
                  </Text>
                </View>
              </View>
              <ChevronRight color={colors['grey-plain']['550']} size={20} />
            </TouchableOpacity>

            <View className="h-px bg-grey-plain-150" />

            {/* Delete Conversation Option */}
            <TouchableOpacity
              onPress={handleDeleteConversation}
              className="flex-row items-center justify-between px-4 py-4"
              activeOpacity={0.7}
            >
              <View className="flex-1 flex-row items-center gap-3">
                <View
                  className="h-10 w-10 items-center justify-center rounded-full"
                  style={{ backgroundColor: colors['red-tint']['150'] }}
                >
                  <Trash2 color={colors.state.red} size={22} strokeWidth={2} />
                </View>
                <View className="flex-1">
                  <Text
                    className="text-base font-medium"
                    style={{ color: colors.state.red }}
                  >
                    Delete conversation
                  </Text>
                  <Text className="text-sm" style={{ color: colors.state.red }}>
                    All messages will be permanently deleted
                  </Text>
                </View>
              </View>
              <ChevronRight color={colors['grey-plain']['550']} size={20} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Groups in common Section */}
        <View
          className="mx-4 mt-5 rounded-2xl p-2"
          style={{ backgroundColor: colors['grey-plain']['150'] }}
        >
          <View className="flex-row items-center justify-between px-3 pt-2">
            <Text className="text-base font-semibold text-grey-alpha-500">
              Groups in common
            </Text>
            <Text className="text-base font-semibold text-grey-alpha-500">6</Text>
          </View>

          <View className="mt-4 overflow-hidden rounded-xl bg-white">
            <TouchableOpacity
              className="flex-row items-center justify-between px-4 py-4"
              activeOpacity={0.7}
              onPress={handleCreateGroup}
            >
              <View className="flex-row items-center gap-3">
                <View
                  className="h-10 w-10 items-center justify-center rounded-full"
                  style={{ backgroundColor: colors['primary-tints'].purple['50'] }}
                >
                  <Users color={colors.primary.purple} size={22} strokeWidth={2} />
                </View>
                <Text className="text-base font-semibold text-grey-alpha-500">
                  Create new group with {contact.name.split(' ')[0]}
                </Text>
              </View>
              <ChevronRight color={colors['grey-plain']['550']} size={20} />
            </TouchableOpacity>

            <View className="h-px bg-grey-plain-150" />

            {groupsInCommon.map((group) => (
              <View key={group.id}>
                <View className="flex-row items-center gap-3 px-4 py-4">
                  <View className="h-11 w-11 overflow-hidden rounded-full">
                    <View className="h-full w-full flex-row flex-wrap">
                      {group.avatars.slice(0, 4).map((avatar, index) => (
                        <View
                          key={`${group.id}-avatar-${index}`}
                          className="h-1/2 w-1/2"
                        >
                          <Image
                            source={avatar}
                            className="h-full w-full"
                            resizeMode="cover"
                          />
                        </View>
                      ))}
                    </View>
                  </View>
                  <View className="flex-1">
                    <Text className="text-base font-semibold text-grey-alpha-500">
                      {group.name}
                    </Text>
                    <Text className="text-sm text-grey-plain-550">
                      {group.members}
                    </Text>
                  </View>
                </View>
                <View className="h-px bg-grey-plain-150" />
              </View>
            ))}

            <TouchableOpacity
              className="flex-row items-center gap-2 px-4 py-4"
              activeOpacity={0.7}
            >
              <Text className="text-base font-semibold text-grey-alpha-500">
                3 more
              </Text>
              <ChevronDown color={colors['grey-plain']['550']} size={18} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Others section  */}
        <View
          className="mx-4 mt-5 rounded-2xl p-2"
          style={{ backgroundColor: colors['grey-plain']['150'] }}
        >
          <View className="flex-row items-center justify-between px-3 pt-2">
            <Text className="text-base font-semibold text-grey-alpha-500">
              Others
            </Text>
            <Text className="text-base font-semibold text-grey-alpha-500">6</Text>
          </View>

          <View className="mt-4 overflow-hidden rounded-xl bg-white">
            <TouchableOpacity
              className="flex-row items-center justify-between px-4 py-4"
              activeOpacity={0.7}
              onPress={handleShareProfile}
            >
              <View className="flex-row items-center gap-3">
                <View
                  className="h-10 w-10 items-center justify-center rounded-full"
                  style={{ backgroundColor: colors['primary-tints'].purple['50'] }}
                >
                  <Share2 color={colors.primary.purple} size={22} strokeWidth={2} />
                </View>
                <Text className="text-base font-semibold text-grey-alpha-500">
                  Share profile link
                </Text>
              </View>
              <ChevronRight color={colors['grey-plain']['550']} size={20} />
            </TouchableOpacity>

            <View className="h-px bg-grey-plain-150" />

            <TouchableOpacity
              className="flex-row items-center justify-between px-4 py-4"
              activeOpacity={0.7}
              onPress={handleToggleFavourite}
            >
              <View className="flex-row items-center gap-3">
                <View
                  className="h-10 w-10 items-center justify-center rounded-full"
                  style={{ backgroundColor: colors['primary-tints'].purple['50'] }}
                >
                  <UserRoundPlus
                    color={colors.primary.purple}
                    size={22}
                    strokeWidth={2}
                  />
                </View>
                <Text className="text-base font-semibold text-grey-alpha-500">
                  {isFavourite ? 'Remove from favourite' : 'Add to favourite'}
                </Text>
              </View>
              {isFavourite ? (
                <Heart color={colors.primary.purple} size={24} fill={colors.primary.purple} />
              ) : (
                <Heart color={colors['grey-plain']['550']} size={24} />
              )}
            </TouchableOpacity>

            <View className="h-px bg-grey-plain-150" />

            <TouchableOpacity
              className="flex-row items-center justify-between px-4 py-4"
              activeOpacity={0.7}
              onPress={handleReportUser}
            >
              <View className="flex-row items-center gap-3">
                <View
                  className="h-10 w-10 items-center justify-center rounded-full"
                  style={{ backgroundColor: colors['red-tint']['150'] }}
                >
                  <CircleSlash2
                    color={colors.state.red}
                    size={22}
                    strokeWidth={2}
                  />
                </View>
                <View>
                  <Text
                    className="text-base font-semibold"
                    style={{ color: colors.state.red }}
                  >
                    Report user
                  </Text>
                  <Text className="text-sm" style={{ color: colors.state.red }}>
                    They won&apos;t be able to message you
                  </Text>
                </View>
              </View>
              <ChevronRight color={colors['grey-plain']['550']} size={20} />
            </TouchableOpacity>
          </View>
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

      <ConfirmationModal
        visible={showBlockScreenshotsConfirm}
        title={
          pendingBlockScreenshots ? 'Block screenshots' : 'Unblock screenshots'
        }
        message={
          pendingBlockScreenshots
            ? `Are you sure you want to block screenshots? ${contact.name} won't be able to take screenshots of your conversations.`
            : `Are you sure you want to unblock screenshots? ${contact.name} will be able to take screenshots of your conversations.`
        }
        confirmText={pendingBlockScreenshots ? 'Yes, block' : 'Yes, unblock'}
        cancelText="Cancel"
        onConfirm={handleConfirmBlockScreenshots}
        onCancel={handleCancelBlockScreenshots}
      />

      <Toast
        visible={showScreenshotsBlockedToast}
        message="Screenshots blocked successfully"
        onHide={() => setShowScreenshotsBlockedToast(false)}
      />
      <Toast
        visible={showScreenshotsUnblockedToast}
        message="Screenshots unblocked successfully"
        onHide={() => setShowScreenshotsUnblockedToast(false)}
      />

      <BottomSheetComponent ref={disappearingSheetRef} snapPoints={['45%']}>
        <View className="px-6">
          <Text className="text-2xl font-semibold text-grey-alpha-500">
            Disappearing messages
          </Text>
          <View className="mt-6 flex-row flex-wrap gap-6">
            {[
              'For 5 mins',
              'For 1 hour',
              'For 8 hours',
              'For 24 hours',
              'For 1 week',
              'Off',
            ].map((option) => {
              const isActive = disappearingMessagesDraft === option;
              return (
                <TouchableOpacity
                  key={option}
                  onPress={() => setDisappearingMessagesDraft(option)}
                  className="w-[46%] flex-row items-center gap-3"
                  activeOpacity={0.7}
                >
                  <View
                    className="h-7 w-7 items-center justify-center rounded-full border-2"
                    style={{
                      borderColor: isActive
                        ? colors.primary.purple
                        : colors['grey-plain']['400'],
                    }}
                  >
                    {isActive ? (
                      <View
                        className="h-4 w-4 rounded-full"
                        style={{ backgroundColor: colors.primary.purple }}
                      />
                    ) : null}
                  </View>
                  <Text
                    className="text-base font-medium"
                    style={{
                      color: isActive
                        ? colors['grey-alpha']['550']
                        : colors['grey-plain']['550'],
                    }}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View className="mt-6 border-t border-grey-plain-150 px-6 pt-6">
          <View className="flex-row items-center justify-between">
            <TouchableOpacity
              onPress={() => disappearingSheetRef.current?.close()}
              className="rounded-full border px-8 py-3"
              style={{ borderColor: colors.primary.purple }}
              activeOpacity={0.7}
            >
              <Text
                className="text-base font-semibold"
                style={{ color: colors.primary.purple }}
              >
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleConfirmDisappearingMessages}
              className="rounded-full px-8 py-3"
              style={{ backgroundColor: colors.primary.purple }}
              activeOpacity={0.7}
            >
              <Text className="text-base font-semibold text-white">Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </BottomSheetComponent>

      <Toast
        visible={showDisappearingToast}
        message="Disappearing message settings done."
        onHide={() => setShowDisappearingToast(false)}
      />

      <BottomSheetComponent ref={muteSheetRef} snapPoints={['45%']}>
        <View className="px-6">
          <Text className="text-2xl font-semibold text-grey-alpha-500">
            Mute user
          </Text>
          <View className="mt-6 flex-row flex-wrap gap-6">
            {[
              'For 5 mins',
              'For 1 hour',
              'For 8 hours',
              'For 24 hours',
              'Until I unmute',
              'Off',
            ].map((option) => {
              const isActive = muteUserDraft === option;
              return (
                <TouchableOpacity
                  key={option}
                  onPress={() => setMuteUserDraft(option)}
                  className="w-[46%] flex-row items-center gap-3"
                  activeOpacity={0.7}
                >
                  <View
                    className="h-7 w-7 items-center justify-center rounded-full border-2"
                    style={{
                      borderColor: isActive
                        ? colors.primary.purple
                        : colors['grey-plain']['400'],
                    }}
                  >
                    {isActive ? (
                      <View
                        className="h-4 w-4 rounded-full"
                        style={{ backgroundColor: colors.primary.purple }}
                      />
                    ) : null}
                  </View>
                  <Text
                    className="text-base font-medium"
                    style={{
                      color: isActive
                        ? colors['grey-alpha']['550']
                        : colors['grey-plain']['550'],
                    }}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View className="mt-6 border-t border-grey-plain-150 px-6 pt-6">
          <View className="flex-row items-center justify-between">
            <TouchableOpacity
              onPress={() => muteSheetRef.current?.close()}
              className="rounded-full border px-8 py-3"
              style={{ borderColor: colors.primary.purple }}
              activeOpacity={0.7}
            >
              <Text
                className="text-base font-semibold"
                style={{ color: colors.primary.purple }}
              >
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleConfirmMuteUser}
              className="rounded-full px-8 py-3"
              style={{ backgroundColor: colors.primary.purple }}
              activeOpacity={0.7}
            >
              <Text className="text-base font-semibold text-white">Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </BottomSheetComponent>

      <Toast
        visible={showMuteToast}
        message="Chat muted successfully."
        onHide={() => setShowMuteToast(false)}
      />

      <Toast
        visible={showPinToast}
        message={`Chat with ${contact.name.split(' ')[0]} pinned successfully.`}
        onHide={() => setShowPinToast(false)}
      />

      <Toast
        visible={showAddFavouriteToast}
        message="Chat added to favourites."
        onHide={() => setShowAddFavouriteToast(false)}
      />
      <Toast
        visible={showRemoveFavouriteToast}
        message="Chat removed from favourites."
        onHide={() => setShowRemoveFavouriteToast(false)}
      />

      <BottomSheetComponent
        ref={shareSheetRef}
        snapPoints={['75%']}
        scrollable
      >
        <View className="px-6">
          <Text className="text-2xl font-semibold text-grey-alpha-500">
            Share profile
          </Text>

          <View className="mt-6 gap-4">
            {[contact, contact, contact].map((person, index) => (
              <View
                key={`${person.id}-share-${index}`}
                className="flex-row items-center gap-3"
              >
                <Avatar
                  profileImage={
                    typeof person.avatar === 'object' && 'uri' in person.avatar
                      ? person.avatar.uri
                      : undefined
                  }
                  name={person.name}
                  size={44}
                  showBadge={false}
                />
                <View className="flex-1">
                  <View className="flex-row items-center gap-2">
                    <Text className="text-base font-semibold text-grey-alpha-500">
                      {person.name}
                    </Text>
                    {person.verified ? (
                      <BadgeCheck color={colors.primary.purple} size={18} />
                    ) : null}
                    <Text className="text-base text-grey-plain-550">
                      @{person.username}
                    </Text>
                  </View>
                  <Text className="text-sm text-grey-plain-550">
                    via Direct Message
                  </Text>
                </View>
              </View>
            ))}
          </View>

          <View className="mt-6 flex-row items-center gap-3">
            <View
              className="h-10 w-10 items-center justify-center"
              style={{ backgroundColor: colors['grey-plain']['50'] }}
            >
              <MessageSquare color={colors['grey-plain']['550']} size={22} />
            </View>
            <Text className="text-base font-semibold text-grey-alpha-500">
              Send via Direct Message
            </Text>
          </View>
        </View>

        <View className="mt-6 border-t border-grey-plain-150 px-6 pt-6">
          <View className="flex-row flex-wrap justify-between">
            {[
              {
                id: 'copy',
                label: 'Copy link',
                icon: (
                  <View className="h-12 w-12 items-center justify-center rounded-full bg-grey-plain-100">
                    <Link color={colors['grey-plain']['550']} size={22} />
                  </View>
                ),
              },
              {
                id: 'whatsapp',
                label: 'WhatsApp',
                icon: <WhatsappIcon width={48} height={48} />,
              },
              {
                id: 'instagram',
                label: 'Instagram\nStories',
                icon: (
                  <View className="h-12 w-12 items-center justify-center">
                    <InstagramIcon width={40} height={40} />
                  </View>
                ),
              },
              {
                id: 'telegram',
                label: 'Telegram',
                icon: <TelegramIcon width={48} height={48} />,
              },
              {
                id: 'chats',
                label: 'Chats',
                icon: <MessengerIcon width={48} height={48} />,
              },
              {
                id: 'newsfeed',
                label: 'News Feed',
                icon: (
                  <View className="h-12 w-12 items-center justify-center">
                    <FacebookIcon width={40} height={40} />
                  </View>
                ),
              },
              {
                id: 'snapchat',
                label: 'Snapchat\nCamera',
                icon: <SnapchatIcon width={48} height={48} />,
              },
              {
                id: 'groups',
                label: 'Your Groups',
                icon: (
                  <View className="h-12 w-12 items-center justify-center">
                    <FacebookIcon width={40} height={40} />
                  </View>
                ),
              },
            ].map((item) => (
              <View key={item.id} className="mb-6 w-[23%] items-center">
                {item.icon}
                <Text className="mt-2 text-center text-xs text-grey-alpha-500">
                  {item.label}
                </Text>
              </View>
            ))}
          </View>

          <TouchableOpacity
            className="items-center py-2"
            activeOpacity={0.7}
          >
            <Text
              className="text-base font-semibold"
              style={{ color: colors.primary.purple }}
            >
              See all
            </Text>
          </TouchableOpacity>
        </View>
      </BottomSheetComponent>


      <BottomSheetComponent ref={chatThemeSheetRef} snapPoints={['40%']}>
        <View className="px-6">
          <Text className="text-2xl font-semibold text-grey-alpha-500">
            Chat theme
          </Text>
          <View className="mt-6 flex-row justify-between">
            {([
              {
                id: 'light',
                label: 'Light',
                preview: LightThemePreview,
              },
              {
                id: 'system',
                label: 'System',
                preview: SystemThemePreview,
              },
              {
                id: 'dark',
                label: 'Dark',
                preview: DarkThemePreview,
              },
              {
                id: 'image',
                label: 'Image',
                preview: null,
              },
            ] as {
              id: 'light' | 'system' | 'dark' | 'image';
              label: string;
              preview: React.ComponentType<SvgProps> | null;
            }[]).map((option) => {
              const isActive = selectedTheme === option.id;
              const PreviewComponent = option.preview;
              return (
                <TouchableOpacity
                  key={option.id}
                  onPress={() => setSelectedTheme(option.id)}
                  className="items-center"
                  activeOpacity={0.7}
                  style={{ width: themeCardWidth }}
                >
                  <View
                    className="rounded-xl"
                    style={{
                      borderWidth: 2,
                      borderColor: isActive
                        ? colors.primary.purple
                        : colors['grey-plain']['300'],
                      padding: 10,
                      backgroundColor: colors['grey-plain']['50'],
                    }}
                  >
                    {PreviewComponent ? (
                      <PreviewComponent
                        width={themePreviewSize}
                        height={themePreviewSize * 0.96}
                      />
                    ) : (
                      <View
                        className="items-center justify-center rounded-2xl"
                        style={{
                          width: themePreviewSize,
                          height: themePreviewSize * 0.96,
                          backgroundColor: colors['grey-plain']['100'],
                        }}
                      >
                        <ImageIcon
                          color={colors['grey-alpha']['400']}
                          size={26}
                        />
                      </View>
                    )}
                    {isActive ? (
                      <View className="absolute inset-0 items-center justify-center">
                        <View className="h-10 w-10 items-center justify-center rounded-full bg-white/90">
                          <Check
                            color={colors.state.green}
                            size={24}
                            strokeWidth={3}
                          />
                        </View>
                      </View>
                    ) : null}
                  </View>
                  <Text className="mt-3 text-sm font-semibold text-grey-alpha-500">
                    {option.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </BottomSheetComponent>

      <BottomSheetComponent ref={nicknameSheetRef} snapPoints={['35%']}>
        <View className="px-6">
          <Text className="text-xl font-semibold text-grey-alpha-500">
            Nickname
          </Text>
          <View className="mt-6 flex-row items-center justify-between">
            <View>
              <Text className="text-base text-grey-plain-550">
                {nickname ? 'Nickname added' : 'Add nickname'}
              </Text>
              <Text className="mt-1 text-base font-semibold text-grey-alpha-500">
                {nickname || 'Not added'}
              </Text>
            </View>
            <View className="flex-row items-center gap-6">
              <TouchableOpacity onPress={handleOpenEditNickname}>
                <Pencil color={colors['grey-plain']['550']} size={22} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setShowDeleteNicknameConfirm(true)}
                disabled={!nickname}
              >
                <Trash2
                  color={
                    nickname ? colors.state.red : colors['grey-plain']['350']
                  }
                  size={22}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </BottomSheetComponent>

      <Modal visible={showEditNickname} transparent animationType="fade">
        <View className="flex-1 items-center justify-center bg-black/50 px-6">
          <View className="w-full rounded-2xl bg-white p-6">
            <Text className="text-2xl font-semibold text-grey-alpha-500">
              Edit nickname
            </Text>
            <Text className="mt-4 text-sm font-medium text-grey-plain-550">
              Nickname
            </Text>
            <View className="mt-2 rounded-xl border border-primary px-4 py-3">
              <TextInput
                value={nicknameDraft}
                onChangeText={setNicknameDraft}
                placeholder="Enter nickname"
                placeholderTextColor={colors['grey-plain']['550']}
                className="text-base text-grey-alpha-500"
              />
            </View>
            <View className="mt-6 flex-row justify-end gap-8">
              <TouchableOpacity onPress={() => setShowEditNickname(false)}>
                <Text
                  className="text-base font-semibold"
                  style={{ color: colors.primary.purple }}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleUpdateNickname}>
                <Text
                  className="text-base font-semibold"
                  style={{ color: colors.primary.purple }}
                >
                  Save and update
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <ConfirmationModal
        visible={showDeleteNicknameConfirm}
        title="Delete nickname"
        message="Are you sure you want to delete this nickname? The default user's name will now be used."
        confirmText="Yes, delete"
        cancelText="Cancel"
        destructive
        onConfirm={handleConfirmDeleteNickname}
        onCancel={() => setShowDeleteNicknameConfirm(false)}
      />

      <Toast
        visible={showNicknameDeletedToast}
        message="Nickname deleted successfully"
        onHide={() => setShowNicknameDeletedToast(false)}
      />
      <Toast
        visible={showNicknameUpdatedToast}
        message="Nickname updated successfully"
        onHide={() => setShowNicknameUpdatedToast(false)}
      />
    </SafeAreaView>
  );
}

