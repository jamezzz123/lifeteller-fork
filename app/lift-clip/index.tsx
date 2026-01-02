import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { CameraScreen } from '@/components/lift-clip';

export default function LiftClipScreen() {
  const router = useRouter();

  const handleClose = () => {
    router.back();
  };

  const handleVideoSelected = (videoUri: string) => {
    // Navigate to preview screen with video URI
    router.push({
      pathname: '/lift-clip/preview' as any,
      params: { videoUri },
    });
  };

  return (
    <View style={styles.container}>
      <CameraScreen onClose={handleClose} onVideoRecorded={handleVideoSelected} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
