import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { router, Href } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import {
  X,
  Hash,
  AtSign,
  SmilePlus,
  ImageIcon,
  Video,
  Trash2,
  UserPlus,
  MoreHorizontal,
  ChevronRight,
  Trash,
  UserRound,
  UserRoundX,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';
import { useRef, useState, useMemo } from 'react';

import { colors } from '@/theme/colors';
import { Toggle } from '@/components/ui/Toggle';
import { Button } from '@/components/ui/Button';
import { useLiftDraft, LiftTypeValue } from '@/context/LiftDraftContext';
import { AudienceOfferType } from '@/context/request-lift';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { VisibilitySelector } from '@/components/ui/VisibilitySelector';
import { MaterialInput } from '@/components/ui/MaterialInput';
import { ProfileStack } from '@/components/ui/ProfileStack';
import { UserInfoRow } from '@/components/ui/UserInfoRow';
import { BottomSheetRef } from '@/components/ui/BottomSheet';
import { AudienceBottomSheet } from '@/components/lift/AudienceBottomSheet';
import { LiftAmountSelector } from '@/components/lift/LiftAmountSelector';
import { EnterAmountBottomSheet } from '@/components/lift/EnterAmountBottomSheet';
import { NonMonetaryItemsSelector } from '@/components/lift/NonMonetaryItemsSelector';
import { RecipientNumberSelector } from './RecipientNumberSelector';

const TITLE_MAX_LENGTH = 55;
const DESCRIPTION_MAX_LENGTH = 500;

// Configuration for which fields are required for validation
export interface ValidationConfig {
  title?: boolean;
  description?: boolean;
  liftAmount?: boolean;
  liftItems?: boolean;
  category?: boolean;
  location?: boolean;
  offerTo?: boolean;
  numberOfRecipients?: boolean;
}

const defaultValidationConfig: ValidationConfig = {
  title: true,
  description: true,
  liftAmount: true,
  liftItems: true,
  category: false,
  location: false,
  offerTo: false,
  numberOfRecipients: false,
};

function InputActions() {
  return (
    <View className="mt-2 flex-row gap-2">
      <TouchableOpacity className="flex-row items-center gap-1.5 rounded-md bg-grey-plain-200 px-3 py-1.5">
        <Hash size={14} color={colors['grey-alpha']['400']} strokeWidth={2} />
        <Text className="font-inter text-xs">hashtag</Text>
      </TouchableOpacity>

      <TouchableOpacity className="flex-row items-center gap-1.5 rounded-md bg-grey-plain-200 px-3 py-1.5">
        <AtSign size={14} color={colors['grey-alpha']['400']} strokeWidth={2} />
        <Text className="font-inter text-xs">mentions</Text>
      </TouchableOpacity>

      <TouchableOpacity className="flex-row items-center gap-1.5 rounded-md bg-grey-plain-200 px-3 py-1.5">
        <SmilePlus
          size={14}
          color={colors['grey-alpha']['400']}
          strokeWidth={2}
        />
        <Text className="font-inter text-xs">Emoji</Text>
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
      <Text className="font-inter-medium text-sm text-grey-alpha-500">
        {label}
      </Text>
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
  audienceBottomSheetTitle?: string;
  showExploreOption?: boolean;
  showOfferAnon?: boolean;
  /** Configuration for which fields are required for form validation */
  validationConfig?: ValidationConfig;
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
  audienceBottomSheetTitle = 'Who can see the Lift i am raising?',
  showExploreOption = true,
  showOfferAnon = false,
  validationConfig,
}: LiftCreationScreenProps) {
  // Merge provided validation config with defaults
  const validation = useMemo(
    () => ({ ...defaultValidationConfig, ...validationConfig }),
    [validationConfig]
  );
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
    category,
    location,
    offerTo,
    setOfferToAnonymous,
    offerAnonymous,
  } = useLiftDraft();

  // Validate form and determine if buttons should be enabled
  const isFormValid = useMemo(() => {
    // Check required fields based on validation config
    if (validation.title && !title.trim()) return false;
    if (validation.description && !description.trim()) return false;
    if (validation.category && !category) return false;
    if (validation.location && !location) return false;
    if (validation.offerTo && !offerTo) return false;
    if (validation.numberOfRecipients && !numberOfRecipients) return false;

    // Lift type specific validation
    if (liftType === 'monetary') {
      if (validation.liftAmount && !liftAmount.trim()) return false;
    } else {
      if (validation.liftItems && liftItems.length === 0) return false;
    }

    return true;
  }, [
    validation,
    title,
    description,
    category,
    location,
    offerTo,
    numberOfRecipients,
    liftType,
    liftAmount,
    liftItems,
  ]);

  // Count selected options from more options screen
  const moreOptionsCount = [category, location].filter(Boolean).length;
  const audienceSheetRef = useRef<BottomSheetRef>(null);
  const navigation = useNavigation();

  const [isAmountSheetMounted, setIsAmountSheetMounted] = useState(false);
  const [isNumberOfRecipientSheetMounted, setIsNumberOfRecipientSheetMounted] =
    useState(false);

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
      // Check if we can go back, otherwise navigate to home screen
      if (navigation.canGoBack()) {
        router.back();
      } else {
        router.replace('/(tabs)' as Href);
      }
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
    setIsAmountSheetMounted(true);
  };
  const handleCustomAmountPressOnNR = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsNumberOfRecipientSheetMounted(true);
  };

  const handleAmountDone = (amount: string) => {
    setLiftAmount(amount);
    setIsAmountSheetMounted(false);
  };

  const handleAmountSheetClose = () => {
    setIsAmountSheetMounted(false);
  };

  const handleNRDone = (amount: string) => {
    setNumberOfRecipients(amount);
    setIsNumberOfRecipientSheetMounted(false);
  };

  const handleNumberOfRecipientSheetClose = () => {
    setIsNumberOfRecipientSheetMounted(false);
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
            <X size={24} color={colors['grey-plain']['550']} strokeWidth={2} />
          </TouchableOpacity>
          <Text className="font-inter-semibold text-lg text-grey-alpha-500">
            {headerTitle}
          </Text>
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={0}
      >
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
                title=""
                onPress={() => audienceSheetRef.current?.expand()}
              />
            )}

            {/* Offer to: section */}
            {offerTo && (
              <View>
                <Text className="mb-2 font-inter text-sm text-grey-alpha-400">
                  Offer to:
                </Text>
                <UserInfoRow user={offerTo} />
              </View>
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
                size="medium"
                showCharacterCountBelow
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
                size="small"
                showCharacterCountBelow
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
            <View className="border-b  border-grey-plain-300">
              <LiftAmountSelector
                selectedAmount={liftAmount}
                onAmountChange={setLiftAmount}
                onCustomAmountPress={handleCustomAmountPress}
              />
            </View>
          )}

          {/* Non-Monetary Items */}
          {liftType === 'non-monetary' && (
            <View className="border-b  border-grey-plain-300">
              <NonMonetaryItemsSelector
                items={liftItems}
                onAddItemsPress={() => router.push(addItemsRoute as Href)}
              />
            </View>
          )}

          {/* Media Section */}
          <View className=" px-4 py-4">
            {selectedMedia.length > 0 && (
              <View className="mb-4 flex-row items-center justify-between">
                <TouchableOpacity
                  onPress={() => setSelectedMedia([])}
                  hitSlop={10}
                >
                  <Trash size={20} color={colors.state.red} strokeWidth={2} />
                </TouchableOpacity>
                <Text className="font-inter text-sm text-grey-alpha-400">
                  {getMediaCountText()}
                </Text>
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
                        <Text className="font-inter text-xs text-white">
                          Video
                        </Text>
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
                    <Text className="font-inter-medium text-sm text-grey-alpha-500">
                      Collaborators{' '}
                      <Text className="font-inter text-grey-alpha-400">
                        (optional)
                      </Text>
                    </Text>
                  </View>
                  <View className="flex-row items-center gap-1.5 rounded-lg border border-grey-plain-300 p-2">
                    <UserPlus
                      size={18}
                      color={colors.primary.purple}
                      strokeWidth={2}
                    />
                    <Text className="font-inter-medium text-sm">Add</Text>
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
                      <Text className="font-inter-medium text-sm text-grey-alpha-500">
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
                        <Text className="font-inter text-sm text-grey-alpha-400">
                          {collaborators[0]?.fullName}
                          {collaborators.length > 1 && (
                            <Text className="font-inter">
                              {' '}
                              and{' '}
                              <Text className="font-inter text-grey-alpha-500">
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
                  <Toggle
                    value={true}
                    onValueChange={(enabled) => {
                      if (!enabled) {
                        setCollaborators([]);
                      }
                    }}
                  />
                </View>
              )}
            </View>
          )}

          {/* Explore More Options */}
          {showExploreOption && (
            <View className="px-4 py-3">
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
                  <Text className="font-inter-medium text-sm text-grey-alpha-500">
                    Explore more options
                  </Text>
                </View>
                <View className="flex-row items-center gap-2">
                  {moreOptionsCount > 0 && (
                    <View
                      style={{ backgroundColor: '#CF2586' }}
                      className="h-6 min-w-6 items-center justify-center rounded-full px-2"
                    >
                      <Text className="font-inter-semibold text-xs text-white">
                        {moreOptionsCount}
                      </Text>
                    </View>
                  )}
                  <ChevronRight
                    size={20}
                    color={colors['grey-alpha']['400']}
                    strokeWidth={2}
                  />
                </View>
              </TouchableOpacity>
            </View>
          )}

          {/* Offer Anonymously */}
          {showOfferAnon && (
            <View className="flex-row items-center justify-between px-4 py-3">
              <View className="flex-1 flex-row items-center">
                <UserRoundX></UserRoundX>
                <View className="ml-3 flex">
                  <Text className="font-inter-medium text-sm font-semibold text-grey-alpha-500">
                    Offer lift anonymously
                  </Text>
                  <Text className="font-inter text-xs text-grey-alpha-400">
                    Recipient won’t know it is you.
                  </Text>
                </View>
              </View>
              <Toggle
                value={offerAnonymous}
                onValueChange={(enabled) => {
                  setOfferToAnonymous(enabled);
                }}
              />
            </View>
          )}
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
                disabled={!isFormValid}
              />
            </View>

            <View className="flex-1">
              <Button
                title={actionButtonText}
                onPress={handleSubmit}
                variant="primary"
                className="rounded-full"
                disabled={!isFormValid}
              />
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>

      {showVisibilitySelector && (
        <AudienceBottomSheet
          ref={audienceSheetRef}
          variant="see"
          title={audienceBottomSheetTitle}
          selectedKey={audienceType}
          onSelectAudience={(key) => {
            setAudienceType(key as AudienceOfferType);
            audienceSheetRef.current?.close();
          }}
        />
      )}

      {/* Enter Amount Bottom Sheet */}
      {isAmountSheetMounted && (
        <EnterAmountBottomSheet
          onDone={handleAmountDone}
          initialAmount={liftAmount}
          onClose={handleAmountSheetClose}
        />
      )}

      {/* Enter Recipient Bottom Sheet */}
      {isNumberOfRecipientSheetMounted && (
        <EnterAmountBottomSheet
          title="Offer lift to multiple people"
          inputLabel="Number of recipients"
          enableFormattedDisplay={false}
          onDone={handleNRDone}
          initialAmount={numberOfRecipients}
          quickAmounts={[1, 2, 3, 5, 10]}
          singleRowQuickAmounts
          onClose={handleNumberOfRecipientSheetClose}
        />
      )}
    </SafeAreaView>
  );
}
