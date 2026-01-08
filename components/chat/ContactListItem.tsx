import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { BadgeCheck, Check } from 'lucide-react-native';
import { Avatar } from '@/components/ui/Avatar';
import { colors } from '@/theme/colors';
import { Contact } from '@/components/request-lift/types';

interface ContactListItemProps {
  contact: Contact;
  onPress: (contact: Contact) => void;
  showPurpleBadge?: boolean;
  showCheckbox?: boolean;
  isSelected?: boolean;
}

export function ContactListItem({
  contact,
  onPress,
  showPurpleBadge = false,
  showCheckbox = false,
  isSelected = false,
}: ContactListItemProps) {
  const profileImage =
    typeof contact.avatar === 'object' && 'uri' in contact.avatar
      ? contact.avatar.uri
      : undefined;

  return (
    <TouchableOpacity
      onPress={() => onPress(contact)}
      className="flex-row items-center border-b border-grey-plain-150 px-4 py-3"
      activeOpacity={0.7}
    >
      {/* Profile Picture with Badge */}
      <View className="relative mr-3">
        <Avatar
          profileImage={profileImage}
          name={contact.name}
          size={48}
          showBadge={true}
        />
        {/* Purple Badge Overlay (optional) */}
        {showPurpleBadge && (
          <View
            className="absolute -bottom-0.5 -right-0.5 items-center justify-center rounded-full border-2 border-white"
            style={{
              width: 20,
              height: 20,
              backgroundColor: colors['primary-tints'].purple['100'],
            }}
          >
            <Text
              className="text-[10px] font-bold"
              style={{ color: colors.primary.purple }}
            >
              P
            </Text>
          </View>
        )}
      </View>

      {/* Contact Info */}
      <View className="flex-1">
        <View className="mb-0.5 flex-row items-center gap-1.5">
          <Text className="text-base font-semibold text-grey-alpha-500">
            {contact.name}
          </Text>
          {contact.verified && (
            <BadgeCheck color={colors.primary.purple} size={16} />
          )}
        </View>
        <Text className="text-sm text-grey-plain-550">
          @{contact.username}
        </Text>
      </View>

      {/* Checkbox (optional) */}
      {showCheckbox && (
        <View
          className="items-center justify-center rounded-full border-2"
          style={{
            width: 24,
            height: 24,
            borderColor: isSelected
              ? colors.primary.purple
              : colors['grey-plain']['450'],
            backgroundColor: isSelected
              ? colors.primary.purple
              : 'transparent',
          }}
        >
          {isSelected && (
            <Check size={14} color={colors['grey-plain']['50']} strokeWidth={3} />
          )}
        </View>
      )}
    </TouchableOpacity>
  );
}

