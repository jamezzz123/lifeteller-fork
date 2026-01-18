import React, { useState, forwardRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import { X, Calendar } from 'lucide-react-native';
import {
  BottomSheetComponent,
  BottomSheetRef,
} from '@/components/ui/BottomSheet';
import { Button } from '@/components/ui/Button';
import { colors } from '@/theme/colors';
import * as Haptics from 'expo-haptics';

export interface TransactionFilters {
  status: string;
  dateRange: string;
  startDate?: string;
  endDate?: string;
  transactionType: string;
  transactionCategory: string;
}

interface FilterTransactionsBottomSheetProps {
  initialFilters?: TransactionFilters;
  onApplyFilters: (filters: TransactionFilters) => void;
  onClose?: () => void;
}

export const FilterTransactionsBottomSheet = forwardRef<
  BottomSheetRef,
  FilterTransactionsBottomSheetProps
>(({ initialFilters, onApplyFilters, onClose }, ref) => {
  const [filters, setFilters] = useState<TransactionFilters>(
    initialFilters || {
      status: 'All',
      dateRange: 'All time',
      transactionType: 'All',
      transactionCategory: 'All',
    }
  );

  const handleClose = () => {
    if (ref && typeof ref !== 'function' && ref.current) {
      ref.current.close();
    }
    onClose?.();
  };

  const handleGoBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    handleClose();
  };

  const handleApplyFilters = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onApplyFilters(filters);
    handleClose();
  };

  const handleSelectStatus = (status: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setFilters({ ...filters, status });
  };

  const handleSelectDateRange = (dateRange: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setFilters({
      ...filters,
      dateRange,
      startDate: undefined,
      endDate: undefined,
    });
  };

  const handleSelectTransactionType = (type: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setFilters({ ...filters, transactionType: type });
  };

  const handleSelectCategory = (category: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setFilters({ ...filters, transactionCategory: category });
  };

  const renderFilterChip = (
    label: string,
    isSelected: boolean,
    onPress: () => void
  ) => {
    return (
      <TouchableOpacity
        onPress={onPress}
        className="rounded-full px-4 py-2"
        style={{
          backgroundColor: isSelected
            ? colors['primary-tints'].purple['100']
            : colors['grey-plain']['50'],
          borderWidth: 1,
          borderColor: isSelected
            ? colors.primary.purple
            : colors['grey-plain']['300'],
        }}
        activeOpacity={0.7}
      >
        <Text
          className="text-sm font-medium"
          style={{
            color: isSelected
              ? colors['primary-shades'].purple['200']
              : colors['grey-alpha']['500'],
          }}
        >
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  const statusOptions = [
    'All',
    'Success',
    'Failed',
    'Pending',
    'Status #4',
    'Status #5',
    'Status #6',
  ];

  const dateRangeOptions = [
    'All time',
    'Today',
    'This week',
    'Last month',
    'Last 90 days',
    'Custom date range',
  ];

  const transactionTypeOptions = ['All', 'Credit', 'Debit'];

  const categoryOptions = [
    'All',
    'Funds withdrawal',
    'Fund wallet',
    'Lift offer',
    'Lift offered',
  ];

  return (
    <BottomSheetComponent ref={ref} snapPoints={['90%']} onClose={onClose}>
      <View className="flex-1">
        {/* Header */}
        <View className="flex-row items-center justify-between border-b border-grey-plain-150 px-6 py-4">
          <Text className="text-xl font-semibold text-grey-alpha-500">
            Filter transactions
          </Text>
          <TouchableOpacity onPress={handleClose} hitSlop={8}>
            <X color={colors['grey-alpha']['500']} size={24} />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ padding: 24, paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Status Filter */}
          <View className="mb-8">
            <Text className="mb-3 text-sm font-semibold text-grey-alpha-500">
              Status
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {statusOptions.map((status) =>
                renderFilterChip(status, filters.status === status, () =>
                  handleSelectStatus(status)
                )
              )}
            </View>
          </View>

          {/* Date Range Filter */}
          <View className="mb-8">
            <Text className="mb-3 text-sm font-semibold text-grey-alpha-500">
              Date range
            </Text>
            <View className="mb-4 flex-row flex-wrap gap-2">
              {dateRangeOptions.map((range) =>
                renderFilterChip(range, filters.dateRange === range, () =>
                  handleSelectDateRange(range)
                )
              )}
            </View>

            {/* Custom Date Range Inputs */}
            {filters.dateRange === 'Custom date range' && (
              <View className="gap-3">
                <View>
                  <Text className="mb-2 text-xs font-medium text-grey-plain-550">
                    Start date
                  </Text>
                  <View className="flex-row items-center gap-3 rounded-xl border border-grey-plain-300 bg-white px-4 py-3">
                    <TextInput
                      value={filters.startDate}
                      onChangeText={(text) =>
                        setFilters({ ...filters, startDate: text })
                      }
                      placeholder="DD/MM/YYYY"
                      placeholderTextColor={colors['grey-alpha']['400']}
                      className="flex-1 text-base text-grey-alpha-500"
                      style={{ fontSize: 16 }}
                    />
                    <Calendar
                      color={colors['grey-alpha']['400']}
                      size={20}
                      strokeWidth={2}
                    />
                  </View>
                </View>
                <View>
                  <Text className="mb-2 text-xs font-medium text-grey-plain-550">
                    End date
                  </Text>
                  <View className="flex-row items-center gap-3 rounded-xl border border-grey-plain-300 bg-white px-4 py-3">
                    <TextInput
                      value={filters.endDate}
                      onChangeText={(text) =>
                        setFilters({ ...filters, endDate: text })
                      }
                      placeholder="DD/MM/YYYY"
                      placeholderTextColor={colors['grey-alpha']['400']}
                      className="flex-1 text-base text-grey-alpha-500"
                      style={{ fontSize: 16 }}
                    />
                    <Calendar
                      color={colors['grey-alpha']['400']}
                      size={20}
                      strokeWidth={2}
                    />
                  </View>
                </View>
              </View>
            )}
          </View>

          {/* Transaction Type Filter */}
          <View className="mb-8">
            <Text className="mb-3 text-sm font-semibold text-grey-alpha-500">
              Transaction type
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {transactionTypeOptions.map((type) =>
                renderFilterChip(type, filters.transactionType === type, () =>
                  handleSelectTransactionType(type)
                )
              )}
            </View>
          </View>

          {/* Transaction Category Filter */}
          <View className="mb-8">
            <Text className="mb-3 text-sm font-semibold text-grey-alpha-500">
              Transaction category
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {categoryOptions.map((category) =>
                renderFilterChip(
                  category,
                  filters.transactionCategory === category,
                  () => handleSelectCategory(category)
                )
              )}
            </View>
          </View>
        </ScrollView>

        {/* Footer */}
        <View className="absolute bottom-0 left-0 right-0 flex-row items-center justify-between border-t border-grey-plain-150 bg-white px-6 py-4">
          <TouchableOpacity onPress={handleGoBack} hitSlop={8}>
            <Text className="text-base font-medium text-grey-alpha-500">
              Go back
            </Text>
          </TouchableOpacity>
          <Button
            title="Apply filter"
            onPress={handleApplyFilters}
            variant="primary"
            size="medium"
          />
        </View>
      </View>
    </BottomSheetComponent>
  );
});

FilterTransactionsBottomSheet.displayName = 'FilterTransactionsBottomSheet';
