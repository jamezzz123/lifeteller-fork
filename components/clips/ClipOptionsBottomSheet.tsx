import React, { forwardRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import {
  Handshake,
  UserMinus,
  EyeOff,
  HelpCircle,
  Bookmark,
  QrCode,
  Flag,
  UserRoundPlus,
  UserRoundCog,
  CircleSlash,
} from 'lucide-react-native';
import { colors } from '@/theme/colors';
import {
  BottomSheetComponent,
  BottomSheetRef,
} from '@/components/ui/BottomSheet';

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  onPress: () => void;
  isDestructive?: boolean;
}

interface ClipOptionsBottomSheetProps {
  onBecomeCollaborator: () => void;
  onJoinAsBeneficiary: () => void;
  onUnfollow: () => void;
  onAboutAccount: () => void;
  onHideClip: () => void;
  onWhySeeing: () => void;
  onSaveForLater: () => void;
  onGetQRCode: () => void;
  onReportClip: () => void;
  onReportAndBlock: () => void;
}

export const ClipOptionsBottomSheet = forwardRef<
  BottomSheetRef,
  ClipOptionsBottomSheetProps
>(
  (
    {
      onBecomeCollaborator,
      onJoinAsBeneficiary,
      onUnfollow,
      onAboutAccount,
      onHideClip,
      onWhySeeing,
      onSaveForLater,
      onGetQRCode,
      onReportClip,
      onReportAndBlock,
    },
    ref
  ) => {
    const menuItems: MenuItem[] = [
      {
        id: 'collaborator',
        label: 'Become a collaborator',
        icon: <Handshake size={24} color={colors['grey-alpha']['400']} />,
        onPress: onBecomeCollaborator,
      },
      {
        id: 'beneficiary',
        label: 'Join lift as a beneficiary',
        icon: <UserRoundPlus size={24} color={colors['grey-alpha']['400']} />,
        onPress: onJoinAsBeneficiary,
      },
      {
        id: 'unfollow',
        label: 'Unfollow',
        icon: <UserMinus size={24} color={colors['grey-alpha']['400']} />,
        onPress: onUnfollow,
      },
      {
        id: 'about',
        label: 'About this account',
        icon: <UserRoundCog size={24} color={colors['grey-alpha']['400']} />,
        onPress: onAboutAccount,
      },
      {
        id: 'hide',
        label: 'Hide this lift clip',
        icon: <EyeOff size={24} color={colors['grey-alpha']['400']} />,
        onPress: onHideClip,
      },
      {
        id: 'why',
        label: 'Why am I seeing this lift clip',
        icon: <HelpCircle size={24} color={colors['grey-alpha']['400']} />,
        onPress: onWhySeeing,
      },
      {
        id: 'save',
        label: 'Save for later',
        icon: <Bookmark size={24} color={colors['grey-alpha']['400']} />,
        onPress: onSaveForLater,
      },
      {
        id: 'qr',
        label: 'Get QR code',
        icon: <QrCode size={24} color={colors['grey-alpha']['400']} />,
        onPress: onGetQRCode,
      },
      {
        id: 'report',
        label: 'Report lift clip',
        icon: <Flag size={24} color={colors.state.red} />,
        onPress: onReportClip,
        isDestructive: true,
      },
      {
        id: 'block',
        label: 'Report lift clip and block user',
        icon: <CircleSlash size={24} color={colors.state.red} />,
        onPress: onReportAndBlock,
        isDestructive: true,
      },
    ];

    const handleItemPress = (item: MenuItem) => {
      item.onPress();
      // Close the bottom sheet after action
      if (ref && typeof ref !== 'function' && ref.current) {
        ref.current.close();
      }
    };

    return (
      <BottomSheetComponent ref={ref}>
        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <React.Fragment key={item.id}>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => handleItemPress(item)}
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
              {index < menuItems.length - 1 && <View style={styles.divider} />}
            </React.Fragment>
          ))}
        </View>
      </BottomSheetComponent>
    );
  }
);

ClipOptionsBottomSheet.displayName = 'ClipOptionsBottomSheet';

const styles = StyleSheet.create({
  menuContainer: {
    paddingHorizontal: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  iconContainer: {
    marginRight: 16,
    width: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuText: {
    fontSize: 16,
    color: colors['grey-alpha']['400'],
    flex: 1,
    fontFamily: 'interRegular',
  },
  destructiveText: {
    color: colors.state.red,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors['grey-alpha']['250'],
    marginLeft: 48,
  },
});
