import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
  Text,
  Dimensions,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { VideoView, useVideoPlayer } from 'expo-video';
import {
  X,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Minus,
  Plus,
  Palette,
} from 'lucide-react-native';
import { colors } from '@/theme/colors';
import { Button } from '../ui/Button';

interface AddTextScreenProps {
  videoUri: string;
  initialText?: string;
  initialStyle?: TextStyle;
  onClose: () => void;
  onDone: (text: string, style: TextStyle) => void;
}

interface TextStyle {
  color: string;
  fontSize: number;
  textAlign: 'left' | 'center' | 'right';
  backgroundColor?: string;
}

// Background color options
const BACKGROUND_COLORS = [
  { id: 'none', color: 'transparent', label: 'None' },
  { id: 'black', color: 'rgba(0, 0, 0, 0.8)', label: 'Black' },
  { id: 'white', color: 'rgba(255, 255, 255, 0.9)', label: 'White' },
  { id: 'purple', color: 'rgba(139, 92, 246, 0.9)', label: 'Purple' },
  { id: 'red', color: 'rgba(239, 68, 68, 0.9)', label: 'Red' },
  { id: 'blue', color: 'rgba(59, 130, 246, 0.9)', label: 'Blue' },
  { id: 'green', color: 'rgba(34, 197, 94, 0.9)', label: 'Green' },
  { id: 'yellow', color: 'rgba(234, 179, 8, 0.9)', label: 'Yellow' },
];

// Text color options
const TEXT_COLORS = [
  '#FFFFFF',
  '#000000',
  '#8B5CF6',
  '#EF4444',
  '#3B82F6',
  '#22C55E',
  '#EAB308',
  '#EC4899',
];

const MIN_FONT_SIZE = 20;
const MAX_FONT_SIZE = 60;

