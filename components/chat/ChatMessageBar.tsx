import React, { useMemo, useState, useEffect } from 'react';
import { View, TouchableOpacity, TextInput as RNTextInput, Text } from 'react-native';
import {
  Smile,
  Paperclip,
  Camera,
  Mic,
  SendHorizontal,
  Play,
  Pause,
  Trash2,
  X,
} from 'lucide-react-native';
import {
  getRecordingPermissionsAsync,
  RecordingPresets,
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
  useAudioPlayer,
  useAudioPlayerStatus,
  useAudioRecorder,
  useAudioRecorderState,
} from 'expo-audio';
import { colors } from '@/theme/colors';

interface ChatMessageBarProps {
  message: string;
  onChangeMessage: (value: string) => void;
  onSend: () => void;
  onSendAudio?: (payload: { uri: string; duration: number }) => void;
  onOpenAttachments?: () => void;
  onOpenCamera?: () => void;
  onOpenEmoji?: () => void;
  placeholder?: string;
  hasAttachments?: boolean;
}

export function ChatMessageBar({
  message,
  onChangeMessage,
  onSend,
  onSendAudio,
  onOpenAttachments,
  onOpenCamera,
  onOpenEmoji,
  placeholder = 'Start a message...',
  hasAttachments = false,
}: ChatMessageBarProps) {
  const recorder = useAudioRecorder(RecordingPresets.LOW_QUALITY);
  const recorderState = useAudioRecorderState(recorder, 150);
  const [isPreparingRecording, setIsPreparingRecording] = useState(false);
  const [recordingUri, setRecordingUri] = useState<string | null>(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [previewState, setPreviewState] = useState<'idle' | 'playing' | 'paused'>(
    'idle'
  );
  const previewPlayer = useAudioPlayer(recordingUri);
  const previewStatus = useAudioPlayerStatus(previewPlayer);

  const hasMessage = message.trim().length > 0;
  const hasRecording = !!recordingUri;
  const showSend = hasMessage || hasAttachments || hasRecording;

  const waveformHeights = useMemo(
    () => [6, 12, 8, 14, 10, 16, 9, 15, 7, 13, 8, 12],
    []
  );

  useEffect(() => {
    if (hasRecording) return;
    try {
      previewPlayer.pause();
    } catch {
      // Ignore pause errors
    }
    setPreviewState('idle');
  }, [hasRecording, previewPlayer]);

  useEffect(() => {
    if (previewState !== 'playing') return;
    if (!previewStatus.duration) return;
    if (previewStatus.playing) return;
    if (previewStatus.currentTime >= previewStatus.duration - 0.1) {
      setPreviewState('idle');
    }
  }, [
    previewState,
    previewStatus.currentTime,
    previewStatus.duration,
    previewStatus.playing,
  ]);

  useEffect(() => {
    if (!recorderState.isRecording) return;
    setRecordingDuration(Math.floor(recorderState.durationMillis / 1000));
  }, [recorderState.durationMillis, recorderState.isRecording]);

  const formatDuration = (seconds: number) => {
    if (!Number.isFinite(seconds)) return '0:00';
    const total = Math.max(0, Math.round(seconds));
    const mins = Math.floor(total / 60);
    const secs = total % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const ensureRecordingPermissions = async () => {
    const current = await getRecordingPermissionsAsync();
    if (current.granted) return true;
    const requested = await requestRecordingPermissionsAsync();
    return requested.granted;
  };

  const handleStartRecording = async () => {
    if (isPreparingRecording || recorderState.isRecording) return;
    setIsPreparingRecording(true);
    try {
      const granted = await ensureRecordingPermissions();
      if (!granted) {
        alert('Microphone permission is required to record voice notes.');
        return;
      }
      setRecordingUri(null);
      setRecordingDuration(0);
      setPreviewState('idle');
      await setAudioModeAsync({
        allowsRecording: true,
        playsInSilentMode: true,
      });
      await recorder.prepareToRecordAsync();
      recorder.record();
    } catch {
      alert('Unable to start recording right now.');
    } finally {
      setIsPreparingRecording(false);
    }
  };

  const handleStopRecording = async () => {
    try {
      const duration = Math.floor(recorderState.durationMillis / 1000);
      await recorder.stop();
      const uri = recorder.uri;
      if (uri) {
        setRecordingUri(uri);
        setRecordingDuration(Math.max(1, Math.round(duration)));
      }
    } catch {
      // Ignore stop errors
    }
  };

  const handleCancelRecording = async () => {
    try {
      if (recorderState.isRecording) {
        await recorder.stop();
      }
    } catch {
      // Ignore stop errors
    }
    setPreviewState('idle');
    setRecordingUri(null);
    setRecordingDuration(0);
  };

  const handleSendRecording = () => {
    if (!recordingUri) return;
    onSendAudio?.({ uri: recordingUri, duration: recordingDuration });
    try {
      previewPlayer.pause();
    } catch {
      // Ignore pause errors
    }
    setPreviewState('idle');
    setRecordingUri(null);
    setRecordingDuration(0);
  };

  const handleTogglePreviewPlayback = () => {
    if (!recordingUri) return;
    if (previewState === 'playing') {
      previewPlayer.pause();
      setPreviewState('paused');
      return;
    }
    previewPlayer.play();
    setPreviewState('playing');
    if (
      previewStatus.duration &&
      previewStatus.currentTime >= previewStatus.duration - 0.1
    ) {
      previewPlayer.seekTo(0).catch(() => undefined);
    }
  };

  useEffect(() => {
    return () => {
      try {
        recorder.stop();
      } catch {
        // Ignore cleanup errors
      }
    };
  }, [recorder]);

  return (
    <View className="border-t border-grey-plain-150 bg-white px-4 py-3">
      {recorderState.isRecording ? (
        <View className="flex-row items-center gap-3 rounded-3xl bg-grey-plain-50 px-3 py-2">
          <TouchableOpacity
            className="items-center justify-center rounded-full"
            style={{ width: 36, height: 36, backgroundColor: colors['grey-plain']['150'] }}
            onPress={handleCancelRecording}
          >
            <X color={colors['grey-plain']['550']} size={18} />
          </TouchableOpacity>

          <View className="flex-1 flex-row items-center gap-1">
            {waveformHeights.map((height, index) => (
              <View
                key={`record-${index}`}
                style={{
                  width: 3,
                  height,
                  borderRadius: 2,
                  backgroundColor: colors.primary.purple,
                  opacity: index % 2 === 0 ? 0.7 : 1,
                }}
              />
            ))}
          </View>

          <Text className="text-sm text-grey-plain-550">
            {formatDuration(recordingDuration)}
          </Text>

          <TouchableOpacity
            className="items-center justify-center rounded-full"
            style={{ width: 44, height: 44, backgroundColor: colors['grey-plain']['150'] }}
            onPress={handleStopRecording}
          >
            <View
              style={{
                width: 18,
                height: 18,
                borderRadius: 4,
                backgroundColor: colors.state.red,
              }}
            />
          </TouchableOpacity>
        </View>
      ) : hasRecording ? (
        <View className="flex-row items-center gap-3 rounded-3xl bg-grey-plain-50 px-3 py-2">
          <TouchableOpacity
            className="items-center justify-center rounded-full"
            style={{
              width: 36,
              height: 36,
              backgroundColor: colors['grey-alpha']['450'],
            }}
            onPress={handleTogglePreviewPlayback}
          >
            {previewState === 'playing' ? (
              <Pause
                fill={colors['grey-plain']['50']}
                color={colors['grey-plain']['50']}
                size={18}
              />
            ) : (
              <Play
                fill={colors['grey-plain']['50']}
                color={colors['grey-plain']['50']}
                size={18}
              />
            )}
          </TouchableOpacity>

          <View className="flex-1 flex-row items-center gap-1">
            {waveformHeights.map((height, index) => (
              <View
                key={`preview-${index}`}
                style={{
                  width: 3,
                  height,
                  borderRadius: 2,
                  backgroundColor: colors['grey-plain']['300'],
                }}
              />
            ))}
          </View>

          <Text className="text-sm text-grey-plain-550">
            {formatDuration(recordingDuration)}
          </Text>

          <TouchableOpacity
            className="items-center justify-center rounded-full"
            style={{ width: 36, height: 36, backgroundColor: colors['grey-plain']['150'] }}
            onPress={handleCancelRecording}
          >
            <Trash2 color={colors['grey-plain']['550']} size={18} />
          </TouchableOpacity>

          <TouchableOpacity
            className="items-center justify-center rounded-full"
            style={{
              width: 48,
              height: 48,
              backgroundColor: colors.primary.purple,
            }}
            onPress={handleSendRecording}
          >
            <SendHorizontal color={colors['grey-plain']['50']} size={22} />
          </TouchableOpacity>
        </View>
      ) : (
        <View className="flex-row items-start gap-3">
          <TouchableOpacity className="p-1" onPress={onOpenEmoji}>
            <Smile color={colors['grey-plain']['550']} size={24} />
          </TouchableOpacity>

          <View className="flex-1 flex-row items-center rounded-3xl border border-grey-plain-300 bg-grey-plain-50 px-4 py-2">
            <RNTextInput
              value={message}
              onChangeText={onChangeMessage}
              placeholder={placeholder}
              placeholderTextColor={colors['grey-alpha']['400']}
              className="flex-1 text-base text-grey-alpha-500"
              style={{
                fontSize: 16,
                textAlignVertical: 'center',
                paddingVertical: 0,
                minHeight: 20,
              }}
              multiline
              maxLength={500}
            />
          </View>

          <View className="flex flex-row items-center gap-3">
            <TouchableOpacity onPress={onOpenAttachments} className="p-1">
              <Paperclip color={colors['grey-plain']['550']} size={24} />
            </TouchableOpacity>

            <TouchableOpacity onPress={onOpenCamera} className="p-1">
              <Camera color={colors['grey-plain']['550']} size={24} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={showSend ? onSend : handleStartRecording}
              className="items-center justify-center rounded-full"
              style={{
                width: 48,
                height: 48,
                backgroundColor: colors.primary.purple,
              }}
            >
              {showSend ? (
                <SendHorizontal color={colors['grey-plain']['50']} size={24} />
              ) : (
                <Mic color={colors['grey-plain']['50']} size={24} />
              )}
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}
