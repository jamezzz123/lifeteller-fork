import { useState } from 'react';
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Image } from 'expo-image';

import { colors } from '@/theme/colors';
import { FullScreenModal } from '@/components/ui/FullScreenModal';
import { Contact } from './types';
import { CONTACTS } from './data';

type CreateListModalProps = {
  visible: boolean;
  onDone: (selectedPeople: Contact[], listName: string) => void;
  onClose: () => void;
};

export function CreateListModal({
  visible,
  onDone,
  onClose,
}: CreateListModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPeople, setSelectedPeople] = useState<Contact[]>([]);

  const filteredContacts = CONTACTS.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  function handleTogglePerson(contact: Contact) {
    const isSelected = selectedPeople.some((p) => p.id === contact.id);
    if (isSelected) {
      setSelectedPeople(selectedPeople.filter((p) => p.id !== contact.id));
    } else {
      setSelectedPeople([...selectedPeople, contact]);
    }
  }

  function handleDone() {
    // For now, using a default list name
    // In a real app, you'd prompt for a list name
    onDone(selectedPeople, 'New List');
    setSearchQuery('');
    setSelectedPeople([]);
  }

  function handleClose() {
    setSearchQuery('');
    setSelectedPeople([]);
    onClose();
  }

  const isPersonSelected = (contactId: string) =>
    selectedPeople.some((p) => p.id === contactId);

  return (
    <FullScreenModal
      visible={visible}
      title="Create a new list"
      onClose={handleClose}
      rightButton={{
        label: 'Done',
        onPress: handleDone,
        disabled: selectedPeople.length === 0,
      }}
    >
      <ScrollView
        className="flex-1 px-4"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        {/* Search Input */}
        <View className="mb-4">
          <Text className="mb-3 text-sm text-grey-alpha-400">
            Search by username or name of user
          </Text>
          <View className="flex-row items-center border-b-2 border-primary pb-2">
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder=""
              className="flex-1 text-base text-grey-alpha-500"
              autoCapitalize="none"
            />
          </View>
        </View>

        {/* Contacts List */}
        {searchQuery && (
          <View>
            {filteredContacts.map((contact) => {
              const isSelected = isPersonSelected(contact.id);
              return (
                <TouchableOpacity
                  key={contact.id}
                  onPress={() => handleTogglePerson(contact)}
                  className="flex-row items-center justify-between border-b border-grey-plain-450/20 py-3"
                >
                  <View className="flex-1 flex-row items-center gap-3">
                    <Image
                      source={contact.avatar}
                      style={{ width: 48, height: 48, borderRadius: 24 }}
                      contentFit="cover"
                    />
                    <View className="flex-1">
                      <View className="flex-row items-center gap-2">
                        <Text className="text-base font-medium text-grey-alpha-500">
                          {contact.name}
                        </Text>
                        {contact.verified && (
                          <View className="size-4 items-center justify-center rounded-full bg-primary">
                            <Text className="text-[10px] text-white">✓</Text>
                          </View>
                        )}
                      </View>
                      <Text className="text-sm text-grey-alpha-400">
                        @{contact.username}
                      </Text>
                    </View>
                  </View>

                  {/* Checkbox */}
                  <View
                    className="size-6 items-center justify-center rounded border-2"
                    style={{
                      borderColor: isSelected
                        ? colors.primary.purple
                        : colors['grey-plain']['450'],
                      backgroundColor: isSelected
                        ? colors.primary.purple
                        : 'transparent',
                    }}
                  >
                    {isSelected && (
                      <Text className="text-xs text-white">✓</Text>
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </ScrollView>
    </FullScreenModal>
  );
}
