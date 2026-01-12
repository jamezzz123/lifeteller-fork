import React, { forwardRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MessageCircleQuestion, Flag } from 'lucide-react-native';
import {
  BottomSheetComponent,
  BottomSheetRef,
} from '@/components/ui/BottomSheet';
import { colors } from '@/theme/colors';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';

interface TransactionOptionsBottomSheetProps {
  transactionId: string;
  onReportComplaints?: () => void;
  onFlagTransaction?: () => void;
}

export const TransactionOptionsBottomSheet = forwardRef<
  BottomSheetRef,
  TransactionOptionsBottomSheetProps
>(({ transactionId, onReportComplaints, onFlagTransaction }, ref) => {
  const handleReportComplaints = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (onReportComplaints) {
      onReportComplaints();
    } else {
      // Default action: navigate to report issue screen
      router.push('/report-issue' as any);
    }
    if (ref && typeof ref !== 'function' && ref.current) {
      ref.current.close();
    }
  };

  const handleFlagTransaction = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (onFlagTransaction) {
      onFlagTransaction();
    } else {
      // Default action: navigate to report issue screen with transaction context
      router.push(`/report-issue?transactionId=${transactionId}` as any);
    }
    if (ref && typeof ref !== 'function' && ref.current) {
      ref.current.close();
    }
  };

  const menuItems = [
    {
      id: 'report-complaints',
      label: 'Report complaints',
      icon: (
        <MessageCircleQuestion
          size={24}
          color={colors['grey-alpha']['500']}
          strokeWidth={2}
        />
      ),
      onPress: handleReportComplaints,
    },
    {
      id: 'flag-transaction',
      label: 'Flag transaction',
      icon: (
        <Flag size={24} color={colors['grey-alpha']['500']} strokeWidth={2} />
      ),
      onPress: handleFlagTransaction,
    },
  ];

  return (
    <BottomSheetComponent ref={ref} snapPoints={['25%']}>
      <View style={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <React.Fragment key={item.id}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={item.onPress}
              activeOpacity={0.7}
            >
              <View style={styles.iconContainer}>{item.icon}</View>
              <Text style={styles.menuText}>{item.label}</Text>
            </TouchableOpacity>
            {index < menuItems.length - 1 && <View style={styles.divider} />}
          </React.Fragment>
        ))}
      </View>
    </BottomSheetComponent>
  );
});

TransactionOptionsBottomSheet.displayName = 'TransactionOptionsBottomSheet';

const styles = StyleSheet.create({
  menuContainer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  iconContainer: {
    marginRight: 16,
  },
  menuText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors['grey-alpha']['500'],
  },
  divider: {
    height: 1,
    backgroundColor: colors['grey-plain']['300'],
    marginLeft: 40, // Align with text (icon width + margin)
  },
});

