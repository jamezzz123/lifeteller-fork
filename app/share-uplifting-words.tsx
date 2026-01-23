import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Modal,
  FlatList,
  Dimensions,
  ScrollView,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import {
  X,
  ChevronDown,
  SmilePlus,
  AtSign,
  Trash2,
  Pencil,
  Plus,
} from 'lucide-react-native';
import { colors } from '@/theme/colors';
import { useAuth } from '@/context/auth';
import { getInitials, getFullName } from '@/utils/user';
import { AudienceBottomSheet, AudienceOption } from '@/components/lift';
import { BottomSheetRef } from '@/components/ui/BottomSheet';
import { CancelBottomSheet } from '@/components/lift/CancelBottomSheet';
import { Button } from '@/components/ui/Button';
import {
  MediaSelectionScreen,
  MediaItem,
} from '@/components/chat/MediaSelectionScreen';
import ImageUploadIcon from '@/assets/images/image-upload.svg';

export default function ShareUpliftingWordsScreen() {
  const { user } = useAuth();
  const [postText, setPostText] = useState('');
  const [audienceKey, setAudienceKey] = useState('public');
  const audienceSheetRef = useRef<BottomSheetRef>(null);
  const [showMediaSelection, setShowMediaSelection] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<MediaItem[]>([]);
  const [showMediaPreview, setShowMediaPreview] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);
  const previewListRef = useRef<FlatList<MediaItem>>(null);
  const [showCancelSheet, setShowCancelSheet] = useState(false);
  const { width } = Dimensions.get('window');
  const previewItemSize = (width - 32 - 16 - 24) / 3;
  const insets = useSafeAreaInsets();

  const fullName = useMemo(
    () => (user ? getFullName(user.first_name, user.last_name) : ''),
    [user]
  );
  const initials = getInitials(fullName);
  const avatarUrl = user?.avatar_url;
  const hasSelectedMedia = selectedMedia.length > 0;
  const audienceOptions: AudienceOption[] = [
    {
      key: 'public',
      label: 'Public',
      description: 'All users on or off Lifteller',
    },
    {
      key: 'friends',
      label: 'Friends (1.7k)',
      description: 'Your connections on Lifteller',
    },
    {
      key: 'selected-people',
      label: 'Selected people',
      description: 'Who can see my lift bottom sheet',
    },
    {
      key: 'my-list',
      label: 'My list',
      description:
        'Choose from existing list or create a new one of people who can interact with your post.',
    },
    {
      key: 'friends-except',
      label: 'Friends except',
      description: "Don’t show to some connections",
    },
    {
      key: 'private',
      label: 'Private',
      description: 'You can still share your post link with others.',
    },
  ];
  const selectedAudienceLabel =
    audienceOptions.find((option) => option.key === audienceKey)?.label ??
    'Public';

  function handleClose() {
    setShowCancelSheet(true);
  }

  function handleOpenMediaSelection() {
    setShowMediaSelection(true);
  }

  function handleProceedMedia(media: MediaItem[]) {
    setSelectedMedia(media);
    setShowMediaSelection(false);
    if (media.length > 0) {
      setPreviewIndex(0);
      setShowMediaPreview(true);
    }
  }

  function handleNext() {
    router.replace('/(tabs)');
  }

  function handleSaveDraft() {
    // TODO: persist draft
    router.replace('/(tabs)');
  }

  function handleDiscard() {
    // TODO: clear draft
    router.replace('/(tabs)');
  }

  function handleContinueEditing() {
    setShowCancelSheet(false);
  }

  function handleOpenAudience() {
    audienceSheetRef.current?.expand();
  }

  function handleSelectAudience(key: string) {
    setAudienceKey(key);
    audienceSheetRef.current?.close();
  }

  function handleOpenPreview(index = 0) {
    setPreviewIndex(index);
    setShowMediaPreview(true);
  }

  function handleRemoveCurrentMedia() {
    setSelectedMedia((prev) => {
      if (prev.length === 0) return prev;
      const next = prev.filter((_, index) => index !== previewIndex);
      if (next.length === 0) {
        setShowMediaPreview(false);
        return next;
      }
      const nextIndex = Math.min(previewIndex, next.length - 1);
      setPreviewIndex(nextIndex);
      return next;
    });
  }

  function handleRemoveAllMedia() {
    setSelectedMedia([]);
    setShowMediaPreview(false);
  }

  function handleAddMoreMedia() {
    setShowMediaPreview(false);
    setShowMediaSelection(true);
  }

  useEffect(() => {
    if (!showMediaPreview) return;
    if (!previewListRef.current || selectedMedia.length === 0) return;
    previewListRef.current.scrollToIndex({
      index: previewIndex,
      animated: false,
    });
  }, [showMediaPreview, previewIndex, selectedMedia.length]);

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Header */}
        <View className="flex-row items-center justify-between border-b border-grey-plain-150 px-4 py-3">
          <View className="flex-row items-center gap-3">
            <TouchableOpacity onPress={handleClose} className="p-1">
              <X color={colors['grey-plain']['550']} size={22} strokeWidth={2} />
            </TouchableOpacity>
            <Text className="text-[17px] font-semibold text-grey-alpha-500">
              Share uplifting words
            </Text>
          </View>
          <TouchableOpacity
            className="rounded-full px-4 py-2"
            style={{ backgroundColor: colors.primary.purple }}
            onPress={handleNext}
            activeOpacity={0.8}
          >
            <Text className="text-sm font-semibold text-white">Next</Text>
          </TouchableOpacity>
        </View>

        <View className="flex-1">
          {/* User + Audience */}
          <View className="flex-row items-center gap-3 px-4 py-4">
            <View className="size-10 overflow-hidden rounded-full bg-grey-plain-300">
              {avatarUrl ? (
                <Image
                  source={{ uri: avatarUrl }}
                  style={{ width: 40, height: 40, borderRadius: 20 }}
                  contentFit="cover"
                />
              ) : initials ? (
                <View
                  className="h-full w-full items-center justify-center"
                  style={{
                    backgroundColor: colors['primary-tints'].purple['100'],
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: 'bold',
                      color: colors.primary.purple,
                    }}
                  >
                    {initials}
                  </Text>
                </View>
              ) : (
                <View
                  className="h-full w-full"
                  style={{ backgroundColor: colors['grey-plain']['450'] }}
                />
              )}
            </View>

            <TouchableOpacity
              className="flex-row items-center gap-2 rounded-full border bg-white px-4 py-2"
              style={{ borderColor: colors.primary.purple }}
              activeOpacity={0.8}
              onPress={handleOpenAudience}
            >
              <Text
                className="text-[14px] font-medium"
                style={{ color: colors.primary.purple }}
              >
                {selectedAudienceLabel}
              </Text>
              <ChevronDown
                size={16}
                color={colors.primary.purple}
                strokeWidth={2}
              />
            </TouchableOpacity>
          </View>

          {/* Text Input */}
          <View className="flex-row gap-3 px-4">
            <TextInput
              value={postText}
              onChangeText={setPostText}
              placeholder="What is on your mind?"
              placeholderTextColor={colors['grey-plain']['400']}
              className="flex-1 text-[16px] text-grey-alpha-500"
              multiline
              style={{ minHeight: 120, textAlignVertical: 'top' }}
            />
          </View>

          {hasSelectedMedia && (
            <View className="mt-4 px-4">
              <View className="flex-row items-center justify-end gap-3">
                <TouchableOpacity
                  onPress={() => handleOpenPreview(0)}
                  className="items-center justify-center rounded-full bg-grey-plain-100 p-2"
                  activeOpacity={0.7}
                >
                  <Pencil size={18} color={colors['grey-alpha']['500']} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleRemoveAllMedia}
                  className="items-center justify-center rounded-full bg-grey-plain-100 p-2"
                  activeOpacity={0.7}
                >
                  <Trash2 size={18} color={colors.state.red} />
                </TouchableOpacity>
              </View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="mt-3"
                contentContainerStyle={{ paddingRight: 0 }}
              >
                {selectedMedia.map((item, index) => (
                  <TouchableOpacity
                    key={item.id}
                    onPress={() => handleOpenPreview(index)}
                    activeOpacity={0.8}
                    style={{
                      marginRight:
                        index === selectedMedia.length - 1 ? 0 : 8,
                      width: previewItemSize,
                      height: previewItemSize,
                      borderRadius: 12,
                      overflow: 'hidden',
                    }}
                  >
                    <Image
                      source={{ uri: item.uri }}
                      style={{ width: '100%', height: '100%' }}
                      contentFit="cover"
                    />
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>

        {/* Bottom Actions */}
        <View className="border-t border-grey-plain-150 bg-grey-alpha-100 px-4 py-6">
          <View className="flex-row items-center justify-between">
            <TouchableOpacity
              className="flex-row items-center gap-3"
              onPress={handleOpenMediaSelection}
              activeOpacity={0.7}
            >
              <ImageUploadIcon width={22} height={22} />
              <Text className="text-[15px] font-medium text-grey-alpha-500">
                Add Photos/Videos
              </Text>
            </TouchableOpacity>

            <View className="flex-row items-center gap-4">
              <TouchableOpacity onPress={() => null} activeOpacity={0.7}>
                <SmilePlus
                  size={22}
                  color={colors['grey-plain']['450']}
                  strokeWidth={2}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => null} activeOpacity={0.7}>
                <AtSign
                  size={22}
                  color={colors['grey-plain']['450']}
                  strokeWidth={2}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>

      <MediaSelectionScreen
        visible={showMediaSelection}
        onClose={() => setShowMediaSelection(false)}
        onProceed={handleProceedMedia}
        initialSelected={selectedMedia}
      />

      <AudienceBottomSheet
        ref={audienceSheetRef}
        title="Who can see my post"
        options={audienceOptions}
        selectedKey={audienceKey}
        onSelectAudience={handleSelectAudience}
      />

      <CancelBottomSheet
        visible={showCancelSheet}
        onSaveAsDraft={handleSaveDraft}
        onDiscard={handleDiscard}
        onContinueEditing={handleContinueEditing}
      />

      <Modal
        visible={showMediaPreview && selectedMedia.length > 0}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={() => setShowMediaPreview(false)}
      >
        <SafeAreaView className="flex-1 bg-white" edges={['top']}>
          <View
            className="border-b border-grey-plain-150 px-4 py-3"
            style={{ paddingTop: Math.max(insets.top, 12) }}
          >
            <TouchableOpacity
              onPress={() => setShowMediaPreview(false)}
              activeOpacity={0.7}
            >
              <Text className="text-base font-medium text-grey-alpha-500">
                Cancel
              </Text>
            </TouchableOpacity>
          </View>

          <View className="flex-1 bg-white">
            <FlatList
              ref={previewListRef}
              data={selectedMedia}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={{ width, height: '100%' }}>
                  <Image
                    source={{ uri: item.uri }}
                    style={{ width: '100%', height: '100%' }}
                    contentFit="cover"
                  />
                </View>
              )}
              onMomentumScrollEnd={(event) => {
                const index = Math.round(
                  event.nativeEvent.contentOffset.x / width
                );
                setPreviewIndex(index);
              }}
              getItemLayout={(_, index) => ({
                length: width,
                offset: width * index,
                index,
              })}
            />

            {selectedMedia.length > 1 && (
              <View
                className="absolute bottom-24 self-center rounded-full px-3 py-1"
                style={{ backgroundColor: 'rgba(0, 0, 0, 0.55)' }}
              >
                <Text className="text-sm font-medium text-white">
                  {previewIndex + 1} of {selectedMedia.length}
                </Text>
              </View>
            )}
          </View>

          <View className="border-t border-grey-plain-150 bg-white px-4 py-4">
            <View className="flex-row items-center justify-between">
              <Button
                onPress={handleRemoveCurrentMedia}
                variant="outline"
                size="small"
                className="h-11 w-11 min-w-0 rounded-full px-0 py-0"
              >
                <Trash2 size={18} color={colors.state.red} />
              </Button>

              <View className="flex-row items-center gap-2">
                <Button
                  onPress={handleAddMoreMedia}
                  variant="outline"
                  size="small"
                  iconLeft={<Plus size={18} color={colors.primary.purple} />}
                  title="Add more"
                  className="h-11 min-w-0 px-4 py-2"
                />

                <Button
                  onPress={() => setShowMediaPreview(false)}
                  variant="primary"
                  size="small"
                  title="Next"
                  className="h-11 min-w-0 px-5 py-2"
                />
              </View>
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}
