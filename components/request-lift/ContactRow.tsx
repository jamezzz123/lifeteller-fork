import { Text, TouchableOpacity, View } from 'react-native';
import { Image } from 'expo-image';
import { CheckCircle2, Plus } from 'lucide-react-native';

import { colors } from '@/theme/colors';
import { Contact } from './types';

type ContactRowProps = {
  contact: Contact;
  disabled: boolean;
  isSelected: boolean;
  onSelect: (contact: Contact) => void;
};

export function ContactRow({
  contact,
  disabled,
  isSelected,
  onSelect,
}: ContactRowProps) {
  return (
    <TouchableOpacity
      onPress={() => onSelect(contact)}
      disabled={disabled || isSelected}
      className="flex-row items-center bg-grey-plain-50 px-4 py-3"
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
        <Text className="mt-1 text-sm text-grey-alpha-400">
          @{contact.username}
        </Text>
      </View>
      {isSelected ? (
        <Text className="text-sm text-grey-alpha-400">Already added</Text>
      ) : (
        <View className="size-9 items-center justify-center rounded-full border border-primary-tints-200">
          <Plus size={18} color={colors.primary.purple} strokeWidth={2.6} />
        </View>
      )}
    </TouchableOpacity>
  );
}
