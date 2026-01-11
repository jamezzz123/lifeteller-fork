import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { X, Music, Type, HandHelping } from 'lucide-react-native';
import { VideoView, useVideoPlayer } from 'expo-video';
import { colors } from '@/theme/colors';
import { Button } from '../ui/Button';
import { BlurView } from 'expo-blur';

interface TextOverlay {
  text: string;
  style: {
    color: string;
    fontSize: number;
    textAlign: 'left' | 'center' | 'right';
    backgroundColor?: string;
  };
}

interface VideoPreviewScreenProps {
  videoUri: string;
  linkedLiftName?: string;
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
  textOverlay,
  onClose,
  onLinkToExistingLift,
  onAddSong,
  onAddText,
  onProceed,
}: VideoPreviewScreenProps) {
  const player = useVideoPlayer(videoUri, (player) => {
    player.loop = true;
    player.volume = 1.0;
    player.play();
  });

  useEffect(() => {
    // Auto-play video when URI changes
    player.play();
  }, [videoUri, player]);
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

      {/* Info Text */}
      {/* <View style={styles.infoContainer}>
        <Text style={styles.infoText}>Video starts playing upon selection</Text>
      </View> */}

      {/* Linked Lift Display (if lift is linked) */}
      {linkedLiftName && (
        <View style={styles.linkedLiftContainer}>
          <TouchableOpacity
            onPress={onLinkToExistingLift}
            style={styles.linkedLiftButton}
          >
            <Text style={styles.linkedLiftText}>
              ✓ Linked lift - {linkedLiftName}
            </Text>
            <Text style={styles.linkedLiftSubtext}>Tap to change</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        {!linkedLiftName && (
          <BlurView intensity={10}>
            <TouchableOpacity
              onPress={onLinkToExistingLift}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                flex: 1,
                padding: 8,
                borderRadius: 8,
              }}
            >
              <HandHelping
                size={18}
                color={colors['grey-plain']['50']}
              ></HandHelping>
              <Text style={styles.actionText}>Link to existing lift</Text>
            </TouchableOpacity>
          </BlurView>
        )}

        <BlurView intensity={10}>
          <TouchableOpacity
            onPress={onAddSong}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              flex: 1,
              padding: 8,
              borderRadius: 8,
            }}
          >
            <Music size={18} color={colors['grey-plain']['50']}></Music>
            <Text style={styles.actionText}>Add song</Text>
          </TouchableOpacity>
        </BlurView>

        <BlurView intensity={10}>
          <TouchableOpacity
            onPress={onAddText}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              flex: 1,
              padding: 8,
              borderRadius: 8,
            }}
          >
            <Type size={18} color={colors['grey-plain']['50']}></Type>
            <Text style={styles.actionText}>
              {textOverlay ? 'Edit Text' : 'Add Text'}
            </Text>
          </TouchableOpacity>
        </BlurView>
      </View>

      {/* Proceed Button */}
      <View className="flex items-end" style={styles.proceedContainer}>
        <View className="w-1/2">
          <Button title="Proceed" onPress={onProceed}></Button>
        </View>
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
  infoContainer: {
    position: 'absolute',
    bottom: 200,
    left: 0,
    right: 0,
    paddingVertical: 16,
    paddingHorizontal: 24,
    backgroundColor: 'rgba(37, 42, 49, 0.7)',
  },
  infoText: {
    fontSize: 14,
    color: colors['grey-plain']['300'],
    textAlign: 'center',
  },
  actionsContainer: {
    position: 'absolute',
    bottom: 140,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    paddingVertical: 20,
    // backgroundColor: 'rgba(37, 42, 49, 0.7)',
  },
  actionButton: {
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(37, 42, 49, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionText: {
    fontSize: 12,
    color: colors['grey-plain']['50'],
    textAlign: 'center',
  },
  proceedContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingVertical: 24,
    paddingBottom: 40,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  proceedButton: {
    backgroundColor: colors.primary.purple,
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 24,
    alignItems: 'center',
    alignSelf: 'center',
    minWidth: 200,
  },
  proceedText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors['grey-plain']['50'],
  },
  linkedLiftContainer: {
    position: 'absolute',
    bottom: 220,
    left: 16,
    right: 16,
    zIndex: 2,
  },
  linkedLiftButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  linkedLiftText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors['grey-plain']['50'],
    marginBottom: 4,
  },
  linkedLiftSubtext: {
    fontSize: 11,
    color: colors['grey-plain']['300'],
  },
  textOverlayContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    pointerEvents: 'none',
  },
  textOverlay: {
    fontWeight: '700',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
});
