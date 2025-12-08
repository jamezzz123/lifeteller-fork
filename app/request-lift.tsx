import { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ImageSourcePropType,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Image } from 'expo-image';
import { CheckCircle2, Info, MapPin, Plus, X } from 'lucide-react-native';

import { Button } from '@/components/ui/Button';
import { colors } from '@/theme/colors';

type Contact = {
  id: string;
  name: string;
  username: string;
  location: string;
  verified?: boolean;
  avatar: ImageSourcePropType;
};

const MAX_SELECTION = 5;

const CONTACTS: Contact[] = [
  {
    id: '1',
    name: 'Isaac Tolulope',
    username: 'dareytemy',
    location: 'Lagos, Nigeria',
    verified: true,
    avatar: require('../assets/images/welcome/collage-1.jpg'),
  },
  {
    id: '2',
    name: 'Don Jay',
    username: 'donjay',
    location: 'Abuja, Nigeria',
    verified: true,
    avatar: require('../assets/images/welcome/collage-2.png'),
  },
  {
    id: '3',
    name: 'Amara Obi',
    username: 'amaraobi',
    location: 'Kigali, Rwanda',
    avatar: require('../assets/images/welcome/collage-3.jpg'),
  },
  {
    id: '4',
    name: 'Tomiwa Ade',
    username: 'tomiwaa',
    location: 'Cape Town, South Africa',
    avatar: require('../assets/images/welcome/collage-4.jpg'),
  },
  {
    id: '5',
    name: 'Chinwe Nwosu',
    username: 'chinwen',
    location: 'Nairobi, Kenya',
    verified: true,
    avatar: require('../assets/images/welcome/collage-5.jpg'),
  },
  {
    id: '6',
    name: 'Ayo Martins',
    username: 'ayomartins',
    location: 'Accra, Ghana',
    avatar: require('../assets/images/welcome/collage-6.jpg'),
  },
];

function SelectedChip({
  contact,
  onRemove,
}: {
  contact: Contact;
  onRemove: (id: string) => void;
}) {
  return (
    <View className="flex-row items-center gap-2 rounded-full border border-grey-plain-450 bg-grey-plain-50 px-3 py-2">
      <Image
        source={contact.avatar}
        className="size-8 rounded-full"
        contentFit="cover"
        transition={150}
      />
      <Text className="text-sm font-medium text-grey-alpha-500">
        {contact.name}
      </Text>
      <TouchableOpacity
        onPress={() => onRemove(contact.id)}
        accessibilityLabel={`Remove ${contact.name}`}
        hitSlop={10}
      >
        <X size={16} color={colors['grey-alpha']['400']} strokeWidth={2.5} />
      </TouchableOpacity>
    </View>
  );
}

function ContactRow({
  contact,
  disabled,
  onSelect,
}: {
  contact: Contact;
  disabled: boolean;
  onSelect: (contact: Contact) => void;
}) {
  return (
    <TouchableOpacity
      onPress={() => onSelect(contact)}
      disabled={disabled}
      className="flex-row items-center bg-grey-plain-50 px-4 py-3"
      style={{ opacity: disabled ? 0.45 : 1 }}
    >
      <Image
        source={contact.avatar}
        className="size-11 rounded-full"
        contentFit="cover"
        transition={150}
      />
      <View className="ml-3 flex-1">
        <View className="flex-row items-center gap-1">
          <Text className="text-base font-semibold text-grey-alpha-500">
            {contact.name}
          </Text>
          {contact.verified ? (
            <CheckCircle2
              size={16}
              color={colors.primary.purple}
              strokeWidth={2.4}
            />
          ) : null}
        </View>
        <View className="mt-1 flex-row items-center gap-1">
          <MapPin
            size={14}
            color={colors.primary.purple}
            strokeWidth={2.6}
          />
          <Text className="text-sm text-grey-alpha-400">
            @{contact.username} - {contact.location}
          </Text>
        </View>
      </View>
      <View className="size-9 items-center justify-center rounded-full border border-primary-tints-200">
        <Plus
          size={18}
          color={colors.primary.purple}
          strokeWidth={2.6}
        />
      </View>
    </TouchableOpacity>
  );
}

export default function RequestLiftScreen() {
  const [search, setSearch] = useState('');
  const [selectedContacts, setSelectedContacts] = useState<Contact[]>(
    CONTACTS.slice(0, 2),
  );

  const filteredContacts = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return [];

    return CONTACTS.filter(
      (contact) =>
        !selectedContacts.find((item) => item.id === contact.id) &&
        (contact.name.toLowerCase().includes(query) ||
          contact.username.toLowerCase().includes(query)),
    );
  }, [search, selectedContacts]);

  const remainingSelection = MAX_SELECTION - selectedContacts.length;
  const showResults = search.trim().length > 0;

  function handleSelect(contact: Contact) {
    if (selectedContacts.find((item) => item.id === contact.id)) {
      return;
    }
    if (selectedContacts.length >= MAX_SELECTION) return;
    setSelectedContacts((prev) => [...prev, contact]);
  }

  function handleRemove(contactId: string) {
    setSelectedContacts((prev) =>
      prev.filter((contact) => contact.id !== contactId),
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View className="flex-1">
          <View className="flex-row items-center justify-between px-4 pt-2 pb-3">
            <TouchableOpacity
              onPress={() => router.back()}
              accessibilityLabel="Close request lift"
              hitSlop={10}
              className="pr-2"
            >
              <X
                size={20}
                color={colors['grey-alpha']['500']}
                strokeWidth={2.6}
              />
            </TouchableOpacity>
            <Text className="text-base font-semibold text-grey-alpha-500">
              Request lift
            </Text>
            <View className="w-[84px] items-end">
              <Button
                title="Next"
                onPress={() => {}}
                size="small"
                disabled={selectedContacts.length === 0}
                className="px-4"
              />
            </View>
          </View>

          <View className="px-4">
            <View className="h-[3px] w-full rounded-full bg-grey-plain-450/60">
              <View className="h-[3px] w-24 rounded-full bg-primary" />
            </View>
          </View>

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
                  <SelectedChip
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
                {filteredContacts.map((contact, index) => (
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
                      disabled={remainingSelection <= 0}
                    />
                  </View>
                ))}
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
    </SafeAreaView>
  );
}
