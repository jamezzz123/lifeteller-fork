import React, { useState, useMemo, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Search,
  SlidersHorizontal,
  BanknoteArrowDown,
  BanknoteArrowUp,
  ArrowDownLeft,
  CornerUpLeft,
  ArrowUpRight,
} from 'lucide-react-native';
import { router } from 'expo-router';
import { colors } from '@/theme/colors';
import { formatAmount } from '@/utils/formatAmount';
import * as Haptics from 'expo-haptics';
import EmptyTransactionIllustration from '@/assets/images/empty-transaction.svg';
import {
  FilterTransactionsBottomSheet,
  TransactionFilters,
} from '@/components/wallet/FilterTransactionsBottomSheet';
import { BottomSheetRef } from '@/components/ui/BottomSheet';

interface Transaction {
  id: string;
  type:
    | 'fund-withdrawal'
    | 'lift-offered'
    | 'lift-offer'
    | 'fund-wallet'
    | 'lift-contributed';
  title: string;
  description: string;
  amount: number;
  timestamp: string;
  date: string; // Full date for grouping
  status: 'success' | 'pending' | 'failed';
}

// Mock transaction data - replace with actual API data
const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: 'fund-withdrawal',
    title: 'Fund withdrawal',
    description: 'Description goes here.',
    amount: 5600,
    timestamp: '10:04am',
    date: '2024-02-09',
    status: 'success',
  },
  {
    id: '2',
    type: 'lift-offered',
    title: 'Lift offered',
    description: 'You offered Isaac Tolulope a lift.',
    amount: 5600,
    timestamp: '10:04am',
    date: '2024-02-09',
    status: 'success',
  },
  {
    id: '3',
    type: 'lift-offer',
    title: 'Lift offer',
    description: 'OlorunToba Freeman sent you a...',
    amount: 5600,
    timestamp: '10:04am',
    date: '2024-02-09',
    status: 'success',
  },
  {
    id: '4',
    type: 'lift-offered',
    title: 'Lift offered',
    description: 'You contributed to a raised lift...',
    amount: 5600,
    timestamp: '10:04am',
    date: '2024-02-09',
    status: 'success',
  },
  {
    id: '5',
    type: 'fund-wallet',
    title: 'Fund wallet',
    description: 'Description goes here.',
    amount: 5600,
    timestamp: '10:04am',
    date: '2024-02-09',
    status: 'success',
  },
  {
    id: '6',
    type: 'lift-offered',
    title: 'Lift offered',
    description: 'You contributed to a raised lift...',
    amount: 5600,
    timestamp: '10:04am',
    date: '2024-02-08',
    status: 'success',
  },
];

