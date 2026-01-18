import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import {
  CornerUpLeft,
  ShieldUser,
  CalendarClock,
  Check,
} from 'lucide-react-native';
import { colors } from '@/theme/colors';
import { Button } from '@/components/ui/Button';
import { formatAmount } from '@/utils/formatAmount';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SetDailyLimitBottomSheet } from '@/components/wallet/SetDailyLimitBottomSheet';
import { SetOneTimeLimitBottomSheet } from '@/components/wallet/SetOneTimeLimitBottomSheet';
import { PasscodeBottomSheet } from '@/components/ui/PasscodeBottomSheet';
import { DailyLimitSuccessBottomSheet } from '@/components/wallet/DailyLimitSuccessBottomSheet';
import { OneTimeLimitSuccessBottomSheet } from '@/components/wallet/OneTimeLimitSuccessBottomSheet';
import { RemoveLimitConfirmationModal } from '@/components/wallet/RemoveLimitConfirmationModal';
import { BottomSheetRef } from '@/components/ui/BottomSheet';

interface KYCItem {
  id: string;
  label: string;
  isVerified: boolean;
}

const DAILY_LIMIT_STORAGE_KEY = '@wallet_daily_limit';
const ONE_TIME_LIMIT_STORAGE_KEY = '@wallet_one_time_limit';

