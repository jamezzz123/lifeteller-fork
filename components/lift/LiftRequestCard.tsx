import React from 'react';
import { View, Text, Pressable, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import {
  BadgeCheck,
  Heart,
  MessageCircleMore,
  Repeat2,
  Share2,
  Hand,
  HandCoins,
  Info,
  CheckCircle2,
  XCircle,
  CircleCheck,
  ThumbsDown,
  HandMetal,
  Medal,
  HandHelping,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '@/theme/colors';
import { Button } from '@/components/ui/Button';
import { Lift } from '@/types/lift';

export interface LiftCardProps {
  lift: Lift;
  isLiked?: boolean;

  // Callbacks
  onLike?: () => void;
  onComment?: () => void;
  onShare?: () => void;
  onCardPress?: () => void;
  onOfferLift?: () => void;
  onDecline?: () => void;
  onAccept?: () => void;

  highlighted?: boolean;
}

export function LiftCard({
  lift,
  isLiked = false,
  onLike,
  onComment,
  onShare,
  onCardPress,
  onOfferLift,
  onDecline,
  onAccept,
  highlighted = false,
}: LiftCardProps) {
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);

  // Calculate progress for monetary lifts
  const getProgress = () => {
    if (!lift.monetary) return 0;
    const { currentAmount, targetAmount } = lift.monetary;
    return targetAmount > 0
      ? Math.min((currentAmount / targetAmount) * 100, 100)
      : 0;
  };

  const progress = getProgress();

  // Get status configuration
  const getStatusConfig = () => {
    switch (lift.status) {
      case 'pending':
        return {
          bg: colors['yellow-tint']['50'],
          text: colors.yellow['50'],
          label: 'Pending',
          icon: <Info size={16} color={colors.yellow['50']}></Info>,
        };
      case 'request-sent':
        return {
          bg: colors['primary-tints'].purple['50'],
          text: colors.primary.purple,
          label: 'Request sent',
          icon: <HandMetal size={16} color={colors.primary.purple}></HandMetal>,
        };
      case 'offered':
        return {
          bg: colors['primary-tints'].purple['100'],
          text: colors.primary.purple,
          label: 'Offered',
          icon: <HandMetal size={16} color={colors.primary.purple}></HandMetal>,
        };
      case 'accepted':
        return {
          bg: '#E7F5E9',
          text: '#22874E',
          label: 'Accepted',
          icon: <CircleCheck size={16} color={'#22874E'}></CircleCheck>,
        };
      case 'declined':
        return {
          bg: '#FEE9E9',
          text: colors.state.red,
          label: 'Declined',
          icon: <ThumbsDown size={16} color={colors.state.red}></ThumbsDown>,
        };
      case 'active':
        return {
          bg: colors['primary-tints'].purple['50'],
          text: colors.primary.purple,
          label: 'Active',
          icon: <HandMetal size={16} color={colors.primary.purple}></HandMetal>,
        };
      case 'completed':
        return {
          bg: '#E7F5E9',
          text: '#22874E',
          label: 'Completed',
          icon: <CircleCheck size={16} color={'#22874E'}></CircleCheck>,
        };
      case 'closed':
        return {
          bg: colors['grey-plain']['300'],
          text: colors['grey-plain']['550'],
          label: 'Closed',
          icon: <ThumbsDown size={16} color={colors.state.red}></ThumbsDown>,
        };
      default:
        return {
          bg: colors['yellow-tint']['50'],
          text: colors.yellow['50'],
          label: 'Pending',
          icon: <Info size={16} color={colors.yellow['50']}></Info>,
        };
    }
  };

  const statusConfig = getStatusConfig();

  // Get card header configuration
  const getCardHeaderConfig = () => {
    switch (lift.cardType) {
      case 'lift-request':
        return {
          icon: HandHelping,
          label: 'Lift request',
        };
      case 'lift-raised':
        return {
          icon: HandCoins,
          label: 'Lift raised',
        };
      case 'lift-offer':
        return {
          icon: Hand,
          label: 'Lift offer',
        };
      case 'lift-offered':
        return {
          icon: Hand,
          label: 'Lift offered',
        };
      default:
        return {
          icon: HandCoins,
          label: 'Lift request',
        };
    }
  };

  const headerConfig = getCardHeaderConfig();
  const HeaderIcon = headerConfig.icon;

  // Render co-raisers section
  const renderCoRaisers = () => {
    if (!lift.monetary?.coRaisers || lift.monetary.coRaisers.length === 0)
      return null;

    const firstCoRaiser = lift.monetary.coRaisers[0];
    const othersCount = lift.monetary.coRaisers.length - 1;

    return (
      <View className="mb-3 flex-row items-center gap-2">
        <View className="h-6 w-6 overflow-hidden rounded-full bg-grey-plain-300">
          <Image
            source={{ uri: firstCoRaiser.avatar }}
            style={{ width: 24, height: 24 }}
            contentFit="cover"
          />
        </View>
        <Text className="text-[13px] text-grey-plain-550">
          Co-raised by{' '}
          <Text className="font-inter-semibold">{firstCoRaiser.name}</Text>
          {othersCount > 0 && (
            <Text>
              {' '}
              and {othersCount} other{othersCount > 1 ? 's' : ''}
            </Text>
          )}
        </Text>
      </View>
    );
  };

  // Render non-monetary items as chips
  const renderNonMonetaryItems = () => {
    if (!lift.nonMonetary?.items || lift.nonMonetary.items.length === 0)
      return null;

    return (
      <View className="mb-4 flex-row flex-wrap gap-2">
        {lift.nonMonetary.items.map((item) => (
          <View
            key={item.id}
            className="rounded-full bg-grey-plain-150 px-4 py-2"
          >
            <Text className="text-[14px] font-inter-medium text-grey-alpha-500">
              {item.name}
              {item.quantity && item.quantity > 1 ? ` (${item.quantity})` : ''}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  // Calculate safe pill position (keeps it within bounds)
  const getPillPosition = (): { left: string | number; marginLeft: number } => {
    // Pill width is ~40px, half is 20px
    // Clamp between edges to prevent overflow
    if (progress <= 5) {
      return { left: 2 as const, marginLeft: 0 };
    } else if (progress >= 95) {
      return { left: '100%' as const, marginLeft: -40 };
    }
    return { left: `${progress}%`, marginLeft: -20 };
  };

  // Render monetary progress section
  const renderMonetaryProgress = () => {
    if (!lift.monetary) return null;

    const { currentAmount, targetAmount } = lift.monetary;
    const pillPosition = getPillPosition();

    return (
      <View className="mb-4">
        <Text className="mb-2 text-[13px] text-grey-plain-550">
          <Text className="font-inter-semibold">{formatCurrency(currentAmount)}</Text>{' '}
          of {formatCurrency(targetAmount)} raised
        </Text>

        {/* Progress Bar */}
        <View className="relative mb-2">
          <View className="h-2 flex-1 overflow-visible rounded-full bg-grey-plain-300">
            <View className="relative h-full w-full">
              <LinearGradient
                colors={['#7538BA', '#CF2586']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{
                  width: `${progress}%`,
                  height: '100%',
                  borderRadius: 999,
                }}
              />
              {/* Percentage Pill */}
              <View
                className="border-primary-purple absolute -top-2 h-6 min-w-[40px] items-center justify-center rounded-full border bg-white px-2"
                style={{
                  left: pillPosition.left as number | `${number}%`,
                  marginLeft: pillPosition.marginLeft,
                }}
              >
                <Text className="text-xs font-inter-medium text-grey-alpha-500">
                  {Math.round(progress)}%
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  };

  // Render offer details (for lift-offer cards)
  const renderOfferDetails = () => {
    if (!lift.offer) return null;

    const parts: string[] = [];

    if (lift.offer.monetaryAmount) {
      parts.push(formatCurrency(lift.offer.monetaryAmount));
    }

    if (lift.offer.items && lift.offer.items.length > 0) {
      const firstItem = lift.offer.items[0].name;
      const othersCount = lift.offer.items.length - 1;
      parts.push(
        othersCount > 0
          ? `${firstItem} and ${othersCount} other${othersCount > 1 ? 's' : ''}`
          : firstItem
      );
    }

    if (parts.length === 0) return null;

    return (
      <View className="mb-4">
        <Text className="text-[14px] text-grey-plain-550">
          <Text className="font-inter-semibold">Offered:</Text> {parts.join(' • ')}
        </Text>
      </View>
    );
  };

  // Render action buttons based on card type and status
  const renderActionButtons = () => {
    // Only show action buttons for pending requests
    if (lift.cardType === 'lift-request' && lift.status === 'pending') {
      return (
        <View className="flex-row items-center justify-between gap-3 border-t border-grey-alpha-250 pt-2">
          <TouchableOpacity
            onPress={onDecline}
            className="flex-1 items-start rounded-full  border-grey-alpha-250 bg-white py-3"
            activeOpacity={0.7}
          >
            <Text className="text-sm font-inter-semibold text-state-red">
              Decline
            </Text>
          </TouchableOpacity>

          <View className="flex-1">
            <Button
              title="Offer lift"
              onPress={onOfferLift || (() => {})}
              variant="outline"
              size="small"
              className="px-1"
              iconLeft={
                <HandCoins size={18} color={colors['primary']['purple']} />
              }
            />
          </View>
        </View>
      );
    }

    // For lift offers that are pending acceptance
    if (lift.cardType === 'lift-offer' && lift.status === 'offered') {
      return (
        <View className="flex-row items-center gap-3">
          <TouchableOpacity
            onPress={onDecline}
            className="flex-1 items-center justify-center rounded-full border border-state-red bg-white py-3"
            activeOpacity={0.7}
          >
            <View className="flex-row items-center gap-2">
              <XCircle size={18} color={colors.state.red} />
              <Text className="text-[15px] font-inter-semibold text-state-red">
                Decline
              </Text>
            </View>
          </TouchableOpacity>

          <View className="flex-1">
            <Button
              title="Accept"
              onPress={onAccept || (() => {})}
              variant="primary"
              size="medium"
              iconLeft={
                <CheckCircle2 size={18} color={colors['grey-plain']['50']} />
              }
            />
          </View>
        </View>
      );
    }

    return null;
  };
  const headerBgClass = highlighted
    ? 'bg-primary-tints-50'
    : 'bg-grey-plain-150';
  return (
    <Pressable
      onPress={onCardPress}
      className="rounded-xl border border-grey-plain-300 bg-white"
      style={({ pressed }) => ({
        opacity: pressed && onCardPress ? 0.95 : 1,
      })}
    >
      {/* Header: Card Type + Status */}
      <View
        className={`flex-row items-center justify-between rounded-t-xl  px-4 py-3 ${headerBgClass}`}
      >
        <View className="flex-row items-center gap-2">
          <HeaderIcon size={20} color={colors['grey-alpha']['500']} />
          <Text className="text-[15px] font-inter-medium text-grey-alpha-500">
            {headerConfig.label}
          </Text>
        </View>
        <View
          className="flex-row items-center space-y-2 rounded-full px-3 py-1"
          style={{ backgroundColor: statusConfig.bg }}
        >
          {statusConfig.icon}
          <Text
            className="px-1 text-[13px] font-inter-semibold"
            style={{ color: statusConfig.text }}
          >
            {statusConfig.label}
          </Text>
        </View>
      </View>

      <View className="p-4">
        {/* User Header */}
        <View className="mb-3 flex-row items-center gap-3">
          <View className="h-10 w-10 overflow-hidden rounded-full bg-grey-plain-300">
            <Image
              source={{ uri: lift.owner.avatar }}
              style={{ width: 40, height: 40 }}
              contentFit="cover"
            />

            <View
              className="absolute -bottom-0.5 left-3 h-5 w-5 items-center justify-center rounded-full border-2 border-white"
              style={{
                backgroundColor: colors['primary-tints'].purple['100'],
              }}
            >
              <Medal color={colors.primary.purple} size={12} />
            </View>
          </View>
          <View className="flex-1">
            <View className="flex-row items-center gap-1">
              <Text className="text-[15px] font-inter-semibold text-grey-alpha-500">
                {lift.owner.name}
              </Text>
              {lift.owner.verified && (
                <BadgeCheck color={colors.primary.purple} size={16} />
              )}
              {lift.collaborators && lift.collaborators.length > 0 && (
                <Text className="text-[13px] text-grey-plain-550">
                  {' '}
                  and +{lift.collaborators.length} other
                  {lift.collaborators.length > 1 ? 's' : ''}
                </Text>
              )}
            </View>
            <View className="flex-row items-center gap-1">
              <Text className="text-[13px] text-grey-plain-550">
                @{lift.owner.handle}
              </Text>
              <View className="h-1 w-1 rounded-full bg-grey-plain-550" />
              <Text className="text-[13px] text-grey-plain-550">
                {lift.timestamp}
              </Text>
            </View>
          </View>
        </View>

        {/* Title & Description */}
        <View className="mb-3">
          <Text className="mb-2 text-[17px] font-inter-semibold text-grey-alpha-500">
            {lift.title}
          </Text>
          <Text
            className="text-[14px] font-inter leading-5 text-grey-plain-550"
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {lift.description}
          </Text>
        </View>

        {/* Conditional Content Based on Lift Type */}

        {/* Monetary Progress (for monetary and both types) */}
        {(lift.liftType === 'monetary' || lift.liftType === 'both') &&
          lift.monetary &&
          renderMonetaryProgress()}

        {/* Co-raisers (for completed/active monetary lifts) */}
        {(lift.status === 'completed' || lift.status === 'active') &&
          renderCoRaisers()}

        {/* Offer Details (for lift-offer cards) */}
        {lift.cardType === 'lift-offer' && renderOfferDetails()}

        {/* Non-monetary Items (for non-monetary and both types) */}
        {(lift.liftType === 'non-monetary' || lift.liftType === 'both') &&
          lift.nonMonetary &&
          renderNonMonetaryItems()}

        {/* Engagement Metrics */}
        <View className="mb-4 flex-row items-center gap-6">
          <TouchableOpacity
            onPress={onLike}
            className="flex-row items-center gap-1.5"
            activeOpacity={0.7}
          >
            <Heart
              size={20}
              color={isLiked ? colors.state.red : colors['grey-plain']['550']}
              fill={isLiked ? colors.state.red : 'transparent'}
              strokeWidth={2}
            />
            <Text className="text-[15px] text-grey-plain-550">
              {lift.likes}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onComment}
            className="flex-row items-center gap-1.5"
            activeOpacity={0.7}
          >
            <MessageCircleMore
              size={20}
              color={colors['grey-plain']['550']}
              strokeWidth={2}
            />
            <Text className="text-[15px] text-grey-plain-550">
              {lift.comments}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onShare}
            className="flex-row items-center gap-1.5"
            activeOpacity={0.7}
          >
            <Repeat2
              size={20}
              color={colors['grey-plain']['550']}
              strokeWidth={2}
            />
            <Text className="text-[15px] text-grey-plain-550">
              {lift.shares}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onShare}
            className="ml-auto"
            activeOpacity={0.7}
          >
            <Share2
              size={20}
              color={colors['grey-plain']['550']}
              strokeWidth={2}
            />
          </TouchableOpacity>
        </View>

        {/* Action Buttons */}
        {renderActionButtons()}
      </View>
    </Pressable>
  );
}
