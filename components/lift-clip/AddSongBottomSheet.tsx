import React, { forwardRef, useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
} from 'react-native';
import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import {
  X,
  Search,
  Trash2,
  Play,
  Pause,
  ChevronRight,
  Check,
} from 'lucide-react-native';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { colors } from '@/theme/colors';
import {
  BottomSheetComponent,
  BottomSheetRef,
} from '@/components/ui/BottomSheet';
import { FilterTabs, FilterTab } from '@/components/ui/FilterTabs';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';

interface Song {
  id: string;
  title: string;
  artist: string;
  duration: string;
  thumbnail: string;
  audioUrl: string;
}

// Sample audio URL for demo purposes
const SAMPLE_AUDIO_URL =
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';

interface AddSongBottomSheetProps {
  selectedSongId?: string;
  onSongSelect: (song: Song) => void;
  onRemoveSong: () => void;
}

// Mock songs data
const MOCK_SONGS: Song[] = [
  {
    id: '1',
    title: 'Achalugo',
    artist: 'Ugoccie',
    duration: '2:09',
    thumbnail: 'https://i.pravatar.cc/100?img=1',
    audioUrl: SAMPLE_AUDIO_URL,
  },
  {
    id: '2',
    title: 'Achalugo',
    artist: 'Ugoccie',
    duration: '2:09',
    thumbnail: 'https://i.pravatar.cc/100?img=2',
    audioUrl: SAMPLE_AUDIO_URL,
  },
  {
    id: '3',
    title: 'Achalugo',
    artist: 'Ugoccie',
    duration: '2:09',
    thumbnail: 'https://i.pravatar.cc/100?img=3',
    audioUrl: SAMPLE_AUDIO_URL,
  },
  {
    id: '4',
    title: 'Achalugo',
    artist: 'Ugoccie',
    duration: '2:09',
    thumbnail: 'https://i.pravatar.cc/100?img=4',
    audioUrl: SAMPLE_AUDIO_URL,
  },
  {
    id: '5',
    title: 'Achalugo',
    artist: 'Ugoccie',
    duration: '2:09',
    thumbnail: 'https://i.pravatar.cc/100?img=5',
    audioUrl: SAMPLE_AUDIO_URL,
  },
];

export const AddSongBottomSheet = forwardRef<
  BottomSheetRef,
  AddSongBottomSheetProps