export default function AllTransactionsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<TransactionFilters>({
    status: 'All',
    dateRange: 'All time',
    transactionType: 'All',
    transactionCategory: 'All',
  });
  const filterSheetRef = useRef<BottomSheetRef>(null);

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  const handleFilter = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    filterSheetRef.current?.expand();
  };

  const handleApplyFilters = (appliedFilters: TransactionFilters) => {
    setFilters(appliedFilters);
  };

  const handleTransactionPress = (transactionId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(`/transaction/${transactionId}` as any);
  };

  const handleViewAllTransactions = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSearchQuery('');
    // Scroll to top or refetch all transactions
  };

  const renderTransactionIcon = (type: Transaction['type']) => {
    const isOutgoing =
      type === 'fund-withdrawal' ||
      type === 'lift-offered' ||
      type === 'lift-contributed';
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

  // Filter and group transactions
  const filteredAndGroupedTransactions = useMemo(() => {
    let filtered = mockTransactions;

    // Apply status filter
    if (filters.status !== 'All') {
      const statusMap: Record<string, 'success' | 'pending' | 'failed'> = {
        Success: 'success',
        Failed: 'failed',
        Pending: 'pending',
      };
      const filterStatus = statusMap[filters.status];
      if (filterStatus) {
        filtered = filtered.filter((tx) => tx.status === filterStatus);
      }
    }

    // Apply transaction type filter
    if (filters.transactionType !== 'All') {
      // Credit = incoming transactions (lift-offer, fund-wallet)
      // Debit = outgoing transactions (fund-withdrawal, lift-offered, lift-contributed)
      const creditTypes: Transaction['type'][] = ['lift-offer', 'fund-wallet'];
      const debitTypes: Transaction['type'][] = [
        'fund-withdrawal',
        'lift-offered',
        'lift-contributed',
      ];

      if (filters.transactionType === 'Credit') {
        filtered = filtered.filter((tx) => creditTypes.includes(tx.type));
      } else if (filters.transactionType === 'Debit') {
        filtered = filtered.filter((tx) => debitTypes.includes(tx.type));
      }
    }

    // Apply transaction category filter
    if (filters.transactionCategory !== 'All') {
      const categoryMap: Record<string, Transaction['type']> = {
        'Funds withdrawal': 'fund-withdrawal',
        'Fund wallet': 'fund-wallet',
        'Lift offer': 'lift-offer',
        'Lift offered': 'lift-offered',
      };
      const filterCategory = categoryMap[filters.transactionCategory];
      if (filterCategory) {
        filtered = filtered.filter((tx) => tx.type === filterCategory);
      }
    }

    // Apply date range filter
    if (filters.dateRange !== 'All time') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      let startDate: Date | null = null;

      switch (filters.dateRange) {
        case 'Today':
          startDate = today;
          break;
        case 'This week':
          startDate = new Date(today);
          startDate.setDate(today.getDate() - 7);
          break;
        case 'Last month':
          startDate = new Date(today);
          startDate.setMonth(today.getMonth() - 1);
          break;
        case 'Last 90 days':
          startDate = new Date(today);
          startDate.setDate(today.getDate() - 90);
          break;
        case 'Custom date range':
          if (filters.startDate && filters.endDate) {
            // Parse custom dates (DD/MM/YYYY format)
            const [startDay, startMonth, startYear] =
              filters.startDate.split('/');
            const [endDay, endMonth, endYear] = filters.endDate.split('/');
            const customStart = new Date(
              parseInt(startYear),
              parseInt(startMonth) - 1,
              parseInt(startDay)
            );
            const customEnd = new Date(
              parseInt(endYear),
              parseInt(endMonth) - 1,
              parseInt(endDay)
            );
            customEnd.setHours(23, 59, 59, 999);

            filtered = filtered.filter((tx) => {
              const txDate = new Date(tx.date);
              return txDate >= customStart && txDate <= customEnd;
            });
          }
          break;
      }

      if (startDate && filters.dateRange !== 'Custom date range') {
        filtered = filtered.filter((tx) => {
          const txDate = new Date(tx.date);
          return txDate >= startDate!;
        });
      }
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (tx) =>
          tx.title.toLowerCase().includes(query) ||
          tx.description.toLowerCase().includes(query)
      );
    }

    // Group by date
    const grouped: Record<string, Transaction[]> = {};
    filtered.forEach((tx) => {
      if (!grouped[tx.date]) {
        grouped[tx.date] = [];
      }
      grouped[tx.date].push(tx);
    });

    // Sort dates descending (most recent first)
    const sortedDates = Object.keys(grouped).sort(
      (a, b) => new Date(b).getTime() - new Date(a).getTime()
    );

    return sortedDates.map((date) => ({
      date,
      transactions: grouped[date],
    }));
  }, [searchQuery, filters]);

  // Format date label
  const formatDateLabel = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Reset time for comparison
    const dateOnly = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );
    const todayOnly = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const yesterdayOnly = new Date(
      yesterday.getFullYear(),
      yesterday.getMonth(),
      yesterday.getDate()
    );

    if (dateOnly.getTime() === todayOnly.getTime()) {
      return 'Today';
    } else if (dateOnly.getTime() === yesterdayOnly.getTime()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'bottom']}>
      {/* Header */}
      <View className="border-b border-grey-plain-150 bg-white px-4 py-3">
        <View className="flex-row items-center gap-3">
          <TouchableOpacity onPress={handleBack} hitSlop={8}>
            <CornerUpLeft color={colors['grey-alpha']['500']} size={24} />
          </TouchableOpacity>
          <Text className="flex-1 text-xl font-inter-semibold text-grey-alpha-500">
            All transactions
          </Text>
        </View>
      </View>

      {/* Search and Filter */}
      <View className="border-b border-grey-plain-150 bg-white px-4 py-3">
        <View className="flex-row items-center gap-3">
          <View className="flex-1 flex-row items-center gap-3 rounded-full border border-grey-plain-300 bg-white px-4 py-3">
            <Search
              size={20}
              color={colors['grey-alpha']['400']}
              strokeWidth={2}
            />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search by name, title or description"
              placeholderTextColor={colors['grey-alpha']['400']}
              className="flex-1 text-base text-grey-alpha-500"
              style={{ fontSize: 16 }}
            />
          </View>
          <TouchableOpacity
            onPress={handleFilter}
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
      </View>

      {/* Transaction List */}
      <ScrollView
        className="flex-1 bg-grey-plain-50"
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        {filteredAndGroupedTransactions.length === 0 && searchQuery.trim() ? (
          <View
            className="flex-1 items-center justify-center px-6"
            style={{ minHeight: 400 }}
          >
            {/* Icon - Empty Transaction Illustration */}
            <View className="mb-8">
              <EmptyTransactionIllustration width={150} height={150} />
            </View>

            {/* Message */}
            <View className="mb-4 items-center">
              <Text className="mb-2 text-center text-base text-grey-alpha-500">
                We couldn&apos;t find any results for{' '}
                <Text className="font-inter-semibold">&quot;{searchQuery}&quot;</Text>
                .
              </Text>
              <Text className="mb-6 text-center text-sm leading-5 text-grey-plain-550">
                Kindly check the spelling and check that no filters was applied.
              </Text>
              <Text className="text-center text-sm text-grey-plain-550">
                You can view all transactions{' '}
                <Text
                  onPress={handleViewAllTransactions}
                  className="font-inter-medium underline"
                  style={{ color: colors.primary.purple }}
                >
                  here
                </Text>
                .
              </Text>
            </View>
          </View>
        ) : filteredAndGroupedTransactions.length === 0 ? (
          <View className="items-center justify-center py-16">
            <Text className="text-base text-grey-plain-550">
              No transactions found
            </Text>
          </View>
        ) : (
          filteredAndGroupedTransactions.map(({ date, transactions }) => (
            <View key={date} className="mb-6">
              {/* Date Header */}
              <Text className="mb-3 text-sm font-inter-semibold text-grey-alpha-500">
                {formatDateLabel(date)}
              </Text>

              {/* Transactions for this date */}
              <View className="gap-3">
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
                        <Text className="mb-1 text-base font-inter-semibold text-grey-alpha-500">
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
                        <Text className="mb-1 text-base font-inter-semibold text-grey-alpha-500">
                          {formatAmount(transaction.amount)}
                        </Text>
                        <View
                          className="rounded-full px-2 py-0.5"
                          style={{
                            backgroundColor: colors['green-tint']['200'],
                          }}
                        >
                          <Text
                            className="text-xs font-inter-semibold"
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
          ))
        )}
      </ScrollView>

      {/* Filter Bottom Sheet */}
      <FilterTransactionsBottomSheet
        ref={filterSheetRef}
        initialFilters={filters}
        onApplyFilters={handleApplyFilters}
      />
    </SafeAreaView>
  );
}
