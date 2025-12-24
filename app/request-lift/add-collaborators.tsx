import { useState, useEffect } from 'react';
import {
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';

import { colors } from '@/theme/colors';
import { Button } from '@/components/ui/Button';
import { Contact, CONTACTS, ContactChip, ContactRow } from '@/components/lift';
import { useRequestLift } from '@/context/request-lift';

export default function AddCollaboratorsScreen() {
  const { collaborators, setCollaborators, setHeaderTitle } = useRequestLift();

  const [selectedCollaborators, setSelectedCollaborators] = useState<Contact[]>(
    collaborators
  );
  const [searchQuery, setSearchQuery] = useState('');

  // Set header title
  useEffect(() => {
    setHeaderTitle('Add collaborators');
  }, [setHeaderTitle]);

  const filteredContacts = CONTACTS.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  function handleSelect(contact: Contact) {
    if (selectedCollaborators.find((c) => c.id === contact.id)) {
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedCollaborators([...selectedCollaborators, contact]);
  }

  function handleRemove(contactId: string) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedCollaborators(
      selectedCollaborators.filter((c) => c.id !== contactId)
    );
  }

  function handleProceed() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // Save to Context
    setCollaborators(selectedCollaborators);
    // Navigate back
    router.back();
  }

  const showResults = searchQuery.trim().length > 0;

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        keyboardShouldPersistTaps="handled"
        contentContainerClassName="flex-grow pb-8"
        showsVerticalScrollIndicator={false}
      >
        <View className="px-4 pt-5">
          {/* Search Label */}
          <Text className="mb-3 text-sm text-grey-alpha-400">
            Search by username or name of user
          </Text>

          {/* Selected Collaborators */}
          {selectedCollaborators.length > 0 && (
            <View className="mb-3 flex-row flex-wrap gap-2">
              {selectedCollaborators.map((collaborator) => (
                <ContactChip
                  key={collaborator.id}
                  contact={collaborator}
                  onRemove={handleRemove}
                />
              ))}
            </View>
          )}

          {/* Search Input */}
          <View>
            <View className="border-b border-grey-plain-450/40 pb-2">
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search people"
                placeholderTextColor={colors['grey-plain']['300']}
                returnKeyType="search"
                autoCapitalize="none"
                autoCorrect={false}
                className="text-base text-grey-alpha-450"
                style={{
                  fontSize: 16,
                  color: colors['grey-alpha']['450'],
                  padding: 0,
                  margin: 0,
                }}
              />
            </View>
          </View>
        </View>

        {/* Search Results */}
        {showResults ? (
          <View className="mx-4 mt-4 overflow-hidden rounded-3xl bg-grey-plain-50">
            {filteredContacts.map((contact) => {
              const isSelected = selectedCollaborators.some(
                (c) => c.id === contact.id
              );
              return (
                <View key={contact.id}>
                  <ContactRow
                    contact={contact}
                    onSelect={handleSelect}
                    isSelected={isSelected}
                    disabled={false}
                  />
                </View>
              );
            })}
            {filteredContacts.length === 0 ? (
              <View className="px-4 py-3">
                <Text className="text-sm text-grey-alpha-400">
                  No matches found.
                </Text>
              </View>
            ) : null}
          </View>
        ) : null}
      </ScrollView>

      {/* Proceed Button */}
      <View className="border-t border-grey-plain-450/40 bg-grey-alpha-150 px-4 py-4">
        <View className="flex w-1/2 self-end">
          <Button
            title="Proceed"
            onPress={handleProceed}
            disabled={selectedCollaborators.length === 0}
          />
        </View>
      </View>
    </View>
  );
}
