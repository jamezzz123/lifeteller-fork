import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Image } from 'expo-image';
import { Trash2 } from 'lucide-react-native';
import { colors } from '@/theme/colors';
import { MediaItem } from '@/contexts/LiftDraftContext';

type SelectedMediaPreviewProps = {
  selectedMedia: MediaItem[];
  onRemoveMedia: (id: string) => void;
  onRemoveAll: () => void;
};

export function SelectedMediaPreview({
  selectedMedia,
  onRemoveMedia,
  onRemoveAll,
}: SelectedMediaPreviewProps) {
  if (selectedMedia.length === 0) return null;

  const imageCount = selectedMedia.filter((m) => m.type === 'image').length;
  const videoCount = selectedMedia.filter((m) => m.type === 'video').length;

  const getMediaCountText = () => {
    const parts = [];
    if (imageCount > 0)
      parts.push(`${imageCount} image${imageCount > 1 ? 's' : ''}`);
    if (videoCount > 0)
      parts.push(`${videoCount} video${videoCount > 1 ? 's' : ''}`);
    return parts.join(', ');
  };

  return (
    <View>
      {/* Media Count Header */}
      <View className="mb-4 flex-row items-center justify-between">
        <Text className="text-sm text-grey-alpha-400">
          {getMediaCountText()}
        </Text>
        <TouchableOpacity onPress={onRemoveAll} hitSlop={10}>
          <Trash2 size={20} color={colors.state.red} strokeWidth={2} />
        </TouchableOpacity>
      </View>

      {/* Media Grid */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mb-4"
        contentContainerStyle={{ gap: 8 }}
      >
        {selectedMedia.map((item) => (
          <View key={item.id} className="relative">
            <Image
              source={{ uri: item.uri }}
              style={{ width: 100, height: 100, borderRadius: 8 }}
              contentFit="cover"
            />
            <TouchableOpacity
              onPress={() => onRemoveMedia(item.id)}
              className="absolute right-1 top-1 rounded-full bg-black/60 p-1"
            >
              <Trash2 size={14} color="white" strokeWidth={2} />
            </TouchableOpacity>
            {item.type === 'video' && (
              <View className="absolute bottom-1 left-1 rounded bg-black/60 px-1.5 py-0.5">
                <Text className="text-xs text-white">Video</Text>
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
