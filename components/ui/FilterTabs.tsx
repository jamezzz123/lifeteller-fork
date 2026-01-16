import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { colors } from '@/theme/colors';

export interface FilterTab {
  id: string;
  label: string;
  count?: number;
}

export interface FilterTabsProps {
  filters: FilterTab[];
  activeFilter: string;
  onFilterChange: (filterId: string) => void;
  showCounts?: boolean;
  scrollable?: boolean;
  contentContainerClassName?: string;
}

export function FilterTabs({
  filters,
  activeFilter,
  onFilterChange,
  showCounts = true,
  scrollable = true,
  contentContainerClassName = '',
}: FilterTabsProps) {
  const renderFilter = (filter: FilterTab) => {
    const isActive = activeFilter === filter.id;

    return (
      <TouchableOpacity
        key={filter.id}
        style={[
          styles.filterButton,
          isActive ? styles.filterButtonActive : styles.filterButtonInactive,
        ]}
        onPress={() => onFilterChange(filter.id)}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.filterText,
            isActive ? styles.filterTextActive : styles.filterTextInactive,
          ]}
        >
          {filter.label}
          {showCounts && filter.count !== undefined && (
            <Text style={styles.countText}> ({filter.count})</Text>
          )}
        </Text>
      </TouchableOpacity>
    );
  };

  if (scrollable) {
    return (
      <View className={`bg-grey-plain-50 ${contentContainerClassName}`}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 8, gap: 8 }}
        >
          {filters.map(renderFilter)}
        </ScrollView>
      </View>
    );
  }

  return (
    <View
      className={`flex-row gap-2 bg-grey-plain-50 px-8 ${contentContainerClassName}`}
    >
      {filters.map(renderFilter)}
    </View>
  );
}

const styles = StyleSheet.create({
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterButtonActive: {
    backgroundColor: colors['primary-tints'].purple['100'],
    borderColor: colors.primary.purple,
  },
  filterButtonInactive: {
    backgroundColor: colors['grey-plain']['50'],
    borderColor: colors['grey-plain']['300'],
  },
  filterText: {
    fontSize: 14,
    fontWeight: '400',
  },
  filterTextActive: {
    color: colors.primary.purple,
    fontWeight: '500',
  },
  filterTextInactive: {
    color: colors['grey-alpha']['500'],
  },
  countText: {
    fontWeight: '400',
  },
});
