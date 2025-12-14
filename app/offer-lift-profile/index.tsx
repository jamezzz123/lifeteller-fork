import { useMemo, useState, useEffect, useCallback } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  ScrollView,
  Text,
  View,
  Pressable,
} from 'react-native';
import { router, Href } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Info, ArrowRight } from 'lucide-react-native';

import { colors } from '@/theme/colors';
import { ContactRow, CONTACTS, Contact } from '@/components/request-lift';
import { MaterialInput } from '@/components/ui/MaterialInput';
import { useOfferLiftProfile } from './context';
import ImpactCard from '@/components/OfferLift/ImpactCard';

export default function SelectRecipientScreen() {
  const { selectedRecipient, setSelectedRecipient, setCanProceed, onNextRef } =
    useOfferLiftProfile();

  const [search, setSearch] = useState('');

  const isValid = selectedRecipient !== null;

  const handleNext = useCallback(() => {
    if (!isValid) return;
    router.push('/offer-lift-profile/step-2' as Href);
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

  const showResults = search.trim().length > 0;

  function handleSelect(contact: Contact) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedRecipient(contact);
    setSearch('');
    Keyboard.dismiss();
    router.push('/offer-lift-profile/step-2' as Href);
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
          contentContainerClassName="flex-grow pb-8"
          showsVerticalScrollIndicator={false}
        >
          <View className="px-4 pt-5">
            <Text className="text-sm font-semibold text-grey-alpha-450">
              Offer to:
            </Text>

            <MaterialInput
              value={search}
              onChangeText={setSearch}
              placeholder={
                selectedRecipient?.name || 'Search by name or username'
              }
              returnKeyType="search"
              autoCapitalize="none"
              autoCorrect={false}
              containerClassName="mt-2"
            />
          </View>

          <View className="mt-3 px-4">
            <View className="flex-row items-start gap-2">
              <Info
                size={18}
                color={colors['grey-alpha']['400']}
                strokeWidth={2.4}
                style={{ marginTop: 2 }}
              />
              <Text className="flex-1 text-sm text-grey-alpha-400">
                You can only choose one recipient.
              </Text>
            </View>

            <View className="mt-8">
              <ImpactCard
                handlePress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  // Navigate to multi-recipient flow or show modal
                }}
              />
            </View>
          </View>
        </ScrollView>

        {/* Search Results Overlay */}
        {showResults && (
          <>
            {/* Backdrop */}
            <Pressable
              className="absolute inset-0 bg-black/20"
              onPress={() => {
                setSearch('');
                Keyboard.dismiss();
              }}
              style={{ top: 0, bottom: 0, left: 0, right: 0 }}
            />

            {/* Results Container */}
            <View
              className="absolute left-0 right-0 px-4"
              style={{
                top: 90,
                maxHeight: 400,
              }}
            >
              <View className="overflow-hidden rounded-lg bg-grey-plain-50 shadow-lg">
                {filteredContacts.length === 0 ? (
                  <View className="px-4 py-3">
                    <Text className="text-sm text-grey-alpha-400">
                      No matches found.
                    </Text>
                  </View>
                ) : (
                  <ScrollView
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                  >
                    {filteredContacts.map((contact) => {
                      const isSelected = selectedRecipient?.id === contact.id;
                      return (
                        <ContactRow
                          key={contact.id}
                          contact={contact}
                          onSelect={handleSelect}
                          disabled={false}
                          isSelected={isSelected}
                        />
                      );
                    })}
                  </ScrollView>
                )}
              </View>
            </View>
          </>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}
