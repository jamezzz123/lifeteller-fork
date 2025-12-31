import React, { forwardRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  FlatList,
  Image,
} from 'react-native';
import {
  X,
  Search,
  Trash2,
  Play,
  ChevronRight,
  Check,
} from 'lucide-react-native';
import { colors } from '@/theme/colors';
import {
  BottomSheetComponent,
  BottomSheetRef,
} from '@/components/ui/BottomSheet';
import { FilterTabs, FilterTab } from '@/components/ui/FilterTabs';

interface Song {
  id: string;
  title: string;
  artist: string;
  duration: string;
  thumbnail: string;
}

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
  },
  {
    id: '2',
    title: 'Achalugo',
    artist: 'Ugoccie',
    duration: '2:09',
    thumbnail: 'https://i.pravatar.cc/100?img=2',
  },
  {
    id: '3',
    title: 'Achalugo',
    artist: 'Ugoccie',
    duration: '2:09',
    thumbnail: 'https://i.pravatar.cc/100?img=3',
  },
  {
    id: '4',
    title: 'Achalugo',
    artist: 'Ugoccie',
    duration: '2:09',
    thumbnail: 'https://i.pravatar.cc/100?img=4',
  },
  {
    id: '5',
    title: 'Achalugo',
    artist: 'Ugoccie',
    duration: '2:09',
    thumbnail: 'https://i.pravatar.cc/100?img=5',
  },
];

export const AddSongBottomSheet = forwardRef<
  BottomSheetRef,
  AddSongBottomSheetProps
>(({ selectedSongId, onSongSelect, onRemoveSong }, ref) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const filters: FilterTab[] = [
    { id: 'all', label: 'All' },
    { id: 'popular', label: 'Popular' },
    { id: 'recently-used', label: 'Recently used' },
  ];

  const renderSongItem = ({ item }: { item: Song }) => {
    const isSelected = item.id === selectedSongId;

    return (
      <TouchableOpacity
        style={styles.songItem}
        onPress={() => onSongSelect(item)}
      >
        {/* Thumbnail with play icon */}
        <View style={styles.thumbnailContainer}>
          <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
          <View style={styles.playIconOverlay}>
            <Play size={16} color={colors['grey-plain']['50']} fill="white" />
          </View>
        </View>

        {/* Song info */}
        <View style={styles.songInfo}>
          <Text style={styles.songTitle}>{item.title}</Text>
          <Text style={styles.songDetails}>
            {item.artist} · {item.duration}
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
          <TextInput
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
          <TouchableOpacity style={styles.removeButton} onPress={onRemoveSong}>
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
