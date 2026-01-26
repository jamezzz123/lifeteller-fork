import React, { useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import {
  CornerUpLeft,
  Search,
  MoreVertical,
  Star,
} from 'lucide-react-native';
import { colors } from '@/theme/colors';
import { CONTACTS } from '@/components/request-lift/data';
import { BottomSheetComponent, BottomSheetRef } from '@/components/ui/BottomSheet';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Toast } from '@/components/ui/Toast';
import { Avatar } from '@/components/ui/Avatar';

interface StarredMessage {
  id: string;
  text: string;
  isSent: boolean;
  timestamp: string;
  isSeen?: boolean;
}

const STARRED_MESSAGES: StarredMessage[] = [
  {
    id: '1',
    text: 'How to make more money while sleeping',
    isSent: false,
    timestamp: '06:87am',
    isSeen: true,
  },
  {
    id: '2',
    text: 'The guide "Thrive in Uncertainty with the Latest B2B SaaS Guide for Startups" outlines strategies for building and scaling a successful B2B SaaS company, even in challenging economic times. It emphasizes the importance of thorough market research to ensure product-market fit, early validation through MVPs, and targeting niche markets as SaaS shifts from horizontal to vertical solutions. Winning customers requires clear sales strategies, early lead qualification, and leveraging champions within target companies, while offering workshops or free trials can accelerate adoption. Pricing strategies should align with customer value, and growth should focus on metrics like churn and net revenue retention (NRR) to ensure customer satisfaction and scalability. Startups are encouraged to outsource non-core tasks like compliance and security, focus on retaining customers, and leverage partnerships and data to gain an edge in a competitive market.',
    isSent: true,
    timestamp: '06:87am',
    isSeen: true,
  },
];

