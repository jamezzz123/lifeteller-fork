import { useMemo, useState, useEffect, useCallback, useRef } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  ScrollView,
  Text,
  TextInput as RNTextInput,
  View,
} from 'react-native';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Info } from 'lucide-react-native';

import { colors } from '@/theme/colors';
import { TextButton } from '@/components/ui/TextButton';
import { BottomSheetRef } from '@/components/ui/BottomSheet';
import {
  ContactChip,
  ContactRow,
  CONTACTS,
  MAX_SELECTION,
  AudienceBottomSheet,
  AddCollaboratorsModal,
  ChooseListBottomSheet,
  ChooseFromListModal,
  CreateListModal,
  ReviewContactsModal,
  Contact,
} from '@/components/lift';
import {
  useRequestLift,
  AudienceOfferType,
  List,
} from '@/context/request-lift';

export default function SelectContactsScreen() {
  const {
    selectedContacts,
    setSelectedContacts,
    setAudienceOfferType,
    selectedPeopleForAudience,
    setSelectedPeopleForAudience,
    setSelectedList,
    setCanProceed,
    onNextRef,
    audienceOfferType,
  } = useRequestLift();

  const [search, setSearch] = useState('');
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showSelectedPeopleModal, setShowSelectedPeopleModal] = useState(false);
  const [showChooseListModal, setShowChooseListModal] = useState(false);
  const [showCreateListModal, setShowCreateListModal] = useState(false);

  const audienceSheetRef = useRef<BottomSheetRef>(null);
  const chooseListSheetRef = useRef<BottomSheetRef>(null);
  const searchInputRef = useRef<RNTextInput>(null);

  // Initialize with some default contacts for testing (remove in production)
  useEffect(() => {
    if (selectedContacts.length === 0) {
      setSelectedContacts(CONTACTS.slice(0, 2));
    }
  }, [selectedContacts.length, setSelectedContacts]);

  const isValid = selectedContacts.length > 0;

  const handleNext = useCallback(() => {
    if (!isValid) return;
    setShowReviewModal(true);
  }, [isValid]);

  const handleProceed = useCallback(() => {
    setShowReviewModal(false);
    router.push('/request-lift/step-2');
  }, []);

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

  function handleSelect(contact: (typeof CONTACTS)[0]) {
    if (selectedContacts.find((item) => item.id === contact.id)) {
      return;
    }
    if (selectedContacts.length >= MAX_SELECTION) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedContacts([...selectedContacts, contact]);
  }

  function handleRemove(contactId: string) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedContacts(
      selectedContacts.filter((contact) => contact.id !== contactId)
    );
  }

  function handleExploreOptions() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    searchInputRef.current?.blur();
    Keyboard.dismiss();
    audienceSheetRef.current?.expand();
  }

  function handleAudienceSelect(type: AudienceOfferType) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setAudienceOfferType(type);
    audienceSheetRef.current?.close();

    if (type === 'chat-direct') {
      // setShowSelectedPeopleModal(true);
    } else if (type === 'my-list') {
      chooseListSheetRef.current?.expand();
    }
  }

  function handleSelectedPeopleDone(people: Contact[]) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedPeopleForAudience(people);
    setShowSelectedPeopleModal(false);
  }

  function handleSelectList(list: List) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedList(list);
    chooseListSheetRef.current?.close();
    setShowChooseListModal(true);
  }

  function handleCreateNewList() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    chooseListSheetRef.current?.close();
    setShowCreateListModal(true);
  }

  function handleCreateListDone(people: Contact[], listName: string) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // Create a new list (in real app, this would save to backend)
    const newList: List = {
      id: Date.now().toString(),
      name: listName,
      peopleCount: people.length,
    };
    setSelectedList(newList);
    setShowCreateListModal(false);
  }

  function handleChooseFromListDone(list: List) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedList(list);
    setShowChooseListModal(false);
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
            <View className="flex-row items-center justify-between">
              <Text className="text-sm font-semibold text-grey-alpha-450">
                Request from:
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
                <View className="h-3 w-3 flex-row items-center justify-center rounded-full border border-primary">
                  <Text className="text-sm font-semibold text-primary">
                    +{selectedContacts.length - 3}
                  </Text>
                </View>
              ) : null}
            </View>

            <View className="mt-3 border-b border-grey-plain-450/40 pb-2">
              <RNTextInput
                ref={searchInputRef}
                value={search}
                onChangeText={setSearch}
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

          {showResults ? (
            <View className="mx-4 mt-4 overflow-hidden rounded-3xl  bg-grey-plain-50">
              {filteredContacts.map((contact, index) => {
                const isSelected = selectedContacts.some(
                  (item) => item.id === contact.id
                );
                return (
                  <View key={contact.id}>
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

            <View className="mt-5">
              <TextButton
                title="Explore other options"
                onPress={handleExploreOptions}
                underline
                className="self-center"
              />
            </View>
          </View>
        </ScrollView>

        {/* Audience Bottom Sheet */}
        <AudienceBottomSheet
          ref={audienceSheetRef}
          variant="offer"
          selectedType={audienceOfferType}
          onSelectAudience={handleAudienceSelect}
        />

        {/* Selected People Modal (for "Selected people" audience) */}
        <AddCollaboratorsModal
          visible={showSelectedPeopleModal}
          currentCollaborators={selectedPeopleForAudience}
          onDone={handleSelectedPeopleDone}
          onClose={() => setShowSelectedPeopleModal(false)}
        />

        {/* Choose List Bottom Sheet */}
        <ChooseListBottomSheet
          ref={chooseListSheetRef}
          onSelectList={handleSelectList}
          onCreateNewList={handleCreateNewList}
        />

        {/* Choose From List Modal */}
        <ChooseFromListModal
          visible={showChooseListModal}
          onDone={handleChooseFromListDone}
          onClose={() => setShowChooseListModal(false)}
        />

        {/* Create List Modal */}
        <CreateListModal
          visible={showCreateListModal}
          onDone={handleCreateListDone}
          onClose={() => setShowCreateListModal(false)}
        />

        {/* Review Contacts Modal */}
        <ReviewContactsModal
          visible={showReviewModal}
          contacts={selectedContacts}
          onRemove={handleRemove}
          onProceed={handleProceed}
          onClose={() => setShowReviewModal(false)}
        />
      </View>
    </KeyboardAvoidingView>
  );
}
