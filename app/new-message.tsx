import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { CornerUpLeft, Users } from 'lucide-react-native';
import { colors } from '@/theme/colors';
import { Contact } from '@/components/request-lift/types';
import { CONTACTS } from '@/components/request-lift/data';
import { ContactListItem } from '@/components/chat/ContactListItem';
import { SearchInput } from '@/components/ui/SearchInput';

export default function NewMessageScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  // Mock recently contacted - in production, this would come from API
  const recentlyContacted: Contact[] = CONTACTS.slice(0, 8);

  const filteredContacts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return [];

    return CONTACTS.filter(
      (contact) =>
        contact.name.toLowerCase().includes(query) ||
        contact.username.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const handleContactSelect = (contact: Contact) => {
    // Navigate to chat screen
    router.push(`/chat/${contact.id}` as any);
  };

  const handleCreateGroup = () => {
    router.push('/create-group' as any);
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
        <Text className="text-lg font-inter-semibold text-grey-alpha-500">
          New message
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Search Bar */}
        <SearchInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search by username or name of user"
        />

        {/* Create New Group Option */}
        <TouchableOpacity
          onPress={handleCreateGroup}
          className="flex-row items-center gap-3 rounded-xl bg-white px-4 py-4"
          activeOpacity={0.7}
        >
          <View
            className="items-center justify-center rounded-full"
            style={{
              width: 48,
              height: 48,
              backgroundColor: colors['primary-tints'].purple['100'],
            }}
          >
            <Users color={colors.primary.purple} size={24} strokeWidth={2} />
          </View>
          <Text
            className="flex-1 text-base font-inter-medium"
            style={{ color: colors.primary.purple }}
          >
            Create a new group
          </Text>
        </TouchableOpacity>

        {/* Recently Contacted Section */}
        {!searchQuery && (
          <View className="mt-2">
            <Text className="mb-4 px-4 text-sm font-inter-semibold text-grey-alpha-400">
              Recently contacted
            </Text>

            {/* Contact List */}
            <View className="bg-white">
              {recentlyContacted.map((contact) => (
                <ContactListItem
                  key={contact.id}
                  contact={contact}
                  onPress={handleContactSelect}
                />
              ))}
            </View>
          </View>
        )}

        {/* Search Results */}
        {searchQuery && (
          <View className="mt-4 bg-white">
            {filteredContacts.length > 0 ? (
              filteredContacts.map((contact) => (
                <ContactListItem
                  key={contact.id}
                  contact={contact}
                  onPress={handleContactSelect}
                  showPurpleBadge={true}
                />
              ))
            ) : (
              <View className="items-center justify-center py-12">
                <Text className="text-sm text-grey-plain-550">
                  No users found
                </Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
