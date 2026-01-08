import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import {
  Reply,
  Copy,
  Forward,
  Trash2,
} from 'lucide-react-native';
import { colors } from '@/theme/colors';
import * as Haptics from 'expo-haptics';
import * as Clipboard from 'expo-clipboard';
import { EmojiPicker } from './EmojiPicker';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface MessageActionMenuProps {
  visible: boolean;
  messageId: string;
  messageText?: string;
  timestamp: string;
  isSent: boolean;
  onClose: () => void;
  onReply?: () => void;
  onCopy?: () => void;
  onForward?: () => void;
  onDelete?: () => void;
  onReact?: (emoji: string) => void;
  messagePosition?: { x: number; y: number };
}

// Quick reaction emojis - matching the image exactly
const QUICK_REACTIONS = ['👍', '❤️', '😂', '😮', '😢'];

export function MessageActionMenu({
  visible,
  messageId,
  messageText,
  timestamp,
  isSent,
  onClose,
  onReply,
  onCopy,
  onForward,
  onDelete,
  onReact,
  messagePosition,
}: MessageActionMenuProps) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else {
      fadeAnim.setValue(0);
      setShowEmojiPicker(false);
    }
    // fadeAnim is a ref and doesn't need to be in dependencies
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const handleEmojiPress = (emoji: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onReact?.(emoji);
    onClose();
  };

  const handleCustomiseReactions = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowEmojiPicker(true);
  };

  const handleEmojiPickerSelect = (emoji: string) => {
    handleEmojiPress(emoji);
  };

  const handleActionPress = (action: () => void) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    action();
    onClose();
  };

  // Action menu items
  const actionItems = [
    {
      id: 'reply',
      label: 'Reply',
      icon: Reply,
      onPress: () => onReply?.(),
      color: colors['grey-alpha']['500'],
    },
    {
      id: 'copy',
      label: 'Copy',
      icon: Copy,
      onPress: async () => {
        if (messageText) {
          try {
            await Clipboard.setStringAsync(messageText);
          } catch (error) {
            console.error('Error copying message:', error);
          }
        }
        onCopy?.();
      },
      color: colors['grey-alpha']['500'],
    },
    {
      id: 'forward',
      label: 'Forward',
      icon: Forward,
      onPress: () => onForward?.(),
      color: colors['grey-alpha']['500'],
    },
    {
      id: 'delete',
      label: isSent ? 'Unsend' : 'Delete',
      icon: Trash2,
      onPress: () => onDelete?.(),
      color: colors.state.red,
      destructive: true,
    },
  ];

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPress={onClose}
        style={styles.backdrop}
      >
        <Animated.View
          style={[
            styles.container,
            {
              opacity: fadeAnim,
            },
          ]}
        >
          {/* Emoji Reactions Bar - Top */}
          <View style={styles.emojiContainer}>
            <View style={styles.emojiBar}>
              {QUICK_REACTIONS.map((emoji, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleEmojiPress(emoji)}
                  style={styles.emojiButton}
                  activeOpacity={0.7}
                >
                  <Text style={styles.emoji}>{emoji}</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                onPress={handleCustomiseReactions}
                style={styles.emojiButton}
                activeOpacity={0.7}
              >
                <View style={styles.plusButton}>
                  <Text style={styles.plusText}>+</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* "More" label */}
          <Text style={styles.moreLabel}>More</Text>

          {/* Action Menu */}
          <View style={styles.actionMenu}>
            {actionItems.map((item, index) => {
              const Icon = item.icon;
              const isLast = index === actionItems.length - 1;
              return (
                <View key={item.id}>
                  <TouchableOpacity
                    onPress={() => handleActionPress(item.onPress)}
                    style={styles.actionItem}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.actionLabel,
                        item.destructive && styles.destructiveLabel,
                      ]}
                    >
                      {item.label}
                    </Text>
                    <Icon
                      color={item.destructive ? colors.state.red : item.color}
                      size={20}
                      strokeWidth={2}
                    />
                  </TouchableOpacity>
                  {!isLast && <View style={styles.separator} />}
                </View>
              );
            })}
          </View>

          {/* Emoji Picker */}
          <EmojiPicker
            visible={showEmojiPicker}
            onSelectEmoji={handleEmojiPickerSelect}
            onClose={() => setShowEmojiPicker(false)}
          />
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    alignItems: 'center',
    width: SCREEN_WIDTH - 64,
    maxWidth: 280,
  },
  emojiContainer: {
    marginBottom: 12,
    width: '100%',
  },
  emojiBar: {
    flexDirection: 'row',
    backgroundColor: '#E8E8E8', // Light grey matching the image
    borderRadius: 24,
    paddingVertical: 8,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  emojiButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  emoji: {
    fontSize: 26,
  },
  plusButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#6B6B6B', // Dark grey matching the image
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 20,
  },
  moreLabel: {
    fontSize: 14,
    color: colors['grey-plain']['550'],
    marginBottom: 6,
    alignSelf: 'flex-start',
    marginLeft: 2,
    fontWeight: '400',
  },
  actionMenu: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
    overflow: 'hidden',
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 18,
  },
  actionLabel: {
    fontSize: 16,
    color: colors['grey-alpha']['500'],
    fontWeight: '400',
  },
  destructiveLabel: {
    color: colors.state.red,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors['grey-plain']['300'],
    marginLeft: 18,
  },
});
