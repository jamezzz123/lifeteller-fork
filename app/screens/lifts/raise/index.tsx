import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import {
  CornerUpLeft,
  Hash,
  AtSign,
  SmilePlus,
  ImageIcon,
  Video,
  Trash2,
  UserPlus,
  MoreHorizontal,
  ChevronRight,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';
import { useState, useEffect } from 'react';

import { colors } from '@/theme/colors';
import { Button } from '@/components/ui/Button';
import { useLiftDraft } from '@/context/LiftDraftContext';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { VisibilitySelector } from '@/components/ui/VisibilitySelector';
import { MaterialInput } from '@/components/ui/MaterialInput';
import { ProfileStack } from '@/components/ui/ProfileStack';
import { SelectedMediaPreview } from '@/components/ui/SelectedMediaPreview';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useRef } from 'react';
import { BottomSheetRef } from '@/components/ui/BottomSheet';
import { AudienceBottomSheet } from '@/components/lift/AudienceBottomSheet';

const TITLE_MAX_LENGTH = 55;
const DESCRIPTION_MAX_LENGTH = 500;

function InputActions() {
  return (
    <View className="mt-2 flex-row gap-2">
      <TouchableOpacity className="bg-grey-plain-200 flex-row items-center gap-1.5 rounded px-3 py-1.5">
        <Hash size={14} color={colors['grey-alpha']['400']} strokeWidth={2} />
        <Text className="text-xs">hashtag</Text>
      </TouchableOpacity>

      <TouchableOpacity className="bg-grey-plain-200 flex-row items-center gap-1.5 rounded px-3 py-1.5">
        <AtSign size={14} color={colors['grey-alpha']['400']} strokeWidth={2} />
        <Text className="text-xs">mentions</Text>
      </TouchableOpacity>

      <TouchableOpacity className="bg-grey-plain-200 flex-row items-center gap-1.5 rounded px-3 py-1.5">
        <SmilePlus
          size={14}
          color={colors['grey-alpha']['400']}
          strokeWidth={2}
        />
        <Text className="text-xs">Emoji</Text>
      </TouchableOpacity>
    </View>
  );
}

type MediaButtonProps = {
  onPress: () => void;
  icon: React.ReactNode;
  label: string;
};

function MediaButton({ onPress, icon, label }: MediaButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-1 flex-row items-center justify-center gap-2 rounded-lg border-grey-plain-300 bg-primary-tints-50 py-3"
    >
      {icon}
      <Text className="text-sm font-medium text-grey-alpha-500">{label}</Text>
    </TouchableOpacity>
  );
}