export default function WalletSettingsScreen() {
  const [dailyLimit, setDailyLimit] = useState<number | null>(null);
  const [oneTimeLimit, setOneTimeLimit] = useState<number | null>(null);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [selectedOneTimeAmount, setSelectedOneTimeAmount] = useState<
    number | null
  >(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showOneTimeSuccess, setShowOneTimeSuccess] = useState(false);
  const [passcodeError, setPasscodeError] = useState<string | undefined>();
  const [showRemoveConfirmation, setShowRemoveConfirmation] = useState(false);
  const [limitToRemove, setLimitToRemove] = useState<
    'daily' | 'one-time' | null
  >(null);
  const [isSettingOneTimeLimit, setIsSettingOneTimeLimit] = useState(false);

  const setLimitSheetRef = useRef<BottomSheetRef>(null);
  const setOneTimeLimitSheetRef = useRef<BottomSheetRef>(null);
  const passcodeSheetRef = useRef<BottomSheetRef>(null);

  // Mock KYC data - replace with actual data from API
  const kycItems: KYCItem[] = [
    { id: 'bvn-1', label: 'BVN', isVerified: true },
    { id: 'bvn-2', label: 'BVN', isVerified: true },
    { id: 'other', label: 'Any other one', isVerified: true },
  ];

  // Load limits from storage on mount
  useEffect(() => {
    loadDailyLimit();
    loadOneTimeLimit();
  }, []);

  const loadDailyLimit = async () => {
    try {
      const stored = await AsyncStorage.getItem(DAILY_LIMIT_STORAGE_KEY);
      if (stored) {
        setDailyLimit(parseInt(stored, 10));
      }
    } catch (error) {
      console.error('Error loading daily limit:', error);
    }
  };

  const saveDailyLimit = async (amount: number) => {
    try {
      await AsyncStorage.setItem(DAILY_LIMIT_STORAGE_KEY, amount.toString());
    } catch (error) {
      console.error('Error saving daily limit:', error);
    }
  };

  const loadOneTimeLimit = async () => {
    try {
      const stored = await AsyncStorage.getItem(ONE_TIME_LIMIT_STORAGE_KEY);
      if (stored) {
        setOneTimeLimit(parseInt(stored, 10));
      }
    } catch (error) {
      console.error('Error loading one-time limit:', error);
    }
  };

  const saveOneTimeLimit = async (amount: number) => {
    try {
      await AsyncStorage.setItem(ONE_TIME_LIMIT_STORAGE_KEY, amount.toString());
    } catch (error) {
      console.error('Error saving one-time limit:', error);
    }
  };

  const removeDailyLimit = async () => {
    try {
      await AsyncStorage.removeItem(DAILY_LIMIT_STORAGE_KEY);
      setDailyLimit(null);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (error) {
      console.error('Error removing daily limit:', error);
    }
  };

  const removeOneTimeLimit = async () => {
    try {
      await AsyncStorage.removeItem(ONE_TIME_LIMIT_STORAGE_KEY);
      setOneTimeLimit(null);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (error) {
      console.error('Error removing one-time limit:', error);
    }
  };

  const handleSetupDailyLimit = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setLimitSheetRef.current?.expand();
  };

  const handleRemoveDailyLimit = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setLimitToRemove('daily');
    setShowRemoveConfirmation(true);
  };

  const handleRemoveOneTimeLimit = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setLimitToRemove('one-time');
    setShowRemoveConfirmation(true);
  };

  const handleConfirmRemove = () => {
    if (limitToRemove === 'daily') {
      removeDailyLimit();
    } else if (limitToRemove === 'one-time') {
      removeOneTimeLimit();
    }
    setShowRemoveConfirmation(false);
    setLimitToRemove(null);
  };

  const handleCancelRemove = () => {
    setShowRemoveConfirmation(false);
    setLimitToRemove(null);
  };

  const handleLimitSelected = (amount: number) => {
    setSelectedAmount(amount);
    setIsSettingOneTimeLimit(false);
    setLimitSheetRef.current?.close();
    // Show passcode sheet after a short delay
    setTimeout(() => {
      setPasscodeError(undefined);
      passcodeSheetRef.current?.expand();
    }, 300);
  };

  const handleOneTimeLimitSelected = (amount: number) => {
    setSelectedOneTimeAmount(amount);
    setIsSettingOneTimeLimit(true);
    setOneTimeLimitSheetRef.current?.close();
    // Show passcode sheet after a short delay
    setTimeout(() => {
      setPasscodeError(undefined);
      passcodeSheetRef.current?.expand();
    }, 300);
  };

  const handlePasscodeComplete = async (passcode: string) => {
    // TODO: Verify passcode with backend
    // Mock verification for now
    const CORRECT_PASSCODE = '123456';

    if (passcode === CORRECT_PASSCODE) {
      setPasscodeError(undefined);
      passcodeSheetRef.current?.close();

      if (isSettingOneTimeLimit && selectedOneTimeAmount) {
        setOneTimeLimit(selectedOneTimeAmount);
        saveOneTimeLimit(selectedOneTimeAmount);
        // Show success bottom sheet
        setTimeout(() => {
          setShowOneTimeSuccess(true);
        }, 300);
      } else if (selectedAmount) {
        setDailyLimit(selectedAmount);
        saveDailyLimit(selectedAmount);
        // Show success bottom sheet
        setTimeout(() => {
          setShowSuccess(true);
        }, 300);
      }
    } else {
      setPasscodeError('Incorrect passcode. Please try again.');
    }
  };

  const handleForgotPasscode = () => {
    passcodeSheetRef.current?.close();
    // TODO: Navigate to forgot passcode screen
    router.push('/verify-otp');
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    setSelectedAmount(null);
  };

  const handleOneTimeSuccessClose = () => {
    setShowOneTimeSuccess(false);
    setSelectedOneTimeAmount(null);
    setIsSettingOneTimeLimit(false);
  };

  const handleSetupOneTimeLimit = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setOneTimeLimitSheetRef.current?.expand();
  };

  const handleHelpCenter = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/help-center/wallet');
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'bottom']}>
      {/* Header */}
      <View className="flex-row items-center border-b border-grey-plain-150 bg-white px-4 py-3">
        <TouchableOpacity onPress={() => router.back()} className="mr-3">
          <CornerUpLeft
            color={colors['grey-plain']['550']}
            size={24}
            strokeWidth={2}
          />
        </TouchableOpacity>
        <Text className="text-lg font-inter-semibold text-grey-alpha-500">
          Wallet settings
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        {/* KYC Status Section */}
        <View
          className="mx-4 mt-6 rounded-2xl p-2"
          style={{ backgroundColor: colors['grey-plain']['150'] }}
        >
          <Text className="mb-4 ml-3 mt-2 text-base font-inter-semibold text-grey-alpha-500">
            KYC status
          </Text>

          {kycItems.map((item, index) => (
            <View key={item.id}>
              <View className="flex-row items-center justify-between rounded-xl bg-white px-4 py-4">
                <Text className="text-[15px] font-inter-medium text-grey-alpha-500">
                  {item.label}
                </Text>
                {item.isVerified && (
                  <View
                    className="flex-row items-center gap-1.5 rounded-lg px-2.5 py-1"
                    style={{ backgroundColor: colors['green-tint']['100'] }}
                  >
                    <View
                      className="h-4 w-4 items-center justify-center rounded-full"
                      style={{ backgroundColor: colors.state.green }}
                    >
                      <Check
                        color={colors['grey-plain']['50']}
                        size={10}
                        strokeWidth={2.5}
                      />
                    </View>
                    <Text
                      className="text-xs font-inter-medium"
                      style={{ color: colors['grey-alpha']['500'] }}
                    >
                      Verified
                    </Text>
                  </View>
                )}
              </View>
              {index < kycItems.length - 1 && (
                <View
                  className="my-1 h-px"
                  style={{ backgroundColor: colors['grey-plain']['300'] }}
                />
              )}
            </View>
          ))}
        </View>

        {/* Transaction Limits - Flat List */}
        <View className="mx-4 mt-4">
          {/* Daily Cumulative Transaction Limit */}
          <View className="flex-row items-center justify-between px-4 py-4">
            <View className="flex-1 flex-row items-center gap-3">
              <ShieldUser
                color={colors['grey-alpha']['500']}
                size={24}
                strokeWidth={2}
              />
              <Text className="flex-1 text-sm font-inter-medium text-grey-alpha-500">
                Daily cumulative transaction limit
              </Text>
            </View>
            {dailyLimit ? (
              <View className="ml-3 flex-row items-center gap-3">
                <View className="flex-row items-center gap-1.5 rounded-lg bg-primary-tints-100 px-2.5 py-1.5">
                  <Check
                    size={14}
                    color={colors.primary.purple}
                    strokeWidth={2.5}
                  />
                  <Text
                    className="text-xs font-inter-medium"
                    style={{ color: colors.primary.purple }}
                  >
                    {formatAmount(dailyLimit)}
                  </Text>
                </View>
                <TouchableOpacity onPress={handleRemoveDailyLimit}>
                  <Text className="text-sm font-inter-medium text-red-500">
                    Remove
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <Button
                title="Setup"
                onPress={handleSetupDailyLimit}
                variant="outline"
                size="small"
                className="ml-3"
              />
            )}
          </View>

          {/* Divider */}
          <View
            className="mx-4 h-px"
            style={{ backgroundColor: colors['grey-plain']['300'] }}
          />

          {/* One-time Transaction Limit */}
          <View className="flex-row items-center justify-between px-4 py-4">
            <View className="flex-1 flex-row items-center gap-3">
              <CalendarClock
                color={colors['grey-alpha']['500']}
                size={24}
                strokeWidth={2}
              />
              <Text className="flex-1 text-sm font-inter-medium text-grey-alpha-500">
                One-time transaction limit
              </Text>
            </View>
            {oneTimeLimit ? (
              <View className="ml-3 flex-row items-center gap-3">
                <View className="flex-row items-center gap-1.5 rounded-lg bg-primary-tints-100 px-2.5 py-1.5">
                  <Check
                    size={14}
                    color={colors.primary.purple}
                    strokeWidth={2.5}
                  />
                  <Text
                    className="text-xs font-inter-medium"
                    style={{ color: colors.primary.purple }}
                  >
                    {formatAmount(oneTimeLimit)}
                  </Text>
                </View>
                <TouchableOpacity onPress={handleRemoveOneTimeLimit}>
                  <Text className="text-sm font-inter-medium text-red-500">
                    Remove
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <Button
                title="Setup"
                onPress={handleSetupOneTimeLimit}
                variant="outline"
                size="small"
                className="ml-3"
              />
            )}
          </View>
        </View>

        {/* Help Center Link */}
        <View className="mx-4 mt-6 px-4">
          <Text className="text-center text-sm text-grey-plain-550">
            Visit the{' '}
            <Text
              onPress={handleHelpCenter}
              className="font-inter-semibold"
              style={{ color: colors.primary.purple }}
            >
              wallet help center
            </Text>{' '}
            for wallet-related issues.
          </Text>
        </View>
      </ScrollView>

      {/* Set Daily Limit Bottom Sheet */}
      <SetDailyLimitBottomSheet
        ref={setLimitSheetRef}
        onDone={handleLimitSelected}
      />

      {/* Set One-Time Limit Bottom Sheet */}
      <SetOneTimeLimitBottomSheet
        ref={setOneTimeLimitSheetRef}
        onDone={handleOneTimeLimitSelected}
      />

      {/* Passcode Verification Bottom Sheet */}
      <PasscodeBottomSheet
        ref={passcodeSheetRef}
        title="Enter your passcode"
        onComplete={handlePasscodeComplete}
        onForgotPasscode={handleForgotPasscode}
        error={passcodeError}
        mode="verify"
      />

      {/* Daily Limit Success Bottom Sheet */}
      {selectedAmount && (
        <DailyLimitSuccessBottomSheet
          visible={showSuccess}
          amount={selectedAmount}
          onClose={handleSuccessClose}
        />
      )}

      {/* One-Time Limit Success Bottom Sheet */}
      {selectedOneTimeAmount && (
        <OneTimeLimitSuccessBottomSheet
          visible={showOneTimeSuccess}
          amount={selectedOneTimeAmount}
          onClose={handleOneTimeSuccessClose}
        />
      )}

      {/* Remove Limit Confirmation Modal */}
      <RemoveLimitConfirmationModal
        visible={showRemoveConfirmation}
        onConfirm={handleConfirmRemove}
        onCancel={handleCancelRemove}
        limitType={limitToRemove || 'daily'}
      />
    </SafeAreaView>
  );
}
