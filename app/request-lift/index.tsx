import { useMemo, useState, useEffect, useCallback } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { Info } from 'lucide-react-native';

import { Button } from '@/components/ui/Button';
import { colors } from '@/theme/colors';
import {
  ContactChip,
  ContactRow,
  CONTACTS,
  MAX_SELECTION,
} from '@/components/request-lift';
import { useRequestLift } from './context';

export default function SelectContactsScreen() {
  const { selectedContacts, setSelectedContacts, setCanProceed, onNextRef } =
    useRequestLift();
  const [search, setSearch] = useState('');

  // Initialize with some default contacts for testing (remove in production)
  useEffect(() => {
    if (selectedContacts.length === 0) {
      setSelectedContacts(CONTACTS.slice(0, 2));
    }
  }, []);

  const isValid = selectedContacts.length > 0;

  const handleNext = useCallback(() => {
    if (!isValid) return;
    router.push('/request-lift/step-2');
  }, [isValid]);

  // Update canProceed and Next handler
  useEffect(() => {
    setCanProceed(isValid);
    onNextRef.current = handleNext;
    return () => {
      onNextRef.current = null;
    };
  }, [isValid, setCanProceed, handleNext, onNextRef]);

  const filteredContacts = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return [];

    return CONTACTS.filter(
      (contact) =>
        contact.name.toLowerCase().includes(query) ||
        contact.username.toLowerCase().includes(query)
    );
  }, [search]);

  const remainingSelection = MAX_SELECTION - selectedContacts.length;
  const showResults = search.trim().length > 0;

  function handleSelect(contact: typeof CONTACTS[0]) {
    if (selectedContacts.find((item) => item.id === contact.id)) {
      return;
    }
    if (selectedContacts.length >= MAX_SELECTION) return;
    setSelectedContacts([...selectedContacts, contact]);
  }

  function handleRemove(contactId: string) {
    setSelectedContacts(
      selectedContacts.filter((contact) => contact.id !== contactId)
    );
  }

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View className="flex-1">
        <ScrollView
          className="flex-1"
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 32 }}
        >
          <View className="px-4 pt-5">
            <View className="flex-row items-center justify-between">
              <Text className="text-sm font-semibold text-grey-alpha-500">
                Request from:
              </Text>
              <Text className="text-xs font-medium text-primary">
                {selectedContacts.length}/{MAX_SELECTION}
              </Text>
            </View>

            <View className="mt-3 flex-row flex-wrap gap-2">
              {selectedContacts.slice(0, 3).map((contact) => (
                <ContactChip
                  key={contact.id}
                  contact={contact}
                  onRemove={handleRemove}
                />
              ))}
              {selectedContacts.length > 3 ? (
                <View className="flex-row items-center justify-center rounded-full border border-primary px-3 py-2">
                  <Text className="text-sm font-semibold text-primary">
                    +{selectedContacts.length - 3}
                  </Text>
                </View>
              ) : null}
            </View>

            <View className="mt-3 border-b border-grey-plain-450">
              <TextInput
                value={search}
                onChangeText={setSearch}
                placeholder="Search people"
                placeholderTextColor={colors['grey-alpha']['250']}
                className="pb-2 text-base text-grey-alpha-500"
                returnKeyType="search"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          </View>

          {showResults ? (
            <View className="mx-4 mt-4 overflow-hidden rounded-3xl border border-grey-plain-450/70 bg-grey-plain-50">
              {filteredContacts.map((contact, index) => {
                const isSelected = selectedContacts.some(
                  (item) => item.id === contact.id
                );
                return (
                  <View
                    key={contact.id}
                    className={
                      index < filteredContacts.length - 1
                        ? 'border-b border-grey-plain-450/60'
                        : ''
                    }
                  >
                    <ContactRow
                      contact={contact}
                      onSelect={handleSelect}
                      disabled={remainingSelection <= 0 && !isSelected}
                      isSelected={isSelected}
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

          <View className="mt-6 px-4">
            <View className="flex-row items-start gap-2">
              <Info
                size={18}
                color={colors['grey-alpha']['400']}
                strokeWidth={2.4}
                style={{ marginTop: 2 }}
              />
              <Text className="flex-1 text-sm text-grey-alpha-400">
                You can select a maximum of {MAX_SELECTION} people. They will
                get it as a direct message.
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => {}}
              className="mt-5"
              accessibilityRole="button"
              accessibilityLabel="Explore other options"
            >
              <Text className="text-center text-sm font-medium text-primary underline">
                Explore other options
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}
