import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { HandHelping, HandCoins } from 'lucide-react-native';
import { colors } from '@/theme/colors';
import { formatAmount } from '@/utils/formatAmount';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/StatusBadge';

export type LiftMessageType =
  | 'lift-request' // User receives a lift request
  | 'lift-offer' // User receives a lift offer
  | 'lift-collaboration' // User receives a collaboration request
  | 'lift-offer-sent' // User has sent an offer (their perspective)
  | 'lift-request-offered'; // Request has been offered

export interface LiftMessageCardProps {
  type: LiftMessageType;
  title: string;
  amount: number;
  status?: 'pending' | 'offered' | 'accepted' | 'declined';
  timestamp: string;
  recipientName?: string; // Name of the recipient for appreciation message
  onOfferLift?: () => void;
  onAccept?: () => void;
  onDecline?: () => void;
  onCancelOffer?: () => void;
  isSent?: boolean; // Whether this message was sent by the current user
}

export function LiftMessageCard({
  type,
  title,
  amount,
  status = 'pending',
  timestamp,
  recipientName,
  onOfferLift,
  onAccept,
  onDecline,
  onCancelOffer,
  isSent = false,
}: LiftMessageCardProps) {
  const getHeaderConfig = () => {
    switch (type) {
      case 'lift-request':
        return {
          icon: <HandHelping size={18} color={colors['grey-alpha']['500']} />,
          label: 'Lift request',
        };
      case 'lift-offer':
        return {
          icon: <HandHelping size={18} color={colors['grey-alpha']['500']} />,
          label: 'Lift offer',
        };
      case 'lift-collaboration':
        return {
          icon: <HandHelping size={18} color={colors['grey-alpha']['500']} />,
          label: 'Lift raised - collaboration',
        };
      case 'lift-offer-sent':
        return {
          icon: <HandHelping size={18} color={colors['grey-alpha']['500']} />,
          label: 'Lift offer',
        };
      case 'lift-request-offered':
        return {
          icon: <HandHelping size={18} color={colors['grey-alpha']['500']} />,
          label: 'Lift request',
        };
      default:
        return {
          icon: <HandHelping size={18} color={colors['grey-alpha']['500']} />,
          label: 'Lift request',
        };
    }
  };

  const headerConfig = getHeaderConfig();

  const renderActionButtons = () => {
    // Lift request - show Offer lift and Decline buttons
    if (type === 'lift-request' && status === 'pending' && !isSent) {
      return (
        <View className="mt-3 flex-row items-center justify-between gap-3 border-t border-grey-plain-300 pt-3">
          <TouchableOpacity
            onPress={onDecline}
            activeOpacity={0.7}
            className="flex-1"
          >
            <Text className="text-sm font-semibold text-state-red">
              Decline
            </Text>
          </TouchableOpacity>
          <View className="flex-1">
            <Button
              title="Offer lift"
              onPress={onOfferLift || (() => {})}
              variant="outline"
              size="small"
              iconLeft={<HandCoins size={16} color={colors.primary.purple} />}
              className="w-full"
            />
          </View>
        </View>
      );
    }

    // Lift offer - show Accept and Decline buttons
    if (type === 'lift-offer' && status === 'pending' && !isSent) {
      return (
        <View className="mt-3 flex-row items-center justify-between gap-3 border-t border-grey-plain-300 pt-3">
          <TouchableOpacity
            onPress={onDecline}
            activeOpacity={0.7}
            className="flex-1"
          >
            <Text className="text-sm font-semibold text-state-red">
              Decline
            </Text>
          </TouchableOpacity>
          <View className="flex-1">
            <Button
              title="Accept"
              onPress={onAccept || (() => {})}
              variant="outline"
              size="small"
              iconLeft={<HandCoins size={16} color={colors.primary.purple} />}
              className="w-full"
            />
          </View>
        </View>
      );
    }

    // Lift collaboration - show Accept and Decline buttons
    if (type === 'lift-collaboration' && status === 'pending' && !isSent) {
      return (
        <View className="mt-3 flex-row items-center justify-between gap-3 border-t border-grey-plain-300 pt-3">
          <TouchableOpacity
            onPress={onDecline}
            activeOpacity={0.7}
            className="flex-1"
          >
            <Text className="text-sm font-semibold text-state-red">
              Decline
            </Text>
          </TouchableOpacity>
          <View className="flex-1">
            <Button
              title="Accept"
              onPress={onAccept || (() => {})}
              variant="outline"
              size="small"
              iconLeft={<HandCoins size={16} color={colors.primary.purple} />}
              className="w-full"
            />
          </View>
        </View>
      );
    }

    // Lift offer sent - show Cancel offer button
    if (type === 'lift-offer-sent' && status === 'pending' && isSent) {
      return (
        <View className="mt-3 border-t border-grey-plain-300 pt-3">
          <TouchableOpacity
            onPress={onCancelOffer}
            activeOpacity={0.7}
            className="items-start"
          >
            <Text className="text-sm font-semibold text-state-red">
              Cancel offer
            </Text>
          </TouchableOpacity>
        </View>
      );
    }

    // Lift request offered - no action buttons, just status
    if (type === 'lift-request-offered' && status === 'offered') {
      return null;
    }

    return null;
  };

  const showAppreciationMessage =
    type === 'lift-request-offered' && status === 'offered' && recipientName;

  return (
    <View>
      <View
        className="rounded-2xl p-3"
        style={{
          backgroundColor: colors['grey-plain']['150'],
          maxWidth: '100%',
        }}
      >
        <View className="rounded-lg bg-white px-3 py-2">
          {/* Header */}
          <View className="mb-3 flex-row items-center gap-2">
            {headerConfig.icon}
            <Text
              className="text-sm font-medium"
              style={{ color: colors['grey-alpha']['500'] }}
            >
              {headerConfig.label}
            </Text>
          </View>
          {/* Title */}
          <Text
            className="mb-3 text-base font-semibold"
            style={{ color: colors['grey-alpha']['500'] }}
          >
            {title}
          </Text>
          {/* Amount and Status */}
          <View className="mb-2 flex-row items-center justify-between">
            <Text
              className="text-base font-semibold"
              style={{ color: colors['grey-alpha']['500'] }}
            >
              {formatAmount(amount)}
            </Text>
            <StatusBadge status={status} size="small" />
          </View>
          {/* Action Buttons */}
          {renderActionButtons()}
        </View>

        {/* Timestamp */}
        <Text
          className="mt-3 text-xs"
          style={{ color: colors['grey-plain']['550'] }}
        >
          {timestamp}
        </Text>
      </View>

      {/* Appreciation Message Reminder */}
      {showAppreciationMessage && (
        <Text
          className="mt-2 text-sm"
          style={{ color: colors['grey-alpha']['500'] }}
        >
          Don&apos;t forget to send an appreciation message to {recipientName}.
        </Text>
      )}
    </View>
  );
}
