import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import {
  X,
  Music2,
  HandHelping,
  Check,
  ChevronRight,
} from 'lucide-react-native';
import { VideoView, useVideoPlayer } from 'expo-video';
import { useAudioPlayer } from 'expo-audio';
import { colors } from '@/theme/colors';

interface TextOverlay {
  text: string;
  style: {
    color: string;
    fontSize: number;
    textAlign: 'left' | 'center' | 'right';
    backgroundColor?: string;
  };
}

interface Song {
  id: string;
  title: string;
  artist: string;
  duration: string;
  thumbnail: string;
  audioUrl: string;
}

interface VideoPreviewScreenProps {
  videoUri: string;
  linkedLiftName?: string;
  selectedSong?: Song | null;
  textOverlay?: TextOverlay | null;
  onClose: () => void;
  onLinkToExistingLift: () => void;
  onAddSong: () => void;
  onAddText: () => void;
  onProceed: () => void;
}

export function VideoPreviewScreen({
  videoUri,
  linkedLiftName,
  selectedSong,
  textOverlay,
  onClose,
  onLinkToExistingLift,
  onAddSong,
  onAddText,
  onProceed,
}: VideoPreviewScreenProps) {
  const player = useVideoPlayer(videoUri, (player) => {
    player.loop = true;
    // Mute video if song is selected (music will play instead)
    player.volume = selectedSong ? 0 : 1.0;
    player.play();
  });

  // Audio player for background music
  const audioPlayer = useAudioPlayer(selectedSong?.audioUrl);

  useEffect(() => {
    // Auto-play video when URI changes
    player.play();
  }, [videoUri, player]);

  // Mute/unmute video based on song selection
  useEffect(() => {
    player.volume = selectedSong ? 0 : 1.0;
  }, [selectedSong, player]);

  // Play/stop music based on song selection
  useEffect(() => {
    if (selectedSong?.audioUrl) {
      try {
        audioPlayer.play();
      } catch {
        // Ignore play errors
      }
    }
    return () => {
      try {
        audioPlayer?.pause();
      } catch {
        // Ignore pause errors
      }
    };
  }, [selectedSong, audioPlayer]);

  // Check if any items have been added
  const hasAddedItems = linkedLiftName || selectedSong || textOverlay;
  return (
    <View style={styles.container}>
      {/* Video Player */}
      <VideoView
        player={player}
        style={styles.video}
        contentFit="cover"
        nativeControls={false}
      />

      {/* Text Overlay */}
      {textOverlay && (
        <View style={styles.textOverlayContainer}>
          <Text
            style={[
              styles.textOverlay,
              {
                color: textOverlay.style.color,
                fontSize: textOverlay.style.fontSize,
                textAlign: textOverlay.style.textAlign,
                backgroundColor: textOverlay.style.backgroundColor,
              },
            ]}
          >
            {textOverlay.text}
          </Text>
        </View>
      )}

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <X size={16} color={colors['grey-plain']['50']} />
        </TouchableOpacity>
      </View>

      {/* Floating Action Cards */}
      <View style={styles.actionsContainer}>
        {/* Linked Lift Card */}
        <TouchableOpacity
          style={[styles.actionCard, linkedLiftName && styles.actionCardActive]}
          onPress={onLinkToExistingLift}
        >
          {linkedLiftName ? (
            <View style={styles.checkIconContainer}>
              <Check size={18} color={colors['grey-plain']['50']} />
            </View>
          ) : (
            <View style={styles.iconPlaceholder}>
              <HandHelping size={18} color={colors['grey-plain']['50']} />
            </View>
          )}
          <Text style={styles.actionCardText} numberOfLines={1}>
            {linkedLiftName
              ? `Linked lift - ${linkedLiftName}`
              : 'Link to existing lift'}
          </Text>
          <ChevronRight size={20} color={colors['grey-plain']['50']} />
        </TouchableOpacity>

        {/* Song Card */}
        <TouchableOpacity
          style={[styles.actionCard, selectedSong && styles.actionCardActive]}
          onPress={onAddSong}
        >
          {selectedSong ? (
            <View style={styles.songThumbnail}>
              <Music2 size={16} color={colors['grey-plain']['50']} />
            </View>
          ) : (
            <View style={styles.iconPlaceholder}>
              <Music2 size={18} color={colors['grey-plain']['50']} />
            </View>
          )}
          <Text style={styles.actionCardText} numberOfLines={1}>
            {selectedSong
              ? `Song added - ${selectedSong.title} by ${selectedSong.artist}`
              : 'Add sound'}
          </Text>
          <ChevronRight size={20} color={colors['grey-plain']['50']} />
        </TouchableOpacity>

        {/* Text Card */}
        <TouchableOpacity
          style={[styles.actionCard, textOverlay && styles.actionCardActive]}
          onPress={onAddText}
        >
          <View style={styles.iconPlaceholder}>
            <Text style={styles.aaIcon}>Aa</Text>
          </View>
          <Text style={styles.actionCardText} numberOfLines={1}>
            {textOverlay ? `Text added - ${textOverlay.text}` : 'Add text'}
          </Text>
          {(textOverlay || true) && (
            <ChevronRight size={20} color={colors['grey-plain']['50']} />
          )}
        </TouchableOpacity>
      </View>

      {/* Proceed Button */}
      <View style={styles.proceedContainer}>
        <TouchableOpacity style={styles.proceedButton} onPress={onProceed}>
          <Text style={styles.proceedButtonText}>Proceed</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors['grey-plain']['300'],
  },
  video: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: 'rgba(37, 42, 49, 0.7)',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  textOverlayContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 250,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    pointerEvents: 'none',
  },
  textOverlay: {
    fontWeight: '700',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 4,
  },
  actionsContainer: {
    position: 'absolute',
    bottom: 150,
    left: 16,
    right: 16,
    gap: 12,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 6,
    paddingVertical: 12,
    paddingHorizontal: 12,
    gap: 8,
  },
  actionCardActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  checkIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    // backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconPlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 16,
    // backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  songThumbnail: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary.purple,
    justifyContent: 'center',
    alignItems: 'center',
  },
  aaIcon: {
    fontSize: 14,
    fontWeight: '700',
    color: colors['grey-plain']['50'],
  },
  actionCardText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '500',
    color: colors['grey-plain']['50'],
  },
  proceedContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 20,
    paddingBottom: 40,
    backgroundColor: 'rgba(37, 42, 49, 0.7)',
  },
  proceedButton: {
    backgroundColor: colors.primary.purple,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 28,
  },
  proceedButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors['grey-plain']['50'],
  },
});
