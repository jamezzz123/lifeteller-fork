import { Text, TouchableOpacity, View } from 'react-native';
import { Image } from 'expo-image';
import { CheckCircle2, Medal } from 'lucide-react-native';

import { colors } from '@/theme/colors';
import { Contact } from './types';

type ContactRowProps = {
  contact: Contact;
  disabled: boolean;
  isSelected: boolean;
  showName?: boolean;
  showBadge?: boolean;
  onSelect: (contact: Contact) => void;
};

export function ContactRow({
  contact,
  disabled,
  isSelected,
  onSelect,
  showBadge = true,
  showName = true,
}: ContactRowProps) {
  return (
    <TouchableOpacity
      onPress={() => onSelect(contact)}
      disabled={disabled || isSelected}
      className="flex-row items-center bg-grey-plain-50 px-2 py-3"
    >
      <Image
        source={contact.avatar}
        style={{ width: 44, height: 44, borderRadius: 22 }}
        contentFit="cover"
      />
      {showName && (
        <View className="ml-3 flex-1">
          <View className="flex-row items-center gap-1">
            <Text className="text-base font-inter-semibold text-grey-alpha-500">
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
      )}

      {isSelected && (
        <Text className="text-sm text-grey-alpha-400">Already added</Text>
      )}

      {/* Badge Overlay */}
      {showBadge && (
        <View
          className="absolute left-5 top-10 items-center justify-center rounded-full border-2 border-white"
          style={{
            width: 44 * 0.5,
            height: 44 * 0.5,
            backgroundColor: colors['primary-tints'].purple['100'],
          }}
        >
          <Medal
            color={colors.primary.purple}
            size={44 * 0.3}
            style={{ alignSelf: 'center' }}
          />
        </View>
      )}
    </TouchableOpacity>
  );
}
