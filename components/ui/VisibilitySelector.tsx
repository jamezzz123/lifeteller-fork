import { View, Text, TouchableOpacity } from 'react-native';
import { ChevronDown, Globe, Users, Lock, MessageCircle } from 'lucide-react-native';
import { colors } from '@/theme/colors';
import { AudienceOfferType } from '@/context/request-lift';

type VisibilitySelectorProps = {
  selectedType: AudienceOfferType;
  onPress: () => void;
};

const VISIBILITY_CONFIG: Record<
  AudienceOfferType,
  { icon: any; label: string; description: string }
> = {
  everyone: {
    icon: Globe,
    label: 'Public',
    description: 'All users can see this lift',
  },
  friends: {
    icon: Users,
    label: 'Friends',
    description: 'People you follow and follow you back',
  },
  'selected-people': {
    icon: Users,
    label: 'Selected people',
    description: 'Only chosen people can see this',
  },
  'chat-direct': {
    icon: MessageCircle,
    label: 'Direct',
    description: 'Send directly to specific people',
  },
  'my-list': {
    icon: Users,
    label: 'My list',
    description: 'People in your custom list',
  },
  private: {
    icon: Lock,
    label: 'Private',
    description: 'Only you can see this',
  },
};

export function VisibilitySelector({
  selectedType,
  onPress,
}: VisibilitySelectorProps) {
  const config = VISIBILITY_CONFIG[selectedType];
  const Icon = config.icon;

  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center rounded-2xl bg-grey-plain-100 px-4 py-3"
      activeOpacity={0.7}
    >
      {/* Icon */}
      <View className="mr-3">
        <Icon
          size={20}
          color={colors.primary.purple}
          strokeWidth={2}
        />
      </View>

      {/* Text Content */}
      <View className="flex-1">
        <Text className="text-sm font-semibold text-grey-alpha-500">
          {config.label}
        </Text>
        <Text className="text-xs text-grey-alpha-400">
          {config.description}
        </Text>
      </View>

      {/* Chevron */}
      <ChevronDown
        size={20}
        color={colors.primary.purple}
        strokeWidth={2}
      />
    </TouchableOpacity>
  );
}