export default function RaiseLiftScreen() {
  const {
    collaborators,
    liftType,
    setLiftType,
    audienceType,
    setAudienceType,
    title,
    setTitle,
    description,
    setDescription,
    liftAmount,
    setLiftAmount,
    selectedMedia,
    setSelectedMedia,
    setCollaborators,
  } = useLiftDraft();
  const audienceSheetRef = useRef<BottomSheetRef>(null);
  const [collaboratorsEnabled, setCollaboratorsEnabled] = useState(false);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);

  // Auto-navigate when toggle is turned on and no collaborators exist
  useEffect(() => {
    if (collaboratorsEnabled && collaborators.length === 0) {
      const timer = setTimeout(() => {
        router.push('/screens/lifts/raise/add-collaborators');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [collaboratorsEnabled, collaborators.length]);

  // Set toggle to true if collaborators exist
  useEffect(() => {
    if (collaborators.length > 0) {
      setCollaboratorsEnabled(true);
    }
  }, [collaborators.length]);

  const handleToggleCollaborators = (enabled: boolean) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (!enabled && collaborators.length > 0) {
      // Show confirmation dialog if there are collaborators
      setShowRemoveConfirm(true);
    } else {
      setCollaboratorsEnabled(enabled);
    }
  };

  const handleConfirmRemove = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setCollaborators([]);
    setCollaboratorsEnabled(false);
    setShowRemoveConfirm(false);
    Alert.alert('Success', 'Collaborators removed successfully');
  };

  const handleCancelRemove = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowRemoveConfirm(false);
  };

  const handleNavigateToCollaborators = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/screens/lifts/raise/add-collaborators');
  };

  const handlePickImage = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      const newMedia = result.assets.map((asset) => ({
        id: Math.random().toString(),
        uri: asset.uri,
        type: 'image' as const,
        fileName: asset.fileName || undefined,
      }));
      setSelectedMedia([...selectedMedia, ...newMedia]);
    }
  };

  const handlePickVideo = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['videos'],
      allowsMultipleSelection: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      const newMedia = result.assets.map((asset) => ({
        id: Math.random().toString(),
        uri: asset.uri,
        type: 'video' as const,
        fileName: asset.fileName || undefined,
      }));
      setSelectedMedia([...selectedMedia, ...newMedia]);
    }
  };

  const handleRemoveMedia = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedMedia(selectedMedia.filter((item) => item.id !== id));
  };

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
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'bottom']}>
      {/* Header */}
      <View className="flex-row items-center justify-between border-b border-grey-plain-150 bg-white px-4 py-3">
        <View className="flex-row items-center gap-3">
          <TouchableOpacity onPress={() => router.back()}>
            <CornerUpLeft
              color={colors['grey-plain']['550']}
              size={24}
              strokeWidth={2}
            />
          </TouchableOpacity>
          <Text className="text-lg font-semibold text-grey-alpha-500">
            Raise Lift
          </Text>
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Lift Type & Visibility */}
        <View className="gap-4 border-b border-grey-plain-300 p-4">
          <SegmentedControl
            options={[
              { label: 'Monetary', value: 'monetary' },
              { label: 'Non-monetary', value: 'non-monetary' },
            ]}
            selectedValue={liftType}
            onValueChange={setLiftType}
          />

          <VisibilitySelector
            selectedType={audienceType}
            onPress={() => audienceSheetRef.current?.expand()}
          />
        </View>

        <View className="gap-4 border-b border-grey-plain-300 py-4">
          {/* Title */}
          <View className=" px-4 py-2">
            <MaterialInput
              value={title}
              onChangeText={setTitle}
              placeholder="Enter a title for your lift"
              maxLength={TITLE_MAX_LENGTH}
              size="large"
              showCharacterCount
              maxCharacters={TITLE_MAX_LENGTH}
              helperText="e.g., Medical bill, School fees, etc."
            />
          </View>

          {/* Description */}
          <View className=" px-4 py-2">
            <MaterialInput
              value={description}
              onChangeText={setDescription}
              placeholder="Enter a description for your lift"
              multiline
              maxLength={DESCRIPTION_MAX_LENGTH}
              size="medium"
              showCharacterCount
              maxCharacters={DESCRIPTION_MAX_LENGTH}
            />
            <InputActions />
          </View>

          {/* Lift Amount */}
          {liftType === 'monetary' && (
            <View className=" px-4 py-4">
              <MaterialInput
                label="Lift amount"
                prefix="₦"
                value={liftAmount}
                onChangeText={setLiftAmount}
                keyboardType="numeric"
                placeholder="5,000"
              />
              <Text className="mt-2 text-xs text-grey-alpha-400">
                Funds will be securely held in your Lift wallet.
              </Text>
            </View>
          )}
        </View>

        {/* Media Section */}
        <View className=" px-4 py-4">
          {selectedMedia.length > 0 && (
            <View className="mb-4 flex-row items-center justify-between">
              <Text className="text-sm text-grey-alpha-400">
                {getMediaCountText()}
              </Text>
              <TouchableOpacity
                onPress={() => setSelectedMedia([])}
                hitSlop={10}
              >
                <Trash2 size={20} color={colors.state.red} strokeWidth={2} />
              </TouchableOpacity>
            </View>
          )}

          {selectedMedia.length > 0 && (
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
                    onPress={() => handleRemoveMedia(item.id)}
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
          )}

          <View className="flex-row gap-3">
            <MediaButton
              onPress={handlePickImage}
              icon={
                <ImageIcon
                  size={20}
                  color={colors.primary.purple}
                  strokeWidth={2}
                />
              }
              label="Add image"
            />

            <MediaButton
              onPress={handlePickVideo}
              icon={
                <Video
                  size={20}
                  color={colors.primary.purple}
                  strokeWidth={2}
                />
              }
              label="Add video"
            />
          </View>
        </View>

        {/* Collaborators */}
        <View className=" px-4 py-4">
          <View className="flex-row items-center justify-between">
            <View className="flex-1 flex-row items-center gap-3">
              <UserPlus
                size={20}
                color={colors['grey-alpha']['500']}
                strokeWidth={2}
              />
              <View className="flex-1">
                <Text className="text-sm font-medium text-grey-alpha-500">
                  Add collaborators
                </Text>
                {collaborators.length > 0 && (
                  <TouchableOpacity
                    onPress={handleNavigateToCollaborators}
                    className="mt-1 flex-row items-center gap-2"
                  >
                    <ProfileStack
                      profiles={collaborators.map((c) => {
                        if (typeof c.profileImage === 'string') {
                          return c.profileImage;
                        }
                        return c.profileImage?.uri || '';
                      })}
                      size={24}
                      overlap={10}
                      maxVisible={3}
                    />
                    <Text className="flex-1 text-sm text-grey-alpha-400">
                      <Text className="font-semibold text-grey-alpha-500">
                        {collaborators[0].fullName}
                      </Text>
                      {collaborators.length > 1 && (
                        <>
                          {' and '}
                          <Text className="font-semibold text-grey-alpha-500">
                            {collaborators.length - 1}
                          </Text>
                          {` ${collaborators.length - 1 === 1 ? 'other' : 'others'}`}
                        </>
                      )}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
            <Switch
              value={collaboratorsEnabled}
              onValueChange={handleToggleCollaborators}
              trackColor={{
                false: colors['grey-plain']['450'],
                true: colors.primary.purple,
              }}
              thumbColor={colors['grey-plain']['50']}
            />
          </View>
        </View>

        {/* Explore More Options */}
        <View className=" px-4 py-4">
          <TouchableOpacity
            onPress={() => router.push('/screens/lifts/raise/more-options')}
            className="flex-row items-center justify-between"
          >
            <View className="flex-row items-center gap-3">
              <MoreHorizontal
                size={20}
                color={colors['grey-alpha']['500']}
                strokeWidth={2}
              />
              <Text className="text-sm font-medium text-grey-alpha-500">
                Explore more options
              </Text>
            </View>
            <ChevronRight
              size={20}
              color={colors['grey-alpha']['400']}
              strokeWidth={2}
            />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Footer Buttons */}
      <View className="border-t border-grey-plain-150 bg-grey-alpha-100 px-4 py-3">
        <View className="flex-row gap-3">
          <View className="flex-1">
            <Button
              title="Preview"
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                // TODO: Navigate to preview
              }}
              variant="outline"
              className="rounded-full"
            />
          </View>

          <View className="flex-1">
            <Button
              title="Raise lift"
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                // TODO: Submit lift
                router.push('/screens/lifts/raise/preview');
              }}
              variant="primary"
              className="rounded-full"
            />
          </View>
        </View>
      </View>

      {/* Remove Collaborators Confirmation */}
      <ConfirmDialog
        visible={showRemoveConfirm}
        title="Are you sure you want to remove all collaborators?"
        message='They can still request to join and support your lift if you enable the "Allow collaborators" settings.'
        confirmText="Yes, remove"
        cancelText="Cancel, go back"
        onConfirm={handleConfirmRemove}
        onCancel={handleCancelRemove}
        destructive
      />

      <AudienceBottomSheet
        ref={audienceSheetRef}
        variant="see"
        selectedType={audienceType}
        onSelectAudience={(type) => {
          setAudienceType(type);
          audienceSheetRef.current?.close();
        }}
      />
    </SafeAreaView>
  );
}
