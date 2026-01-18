import React from 'react';
import { View, Text } from 'react-native';
import { Info, CheckCircle2, XCircle } from 'lucide-react-native';
import { colors } from '@/theme/colors';

export type StatusType = 'pending' | 'offered' | 'accepted' | 'declined';

interface StatusBadgeProps {
  status: StatusType;
  size?: 'small' | 'medium';
  className?: string;
}

export function StatusBadge({
  status,
  size = 'small',
  className = '',
}: StatusBadgeProps) {
  const getStatusConfig = () => {
    switch (status) {
      case 'offered':
        return {
          bg: colors['green-tint']['200'], // Light green background
          text: colors.state.green, // Medium green text
          icon: (
            <CheckCircle2
              size={size === 'small' ? 12 : 14}
              color={colors.state.green}
              strokeWidth={2}
            />
          ),
          label: 'Offered',
        };
      case 'accepted':
        return {
          bg: colors['green-tint']['200'], // Light green background
          text: colors.state.green,
          icon: (
            <CheckCircle2
              size={size === 'small' ? 12 : 14}
              color={colors.state.green}
              strokeWidth={2}
            />
          ),
          label: 'Accepted',
        };
      case 'declined':
        return {
          bg: colors['grey-plain']['100'], // Light grey background
          text: colors.state.red,
          icon: (
            <XCircle
              size={size === 'small' ? 12 : 14}
              color={colors.state.red}
              strokeWidth={2}
            />
          ),
          label: 'Declined',
        };
      case 'pending':
      default:
        return {
          bg: colors['yellow-tint']['50'], // Light beige/yellow background
          text: colors.yellow['50'], // Medium orange-brown text
          icon: (
            <Info
              size={size === 'small' ? 12 : 14}
              color={colors.yellow['50']}
              strokeWidth={2}
            />
          ),
          label: 'Pending',
        };
    }
  };

  const statusConfig = getStatusConfig();
  const paddingClass = size === 'small' ? 'px-2.5 py-1' : 'px-3 py-1.5';
  const textSizeClass = size === 'small' ? 'text-xs' : 'text-sm';

  return (
    <View
      className={`flex-row items-center gap-1.5 rounded-full ${paddingClass} ${className}`}
      style={{ backgroundColor: statusConfig.bg }}
    >
      {statusConfig.icon}
      <Text
        className={`${textSizeClass} font-medium`}
        style={{ color: statusConfig.text }}
      >
        {statusConfig.label}
      </Text>
    </View>
  );
}
