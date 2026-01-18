import React, { useState, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { CornerUpLeft, Download, ChevronDown } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import AnalyticsIllustration from '@/assets/images/analytics.svg';
import { Button } from '@/components/ui/Button';
import { InflowOutflowChart } from '@/components/wallet/InflowOutflowChart';
import {
  BottomSheetRef,
  BottomSheetComponent,
} from '@/components/ui/BottomSheet';
import { colors } from '@/theme/colors';
import { formatAmount } from '@/utils/formatAmount';

interface WalletAnalyticsData {
  currentBalance: number;
  bookBalance: number;
  totalInflow: number;
  totalOutflow: number;
  numberOfTransactions: number;
  numberOfInflows: number;
  numberOfOutflows: number;
  liftOffered: number;
  liftOfferedAmount: number;
  liftReceived: number;
  liftReceivedAmount: number;
}

const TIME_PERIODS = [
  'All time',
  'Last 7 days',
  'Last 30 days',
  'Last 3 months',
  'Last 6 months',
  'Last year',
];

export default function WalletAnalyticsScreen() {
  // Mock data - replace with actual data fetching
  const hasData = true;
  const [selectedPeriod, setSelectedPeriod] = useState('All time');
  const periodSheetRef = useRef<BottomSheetRef>(null);

  const analyticsData: WalletAnalyticsData = {
    currentBalance: 698981.01,
    bookBalance: 898981.01,
    totalInflow: 7097890.95,
    totalOutflow: 6112804.08,
    numberOfTransactions: 4,
    numberOfInflows: 12,
    numberOfOutflows: 27,
    liftOffered: 178,
    liftOfferedAmount: 70920.95,
    liftReceived: 178,
    liftReceivedAmount: 70920.95,
  };

  const handleFundWallet = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // TODO: Navigate to fund wallet screen
    console.log('Fund wallet');
  };

  const handleDownloadStatement = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // TODO: Implement download statement functionality
    console.log('Download statement');
  };

  const handlePeriodSelect = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    periodSheetRef.current?.expand();
  };

  const handlePeriodChange = (period: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedPeriod(period);
    periodSheetRef.current?.close();
    // TODO: Refetch analytics data based on selected period
    console.log('Period changed to:', period);
  };

  // Empty State
  if (!hasData) {
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
            Wallet analytics
          </Text>
        </View>

        {/* Empty State Content */}
        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 24,
            paddingBottom: 32,
          }}
          showsVerticalScrollIndicator={false}
        >
          <View className="items-center">
            {/* Illustration */}
            <View className="mb-8">
              <AnalyticsIllustration width={150} height={150} />
            </View>

            {/* Title */}
            <Text className="mb-4 text-center text-lg font-inter-semibold text-grey-alpha-500">
              No analytics available
            </Text>

            {/* Description */}
            <Text className="mb-8 text-center text-sm leading-5 text-grey-plain-550">
              You have no analytics yet. Your data will appear here once you
              start using the wallet feature frequently.
            </Text>

            {/* Fund Wallet Button */}
            <Button
              title="Fund wallet"
              onPress={handleFundWallet}
              variant="primary"
              size="medium"
              className="min-w-[200px]"
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Data View
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
          Wallet analytics
        </Text>
      </View>

      {/* Content */}
      <ScrollView
        className="flex-1 bg-grey-plain-50"
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="rounded-t-3xl bg-white px-4 pt-6">
          {/* Current Balance Section */}
          <View className="mb-6">
            <Text className="mb-2 text-xs font-inter-semibold uppercase tracking-wider text-grey-plain-550">
              Current Balance
            </Text>
            <Text className="mb-2 text-3xl font-inter-bold text-grey-alpha-500">
              {formatAmount(analyticsData.currentBalance, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </Text>
            <Text className="mb-4 text-sm text-grey-plain-550">
              Book balance:{' '}
              {formatAmount(analyticsData.bookBalance, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </Text>
            <TouchableOpacity
              onPress={handleDownloadStatement}
              className="flex-row items-center gap-2"
              activeOpacity={0.7}
            >
              <Download
                size={16}
                color={colors.primary.purple}
                strokeWidth={2}
              />
              <Text
                className="text-sm font-inter-semibold"
                style={{ color: colors.primary.purple }}
              >
                Wallet statement
              </Text>
            </TouchableOpacity>
          </View>

          {/* Time Period Selector */}
          <View className="mb-6">
            <TouchableOpacity
              onPress={handlePeriodSelect}
              className="flex-row items-center justify-between rounded-xl border border-grey-plain-300 bg-white px-4 py-3"
              activeOpacity={0.7}
            >
              <Text className="text-base font-inter-semibold text-grey-alpha-500">
                {selectedPeriod}
              </Text>
              <ChevronDown
                size={20}
                color={colors['grey-alpha']['500']}
                strokeWidth={2}
              />
            </TouchableOpacity>
          </View>

          {/* Inflow/Outflow Chart Section */}
          <View className="mb-6">
            <InflowOutflowChart
              totalInflow={analyticsData.totalInflow}
              totalOutflow={analyticsData.totalOutflow}
            />
          </View>

          {/* Important Numbers Section */}
          <View
            className="mb-6 rounded-2xl p-2"
            style={{ backgroundColor: colors['grey-plain']['150'] }}
          >
            <Text className="mb-4 ml-3 mt-2 text-base font-inter-semibold text-grey-alpha-500">
              IMPORTANT NUMBERS
            </Text>
            <View className="gap-1">
              {/* Number of transactions */}
              <View className="flex-row items-center justify-between rounded-xl bg-white px-4 py-3">
                <Text className="text-base text-grey-alpha-500">
                  Number of transactions
                </Text>
                <Text className="text-base font-inter-semibold text-grey-alpha-500">
                  {analyticsData.numberOfTransactions}
                </Text>
              </View>

              {/* Number of inflows */}
              <View className="flex-row items-center justify-between rounded-xl bg-white px-4 py-3">
                <Text className="text-base text-grey-alpha-500">
                  Number of inflows
                </Text>
                <Text className="text-base font-inter-semibold text-grey-alpha-500">
                  {analyticsData.numberOfInflows}
                </Text>
              </View>

              {/* Number of outflows */}
              <View className="flex-row items-center justify-between rounded-xl bg-white px-4 py-3">
                <Text className="text-base text-grey-alpha-500">
                  Number of outflows
                </Text>
                <Text className="text-base font-inter-semibold text-grey-alpha-500">
                  {analyticsData.numberOfOutflows}
                </Text>
              </View>

              {/* Lift offered */}
              <View className="flex-row items-center justify-between rounded-xl bg-white px-4 py-3">
                <Text className="text-base text-grey-alpha-500">
                  Lift offered
                </Text>
                <Text className="text-base font-inter-semibold text-grey-alpha-500">
                  {analyticsData.liftOffered}
                </Text>
              </View>

              {/* Lift offered amount */}
              <View className="flex-row items-center justify-between rounded-xl bg-white px-4 py-3">
                <Text className="text-base text-grey-alpha-500">
                  Lift offered amount
                </Text>
                <Text className="text-base font-inter-semibold text-grey-alpha-500">
                  {formatAmount(analyticsData.liftOfferedAmount, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </Text>
              </View>

              {/* Lift received */}
              <View className="flex-row items-center justify-between rounded-xl bg-white px-4 py-3">
                <Text className="text-base text-grey-alpha-500">
                  Lift received
                </Text>
                <Text className="text-base font-inter-semibold text-grey-alpha-500">
                  {analyticsData.liftReceived}
                </Text>
              </View>

              {/* Lift received amount */}
              <View className="flex-row items-center justify-between rounded-xl bg-white px-4 py-3">
                <Text className="text-base text-grey-alpha-500">
                  Lift received amount
                </Text>
                <Text className="text-base font-inter-semibold text-grey-alpha-500">
                  {formatAmount(analyticsData.liftReceivedAmount, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Time Period Selection Bottom Sheet */}
      <BottomSheetComponent ref={periodSheetRef} snapPoints={['40%']}>
        <View className="px-6">
          <Text className="mb-4 text-lg font-inter-bold text-grey-alpha-500">
            Select time period
          </Text>
          <View className="gap-2">
            {TIME_PERIODS.map((period) => (
              <TouchableOpacity
                key={period}
                onPress={() => handlePeriodChange(period)}
                className={`flex-row items-center justify-between rounded-xl border px-4 py-3 ${
                  selectedPeriod === period
                    ? 'border-primary bg-primary-tints-100'
                    : 'border-grey-plain-300 bg-white'
                }`}
                activeOpacity={0.7}
              >
                <Text
                  className={`text-base font-inter-semibold ${
                    selectedPeriod === period
                      ? 'text-primary'
                      : 'text-grey-alpha-500'
                  }`}
                >
                  {period}
                </Text>
                {selectedPeriod === period && (
                  <View className="size-5 items-center justify-center rounded-full bg-primary">
                    <View className="size-2 rounded-full bg-white" />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </BottomSheetComponent>
    </SafeAreaView>
  );
}
