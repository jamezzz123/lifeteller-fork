import React, { useState, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Share } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  MoreVertical,
  Copy,
  Share2,
  Download,
  BadgeCheck,
  ExternalLink,
  CornerUpLeft,
} from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Image } from 'expo-image';
import { colors } from '@/theme/colors';
import { formatAmount } from '@/utils/formatAmount';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import { TransactionOptionsBottomSheet } from '@/components/wallet/TransactionOptionsBottomSheet';
import { BottomSheetRef } from '@/components/ui/BottomSheet';

interface TransactionDetail {
  id: string;
  amount: number;
  status: 'success' | 'pending' | 'failed';
  type: string;
  mode: 'inflow' | 'outflow';
  beneficiary?: {
    name: string;
  };
  date: string;
  reference: string;
  liftSummary?: {
    type: string;
    user: {
      id: string;
      name: string;
      username: string;
      avatar?: string;
      verified: boolean;
    };
    liftId: string;
  };
}

// Mock transaction detail - replace with actual API call
const getTransactionDetail = (id: string): TransactionDetail | null => {
  // In real app, fetch from API
  return {
    id,
    amount: 50000,
    status: 'success',
    type: 'Lift offer',
    mode: 'outflow',
    beneficiary: {
      name: 'Isaac Akinyemi',
    },
    date: '09 Feb. 2024, 8:54am GMT+1',
    reference: 'liftteller_liftoffer_18018au80',
    liftSummary: {
      type: 'Lift request',
      user: {
        id: 'user123',
        name: 'Isaac Tolulope',
        username: 'dareytemy',
        avatar: undefined, // Use placeholder for now
        verified: true,
      },
      liftId: '1',
    },
  };
};

