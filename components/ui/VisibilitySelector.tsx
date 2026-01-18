import { View, Text, TouchableOpacity } from 'react-native';
import {
  ChevronDown,
  Globe,
  Users,
  Lock,
  MessageCircle,
  LucideIcon,
} from 'lucide-react-native';
import { colors } from '@/theme/colors';

export type VisibilityOption = {
  key: string;
  label: string;
  description: string;
  icon?: LucideIcon;
};

type VisibilitySelectorProps = {
  selectedKey: string;
  onPress: () => void;
  title?: string;
  options?: VisibilityOption[];
};

const DEFAULT_ICON_MAP: Record<string, LucideIcon> = {
  everyone: Globe,
  friends: Users,
  'selected-people': Users,
  'chat-direct': MessageCircle,
  'my-list': Users,
  private: Lock,
};

const DEFAULT_OPTIONS: VisibilityOption[] = [
  {
    key: 'everyone',
    label: 'Public',
    description: 'All users can see this lift',
    icon: Globe,
  },
  {
    key: 'friends',
    label: 'Friends',
    description: 'People you follow and follow you back',
    icon: Users,
  },
  {
    key: 'selected-people',
    label: 'Selected people',
    description: 'Only chosen people can see this',
    icon: Users,
  },
  {
    key: 'chat-direct',
    label: 'Direct',
    description: 'Send directly to specific people',
    icon: MessageCircle,
  },
  {
    key: 'my-list',
    label: 'My list',
    description: 'People in your custom list',
    icon: Users,
  },
  {
    key: 'friends-except',
    label: 'Friends except',
    description: 'Don`t show to some connections',
    icon: Users,
  },
  {
    key: 'private',
    label: 'Private',
    description: 'Only you can see this',
    icon: Lock,
  },
];

export function VisibilitySelector({
  selectedKey,
  onPress,
  title,
  options = DEFAULT_OPTIONS,
}: VisibilitySelectorProps) {
  const selectedOption = options.find((opt) => opt.key === selectedKey);
  const Icon = selectedOption?.icon || DEFAULT_ICON_MAP[selectedKey] || Globe;

  return (
    <View>
      {title && (
        <Text className="mb-2 text-sm font-inter-medium text-grey-alpha-400">
          {title}
        </Text>
      )}
      <TouchableOpacity
        onPress={onPress}
        className="flex-row items-center rounded-2xl bg-grey-plain-100 px-4 py-3"
        activeOpacity={0.7}
      >
        {/* Icon */}
        <View className="mr-3">
          <Icon size={20} color={colors.primary.purple} strokeWidth={2} />
        </View>

        {/* Text Content */}
        <View className="flex-1">
          <Text className="text-sm font-inter-semibold text-grey-alpha-500">
            {selectedOption?.label || 'Select visibility'}
          </Text>
          <Text className="text-xs text-grey-alpha-400">
            {selectedOption?.description || 'Choose who can see this'}
          </Text>
        </View>

        {/* Chevron */}
        <ChevronDown size={20} color={colors.primary.purple} strokeWidth={2} />
      </TouchableOpacity>
    </View>
  );
}
