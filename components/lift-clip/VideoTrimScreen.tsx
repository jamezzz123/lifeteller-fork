import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  PanResponder,
} from 'react-native';
import { VideoView, useVideoPlayer } from 'expo-video';
import { X } from 'lucide-react-native';
import { colors } from '@/theme/colors';
import { Button } from '../ui/Button';

interface VideoTrimScreenProps {
  videoUri: string;
  videoDuration: number; // in seconds
  onClose: () => void;
  onDone: (startTime: number, endTime: number) => void;
}

const SCREEN_WIDTH = Dimensions.get('window').width;
const TIMELINE_PADDING = 24;
const TIMELINE_WIDTH = SCREEN_WIDTH - TIMELINE_PADDING * 2;
const HANDLE_WIDTH = 16;
const MIN_DURATION = 1; // minimum 1 second

export function VideoTrimScreen({
  videoUri,
  videoDuration,
  onClose,
  onDone,
}: VideoTrimScreenProps) {
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(videoDuration);
  const [currentTime, setCurrentTime] = useState(0);

  const player = useVideoPlayer(videoUri, (player) => {
    player.loop = true;
    player.volume = 1.0;
    player.play();
  });

  // Update current time from player
  useEffect(() => {
    const interval = setInterval(() => {
      if (player.currentTime !== undefined) {
        setCurrentTime(player.currentTime);
        // Loop within trim range
        if (player.currentTime >= endTime) {
          player.currentTime = startTime;
        }
      }
    }, 100);
    return () => clearInterval(interval);
  }, [player, startTime, endTime]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const timeToPosition = useCallback(
    (time: number) => {
      return (time / videoDuration) * TIMELINE_WIDTH;
    },
    [videoDuration]
  );

  const positionToTime = useCallback(
    (position: number) => {
      return Math.max(0, Math.min(videoDuration, (position / TIMELINE_WIDTH) * videoDuration));
    },
    [videoDuration]
  );

  const handleStartPan = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gestureState) => {
      const newPosition = Math.max(0, gestureState.moveX - TIMELINE_PADDING);
      const newTime = positionToTime(newPosition);
      if (newTime < endTime - MIN_DURATION) {
        setStartTime(newTime);
        player.currentTime = newTime;
      }
    },
  });

  const handleEndPan = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gestureState) => {
      const newPosition = Math.max(0, gestureState.moveX - TIMELINE_PADDING);
      const newTime = positionToTime(newPosition);
      if (newTime > startTime + MIN_DURATION && newTime <= videoDuration) {
        setEndTime(newTime);
      }
    },
  });

  const handleDone = () => {
    onDone(startTime, endTime);
  };

  // Generate waveform bars (simulated)
  const waveformBars = Array.from({ length: 50 }, (_, i) => ({
    height: 10 + Math.random() * 30,
    isInRange:
      (i / 50) * videoDuration >= startTime && (i / 50) * videoDuration <= endTime,
  }));

  return (
    <View style={styles.container}>
      {/* Video Player */}
      <VideoView
        player={player}
        style={styles.video}
        contentFit="cover"
        nativeControls={false}
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <X size={24} color={colors['grey-plain']['50']} />
        </TouchableOpacity>
        <View style={styles.doneButtonContainer}>
          <Button title="Done" onPress={handleDone} size="small" />
        </View>
      </View>

      {/* Time Display */}
      <View style={styles.timeDisplay}>
        <Text style={styles.timeText}>
          {formatTime(currentTime)} / {formatTime(videoDuration)}
        </Text>
      </View>

      {/* Timeline / Waveform */}
      <View style={styles.timelineContainer}>
        {/* Waveform */}
        <View style={styles.waveform}>
          {waveformBars.map((bar, index) => (
            <View
              key={index}
              style={[
                styles.waveformBar,
                {
                  height: bar.height,
                  backgroundColor: bar.isInRange
                    ? colors.primary.purple
                    : colors['grey-alpha']['400'],
                },
              ]}
            />
          ))}
        </View>

        {/* Selected Range Overlay */}
        <View
          style={[
            styles.selectedRange,
            {
              left: timeToPosition(startTime),
              width: timeToPosition(endTime) - timeToPosition(startTime),
            },
          ]}
        />

        {/* Start Handle */}
        <View
          {...handleStartPan.panHandlers}
          style={[
            styles.handle,
            styles.handleLeft,
            { left: timeToPosition(startTime) - HANDLE_WIDTH / 2 },
          ]}
        >
          <View style={styles.handleBar} />
        </View>

        {/* End Handle */}
        <View
          {...handleEndPan.panHandlers}
          style={[
            styles.handle,
            styles.handleRight,
            { left: timeToPosition(endTime) - HANDLE_WIDTH / 2 },
          ]}
        >
          <View style={styles.handleBar} />
        </View>

        {/* Playhead */}
        <View
          style={[
            styles.playhead,
            { left: timeToPosition(Math.min(currentTime, endTime)) },
          ]}
        />
      </View>

      {/* Trim Duration */}
      <View style={styles.trimInfo}>
        <Text style={styles.trimInfoText}>
          Selected: {formatTime(endTime - startTime)}
        </Text>
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
    flex: 1,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: 'rgba(37, 42, 49, 0.7)',
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  doneButtonContainer: {
    width: 80,
  },
  timeDisplay: {
    position: 'absolute',
    top: 120,
    right: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  timeText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors['grey-plain']['50'],
  },
  timelineContainer: {
    position: 'absolute',
    bottom: 100,
    left: TIMELINE_PADDING,
    right: TIMELINE_PADDING,
    height: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 12,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  waveform: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 40,
    paddingHorizontal: 8,
  },
  waveformBar: {
    width: 3,
    borderRadius: 2,
  },
  selectedRange: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    borderWidth: 2,
    borderColor: colors.primary.purple,
    borderRadius: 8,
  },
  handle: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: HANDLE_WIDTH,
    backgroundColor: colors.primary.purple,
    justifyContent: 'center',
    alignItems: 'center',
  },
  handleLeft: {
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  handleRight: {
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  handleBar: {
    width: 4,
    height: 20,
    backgroundColor: colors['grey-plain']['50'],
    borderRadius: 2,
  },
  playhead: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: colors['grey-plain']['50'],
  },
  trimInfo: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  trimInfoText: {
    fontSize: 14,
    color: colors['grey-plain']['50'],
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
});