export default function StarredMessagesScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showUnstarConfirm, setShowUnstarConfirm] = useState(false);
  const [showUnstarToast, setShowUnstarToast] = useState(false);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const moreOptionsSheetRef = useRef<BottomSheetRef>(null);
  const searchInputRef = useRef<TextInput>(null);

  const contact = CONTACTS.find((c) => c.id === id) || CONTACTS[0];

  const filteredMessages = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    if (!normalizedQuery) return STARRED_MESSAGES;

    return STARRED_MESSAGES.filter((message) =>
      message.text.toLowerCase().includes(normalizedQuery)
    );
  }, [searchQuery]);

  const handleOpenMoreOptions = () => {
    moreOptionsSheetRef.current?.expand();
  };

  const handleStartSearch = () => {
    setShowSearch(true);
    requestAnimationFrame(() => {
      searchInputRef.current?.focus();
    });
  };

  const handleCloseSearch = () => {
    setShowSearch(false);
    setSearchQuery('');
  };

  const handleUnstarAll = () => {
    moreOptionsSheetRef.current?.close();
    setShowUnstarConfirm(true);
  };

  const handleConfirmUnstarAll = () => {
    setShowUnstarConfirm(false);
    setShowUnstarToast(true);
    setShouldRedirect(true);
  };

  const handleUnstarToastHide = () => {
    setShowUnstarToast(false);
    if (shouldRedirect) {
      setShouldRedirect(false);
      router.push(`/user/${contact.id}` as any);
    }
  };

  const profileImage =
    typeof contact.avatar === 'object' && 'uri' in contact.avatar
      ? contact.avatar.uri
      : undefined;

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'bottom']}>
      {/* Header */}
      <View className="border-b border-grey-plain-150 bg-white px-4 py-3">
        {showSearch ? (
          <View
            className="flex-row items-center gap-3"
            style={{ minHeight: 44 }}
          >
            <TouchableOpacity onPress={handleCloseSearch}>
              <CornerUpLeft
                color={colors['grey-plain']['550']}
                size={24}
                strokeWidth={2}
              />
            </TouchableOpacity>
            <View
              className="flex-1 flex-row items-center gap-3"
            >
              <TextInput
                ref={searchInputRef}
                placeholder="Search starred messages..."
                placeholderTextColor={colors['grey-plain']['550']}
                value={searchQuery}
                onChangeText={setSearchQuery}
                className="flex-1 text-sm text-grey-alpha-500"
              />
            </View>
          </View>
        ) : (
          <View
            className="flex-row items-center justify-between"
            style={{ minHeight: 44 }}
          >
            <View className="flex-row items-center gap-3">
              <TouchableOpacity onPress={() => router.back()}>
                <CornerUpLeft
                  color={colors['grey-plain']['550']}
                  size={24}
                  strokeWidth={2}
                />
              </TouchableOpacity>
              <Text className="text-lg font-semibold text-grey-alpha-500">
                Starred messages
              </Text>
            </View>
            <View className="flex-row items-center gap-4">
              <TouchableOpacity onPress={handleStartSearch}>
                <Search color={colors['grey-plain']['550']} size={22} />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleOpenMoreOptions}>
                <MoreVertical color={colors['grey-plain']['550']} size={22} />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
      >
        {filteredMessages.length === 0 ? (
          <View className="items-center justify-center rounded-2xl bg-white px-6 py-10">
            <Star color={colors.primary.purple} size={28} />
            <Text className="mt-4 text-base font-semibold text-grey-alpha-500">
              No starred messages
            </Text>
            <Text className="mt-2 text-sm text-grey-plain-550">
              Star messages to find them easily later.
            </Text>
          </View>
        ) : (
          filteredMessages.map((message) => {
            const isSent = message.isSent;
            const senderName = isSent ? 'You' : contact.name;
            const senderUsername = isSent ? 'you' : contact.username;
            const avatarName = isSent ? 'You' : contact.name;

            return (
              <View key={message.id} className="mb-4">
                <View className="flex-row items-center gap-3">
                  <Avatar
                    profileImage={isSent ? undefined : profileImage}
                    name={avatarName}
                    size={34}
                    showBadge={false}
                  />
                  <View>
                    <View className="flex-row items-center gap-2">
                      <Text className="text-sm font-semibold text-grey-alpha-500">
                        {senderName}
                      </Text>
                      <Text className="text-sm text-grey-plain-550">
                        • @{senderUsername}
                      </Text>
                    </View>
                    <Text className="text-xs text-grey-plain-550">
                      {message.timestamp}
                      {message.isSeen ? ' • Seen' : ''}
                    </Text>
                  </View>
                </View>
                <View
                  className="mt-3 px-4 py-3"
                  style={{
                    backgroundColor: colors['grey-alpha']['150'],
                    borderRadius: 16,
                    borderTopLeftRadius: 2,
                    maxWidth: '85%',
                  }}
                >
                  <Text className="text-sm leading-5 text-grey-alpha-500">
                    {message.text}
                  </Text>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>

      <BottomSheetComponent ref={moreOptionsSheetRef} snapPoints={['25%']}>
        <View className="px-6">
          <TouchableOpacity
            onPress={handleUnstarAll}
            className="flex-row items-center gap-3 py-4"
            activeOpacity={0.7}
          >
            <Star color={colors.state.red} size={20} />
            <Text className="text-base font-medium text-grey-alpha-500">
              Unstar all
            </Text>
          </TouchableOpacity>
        </View>
      </BottomSheetComponent>

      <ConfirmDialog
        visible={showUnstarConfirm}
        title="Unstar all messages?"
        message={`Are you sure you want to unstar all messages from your chat with ${contact.name}?`}
        confirmText="Yes, unstar"
        cancelText="Cancel"
        onConfirm={handleConfirmUnstarAll}
        onCancel={() => setShowUnstarConfirm(false)}
        destructive
      />

      <Toast
        visible={showUnstarToast}
        message="All starred messages removed"
        onHide={handleUnstarToastHide}
      />
    </SafeAreaView>
  );
}
