import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
  TextInput,
} from 'react-native';
import { colors } from '@/theme/colors';
import * as Haptics from 'expo-haptics';

interface EmojiPickerProps {
  visible: boolean;
  onSelectEmoji: (emoji: string) => void;
  onClose: () => void;
}

// Common emoji categories
const EMOJI_CATEGORIES = {
  recent: {
    title: 'Recent',
    emojis: ['👍', '❤️', '😂', '😮', '😢', '😡', '🙏', '🔥', '💯', '🙌', '👏', '😴', '🤔', '😅', '😭', '👀', '📌', '🤮', '😒', '🤫', '🤢', '🤔', '😰', '😄'],
  },
  smileys: {
    title: 'Smileys & People',
    emojis: ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣', '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠', '😡', '🤬', '🤯', '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓'],
  },
  gestures: {
    title: 'Gestures',
    emojis: ['👋', '🤚', '🖐', '✋', '🖖', '👌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '👍', '👎', '✊', '👊', '🤛', '🤜', '👏', '🙌', '👐', '🤲', '🤝', '🙏'],
  },
  hearts: {
    title: 'Hearts',
    emojis: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟'],
  },
  objects: {
    title: 'Objects',
    emojis: ['🔥', '💯', '⭐', '🌟', '✨', '💫', '💥', '💢', '💤', '💨', '👁️', '👀', '🧠', '🦷', '🦴', '💀', '👻', '👽', '🤖', '💩', '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿', '😾'],
  },
};

export function EmojiPicker({
  visible,
  onSelectEmoji,
  onClose,
}: EmojiPickerProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleEmojiPress = (emoji: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSelectEmoji(emoji);
    onClose();
  };

  const filteredEmojis = searchQuery
    ? Object.values(EMOJI_CATEGORIES)
        .flatMap((cat) => cat.emojis)
        .filter((emoji) => emoji.includes(searchQuery))
    : null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />
        <View style={styles.pickerContainer}>
          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search"
              placeholderTextColor={colors['grey-plain']['550']}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {/* Your reactions */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Your reactions</Text>
              <TouchableOpacity>
                <Text style={styles.customiseText}>Customise</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.emojiRow}>
              {EMOJI_CATEGORIES.recent.emojis.slice(0, 6).map((emoji, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleEmojiPress(emoji)}
                  style={styles.emojiButton}
                  activeOpacity={0.7}
                >
                  <Text style={styles.emoji}>{emoji}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Emoji Grid */}
          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
          >
            {filteredEmojis ? (
              <View style={styles.emojiGrid}>
                {filteredEmojis.map((emoji, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handleEmojiPress(emoji)}
                    style={styles.emojiGridItem}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.emoji}>{emoji}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              Object.entries(EMOJI_CATEGORIES).map(([key, category]) => (
                <View key={key} style={styles.section}>
                  <Text style={styles.sectionTitle}>{category.title}</Text>
                  <View style={styles.emojiGrid}>
                    {category.emojis.map((emoji, index) => (
                      <TouchableOpacity
                        key={index}
                        onPress={() => handleEmojiPress(emoji)}
                        style={styles.emojiGridItem}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.emoji}>{emoji}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              ))
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  pickerContainer: {
    backgroundColor: colors['grey-plain']['100'],
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '70%',
    paddingBottom: 32,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  searchInput: {
    backgroundColor: colors['grey-plain']['150'],
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    color: colors['grey-alpha']['500'],
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors['grey-alpha']['500'],
  },
  customiseText: {
    fontSize: 14,
    color: colors.primary.purple,
    fontWeight: '500',
  },
  emojiRow: {
    flexDirection: 'row',
    gap: 8,
  },
  emojiButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 28,
  },
  scrollView: {
    flex: 1,
  },
  emojiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  emojiGridItem: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

