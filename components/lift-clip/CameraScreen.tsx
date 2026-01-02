import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { X, Zap, Image, RotateCw } from 'lucide-react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { colors } from '@/theme/colors';

interface CameraScreenProps {
  onClose: () => void;
  onVideoRecorded: (videoUri: string) => void;
}

export function CameraScreen({ onClose, onVideoRecorded }: CameraScreenProps) {
  const [facing, setFacing] = useState<CameraType>('back');
  const [isRecording, setIsRecording] = useState(false);
  const [flash, setFlash] = useState<'off' | 'on'>('off');
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionText}>
            We need your permission to access the camera
          </Text>
          <TouchableOpacity
            onPress={requestPermission}
            style={styles.permissionButton}
          >
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const toggleCameraFacing = () => {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  };

  const toggleFlash = () => {
    setFlash((current) => (current === 'off' ? 'on' : 'off'));
  };

  const handleRecordPress = async () => {
    if (!cameraRef.current) return;

    if (isRecording) {
      // Stop recording
      cameraRef.current.stopRecording();
      setIsRecording(false);
    } else {
      // Start recording
      try {
        setIsRecording(true);
        const video = await cameraRef.current.recordAsync({
          maxDuration: 60, // 60 seconds max
        });

        if (video?.uri) {
          onVideoRecorded(video.uri);
        }
      } catch (error) {
        console.error('Recording error:', error);
        Alert.alert('Error', 'Failed to record video');
        setIsRecording(false);
      }
    }
  };

  const handleOpenGallery = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Gallery permission is required to select videos'
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['videos'],
        allowsEditing: false,
        quality: 1,
        videoMaxDuration: 60,
      });

      if (!result.canceled && result.assets[0]) {
        onVideoRecorded(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Gallery error:', error);
      Alert.alert('Error', 'Failed to open gallery');
    }
  };
  return (
    <View style={styles.container}>
      {/* Live Camera View */}
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing={facing}
        enableTorch={flash === 'on'}
        mode="video"
      >
        {/* Header */}
        <View style={styles.header}>
          <View className="flex-row items-center gap-2">
            <TouchableOpacity onPress={onClose} style={styles.headerButton}>
              <X size={16} color={colors['grey-plain']['50']} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Lift Clip</Text>
          </View>
          <TouchableOpacity onPress={toggleFlash} style={styles.headerButton}>
            <Zap
              size={16}
              color={
                flash === 'on'
                  ? colors.primary.purple
                  : colors['grey-plain']['50']
              }
            />
          </TouchableOpacity>
        </View>

        {/* Bottom Controls */}
        <View style={styles.controls}>
          {/* Gallery Button */}
          <TouchableOpacity
            onPress={handleOpenGallery}
            style={styles.galleryButton}
            disabled={isRecording}
          >
            <Image size={28} color={colors['grey-plain']['50']} />
            <Text style={styles.galleryText}>Gallery</Text>
          </TouchableOpacity>

          {/* Record Button */}
          <TouchableOpacity
            onPress={handleRecordPress}
            style={styles.recordButton}
          >
            <View
              style={[
                styles.recordButtonInner,
                isRecording && styles.recordButtonRecording,
              ]}
            />
          </TouchableOpacity>

          {/* Flip Camera Button */}
          <TouchableOpacity
            onPress={toggleCameraFacing}
            style={styles.flipButton}
            disabled={isRecording}
          >
            <RotateCw size={32} color={colors['grey-plain']['50']} />
          </TouchableOpacity>
        </View>

        {/* Record Text */}
        {/* <Text style={styles.recordText}>
          {isRecording ? 'Recording...' : 'Hold to record'}
        </Text> */}
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent ',
  },
  camera: {
    flex: 1,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  permissionText: {
    fontSize: 16,
    color: colors['grey-alpha']['400'],
    textAlign: 'center',
    marginBottom: 24,
  },
  permissionButton: {
    backgroundColor: colors.primary.purple,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  permissionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors['grey-plain']['50'],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: 'rgba(37, 42, 49, 0.7)',
  },
  headerButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors['grey-plain']['50'],
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 25,
    paddingVertical: 25,
    backgroundColor: 'rgba(37, 42, 49, 0.7)',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  galleryButton: {
    alignItems: 'center',
    gap: 4,
  },
  galleryText: {
    fontSize: 12,
    color: colors['grey-plain']['50'],
    marginTop: 4,
  },
  recordButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors['grey-plain']['50'],
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: colors['grey-plain']['300'],
  },
  recordButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.state.red,
  },
  recordButtonRecording: {
    borderRadius: 8,
    width: 40,
    height: 40,
  },
  flipButton: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordText: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 14,
    color: colors['grey-plain']['300'],
    paddingBottom: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});
