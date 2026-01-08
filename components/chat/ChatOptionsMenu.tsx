import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Info, Settings, User, Trash2 } from 'lucide-react-native';
import { colors } from '@/theme/colors';

interface ChatOptionsMenuProps {
  visible: boolean;
  onClose: () => void;
  onViewInfo: () => void;
  onChatSettings: () => void;
  onViewProfile: () => void;
  onDeleteConversation: () => void;
}

export function ChatOptionsMenu({
  visible,
  onClose,
  onViewInfo,
  onChatSettings,
  onViewProfile,
  onDeleteConversation,
}: ChatOptionsMenuProps) {
  const options = [
    {
      label: 'View info',
      icon: <Info color={colors['grey-alpha']['500']} size={20} />,
      onPress: onViewInfo,
      destructive: false,
    },
    {
      label: 'Chat settings',
      icon: <Settings color={colors['grey-alpha']['500']} size={20} />,
      onPress: onChatSettings,
      destructive: false,
    },
    {
      label: 'View profile',
      icon: <User color={colors['grey-alpha']['500']} size={20} />,
      onPress: onViewProfile,
      destructive: false,
    },
    {
      label: 'Delete conversation',
      icon: <Trash2 color={colors.state.red} size={20} />,
      onPress: onDeleteConversation,
      destructive: true,
    },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.menuContainer}>
          {options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.menuItem,
                index === options.length - 1 && styles.lastMenuItem,
              ]}
              onPress={() => {
                option.onPress();
                onClose();
              }}
              activeOpacity={0.7}
            >
              <View style={styles.menuRow}>
                <View style={styles.iconWrap}>{option.icon}</View>
                <Text
                  style={[
                    styles.menuItemText,
                    option.destructive && styles.destructiveText,
                  ]}
                >
                  {option.label}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  menuContainer: {
    position: 'absolute',
    top: 56,
    right: 16,
    backgroundColor: colors['grey-plain']['50'],
    borderRadius: 12,
    minWidth: 200,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  menuItem: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors['grey-plain']['300'],
  },
  lastMenuItem: {
    borderBottomWidth: 0,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors['grey-alpha']['500'],
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrap: {
    marginRight: 12,
    width: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  destructiveText: {
    color: colors.state.red,
  },
});

