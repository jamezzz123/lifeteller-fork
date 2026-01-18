import { useState } from 'react';
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import { X } from 'lucide-react-native';

import { colors } from '@/theme/colors';
import { FullScreenModal } from '@/components/ui/FullScreenModal';
import { Contact } from './types';
import { CONTACTS } from './data';

type AddCollaboratorsModalProps = {
  visible: boolean;
  currentCollaborators: Contact[];
  onDone: (collaborators: Contact[]) => void;
  onClose: () => void;
};

export function AddCollaboratorsModal({
  visible,
  currentCollaborators,
  onDone,
  onClose,
}: AddCollaboratorsModalProps) {
  const [selectedCollaborators, setSelectedCollaborators] = useState<Contact[]>(
    currentCollaborators
  );
  const [searchQuery, setSearchQuery] = useState('');

  const filteredContacts = CONTACTS.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  function handleToggleCollaborator(contact: Contact) {
    const isSelected = selectedCollaborators.some((c) => c.id === contact.id);
    if (isSelected) {
      setSelectedCollaborators(
        selectedCollaborators.filter((c) => c.id !== contact.id)
      );
    } else {
      setSelectedCollaborators([...selectedCollaborators, contact]);
    }
  }

  function handleRemoveCollaborator(contactId: string) {
    setSelectedCollaborators(
      selectedCollaborators.filter((c) => c.id !== contactId)
    );
  }

  function handleProceed() {
    onDone(selectedCollaborators);
  }

  function handleClose() {
    setSearchQuery('');
    onClose();
  }

  const isCollaboratorSelected = (contactId: string) =>
    selectedCollaborators.some((c) => c.id === contactId);

  return (
    <FullScreenModal
      visible={visible}
      title="Add collaborators"
      onClose={handleClose}
      rightButton={{
        label: 'Proceed',
        onPress: handleProceed,
        disabled: selectedCollaborators.length === 0,
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

        {/* Selected Collaborators Chips */}
        {selectedCollaborators.length > 0 && (
          <View className="mb-4 flex-row flex-wrap gap-2">
            {selectedCollaborators.map((collaborator) => (
              <View
                key={collaborator.id}
                className="flex-row items-center gap-2 rounded-full bg-grey-plain-150 px-3 py-2"
              >
                <Image
                  source={collaborator.avatar}
                  style={{ width: 24, height: 24, borderRadius: 12 }}
                  contentFit="cover"
                />
                <Text className="text-sm text-grey-alpha-500">
                  {collaborator.name}
                </Text>
                <TouchableOpacity
                  onPress={() => handleRemoveCollaborator(collaborator.id)}
                  hitSlop={8}
                >
                  <X
                    size={16}
                    color={colors['grey-alpha']['500']}
                    strokeWidth={2.5}
                  />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {/* Divider */}
        {selectedCollaborators.length > 0 && searchQuery && (
          <View className="mb-4 h-px bg-grey-plain-450/20" />
        )}

        {/* Contacts List */}
        {searchQuery && (
          <View>
            {filteredContacts.map((contact) => {
              const isSelected = isCollaboratorSelected(contact.id);
              return (
                <TouchableOpacity
                  key={contact.id}
                  onPress={() => handleToggleCollaborator(contact)}
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
                        <Text className="text-base font-inter-medium text-grey-alpha-500">
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

                  {isSelected && (
                    <Text className="text-sm text-grey-alpha-400">
                      Already added
                    </Text>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </ScrollView>
    </FullScreenModal>
  );
}