export default function TransactionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [transaction] = useState<TransactionDetail | null>(
    id ? getTransactionDetail(id) : null
  );
  const optionsSheetRef = useRef<BottomSheetRef>(null);

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  const handleMenu = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    optionsSheetRef.current?.expand();
  };

  const handleCopyReference = async () => {
    if (!transaction) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await Clipboard.setStringAsync(transaction.reference);
    // TODO: Show toast notification
    console.log('Reference copied');
  };

  const handleShareReceipt = async () => {
    if (!transaction) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      await Share.share({
        message: `Transaction Receipt\n\nAmount: ${formatAmount(transaction.amount)}\nReference: ${transaction.reference}\nDate: ${transaction.date}`,
        title: 'Transaction Receipt',
      });
    } catch (error) {
      console.error('Error sharing receipt:', error);
    }
  };

  const handleDownloadReceipt = async () => {
    if (!transaction) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      // TODO: Generate receipt image/PDF and save to device
      // This will require expo-file-system and expo-media-library packages
      // For now, just log
      console.log('Download receipt');
      // TODO: Show success toast
    } catch (error) {
      console.error('Error downloading receipt:', error);
      // TODO: Show error toast
    }
  };

  const handleGoToLift = () => {
    if (!transaction?.liftSummary) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push({
      pathname: '/lift-request/[id]' as any,
      params: { id: transaction.liftSummary.liftId },
    });
  };

  if (!transaction) {
    return (
      <SafeAreaView className="flex-1 bg-background" edges={['top', 'bottom']}>
        <View className="flex-1 items-center justify-center">
          <Text className="text-base text-grey-plain-550">
            Transaction not found
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'bottom']}>
      {/* Header */}
      <View className="border-b border-grey-plain-150 bg-white px-4 py-3">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-3">
            <TouchableOpacity onPress={handleBack} hitSlop={8}>
              <CornerUpLeft color={colors['grey-alpha']['500']} size={24} />
            </TouchableOpacity>
            <Text className="text-xl font-semibold text-grey-alpha-500">
              Transaction details
            </Text>
          </View>
          <TouchableOpacity onPress={handleMenu} hitSlop={8}>
            <MoreVertical color={colors['grey-alpha']['500']} size={24} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      <ScrollView
        className="flex-1 bg-white"
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Amount and Status */}
        <View className="border-b border-grey-plain-150 px-4 py-6">
          <View className="flex-row items-center justify-between">
            <Text className="text-3xl font-bold text-grey-alpha-500">
              {formatAmount(transaction.amount, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </Text>
            <View
              className="rounded-full px-3 py-1"
              style={{ backgroundColor: colors['green-tint']['200'] }}
            >
              <Text
                className="text-sm font-semibold"
                style={{ color: colors.state.green }}
              >
                Success
              </Text>
            </View>
          </View>
        </View>

        {/* Transaction Details */}
        <View className="border-b border-grey-plain-150 px-4 py-6">
          <View className="gap-4">
            {/* Transaction Type and Mode */}
            <View className="flex-row gap-6">
              <View className="flex-1">
                <Text className="mb-1 text-sm text-grey-plain-550">
                  Transaction type
                </Text>
                <Text className="text-base font-semibold text-grey-alpha-500">
                  {transaction.type}
                </Text>
              </View>
              <View className="flex-1">
                <Text className="mb-1 text-sm text-grey-plain-550">
                  Transaction mode
                </Text>
                <Text className="text-base font-semibold text-grey-alpha-500">
                  {transaction.mode === 'inflow' ? 'Inflow' : 'Outflow'}
                </Text>
              </View>
            </View>

            {/* Beneficiary Details */}
            {transaction.beneficiary && (
              <View>
                <Text className="mb-1 text-sm text-grey-plain-550">
                  Beneficiary details
                </Text>
                <Text className="text-base font-semibold text-grey-alpha-500">
                  {transaction.beneficiary.name}
                </Text>
              </View>
            )}

            {/* Date */}
            <View>
              <Text className="mb-1 text-sm text-grey-plain-550">Date</Text>
              <Text className="text-base font-semibold text-grey-alpha-500">
                {transaction.date}
              </Text>
            </View>

            {/* Transaction Reference */}
            <View>
              <Text className="mb-1 text-sm text-grey-plain-550">
                Transaction reference
              </Text>
              <View className="flex-row items-center gap-2">
                <Text className="flex-1 text-base font-semibold text-grey-alpha-500">
                  {transaction.reference}
                </Text>
                <TouchableOpacity
                  onPress={handleCopyReference}
                  hitSlop={8}
                  className="p-1"
                >
                  <Copy
                    color={colors['grey-alpha']['500']}
                    size={20}
                    strokeWidth={2}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* Lift Summary */}
        {transaction.liftSummary && (
          <View className="border-b border-grey-plain-150 px-4 py-6">
            <Text className="mb-4 text-sm text-grey-alpha-500">
              Lift summary
            </Text>
            <Text className="mb-4 text-sm font-semibold text-grey-alpha-500">
              {transaction.liftSummary.type}
            </Text>
            <View className="flex-row items-center gap-3">
              {/* Profile Picture */}
              <View className="relative">
                <View
                  className="size-12 items-center justify-center overflow-hidden rounded-full"
                  style={{ backgroundColor: colors['grey-plain']['300'] }}
                >
                  {transaction.liftSummary.user.avatar ? (
                    <Image
                      source={{ uri: transaction.liftSummary.user.avatar }}
                      style={{ width: 48, height: 48 }}
                      contentFit="cover"
                    />
                  ) : (
                    <View
                      className="h-full w-full items-center justify-center"
                      style={{
                        backgroundColor: colors['primary-tints'].purple['100'],
                      }}
                    >
                      <Text
                        className="text-base font-bold"
                        style={{ color: colors.primary.purple }}
                      >
                        {getInitials(transaction.liftSummary.user.name)}
                      </Text>
                    </View>
                  )}
                </View>
              </View>

              {/* User Info */}
              <View className="flex-1">
                <View className="flex-row items-center gap-1">
                  <Text className="text-base font-semibold text-grey-alpha-500">
                    {transaction.liftSummary.user.name}
                  </Text>
                  {transaction.liftSummary.user.verified && (
                    <BadgeCheck color={colors.primary.purple} size={16} />
                  )}
                </View>
                <Text className="text-sm text-grey-plain-550">
                  @{transaction.liftSummary.user.username}
                </Text>
              </View>

              {/* Go to Lift Link */}
              <TouchableOpacity
                onPress={handleGoToLift}
                className="flex-row items-center gap-1"
                hitSlop={8}
              >
                <Text
                  className="text-sm font-medium"
                  style={{ color: colors.primary.purple }}
                >
                  Go to lift
                </Text>
                <ExternalLink
                  color={colors.primary.purple}
                  size={16}
                  strokeWidth={2}
                />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Bottom Action Buttons */}
      <View className="absolute bottom-0 left-0 right-0 border-t border-grey-plain-150 bg-white px-4 pb-8 pt-4">
        <View className="flex-row gap-3">
          {/* Share Receipt Button */}
          <TouchableOpacity
            onPress={handleShareReceipt}
            className="flex-1 items-center gap-2 rounded-xl bg-grey-alpha-100 py-4"
            activeOpacity={0.7}
          >
            <Share2
              color={colors['grey-alpha']['500']}
              size={24}
              strokeWidth={2}
            />
            <Text className="text-sm font-medium text-grey-alpha-500">
              Share receipt
            </Text>
          </TouchableOpacity>

          {/* Download Receipt Button */}
          <TouchableOpacity
            onPress={handleDownloadReceipt}
            className="flex-1 items-center gap-2 rounded-xl bg-grey-alpha-100 py-4"
            activeOpacity={0.7}
          >
            <Download
              color={colors['grey-alpha']['500']}
              size={24}
              strokeWidth={2}
            />
            <Text className="text-sm font-medium text-grey-alpha-500">
              Download receipt
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Transaction Options Bottom Sheet */}
      {transaction && (
        <TransactionOptionsBottomSheet
          ref={optionsSheetRef}
          transactionId={transaction.id}
        />
      )}
    </SafeAreaView>
  );
}
