import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { colors } from '@/theme/colors';

interface Filter {
  id: string;
  label: string;
}

export function FeedFilters() {
  const filters: Filter[] = [
    { id: 'for-me', label: 'For me' },
    { id: 'following', label: 'Following' },
    { id: 'feeding', label: 'Feeding' },
    { id: 'housing', label: 'Housing' },
    { id: 'education', label: 'Education' },
  ];

  const [activeFilter, setActiveFilter] = React.useState('for-me');

  return (
    <View className="bg-grey-plain-50 py-3">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
      >
        {filters.map((filter) => {
          const isActive = activeFilter === filter.id;
          return (
            <TouchableOpacity
              key={filter.id}
              style={[
                styles.filterButton,
                isActive
                  ? styles.filterButtonActive
                  : styles.filterButtonInactive,
              ]}
              onPress={() => setActiveFilter(filter.id)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.filterText,
                  isActive
                    ? styles.filterTextActive
                    : styles.filterTextInactive,
                ]}
              >
                {filter.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
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
    fontWeight: '500',
  },
  filterTextActive: {
    color: colors.primary.purple,
  },
  filterTextInactive: {
    color: colors['grey-alpha']['500'],
  },
});
