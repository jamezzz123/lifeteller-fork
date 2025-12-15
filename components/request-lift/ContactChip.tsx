import { Text, TouchableOpacity, View } from 'react-native';
import { Image } from 'expo-image';
import { X } from 'lucide-react-native';

import { colors } from '@/theme/colors';
import { Contact } from './types';

type ContactChipProps = {
  contact: Contact;
  onRemove: (id: string) => void;
};

export function ContactChip({ contact, onRemove }: ContactChipProps) {
  return (
    <View className="flex-row items-center gap-2 rounded-full border border-grey-plain-450 bg-grey-plain-50 px-3 py-2">
      <Image
        source={contact.avatar}
        style={{ width: 32, height: 32, borderRadius: 16 }}
        contentFit="cover"
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