export function AddTextScreen({
  videoUri,
  initialText = '',
  initialStyle,
  onClose,
  onDone,
}: AddTextScreenProps) {
  const player = useVideoPlayer(videoUri, (player) => {
    player.loop = true;
    player.volume = 0;
    player.play();
  });
  const [text, setText] = useState(initialText);
  const [textStyle, setTextStyle] = useState<TextStyle>(
    initialStyle || {
      color: '#FFFFFF',
      fontSize: 20,
      textAlign: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
    }
  );
  const [showColorPicker, setShowColorPicker] = useState(false);

  const handleDone = () => {
    if (text.trim()) {
      onDone(text, textStyle);
    } else {
      onClose();
    }
  };

  const updateTextAlign = (align: 'left' | 'center' | 'right') => {
    setTextStyle((prev) => ({ ...prev, textAlign: align }));
  };

  const updateFontSize = (delta: number) => {
    setTextStyle((prev) => ({
      ...prev,
      fontSize: Math.min(MAX_FONT_SIZE, Math.max(MIN_FONT_SIZE, prev.fontSize + delta)),
    }));
  };

  const updateTextColor = (color: string) => {
    setTextStyle((prev) => ({ ...prev, color }));
  };

  const updateBackgroundColor = (color: string) => {
    setTextStyle((prev) => ({
      ...prev,
      backgroundColor: color === 'transparent' ? undefined : color,
    }));
  };

  const screenHeight = Dimensions.get('window').height;

  return (
    <View style={styles.container}>
      {/* Video Background */}
      <VideoView
        player={player}
        style={styles.video}
        contentFit="cover"
        nativeControls={false}
      />

      <KeyboardAwareScrollView
        enableOnAndroid
        keyboardShouldPersistTaps="handled"
        extraScrollHeight={120}
        extraHeight={140}
        enableAutomaticScroll
        enableResetScrollToCoords={false}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Bar */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color={colors['grey-plain']['50']} />
          </TouchableOpacity>

          <View style={styles.alignmentButtons}>
            <TouchableOpacity
              onPress={() => updateTextAlign('left')}
              style={[
                styles.alignButton,
                textStyle.textAlign === 'left' && styles.alignButtonActive,
              ]}
            >
              <AlignLeft
                size={20}
                color={
                  textStyle.textAlign === 'left'
                    ? colors.primary.purple
                    : colors['grey-plain']['50']
                }
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => updateTextAlign('center')}
              style={[
                styles.alignButton,
                textStyle.textAlign === 'center' && styles.alignButtonActive,
              ]}
            >
              <AlignCenter
                size={20}
                color={
                  textStyle.textAlign === 'center'
                    ? colors.primary.purple
                    : colors['grey-plain']['50']
                }
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => updateTextAlign('right')}
              style={[
                styles.alignButton,
                textStyle.textAlign === 'right' && styles.alignButtonActive,
              ]}
            >
              <AlignRight
                size={20}
                color={
                  textStyle.textAlign === 'right'
                    ? colors.primary.purple
                    : colors['grey-plain']['50']
                }
              />
            </TouchableOpacity>
          </View>

          <View style={styles.doneButtonContainer}>
            <Button title="Done" onPress={handleDone} size="small" />
          </View>
        </View>

        {/* Text Input on Video */}
        <View style={[styles.textContainer, { minHeight: screenHeight * 0.4 }]}>
          <View
            style={[
              styles.textInputWrapper,
              textStyle.backgroundColor && {
                backgroundColor: textStyle.backgroundColor,
              },
            ]}
          >
            <TextInput
              style={[
                styles.textInput,
                {
                  color: textStyle.color,
                  fontSize: textStyle.fontSize,
                  textAlign: textStyle.textAlign,
                },
              ]}
              value={text}
              onChangeText={setText}
              multiline
              placeholder="Add text"
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
              autoFocus
            />
          </View>
        </View>

        {/* Bottom Toolbar - Commented out for now */}
        {/* <View style={styles.bottomToolbar}>
          <View style={styles.toolSection}>
            <Text style={styles.toolLabel}>Size</Text>
            <View style={styles.fontSizeControls}>
              <TouchableOpacity
                onPress={() => updateFontSize(-4)}
                style={styles.fontSizeButton}
                disabled={textStyle.fontSize <= MIN_FONT_SIZE}
              >
                <Minus
                  size={16}
                  color={
                    textStyle.fontSize <= MIN_FONT_SIZE
                      ? colors['grey-alpha']['400']
                      : colors['grey-alpha']['550']
                  }
                />
              </TouchableOpacity>
              <Text style={styles.fontSizeText}>{textStyle.fontSize}</Text>
              <TouchableOpacity
                onPress={() => updateFontSize(4)}
                style={styles.fontSizeButton}
                disabled={textStyle.fontSize >= MAX_FONT_SIZE}
              >
                <Plus
                  size={16}
                  color={
                    textStyle.fontSize >= MAX_FONT_SIZE
                      ? colors['grey-alpha']['400']
                      : colors['grey-alpha']['550']
                  }
                />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={styles.colorPickerToggle}
            onPress={() => setShowColorPicker(!showColorPicker)}
          >
            <Palette
              size={20}
              color={showColorPicker ? colors.primary.purple : colors['grey-alpha']['550']}
            />
            <Text
              style={[
                styles.toolLabel,
                showColorPicker && { color: colors.primary.purple },
              ]}
            >
              Colors
            </Text>
          </TouchableOpacity>
        </View> */}

        {/* Color Picker Panel - Commented out for now */}
        {/* {showColorPicker && (
          <View style={styles.colorPickerPanel}>
            <View style={styles.colorSection}>
              <Text style={styles.colorSectionLabel}>Text Color</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.colorOptions}>
                  {TEXT_COLORS.map((color) => (
                    <TouchableOpacity
                      key={color}
                      style={[
                        styles.colorOption,
                        { backgroundColor: color },
                        textStyle.color === color && styles.colorOptionSelected,
                      ]}
                      onPress={() => updateTextColor(color)}
                    />
                  ))}
                </View>
              </ScrollView>
            </View>

            <View style={styles.colorSection}>
              <Text style={styles.colorSectionLabel}>Background</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.colorOptions}>
                  {BACKGROUND_COLORS.map((bg) => (
                    <TouchableOpacity
                      key={bg.id}
                      style={[
                        styles.colorOption,
                        {
                          backgroundColor: bg.color === 'transparent' ? '#E5E5E5' : bg.color,
                        },
                        bg.color === 'transparent' && styles.transparentOption,
                        (textStyle.backgroundColor === bg.color ||
                          (!textStyle.backgroundColor && bg.color === 'transparent')) &&
                          styles.colorOptionSelected,
                      ]}
                      onPress={() => updateBackgroundColor(bg.color)}
                    >
                      {bg.color === 'transparent' && (
                        <X size={16} color={colors['grey-alpha']['400']} />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>
          </View>
        )} */}
      </KeyboardAwareScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors['grey-plain']['550'],
  },
  video: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  scrollContent: {
    flexGrow: 1,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: 'rgba(37, 42, 49, 0.8)',
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  alignmentButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  alignButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  alignButtonActive: {
    backgroundColor: colors['grey-plain']['50'],
  },
  doneButtonContainer: {
    width: 80,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  textInputWrapper: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  textInput: {
    width: '100%',
    fontWeight: '700',
    minWidth: 200,
    textAlignVertical: 'center',
  },
  bottomToolbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors['grey-plain']['50'],
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  toolSection: {
    alignItems: 'center',
    gap: 8,
  },
  toolLabel: {
    fontSize: 12,
    color: colors['grey-alpha']['400'],
  },
  fontSizeControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors['grey-alpha']['100'],
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  fontSizeButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors['grey-plain']['50'],
    justifyContent: 'center',
    alignItems: 'center',
  },
  fontSizeText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors['grey-alpha']['550'],
    minWidth: 24,
    textAlign: 'center',
  },
  colorPickerToggle: {
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  colorPickerPanel: {
    backgroundColor: colors['grey-plain']['50'],
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 40,
    gap: 16,
  },
  colorSection: {
    gap: 8,
  },
  colorSectionLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: colors['grey-alpha']['400'],
  },
  colorOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  colorOption: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorOptionSelected: {
    borderColor: colors.primary.purple,
    borderWidth: 3,
  },
  transparentOption: {
    borderWidth: 1,
    borderColor: colors['grey-alpha']['400'],
    borderStyle: 'dashed',
  },
});
