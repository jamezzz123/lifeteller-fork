import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import * as Haptics from 'expo-haptics';

import { Button } from '@/components/ui/Button';
import { DatePickerField } from '@/components/ui/DatePickerField';
import { colors } from '@/theme/colors';
import { TransactionFilters } from '@/components/wallet/FilterTransactionsBottomSheet';

export default function FilterTransactionsScreen() {
  const params = useLocalSearchParams<{
    status?: string | string[];
    dateRange?: string | string[];
    startDate?: string | string[];
    endDate?: string | string[];
    transactionType?: string | string[];
    transactionCategory?: string | string[];
  }>();

  const paramString = (value?: string | string[]) => {
    if (!value) return undefined;
    return Array.isArray(value) ? value[0] : value;
  };

  const initialFilters = useMemo<TransactionFilters>(() => {
    const status = paramString(params.status) || 'All';
    const dateRange = paramString(params.dateRange) || 'All time';
    const startDate = paramString(params.startDate) || undefined;
    const endDate = paramString(params.endDate) || undefined;
    const transactionType = paramString(params.transactionType) || 'All';
    const transactionCategory =
      paramString(params.transactionCategory) || 'All';

    return {
      status,
      dateRange,
      startDate,
      endDate,
      transactionType,
      transactionCategory,
    };
  }, [
    params.dateRange,
    params.endDate,
    params.startDate,
    params.status,
    params.transactionCategory,
    params.transactionType,
  ]);

  const [filters, setFilters] = useState<TransactionFilters>(initialFilters);

  const formatDateString = (date: Date) => date.toLocaleDateString('en-GB');

  const parseDateString = (value?: string) => {
    if (!value) return null;
    const [day, month, year] = value.split('/');
    const parsed = new Date(Number(year), Number(month) - 1, Number(day));
    if (Number.isNaN(parsed.getTime())) return null;
    return parsed;
  };

  const handleClose = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  const handleApplyFilters = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.replace({
      pathname: '/all-transactions' as any,
      params: {
        status: filters.status,
        dateRange: filters.dateRange,
        startDate: filters.startDate || '',
        endDate: filters.endDate || '',
        transactionType: filters.transactionType,
        transactionCategory: filters.transactionCategory,
      },
    });
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
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'bottom']}>
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
          contentContainerStyle={{ padding: 24, paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Status Filter */}
          <View className="mb-8">
            <Text className="mb-3 text-sm font-semibold text-grey-alpha-500">
              Status
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {statusOptions.map((status) => (
                <View key={`status-${status}`}>
                  {renderFilterChip(status, filters.status === status, () =>
                    setFilters({ ...filters, status })
                  )}
                </View>
              ))}
            </View>
          </View>

          {/* Date Range Filter */}
          <View className="mb-8">
            <Text className="mb-3 text-sm font-semibold text-grey-alpha-500">
              Date range
            </Text>
            <View className="mb-4 flex-row flex-wrap gap-2">
              {dateRangeOptions.map((range) => (
                <View key={`range-${range}`}>
                  {renderFilterChip(range, filters.dateRange === range, () =>
                    setFilters({
                      ...filters,
                      dateRange: range,
                      startDate: undefined,
                      endDate: undefined,
                    })
                  )}
                </View>
              ))}
            </View>

            {/* Custom Date Range Inputs */}
            {filters.dateRange === 'Custom date range' && (
              <View className="gap-3">
                <DatePickerField
                  label="Start date"
                  value={parseDateString(filters.startDate)}
                  onChange={(date) =>
                    setFilters({ ...filters, startDate: formatDateString(date) })
                  }
                  placeholder="DD/MM/YYYY"
                  maximumDate={parseDateString(filters.endDate) || new Date()}
                />
                <DatePickerField
                  label="End date"
                  value={parseDateString(filters.endDate)}
                  onChange={(date) =>
                    setFilters({ ...filters, endDate: formatDateString(date) })
                  }
                  placeholder="DD/MM/YYYY"
                  minimumDate={parseDateString(filters.startDate) || undefined}
                  maximumDate={new Date()}
                />
              </View>
            )}
          </View>

          {/* Transaction Type Filter */}
          <View className="mb-8">
            <Text className="mb-3 text-sm font-semibold text-grey-alpha-500">
              Transaction type
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {transactionTypeOptions.map((type) => (
                <View key={`type-${type}`}>
                  {renderFilterChip(type, filters.transactionType === type, () =>
                    setFilters({ ...filters, transactionType: type })
                  )}
                </View>
              ))}
            </View>
          </View>

          {/* Transaction Category Filter */}
          <View className="mb-8">
            <Text className="mb-3 text-sm font-semibold text-grey-alpha-500">
              Transaction category
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {categoryOptions.map((category) => (
                <View key={`category-${category}`}>
                  {renderFilterChip(
                    category,
                    filters.transactionCategory === category,
                    () => setFilters({ ...filters, transactionCategory: category })
                  )}
                </View>
              ))}
            </View>
          </View>
        </ScrollView>

        {/* Footer */}
        <View className="border-t border-grey-plain-150 bg-white px-6 py-4">
          <View className="flex-row items-center justify-between">
            <TouchableOpacity onPress={handleClose} hitSlop={8}>
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
      </View>
    </SafeAreaView>
  );
}