>(({ selectedSongId, onSongSelect, onRemoveSong }, ref) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [previewingSongId, setPreviewingSongId] = useState<string | null>(null);
  const [currentAudioUrl, setCurrentAudioUrl] = useState<string | null>(null);
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);

  // Create audio player using expo-audio - always use the sample URL initially
  // The player needs a valid source to be properly initialized
  const audioPlayer = useAudioPlayer(currentAudioUrl || SAMPLE_AUDIO_URL);
  const playerStatus = useAudioPlayerStatus(audioPlayer);

  // Handle playback end - reset preview state when song finishes
  useEffect(() => {
    if (playerStatus.playing === false && previewingSongId && currentAudioUrl) {
      // Check if playback finished (not just paused)
      if (playerStatus.currentTime > 0 && playerStatus.duration && playerStatus.currentTime >= playerStatus.duration - 0.5) {
        setPreviewingSongId(null);
        setCurrentAudioUrl(null);
      }
    }
  }, [playerStatus.playing, playerStatus.currentTime, playerStatus.duration, previewingSongId, currentAudioUrl]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      try {
        audioPlayer?.pause();
      } catch {
        // Ignore errors during cleanup
      }
    };
  }, [audioPlayer]);

  const handlePreviewSong = useCallback(
    (song: Song) => {
      // If already previewing this song, stop it
      if (previewingSongId === song.id) {
        try {
          audioPlayer.pause();
        } catch {
          // Ignore pause errors
        }
        setPreviewingSongId(null);
        setCurrentAudioUrl(null);
        return;
      }

      // Stop any current preview
      try {
        audioPlayer.pause();
      } catch {
        // Ignore pause errors
      }

      // Start previewing new song
      setPreviewingSongId(song.id);
      setCurrentAudioUrl(song.audioUrl);
    },
    [audioPlayer, previewingSongId]
  );

  // Play audio when URL changes
  useEffect(() => {
    if (currentAudioUrl && previewingSongId) {
      // Small delay to let the player load the new source
      const timer = setTimeout(() => {
        try {
          audioPlayer.play();
        } catch {
          // Ignore play errors
        }
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [currentAudioUrl, previewingSongId, audioPlayer]);

  const handleRemoveSong = () => {
    setShowRemoveDialog(true);
  };

  const handleConfirmRemove = () => {
    setShowRemoveDialog(false);
    onRemoveSong();
  };

  const filters: FilterTab[] = [
    { id: 'all', label: 'All' },
    { id: 'popular', label: 'Popular' },
    { id: 'recently-used', label: 'Recently used' },
  ];

  const renderSongItem = ({ item }: { item: Song }) => {
    const isSelected = item.id === selectedSongId;
    const isPreviewing = item.id === previewingSongId;

    return (
      <TouchableOpacity
        style={styles.songItem}
        onPress={() => onSongSelect(item)}
      >
        {/* Thumbnail with play/pause icon - tappable for preview */}
        <TouchableOpacity
          style={styles.thumbnailContainer}
          onPress={() => handlePreviewSong(item)}
          activeOpacity={0.7}
        >
          <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
          <View
            style={[
              styles.playIconOverlay,
              isPreviewing && styles.playIconOverlayActive,
            ]}
          >
            {isPreviewing ? (
              <Pause size={16} color={colors['grey-plain']['50']} fill="white" />
            ) : (
              <Play size={16} color={colors['grey-plain']['50']} fill="white" />
            )}
          </View>
        </TouchableOpacity>

        {/* Song info */}
        <View style={styles.songInfo}>
          <Text style={styles.songTitle}>{item.title}</Text>
          <Text style={styles.songDetails}>
            {item.artist} · {item.duration}
            {isPreviewing && ' • Playing...'}
          </Text>
        </View>

        {/* Right icon - checkmark or chevron */}
        {isSelected ? (
          <View style={styles.checkmarkContainer}>
            <Check size={24} color={colors.primary.purple} />
          </View>
        ) : (
          <ChevronRight size={24} color={colors['grey-alpha']['400']} />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <BottomSheetComponent ref={ref}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Add song</Text>
          <TouchableOpacity
            onPress={() => {
              if (ref && typeof ref !== 'function' && ref.current) {
                ref.current.close();
              }
            }}
            style={styles.closeButton}
          >
            <X size={24} color={colors['grey-alpha']['550']} />
          </TouchableOpacity>
        </View>

        {/* Search bar */}
        <View style={styles.searchContainer}>
          <Search size={20} color={colors['grey-alpha']['400']} />
          <BottomSheetTextInput
            style={styles.searchInput}
            placeholder="Search songs"
            placeholderTextColor={colors['grey-alpha']['400']}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Filter tabs */}
        <FilterTabs
          filters={filters}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          showCounts={false}
          scrollable={false}
          contentContainerClassName="px-6 pb-4"
        />

        {/* Remove song option */}
        {selectedSongId && (
          <TouchableOpacity style={styles.removeButton} onPress={handleRemoveSong}>
            <Trash2 size={20} color={colors.state.red} />
            <Text style={styles.removeText}>Remove song</Text>
          </TouchableOpacity>
        )}

        {/* Songs list */}
        <FlatList
          data={MOCK_SONGS}
          keyExtractor={(item) => item.id}
          renderItem={renderSongItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      </View>

      {/* Remove Song Confirmation Dialog */}
      <ConfirmDialog
        visible={showRemoveDialog}
        title="Remove song"
        message="Are you sure you want to remove this song from this lift clip?"
        cancelText="Cancel"
        confirmText="Yes, remove"
        onCancel={() => setShowRemoveDialog(false)}
        onConfirm={handleConfirmRemove}
      />
    </BottomSheetComponent>
  );
});

AddSongBottomSheet.displayName = 'AddSongBottomSheet';

const styles = StyleSheet.create({
  container: {
    paddingBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors['grey-alpha']['550'],
  },
  closeButton: {
    padding: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors['grey-alpha']['100'],
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 24,
    marginBottom: 16,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors['grey-alpha']['550'],
  },
  removeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
    marginBottom: 8,
  },
  removeText: {
    fontSize: 16,
    color: colors.state.red,
  },
  listContent: {
    paddingHorizontal: 24,
  },
  songItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  thumbnailContainer: {
    position: 'relative',
    width: 48,
    height: 48,
    borderRadius: 8,
    overflow: 'hidden',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  playIconOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIconOverlayActive: {
    backgroundColor: 'rgba(139, 92, 246, 0.6)',
  },
  songInfo: {
    flex: 1,
  },
  songTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors['grey-alpha']['550'],
    marginBottom: 4,
  },
  songDetails: {
    fontSize: 14,
    color: colors['grey-alpha']['400'],
  },
  checkmarkContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors['grey-alpha']['100'],
    justifyContent: 'center',
    alignItems: 'center',
  },
});
