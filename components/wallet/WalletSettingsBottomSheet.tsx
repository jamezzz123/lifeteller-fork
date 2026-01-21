import React, { forwardRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import {
  Settings,
  BarChart3,
  Vault,
  MinusCircle,
  Landmark,
  CircleSlash,
} from 'lucide-react-native';
import {
  BottomSheetComponent,
  BottomSheetRef,
} from '@/components/ui/BottomSheet';
import { colors } from '@/theme/colors';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';

interface WalletSettingsBottomSheetProps {
  onBankAccounts?: () => void;
  onWalletSettings?: () => void;
  onWalletAnalytics?: () => void;
  onWalletPolicyAndFees?: () => void;
  onDeactivateWallet?: () => void;
  onActivateWallet?: () => void;
  onBlockWallet?: () => void;
  isWalletFrozen?: boolean;
  isWalletDeactivated?: boolean;
}

export const WalletSettingsBottomSheet = forwardRef<
  BottomSheetRef,
  WalletSettingsBottomSheetProps
>(
  (
    {
      onBankAccounts,
      onWalletSettings,
      onWalletAnalytics,
      onWalletPolicyAndFees,
      onDeactivateWallet,
      onActivateWallet,
      onBlockWallet,
      isWalletFrozen = false,
      isWalletDeactivated = false,
    },
    ref
  ) => {
    const handleBankAccounts = () => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      if (onBankAccounts) {
        onBankAccounts();
      } else {
        router.push('/bank-accounts' as any);
      }
      if (ref && typeof ref !== 'function' && ref.current) {
        ref.current.close();
      }
    };

    const handleWalletSettings = () => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      if (onWalletSettings) {
        onWalletSettings();
      } else {
        router.push('/wallet-settings' as any);
      }
      if (ref && typeof ref !== 'function' && ref.current) {
        ref.current.close();
      }
    };

    const handleWalletAnalytics = () => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      if (onWalletAnalytics) {
        onWalletAnalytics();
      } else {
        router.push('/wallet-analytics' as any);
      }
      if (ref && typeof ref !== 'function' && ref.current) {
        ref.current.close();
      }
    };

    const handleWalletPolicyAndFees = () => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      if (onWalletPolicyAndFees) {
        onWalletPolicyAndFees();
      } else {
        router.push('/help-center/wallet' as any);
      }
      if (ref && typeof ref !== 'function' && ref.current) {
        ref.current.close();
      }
    };

    const handleDeactivateWallet = () => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      if (isWalletDeactivated && onActivateWallet) {
        onActivateWallet();
      } else if (onDeactivateWallet) {
        onDeactivateWallet();
      } else {
        // TODO: Navigate to deactivate wallet screen
        router.push('/deactivate-account' as any);
      }
      if (ref && typeof ref !== 'function' && ref.current) {
        ref.current.close();
      }
    };

    const handleBlockWallet = () => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      if (onBlockWallet) {
        onBlockWallet();
      } else {
        // TODO: Navigate to block wallet screen
        console.log('Block wallet');
      }
      if (ref && typeof ref !== 'function' && ref.current) {
        ref.current.close();
      }
    };

    const menuItems = [
      {
        id: 'bank-accounts',
        label: 'Bank accounts',
        icon: <Landmark size={24} color={colors['grey-alpha']['500']} />,
        onPress: handleBankAccounts,
        isDestructive: false,
      },
      {
        id: 'wallet-settings',
        label: 'Wallet settings',
        icon: <Settings size={24} color={colors['grey-alpha']['500']} />,
        onPress: handleWalletSettings,
        isDestructive: false,
      },
      {
        id: 'wallet-analytics',
        label: 'Wallet analytics',
        icon: <BarChart3 size={24} color={colors['grey-alpha']['500']} />,
        onPress: handleWalletAnalytics,
        isDestructive: false,
      },
      {
        id: 'wallet-policy-fees',
        label: 'Wallet policy and fees',
        icon: <Vault size={24} color={colors['grey-alpha']['500']} />,
        onPress: handleWalletPolicyAndFees,
        isDestructive: false,
      },
      {
        id: 'deactivate-wallet',
        label: isWalletDeactivated ? 'Activate wallet' : 'Deactivate wallet',
        icon: (
          <MinusCircle
            size={24}
            color={
              isWalletDeactivated ? colors.primary.purple : colors.state.red
            }
          />
        ),
        onPress: handleDeactivateWallet,
        isDestructive: !isWalletDeactivated,
      },
      {
        id: 'block-wallet',
        label: isWalletFrozen ? 'Unblock wallet' : 'Block wallet',
        icon: <CircleSlash size={24} color={colors.state.red} />,
        onPress: handleBlockWallet,
        isDestructive: true,
      },
    ];

    return (
      <BottomSheetComponent ref={ref}>
        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <React.Fragment key={item.id}>
              {/* Full-width divider before destructive actions */}
              {index === 4 && <View style={styles.fullDivider} />}
              <TouchableOpacity
                style={styles.menuItem}
                onPress={item.onPress}
                activeOpacity={0.7}
              >
                <View style={styles.iconContainer}>{item.icon}</View>
                <Text
                  style={[
                    styles.menuText,
                    item.isDestructive && styles.destructiveText,
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            </React.Fragment>
          ))}
        </View>
      </BottomSheetComponent>
    );
  }
);

WalletSettingsBottomSheet.displayName = 'WalletSettingsBottomSheet';

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
    width: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors['grey-alpha']['500'],
    flex: 1,
  },
  destructiveText: {
    color: colors.state.red,
  },
  divider: {
    height: 1,
    backgroundColor: colors['grey-plain']['300'],
    marginLeft: 40, // Align with text (icon width + margin)
  },
  fullDivider: {
    height: 1,
    backgroundColor: colors['grey-plain']['300'],
    marginVertical: 8,
  },
});
