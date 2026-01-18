import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { CornerUpLeft } from 'lucide-react-native';
import { colors } from '@/theme/colors';
import { Contact } from '@/components/request-lift/types';
import { CONTACTS } from '@/components/request-lift/data';
import { ContactListItem } from '@/components/chat/ContactListItem';
import { Button } from '@/components/ui/Button';
import { SearchInput } from '@/components/ui/SearchInput';

export default function CreateGroupScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContacts, setSelectedContacts] = useState<Set<string>>(
    new Set()
  );

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

  const handleContactToggle = (contact: Contact) => {
    const newSelected = new Set(selectedContacts);
    if (newSelected.has(contact.id)) {
      newSelected.delete(contact.id);
    } else {
      newSelected.add(contact.id);
    }
    setSelectedContacts(newSelected);
  };

  const handleNext = () => {
    if (selectedContacts.size === 0) return;
    // TODO: Navigate to group chat or group setup screen
    // For now, navigate to a group chat with the selected contacts
    const groupId = Array.from(selectedContacts).join(',');
    router.push(`/chat/group/${groupId}` as any);
  };

  const selectedCount = selectedContacts.size;
  const canProceed = selectedCount > 0;

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'bottom']}>
      {/* Header */}
      <View className="flex-row items-center justify-between border-b border-grey-plain-150 bg-white px-4 py-3">
        <View className="flex-row items-center flex-1">
          <TouchableOpacity onPress={() => router.back()} className="mr-3">
            <CornerUpLeft
              color={colors['grey-plain']['550']}
              size={24}
              strokeWidth={2}
            />
          </TouchableOpacity>
          <Text className="text-lg font-inter-semibold text-grey-alpha-500">
            Create a message group
          </Text>
        </View>
        <Button
          title="Next"
          onPress={handleNext}
          variant="secondary"
          size="small"
          disabled={!canProceed}
          className="rounded-full"
        />
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Selection Indicator */}
        {selectedCount > 0 && (
          <View className="mx-4 mt-4">
            <View
              className="self-start rounded-full px-4 py-2"
              style={{ backgroundColor: colors['primary-tints'].purple['100'] }}
            >
              <Text
                className="text-sm font-inter-medium"
                style={{ color: colors.primary.purple }}
              >
                {selectedCount} {selectedCount === 1 ? 'person' : 'people'}{' '}
                selected
              </Text>
            </View>
          </View>
        )}

        {/* Search Bar */}
        <SearchInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search by username or name of user"
        />

        {/* Recently Contacted Section */}
        {!searchQuery && (
          <View className="mt-6">
            <Text className="mb-4 px-4 text-sm font-inter-semibold text-grey-alpha-400">
              Recently contacted
            </Text>

            {/* Contact List */}
            <View className="bg-white">
              {recentlyContacted.map((contact) => (
                <ContactListItem
                  key={contact.id}
                  contact={contact}
                  onPress={handleContactToggle}
                  showCheckbox={true}
                  isSelected={selectedContacts.has(contact.id)}
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
                  onPress={handleContactToggle}
                  showPurpleBadge={true}
                  showCheckbox={true}
                  isSelected={selectedContacts.has(contact.id)}
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

