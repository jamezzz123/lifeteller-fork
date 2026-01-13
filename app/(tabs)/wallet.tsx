import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Settings,
  Share2,
  Copy,
  Eye,
  EyeOff,
  ChevronRight,
  Plus,
  History,
  BanknoteArrowDown,
  BanknoteArrowUp,
  BadgeInfo,
  UserCheck,
  CircleArrowOutDownLeft,
  ReceiptText,
  ArrowUpDown,
  Wifi,
  MoreVertical,
  Search,
  SlidersHorizontal,
  ArrowDownLeft,
  ArrowUpRight,
} from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { WalletSuccessBottomSheet } from '@/components/wallet/WalletSuccessBottomSheet';
import { WalletCreatePasscodeBottomSheet } from '@/components/wallet/WalletCreatePasscodeBottomSheet';
import { WalletSettingsBottomSheet } from '@/components/wallet/WalletSettingsBottomSheet';
import { TierBottomSheet } from '@/components/wallet/TierBottomSheet';
import { DeactivateWalletConfirmationModal } from '@/components/wallet/DeactivateWalletConfirmationModal';
import { FreezeWalletConfirmationModal } from '@/components/wallet/FreezeWalletConfirmationModal';
import { PasscodeBottomSheet } from '@/components/ui/PasscodeBottomSheet';
import { BottomSheetRef } from '@/components/ui/BottomSheet';
import { Button } from '@/components/ui/Button';
import { Toast } from '@/components/ui/Toast';
import { colors } from '@/theme/colors';
import { formatAmount } from '@/utils/formatAmount';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';

interface Transaction {
  id: string;
  type: 'withdrawal' | 'lift-offered' | 'lift-received';
  title: string;
  description: string;
  amount: number;
  timestamp: string;
  status: 'success' | 'pending' | 'failed';
}

