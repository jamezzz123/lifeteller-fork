import React, { useRef, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { VideoPreviewScreen, AddTextScreen } from '@/components/lift-clip';
import { AddSongBottomSheet } from '@/components/lift-clip/AddSongBottomSheet';
import { BottomSheetRef } from '@/components/ui/BottomSheet';

interface Song {
  id: string;
  title: string;
  artist: string;
  duration: string;
  thumbnail: string;
  audioUrl: string;
}

interface TextOverlay {
  text: string;
  style: {
    color: string;
    fontSize: number;
    textAlign: 'left' | 'center' | 'right';
    backgroundColor?: string;
  };
}

export default function PreviewScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const videoUri = params.videoUri as string;
  const linkedLiftName = params.name as string;

  const addSongBottomSheetRef = useRef<BottomSheetRef>(null);
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [showAddText, setShowAddText] = useState(false);
  const [textOverlay, setTextOverlay] = useState<TextOverlay | null>(null);

  const handleClose = () => {
    router.back();
  };

  const handleLinkToExistingLift = () => {
    // Navigate to link-clip, passing current video URI
    router.push({
      pathname: '/lift-clip/link-clip' as any,
      params: { videoUri },
    });
  };

  const handleAddSong = () => {
    addSongBottomSheetRef.current?.expand();
  };

  const handleSongSelect = (song: Song) => {
    setSelectedSong(song);
    addSongBottomSheetRef.current?.close();
  };

  const handleRemoveSong = () => {
    setSelectedSong(null);
    addSongBottomSheetRef.current?.close();
  };

  const handleAddText = () => {
    setShowAddText(true);
  };

  const handleTextDone = (
    text: string,
    style: {
      color: string;
      fontSize: number;
      textAlign: 'left' | 'center' | 'right';
      backgroundColor?: string;
    }
  ) => {
    setTextOverlay({ text, style });
    setShowAddText(false);
  };

  const handleTextClose = () => {
    setShowAddText(false);
  };

  const handleProceed = () => {
    router.push({
      pathname: '/lift-clip/post' as any,
      params: {
        videoUri,
        name: linkedLiftName,
        song: selectedSong ? JSON.stringify(selectedSong) : undefined,
        textOverlay: textOverlay ? JSON.stringify(textOverlay) : undefined,
      },
    });
  };

  if (!videoUri) {
    // If no video URI, go back to selection
    router.replace('/lift-clip' as any);
    return null;
  }

  return (
    <View style={styles.container}>
      {showAddText ? (
        <AddTextScreen
          videoUri={videoUri}
          initialText={textOverlay?.text}
          initialStyle={textOverlay?.style}
          onClose={handleTextClose}
          onDone={handleTextDone}
        />
      ) : (
        <>
          <VideoPreviewScreen
            videoUri={videoUri}
            linkedLiftName={linkedLiftName}
            selectedSong={selectedSong}
            textOverlay={textOverlay}
            onClose={handleClose}
            onLinkToExistingLift={handleLinkToExistingLift}
            onAddSong={handleAddSong}
            onAddText={handleAddText}
            onProceed={handleProceed}
          />
          <AddSongBottomSheet
            ref={addSongBottomSheetRef}
            selectedSongId={selectedSong?.id}
            onSongSelect={handleSongSelect}
            onRemoveSong={handleRemoveSong}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
