import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native';
import { VideoView, useVideoPlayer } from 'expo-video';
import {
  X,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from 'lucide-react-native';
import { colors } from '@/theme/colors';
import { Button } from '../ui/Button';

interface AddTextScreenProps {
  videoUri: string;
  onClose: () => void;
  onDone: (text: string, style: TextStyle) => void;
}

interface TextStyle {
  color: string;
  fontSize: number;
  textAlign: 'left' | 'center' | 'right';
  backgroundColor?: string;
}

export function AddTextScreen({
  videoUri,
  onClose,
  onDone,
}: AddTextScreenProps) {
  const player = useVideoPlayer(videoUri, (player) => {
    player.loop = true;
    player.volume = 0;
    player.play();
  });
  const [text, setText] = useState('Add text');
  const [textStyle, setTextStyle] = useState<TextStyle>({
    color: '#FFFFFF',
    fontSize: 40,
    textAlign: 'center',
  });

  const handleDone = () => {
    onDone(text, textStyle);
  };

  const updateTextAlign = (align: 'left' | 'center' | 'right') => {
    setTextStyle((prev) => ({ ...prev, textAlign: align }));
  };

  return (
    <View style={styles.container}>
      {/* Video Background */}
      <VideoView
        player={player}
        style={styles.video}
        contentFit="cover"
        nativeControls={false}
      />

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
      <View style={styles.textContainer}>
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
  textInput: {
    width: '100%',
    fontWeight: '700',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
});
