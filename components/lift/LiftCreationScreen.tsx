import { View, Text, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { router, Href } from 'expo-router';
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
import { useRef } from 'react';

import { colors } from '@/theme/colors';
import { Button } from '@/components/ui/Button';
import { useLiftDraft, LiftTypeValue } from '@/context/LiftDraftContext';
import { AudienceOfferType } from '@/context/request-lift';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { VisibilitySelector } from '@/components/ui/VisibilitySelector';
import { MaterialInput } from '@/components/ui/MaterialInput';
import { ProfileStack } from '@/components/ui/ProfileStack';
import { BottomSheetRef } from '@/components/ui/BottomSheet';
import { AudienceBottomSheet } from '@/components/lift/AudienceBottomSheet';
import { LiftAmountSelector } from '@/components/lift/LiftAmountSelector';
import { EnterAmountBottomSheet } from '@/components/lift/EnterAmountBottomSheet';
import { NonMonetaryItemsSelector } from '@/components/lift/NonMonetaryItemsSelector';
import {
  RecipientNumberSelector,
  QUICK_AMOUNTS as RNQuickAmount,
} from './RecipientNumberSelector';

const TITLE_MAX_LENGTH = 55;
const DESCRIPTION_MAX_LENGTH = 500;

function InputActions() {
  return (
    <View className="mt-2 flex-row gap-2">
      <TouchableOpacity className="flex-row items-center gap-1.5 rounded bg-grey-plain-200 px-3 py-1.5">
        <Hash size={14} color={colors['grey-alpha']['400']} strokeWidth={2} />
        <Text className="text-xs">hashtag</Text>
      </TouchableOpacity>

      <TouchableOpacity className="flex-row items-center gap-1.5 rounded bg-grey-plain-200 px-3 py-1.5">
        <AtSign size={14} color={colors['grey-alpha']['400']} strokeWidth={2} />
        <Text className="text-xs">mentions</Text>
      </TouchableOpacity>

      <TouchableOpacity className="flex-row items-center gap-1.5 rounded bg-grey-plain-200 px-3 py-1.5">
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

interface LiftCreationScreenProps {
  headerTitle: string;
  onBack?: () => void;
  onPreview?: () => void;
  onSubmit?: () => void;
  actionButtonText: string;
  collaboratorsRoute?: string;
  moreOptionsRoute: string;
  addItemsRoute: string;
  showVisibilitySelector?: boolean;
  showCollaboratorsSelector?: boolean;
  showRecipientNumberSelector?: boolean;
  showMedia?: boolean;
}

export default function LiftCreationScreen({
  headerTitle = 'Raise Lift',
  onBack,
  onPreview,
  onSubmit,
  actionButtonText,
  collaboratorsRoute = '/',
  moreOptionsRoute,
  addItemsRoute,
  showVisibilitySelector = true,
  showCollaboratorsSelector = true,
  showRecipientNumberSelector = false,
  showMedia = true,
}: LiftCreationScreenProps) {
  const {
    collaborators,
    setCollaborators,
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
    liftItems,
    setNumberOfRecipients,
    numberOfRecipients,
  } = useLiftDraft();
  const audienceSheetRef = useRef<BottomSheetRef>(null);
  const amountSheetRef = useRef<BottomSheetRef>(null);
  const numberOfRecipientSheetRef = useRef<BottomSheetRef>(null);

  const handleNavigateToCollaborators = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(collaboratorsRoute as Href);
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

  const handleGoBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  const handleSubmit = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (onSubmit) {
      onSubmit();
    } else {
      router.push('/screens/lifts/raise/preview' as any);
    }
  };

  const handleCustomAmountPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    amountSheetRef.current?.expand();
  };
  const handleCustomAmountPressOnNR = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    numberOfRecipientSheetRef.current?.expand();
  };

  const handleAmountDone = (amount: string) => {
    setLiftAmount(amount);
    amountSheetRef.current?.close();
  };

  const handleNRDone = (amount: string) => {
    setNumberOfRecipients(amount);
    numberOfRecipientSheetRef.current?.close();
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
          <TouchableOpacity onPress={handleGoBack}>
            <CornerUpLeft
              color={colors['grey-plain']['550']}
              size={24}
              strokeWidth={2}
            />
          </TouchableOpacity>
          <Text className="text-lg font-semibold text-grey-alpha-500">
            {headerTitle}
          </Text>
        </View>
      </View>

      <KeyboardAwareScrollView
        enableOnAndroid
        keyboardShouldPersistTaps="handled"
        extraScrollHeight={120}
        extraHeight={140}
        enableAutomaticScroll
        enableResetScrollToCoords={false}
        showsVerticalScrollIndicator={false}
      >
          {/* Lift Type & Visibility */}
          <View className="gap-4 border-b border-grey-plain-300 p-4">
            <SegmentedControl
              options={[
                { label: 'Monetary', value: 'monetary' },
                { label: 'Non-monetary', value: 'non-monetary' },
              ]}
              selectedValue={liftType}
              onValueChange={(value) => setLiftType(value as LiftTypeValue)}
            />

            {showVisibilitySelector && (
              <VisibilitySelector
                selectedKey={audienceType}
                title="Who can see the lift i am raising"
                onPress={() => audienceSheetRef.current?.expand()}
              />
            )}
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
          </View>

          {showRecipientNumberSelector && (
            <View>
              <RecipientNumberSelector
                selectedAmount={numberOfRecipients}
                onAmountChange={setNumberOfRecipients}
                onCustomAmountPress={handleCustomAmountPressOnNR}
              />
            </View>
          )}

          {/* Lift Amount */}
          {liftType === 'monetary' && (
            <View>
              <LiftAmountSelector
                selectedAmount={liftAmount}
                onAmountChange={setLiftAmount}
                onCustomAmountPress={handleCustomAmountPress}
              />
            </View>
          )}

          {/* Non-Monetary Items */}
          {liftType === 'non-monetary' && (
            <NonMonetaryItemsSelector
              items={liftItems}
              onAddItemsPress={() => router.push(addItemsRoute as Href)}
            />
          )}

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

            {showMedia && (
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
            )}
          </View>

          {/* Collaborators */}
          {showCollaboratorsSelector && (
            <View className="px-4 py-4">
              {collaborators.length === 0 ? (
                <TouchableOpacity
                  onPress={handleNavigateToCollaborators}
                  className="flex-row items-center justify-between"
                >
                  <View className="flex-row items-center gap-3">
                    <UserPlus
                      size={20}
                      color={colors['grey-alpha']['500']}
                      strokeWidth={2}
                    />
                    <Text className="text-sm font-medium text-grey-alpha-500">
                      Collaborators{' '}
                      <Text className="text-grey-alpha-400">(optional)</Text>
                    </Text>
                  </View>
                  <View className="flex-row items-center gap-1.5 rounded-lg border border-grey-plain-300 p-2">
                    <UserPlus
                      size={18}
                      color={colors.primary.purple}
                      strokeWidth={2}
                    />
                    <Text className="text-sm font-medium">Add</Text>
                  </View>
                </TouchableOpacity>
              ) : (
                <View className="flex-row items-center justify-between">
                  <View className="flex-1 flex-row items-center gap-3">
                    <UserPlus
                      size={20}
                      color={colors['grey-alpha']['500']}
                      strokeWidth={2}
                    />
                    <View className="flex-1">
                      <Text className="text-sm font-medium text-grey-alpha-500">
                        Added collaborators
                      </Text>
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
                          maxVisible={1}
                        />
                        <Text className="text-sm text-grey-alpha-400">
                          {collaborators[0]?.fullName}
                          {collaborators.length > 1 && (
                            <Text>
                              {' '}
                              and{' '}
                              <Text className="text-grey-alpha-500">
                                {collaborators.length - 1}
                              </Text>
                              {` other${collaborators.length - 1 === 1 ? '' : 's'}`}
                            </Text>
                          )}
                        </Text>
                        <ChevronRight
                          size={16}
                          color={colors['grey-alpha']['400']}
                          strokeWidth={2}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <Switch
                    value={true}
                    onValueChange={(enabled) => {
                      if (!enabled) {
                        setCollaborators([]);
                      }
                    }}
                    trackColor={{
                      false: colors['grey-plain']['450'],
                      true: colors.primary.purple,
                    }}
                    thumbColor={colors['grey-plain']['50']}
                  />
                </View>
              )}
            </View>
          )}

          {/* Explore More Options */}
          <View className=" px-4 py-4">
            <TouchableOpacity
              onPress={() => router.push(moreOptionsRoute as Href)}
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
      </KeyboardAwareScrollView>

      {/* Footer Buttons */}
      <View className="border-t border-grey-plain-150 bg-grey-alpha-100 px-4 py-3">
        <View className="flex-row gap-3">
          <View className="flex-1">
            <Button
              title="Preview"
              onPress={handleSubmit}
              variant="outline"
              className="rounded-full"
            />
          </View>

          <View className="flex-1">
            <Button
              title={actionButtonText}
              onPress={handleSubmit}
              variant="primary"
              className="rounded-full"
            />
          </View>
        </View>
      </View>

      {showVisibilitySelector && (
        <AudienceBottomSheet
          ref={audienceSheetRef}
          variant="see"
          selectedKey={audienceType}
          onSelectAudience={(key) => {
            setAudienceType(key as AudienceOfferType);
            audienceSheetRef.current?.close();
          }}
        />
      )}

      {/* Enter Amount Bottom Sheet */}
      <EnterAmountBottomSheet
        ref={amountSheetRef}
        onDone={handleAmountDone}
        initialAmount={liftAmount}
      />

      {/* Enter Recipient Bottom Sheet */}
      <EnterAmountBottomSheet
        title="Offer Lift to multiple people"
        enableFormattedDisplay={false}
        hintText="Enter the number of people you want to offer this Lift to."
        ref={numberOfRecipientSheetRef}
        onDone={handleNRDone}
        initialAmount={numberOfRecipients}
        quickAmounts={RNQuickAmount}
      />
    </SafeAreaView>
  );
}
