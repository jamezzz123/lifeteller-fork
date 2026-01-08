import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { LucideIcon } from 'lucide-react-native';
import { colors } from '@/theme/colors';

interface ChatStarterCardProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  onPress: () => void;
}

export function ChatStarterCard({
  icon: Icon,
  title,
  subtitle,
  onPress,
}: ChatStarterCardProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-1 rounded-2xl px-4 py-4"
      style={{ backgroundColor: colors['grey-alpha']['150'] }}
      activeOpacity={0.8}
    >
      <Icon color={colors.primary.purple} size={24} strokeWidth={2} />
      <Text
        className="mt-2 text-base font-semibold"
        style={{ color: colors['grey-alpha']['500'] }}
      >
        {title}
      </Text>
      <Text
        className="mt-1 text-sm"
        style={{ color: colors['grey-alpha']['500'] }}
      >
        {subtitle}
      </Text>
    </TouchableOpacity>
  );
}