export default function WalletScreen() {
  const params = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const [showSuccessSheet, setShowSuccessSheet] = useState(false);
  const [showDeactivateToast, setShowDeactivateToast] = useState(false);
  const [showFreezeToast, setShowFreezeToast] = useState(false);
  const [showDeactivateConfirmation, setShowDeactivateConfirmation] =
    useState(false);
  const [showFreezeConfirmation, setShowFreezeConfirmation] = useState(false);
  const [deactivatePasscodeError, setDeactivatePasscodeError] = useState<
    string | undefined
  >();
  const [freezePasscodeError, setFreezePasscodeError] = useState<
    string | undefined
  >();
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const passcodeSheetRef = useRef<BottomSheetRef>(null);
  const settingsSheetRef = useRef<BottomSheetRef>(null);
  const tierSheetRef = useRef<BottomSheetRef>(null);
  const deactivatePasscodeSheetRef = useRef<BottomSheetRef>(null);
  const freezePasscodeSheetRef = useRef<BottomSheetRef>(null);

  // Calculate bottom padding to account for tab bar
  // Tab bar height: iOS ~88px, Android ~64px + insets
  const tabBarHeight =
    Platform.OS === 'ios' ? 88 : 64 + Math.max(insets.bottom - 8, 0);
  const bottomPadding = tabBarHeight + 16; // Add extra spacing

  // Mock wallet data - replace with actual data from API
  const walletData = {
    bankName: 'Parallex Bank',
    accountNumber: '9180918172',
    status: 'Active',
    tier: 'Tier 0',
    userName: 'Isaac Akinyemi Freeman',
    currentBalance: 698981.01,
    bookBalance: 898981.01,
    isKycVerified: false,
  };

  useEffect(() => {
    if (params.showSuccess === 'true') {
      setShowSuccessSheet(true);
      // Clear the param to avoid showing again on re-render
      router.setParams({ showSuccess: undefined } as any);
    }
    if (params.walletDeactivated === 'true') {
      setShowDeactivateToast(true);
      // Clear the param to avoid showing again on re-render
      router.setParams({ walletDeactivated: undefined } as any);
    }
    if (params.walletFrozen === 'true') {
      setShowFreezeToast(true);
      // Clear the param to avoid showing again on re-render
      router.setParams({ walletFrozen: undefined } as any);
    }
  }, [params.showSuccess, params.walletDeactivated, params.walletFrozen]);

  const handleSettingsPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    settingsSheetRef.current?.expand();
  };

  const handleDeactivateWallet = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowDeactivateConfirmation(true);
  };

  const handleConfirmDeactivate = () => {
    setShowDeactivateConfirmation(false);
    // Show passcode sheet after a short delay
    setTimeout(() => {
      setDeactivatePasscodeError(undefined);
      deactivatePasscodeSheetRef.current?.expand();
    }, 300);
  };

  const handleCancelDeactivate = () => {
    setShowDeactivateConfirmation(false);
  };

  const handleDeactivatePasscodeComplete = async (passcode: string) => {
    // TODO: Verify passcode with backend
    // Mock verification for now
    const CORRECT_PASSCODE = '123456';

    if (passcode === CORRECT_PASSCODE) {
      setDeactivatePasscodeError(undefined);
      deactivatePasscodeSheetRef.current?.close();
      // Navigate to password verification screen after a short delay
      setTimeout(() => {
        router.push('/verify-wallet-password');
      }, 300);
    } else {
      setDeactivatePasscodeError('Incorrect passcode. Please try again.');
    }
  };

  const handleDeactivateForgotPasscode = () => {
    deactivatePasscodeSheetRef.current?.close();
    router.push('/verify-otp');
  };

  const handleFreezeWallet = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowFreezeConfirmation(true);
  };

  const handleConfirmFreeze = () => {
    setShowFreezeConfirmation(false);
    // Show passcode sheet after a short delay
    setTimeout(() => {
      setFreezePasscodeError(undefined);
      freezePasscodeSheetRef.current?.expand();
    }, 300);
  };

  const handleCancelFreeze = () => {
    setShowFreezeConfirmation(false);
  };

  const handleFreezePasscodeComplete = async (passcode: string) => {
    // TODO: Verify passcode with backend
    // Mock verification for now
    const CORRECT_PASSCODE = '123456';

    if (passcode === CORRECT_PASSCODE) {
      setFreezePasscodeError(undefined);
      freezePasscodeSheetRef.current?.close();
      // Navigate to password verification screen after a short delay
      setTimeout(() => {
        router.push('/verify-wallet-password-freeze');
      }, 300);
    } else {
      setFreezePasscodeError('Incorrect passcode. Please try again.');
    }
  };

  const handleFreezeForgotPasscode = () => {
    freezePasscodeSheetRef.current?.close();
    router.push('/verify-otp');
  };

  const handleDoThisLater = () => {
    setShowSuccessSheet(false);
  };

  const handleCreatePasscode = () => {
    setShowSuccessSheet(false);
    // Show passcode bottom sheet
    setTimeout(() => {
      passcodeSheetRef.current?.expand();
    }, 300);
  };

  const handlePasscodeComplete = (passcode: string) => {
    // TODO: Save passcode to backend
    console.log('Passcode created:', passcode);
    passcodeSheetRef.current?.close();
    // Show success message or navigate
  };

  const handlePasscodeSheetClose = () => {
    passcodeSheetRef.current?.close();
  };

  const handleShareAccount = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // TODO: Implement share functionality
    console.log('Share account details');
  };

  const handleCopyAccount = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await Clipboard.setStringAsync(walletData.accountNumber);
    // TODO: Show toast notification
    console.log('Account number copied');
  };

  const handleToggleBalanceVisibility = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsBalanceVisible(!isBalanceVisible);
  };

  const handleFundWallet = () => {
    // TODO: Navigate to fund wallet screen
    console.log('Fund wallet');
  };

  const handleViewHistory = () => {
    // TODO: Navigate to wallet history screen
    console.log('View history');
  };

  const handleViewTier = () => {
    // TODO: Navigate to tier details screen
    console.log('View tier');
  };

  const handleUpgradeWallet = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    tierSheetRef.current?.expand();
  };

  const handleTierUpgrade = (targetTier: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const tierMap: Record<string, string> = {
      'Tier 0': 'tier-1',
      'Tier 1': 'tier-2',
      'Tier 2': 'tier-3',
      'Tier 3': 'tier-3',
    };
    const targetTierParam = tierMap[targetTier] || 'tier-1';
    router.push({
      pathname: '/upgrade-wallet' as any,
      params: { targetTier: targetTierParam },
    });
  };

  const handleWithdraw = () => {
    // TODO: Navigate to withdraw screen
    console.log('Withdraw');
  };

  const handleBuyAirtime = () => {
    // TODO: Navigate to buy airtime screen
    console.log('Buy airtime');
  };

  const handleBuyData = () => {
    // TODO: Navigate to buy data screen
    console.log('Buy data');
  };

  const handlePayBills = () => {
    // TODO: Navigate to pay bills screen
    console.log('Pay bills');
  };

  const handleMoreActions = () => {
    // TODO: Show more actions bottom sheet
    console.log('More actions');
  };

  const handleSeeAllTransactions = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/all-transactions' as any);
  };

  const handleTransactionPress = (transactionId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(`/transaction/${transactionId}` as any);
  };

  const handleFilterTransactions = () => {
    // TODO: Show filter bottom sheet
    console.log('Filter transactions');
  };

  // Mock transaction data
  const transactions: Transaction[] = [
    {
      id: '1',
      type: 'withdrawal',
      title: 'Fund withdrawal',
      description: 'Description goes here.',
      amount: 5600,
      timestamp: '10:04am',
      status: 'success',
    },
    {
      id: '2',
      type: 'lift-offered',
      title: 'Lift offered',
      description: 'You offered Isaac Tolulope a lift.',
      amount: 5600,
      timestamp: '10:04am',
      status: 'success',
    },
    {
      id: '3',
      type: 'lift-received',
      title: 'Lift offer',
      description: 'OlorunToba Freeman sent you a...',
      amount: 5600,
      timestamp: '10:04am',
      status: 'success',
    },
  ];

  const renderTransactionIcon = (type: Transaction['type']) => {
    const isOutgoing = type === 'withdrawal' || type === 'lift-offered';
    const badgeColor = isOutgoing ? colors.state.red : colors.state.green;
    const badgeBackgroundColor = isOutgoing
      ? colors['red-tint']['150']
      : colors['green-tint']['100'];
    const BadgeArrowIcon = isOutgoing ? ArrowDownLeft : ArrowUpRight;

    return (
      <View className="relative">
        {/* Main Icon Container */}
        <View className="size-12 items-center justify-center rounded-full bg-grey-plain-150">
          {isOutgoing ? (
            <BanknoteArrowUp color={colors['grey-alpha']['500']} size={20} />
          ) : (
            <BanknoteArrowDown color={colors['grey-alpha']['500']} size={20} />
          )}
        </View>
        {/* Badge overlay with arrow icon - positioned bottom-left */}
        <View
          className="absolute -left-0.5 bottom-4 size-5 items-center justify-center rounded-full"
          style={{ backgroundColor: badgeBackgroundColor }}
        >
          <BadgeArrowIcon color={badgeColor} size={10} strokeWidth={2} />
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      {/* Header */}
      <View className="flex-row items-center justify-between border-b border-grey-plain-150 bg-white px-4 py-3">
        <Text className="text-2xl font-bold text-grey-alpha-500">Wallet</Text>
        <TouchableOpacity onPress={handleSettingsPress}>
          <Settings color={colors['grey-alpha']['500']} size={24} />
        </TouchableOpacity>
      </View>

      {/* Wallet Content */}
      <ScrollView
        className="flex-1 bg-grey-plain-50"
        contentContainerStyle={{ paddingBottom: bottomPadding }}
        showsVerticalScrollIndicator={false}
      >
        {/* Wallet Card */}
        <View
          className="mx-4 mt-4 rounded-2xl border p-1"
          style={{
            backgroundColor: colors['grey-plain']['150'],
            borderColor: colors['grey-plain']['300'],
          }}
        >
          {/* Bank Information - On Grey Background */}
          <View
            className="flex-row items-center justify-between rounded-t-2xl px-3 py-3"
            style={{ backgroundColor: colors['grey-plain']['150'] }}
          >
            <View className="flex-1 flex-row items-center gap-2 text-base font-semibold">
              <Text
                className="text-sm"
                style={{ color: colors['grey-alpha']['400'] }}
              >
                {walletData.bankName} •
              </Text>
              <Text className="text-sm font-medium">
                {walletData.accountNumber}
              </Text>
            </View>
            <View className="flex-row items-center gap-4">
              <TouchableOpacity onPress={handleShareAccount} hitSlop={8}>
                <Share2
                  color={colors['grey-alpha']['500']}
                  size={20}
                  strokeWidth={2}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleCopyAccount} hitSlop={8}>
                <Copy
                  color={colors['grey-alpha']['500']}
                  size={20}
                  strokeWidth={2}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Rest of Content - On White Background */}
          <View className="rounded-xl rounded-b-2xl bg-white px-6 pb-6 pt-4">
            {/* Wallet Status */}
            <View className="mb-3 flex-row items-center justify-between">
              <View className="flex-row items-center gap-2">
                <View className="size-2 rounded-full bg-state-green" />
                <Text
                  className="text-sm font-medium"
                  style={{ color: colors.state.green }}
                >
                  {walletData.status}
                </Text>
              </View>
              <TouchableOpacity
                onPress={handleViewTier}
                className="flex-row items-center gap-1"
                hitSlop={8}
              >
                <Text className="text-sm font-medium text-grey-alpha-500">
                  {walletData.tier}
                </Text>
                <ChevronRight
                  color={colors['grey-alpha']['500']}
                  size={16}
                  strokeWidth={2}
                />
              </TouchableOpacity>
            </View>

            {/* User Name */}
            <Text className="mb-2 text-base font-medium text-grey-alpha-500">
              {walletData.userName}
            </Text>

            {/* Balances */}
            <View className="mb-6">
              <Text className="text-3xl font-bold text-grey-alpha-500">
                {isBalanceVisible
                  ? formatAmount(walletData.currentBalance, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })
                  : '₦ •••,•••.••'}
              </Text>
              <View className="flex-row items-center gap-2">
                <Text className="text-sm text-grey-plain-550">
                  Book balance:{' '}
                  {isBalanceVisible
                    ? formatAmount(walletData.bookBalance, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })
                    : '₦ •••,•••.••'}
                </Text>
                <TouchableOpacity
                  onPress={handleToggleBalanceVisibility}
                  hitSlop={8}
                >
                  {isBalanceVisible ? (
                    <EyeOff
                      color={colors['grey-plain']['550']}
                      size={16}
                      strokeWidth={2}
                    />
                  ) : (
                    <Eye
                      color={colors['grey-plain']['550']}
                      size={16}
                      strokeWidth={2}
                    />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* Action Buttons */}
            <View className="mb-4 flex-row gap-3">
              <View className="flex-1">
                <Button
                  title="Fund wallet"
                  onPress={handleFundWallet}
                  variant="primary"
                  iconLeft={
                    <Plus color="#FFFFFF" size={20} strokeWidth={2.5} />
                  }
                  className="w-full"
                />
              </View>
              <View className="flex-1">
                <Button
                  title="History"
                  onPress={handleViewHistory}
                  variant="outline"
                  iconLeft={
                    <History
                      color={colors.primary.purple}
                      size={20}
                      strokeWidth={2}
                    />
                  }
                  className="w-full"
                />
              </View>
            </View>

            {/* KYC Status Alert */}
            {!walletData.isKycVerified && (
              <View className="items-center">
                <View
                  className="flex-row items-center gap-2 rounded-full px-3 py-1.5"
                  style={{ backgroundColor: colors['yellow-tint']['50'] }}
                >
                  <BadgeInfo
                    size={14}
                    color={colors.yellow['50']}
                    strokeWidth={2}
                  />
                  <Text className="text-xs font-medium text-grey-alpha-500">
                    KYC not verified
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* Upgrade Wallet Button */}
        <View className="mx-4 mt-4">
          <TouchableOpacity onPress={handleUpgradeWallet} activeOpacity={0.8}>
            <LinearGradient
              colors={['#7538BA', '#CF2586']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                borderRadius: 9999,
                padding: 2,
              }}
            >
              <View
                className="flex-row items-center justify-between rounded-full p-4"
                style={{
                  backgroundColor: colors['primary-tints'].purple['50'],
                }}
              >
                <View className="flex-row items-center gap-2">
                  <UserCheck
                    color={colors.primary.purple}
                    size={20}
                    strokeWidth={2}
                  />
                  <Text className="text-base font-semibold text-grey-alpha-500">
                    Click to upgrade wallet
                  </Text>
                </View>
                <ChevronRight
                  color={colors['grey-alpha']['500']}
                  size={20}
                  strokeWidth={2}
                />
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Wallet Actions Grid */}
        <View className="mx-4 mt-6">
          <View className="flex-row justify-between gap-3">
            {/* Row 1 */}
            <View className="flex-1 items-center gap-2">
              <TouchableOpacity
                onPress={handleWithdraw}
                className="h-16 w-24 items-center justify-center rounded-[2rem] bg-grey-plain-150"
                activeOpacity={0.7}
              >
                <CircleArrowOutDownLeft
                  color={colors['grey-alpha']['500']}
                  size={24}
                  strokeWidth={2}
                />
              </TouchableOpacity>
              <Text className="text-xs font-medium text-grey-alpha-500">
                Withdraw
              </Text>
            </View>

            <View className="flex-1 items-center gap-2">
              <TouchableOpacity
                onPress={handleBuyAirtime}
                className="h-16 w-24 items-center justify-center rounded-[2rem] bg-grey-plain-150"
                activeOpacity={0.7}
              >
                <ArrowUpDown
                  color={colors['grey-alpha']['500']}
                  size={24}
                  strokeWidth={2}
                />
              </TouchableOpacity>
              <Text className="text-xs font-medium text-grey-alpha-500">
                Buy airtime
              </Text>
            </View>

            <View className="flex-1 items-center gap-2">
              <TouchableOpacity
                onPress={handleBuyData}
                className="h-16 w-24 items-center justify-center rounded-[2rem] bg-grey-plain-150"
                activeOpacity={0.7}
              >
                <Wifi
                  color={colors['grey-alpha']['500']}
                  size={24}
                  strokeWidth={2}
                />
              </TouchableOpacity>
              <Text className="text-xs font-medium text-grey-alpha-500">
                Buy data
              </Text>
            </View>
          </View>

          {/* Row 2 */}
          <View className="mt-6 flex-row justify-between gap-3">
            <View className="flex-1 items-center gap-2">
              <TouchableOpacity
                onPress={handlePayBills}
                className="h-16 w-24 items-center justify-center rounded-[2rem] bg-grey-plain-150"
                activeOpacity={0.7}
              >
                <ReceiptText
                  color={colors['grey-alpha']['500']}
                  size={24}
                  strokeWidth={2}
                />
              </TouchableOpacity>
              <Text className="text-xs font-medium text-grey-alpha-500">
                Pay bills
              </Text>
            </View>

            <View className="flex-1 items-center gap-2">
              <TouchableOpacity
                onPress={handleMoreActions}
                className="h-16 w-24 items-center justify-center rounded-[2rem] bg-grey-plain-150"
                activeOpacity={0.7}
              >
                <MoreVertical
                  color={colors['grey-alpha']['500']}
                  size={24}
                  strokeWidth={2}
                />
              </TouchableOpacity>
              <Text className="text-xs font-medium text-grey-alpha-500">
                More
              </Text>
            </View>

            {/* Empty space for alignment */}
            <View className="flex-1" />
          </View>
        </View>

        {/* Recent Transactions */}
        <View className="mt-10 border-t border-grey-plain-300 px-4 pt-8">
          {/* Section Header */}
          <View className="mb-4 flex-row items-center justify-between">
            <Text className="text-lg font-semibold text-grey-alpha-500">
              Recent transactions
            </Text>
            <TouchableOpacity
              onPress={handleSeeAllTransactions}
              className="flex-row items-center gap-1"
            >
              <Text className="text-sm font-medium text-primary">See all</Text>
              <ChevronRight
                color={colors.primary.purple}
                size={16}
                strokeWidth={2}
              />
            </TouchableOpacity>
          </View>

          {/* Search and Filter */}
          <View className="mb-4 flex-row items-center gap-3">
            <View className="flex-1 flex-row items-center gap-3 rounded-full border border-grey-plain-300 bg-white px-4 py-3">
              <Search
                size={20}
                color={colors['grey-alpha']['400']}
                strokeWidth={2}
              />
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search by title or description"
                placeholderTextColor={colors['grey-alpha']['400']}
                className="flex-1 text-base text-grey-alpha-500"
                style={{ fontSize: 16 }}
              />
            </View>
            <TouchableOpacity
              onPress={handleFilterTransactions}
              className="size-12 items-center justify-center rounded-xl border border-grey-plain-300 bg-white"
              activeOpacity={0.7}
            >
              <SlidersHorizontal
                color={colors['grey-alpha']['500']}
                size={20}
                strokeWidth={2}
              />
            </TouchableOpacity>
          </View>

          {/* Today Section */}
          <Text className="mb-3 text-sm font-semibold text-grey-alpha-500">
            Today
          </Text>

          {/* Transaction List */}
          <View className="gap-3 pb-4">
            {transactions.map((transaction) => (
              <TouchableOpacity
                key={transaction.id}
                onPress={() => handleTransactionPress(transaction.id)}
                className="rounded-xl border border-grey-plain-300 bg-white p-4"
                activeOpacity={0.7}
              >
                <View className="flex-row gap-3">
                  {/* Transaction Icon */}
                  {renderTransactionIcon(transaction.type)}

                  {/* Transaction Details */}
                  <View className="flex-1">
                    <Text className="mb-1 text-base font-semibold text-grey-alpha-500">
                      {transaction.title}
                    </Text>
                    <Text className="mb-1 text-sm text-grey-plain-550">
                      {transaction.description}
                    </Text>
                    <Text className="text-xs text-grey-plain-550">
                      {transaction.timestamp}
                    </Text>
                  </View>

                  {/* Amount and Status */}
                  <View className="items-end">
                    <Text className="mb-1 text-base font-semibold text-grey-alpha-500">
                      {formatAmount(transaction.amount)}
                    </Text>
                    <View
                      className="rounded-full px-2 py-0.5"
                      style={{ backgroundColor: colors['green-tint']['200'] }}
                    >
                      <Text
                        className="text-xs font-semibold"
                        style={{ color: colors.state.green }}
                      >
                        Success
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Success Bottom Sheet */}
      <WalletSuccessBottomSheet
        visible={showSuccessSheet}
        onDoThisLater={handleDoThisLater}
        onCreatePasscode={handleCreatePasscode}
      />

      {/* Create Passcode Bottom Sheet */}
      <WalletCreatePasscodeBottomSheet
        ref={passcodeSheetRef}
        onComplete={handlePasscodeComplete}
        onClose={handlePasscodeSheetClose}
      />

      {/* Wallet Settings Bottom Sheet */}
      <WalletSettingsBottomSheet
        ref={settingsSheetRef}
        onDeactivateWallet={handleDeactivateWallet}
        onBlockWallet={handleFreezeWallet}
      />

      {/* Tier Bottom Sheet */}
      <TierBottomSheet
        ref={tierSheetRef}
        currentTier={walletData.tier}
        onUpgrade={handleTierUpgrade}
      />

      {/* Deactivate Wallet Confirmation Modal */}
      <DeactivateWalletConfirmationModal
        visible={showDeactivateConfirmation}
        onConfirm={handleConfirmDeactivate}
        onCancel={handleCancelDeactivate}
      />

      {/* Deactivate Wallet Passcode Bottom Sheet */}
      <PasscodeBottomSheet
        ref={deactivatePasscodeSheetRef}
        title="Enter your passcode"
        onComplete={handleDeactivatePasscodeComplete}
        onForgotPasscode={handleDeactivateForgotPasscode}
        error={deactivatePasscodeError}
        mode="verify"
      />

      {/* Freeze Wallet Confirmation Modal */}
      <FreezeWalletConfirmationModal
        visible={showFreezeConfirmation}
        onConfirm={handleConfirmFreeze}
        onCancel={handleCancelFreeze}
      />

      {/* Freeze Wallet Passcode Bottom Sheet */}
      <PasscodeBottomSheet
        ref={freezePasscodeSheetRef}
        title="Enter your passcode"
        onComplete={handleFreezePasscodeComplete}
        onForgotPasscode={handleFreezeForgotPasscode}
        error={freezePasscodeError}
        mode="verify"
      />

      {/* Deactivate Wallet Success Toast */}
      <Toast
        visible={showDeactivateToast}
        message="Wallet deactivated successfully"
        duration={3000}
        onHide={() => setShowDeactivateToast(false)}
      />

      {/* Freeze Wallet Success Toast */}
      <Toast
        visible={showFreezeToast}
        message="Wallet frozen successfully"
        duration={3000}
        onHide={() => setShowFreezeToast(false)}
      />
    </SafeAreaView>
  );
}
