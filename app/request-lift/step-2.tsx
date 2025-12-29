import { useMemo, useState, useEffect, useCallback, useRef } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import { Info, ChevronRight, Edit2, Trash2 } from 'lucide-react-native';

import { colors } from '@/theme/colors';
import {
  LiftTypeSelector,
  MediaPickerBottomSheet,
  filterTitleSuggestions,
  ContactRow,
  AudienceBottomSheet,
} from '@/components/lift';
import { BottomSheetRef } from '@/components/ui/BottomSheet';
import {
  MediaItem,
  useRequestLift,
  AudienceOfferType,
} from '@/context/request-lift';
import { Dropdown } from '@/components/ui/Dropdown';

const TITLE_MAX_LENGTH = 55;
const DESCRIPTION_MIN_LENGTH = 400;

export default function Step2Screen() {
  const {
    selectedContacts,
    liftTitle,
    setLiftTitle,
    liftDescription,
    setLiftDescription,
    liftType,
    liftAmount,
    liftItems,
    selectedMedia,
    setSelectedMedia,
    setCanProceed,
    onNextRef,
    audienceOfferType,
    setAudienceOfferType,
    setHeaderTitle,
  } = useRequestLift();

  const [showTitleSuggestions, setShowTitleSuggestions] = useState(false);
  const [titleFocused, setTitleFocused] = useState(false);
  const [descriptionFocused, setDescriptionFocused] = useState(false);

  const mediaPickerRef = useRef<BottomSheetRef>(null);
  const audienceBottomSheetRef = useRef<BottomSheetRef>(null);

  const titleSuggestions = useMemo(() => {
    return filterTitleSuggestions(liftTitle);
  }, [liftTitle]);

  // Validation temporarily disabled
  const isValid = true;

  const handleNext = useCallback(() => {
    if (!isValid) return;
    router.push('/request-lift/step-3');
  }, [isValid]);

  // Update canProceed and Next handler
  useEffect(() => {
    setHeaderTitle('Lift details');
    setCanProceed(isValid);
    onNextRef.current = handleNext;
    return () => {
      onNextRef.current = null;
    };
  }, [isValid, setCanProceed, handleNext, onNextRef, setHeaderTitle]);

  function handleTitleChange(text: string) {
    if (text.length <= TITLE_MAX_LENGTH) {
      setLiftTitle(text);
      setShowTitleSuggestions(text.length > 0);
    }
  }

  function handleSelectSuggestion(suggestion: string) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setLiftTitle(suggestion);
    setShowTitleSuggestions(false);
  }

  function handleRequestMethodPress() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Open audience selection bottom sheet
    audienceBottomSheetRef.current?.expand();
  }

  function handleSelectAudience(type: AudienceOfferType) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setAudienceOfferType(type);
    audienceBottomSheetRef.current?.close();

    // If switching to chat-direct or selected-people, navigate to contact selection
    if (type === 'chat-direct' || type === 'selected-people') {
      router.back(); // Go back to step 1 to select contacts
    }
  }

  function handleNavigateToLiftType() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/request-lift/lift-type' as any);
  }

  function handleHelpMeWrite() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // TODO: Implement AI writing assistance
  }

  function handleOpenMediaPicker() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    mediaPickerRef.current?.expand();
  }

  function handleMediaPickerDone(media: MediaItem[]) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedMedia(media);
  }

  function handleDeleteAllMedia() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedMedia([]);
  }

  const hasMonetary = liftAmount > 0;
  const hasNonMonetary = liftItems.length > 0;
  const showTypeSelector = !hasMonetary && !hasNonMonetary;
  const hasBoth = hasMonetary && hasNonMonetary;

  const firstItemName =
    liftItems[0]?.name?.trim() || (liftItems.length ? 'Item' : '');
  const nonMonetarySummary =
    liftItems.length > 1
      ? `${firstItemName} and ${liftItems.length - 1} others`
      : firstItemName;

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View className="flex-1">
        <ScrollView
          className="flex-1"
          keyboardShouldPersistTaps="handled"
          contentContainerClassName="flex-grow pb-8"
          showsVerticalScrollIndicator={false}
        >
          {/* Request Method Selector */}
          <View className="pt-5">
            {selectedContacts.length > 0 && (
              <TouchableOpacity
                onPress={handleRequestMethodPress}
                className="flex-row items-center px-4"
              >
                <View className="">
                  <ContactRow
                    key={selectedContacts[0].id}
                    contact={selectedContacts[0] as any}
                    isSelected={false}
                    onSelect={() => {}}
                    disabled={false}
                    showName={false}
                  />
                </View>
                <View className="ml-3">
                  <Dropdown
                    label={'Request via chat'}
                    onPress={handleRequestMethodPress}
                  />
                </View>
              </TouchableOpacity>
            )}
          </View>

          {/* Title Input */}
          <View className="relative z-10 mt-5 px-4">
            <TextInput
              value={liftTitle}
              onChangeText={handleTitleChange}
              placeholder="Enter lift title"
              placeholderTextColor={colors['grey-alpha']['250']}
              className="border-b-2 pb-2 text-lg text-grey-alpha-500"
              returnKeyType="next"
              onFocus={() => {
                setTitleFocused(true);
                setShowTitleSuggestions(liftTitle.length > 0);
              }}
              onBlur={() => {
                setTitleFocused(false);
                // Delay to allow suggestion tap to register
                setTimeout(() => setShowTitleSuggestions(false), 200);
              }}
              style={{
                borderColor: titleFocused
                  ? colors.primary.purple
                  : colors['grey-plain']['450'],
              }}
            />

            {/* Title Helper */}
            <View className="mt-2 flex-row items-start gap-2">
              <Info
                size={16}
                color={colors['grey-alpha']['400']}
                strokeWidth={2.4}
                style={{ marginTop: 1 }}
              />
              <Text className="flex-1 text-xs text-grey-alpha-400">
                e.g., Medical bill, School fees, etc.
              </Text>
              <Text className="text-xs text-grey-alpha-400">
                {liftTitle.length}/{TITLE_MAX_LENGTH}
              </Text>
            </View>

            {/* Title Suggestions Dropdown - Floats over content */}
            {showTitleSuggestions && titleSuggestions.length > 0 ? (
              <View className="absolute left-4 right-4 top-full z-50 mt-1 overflow-hidden rounded-2xl border border-grey-alpha-250 bg-grey-plain-50 shadow-lg">
                {titleSuggestions.slice(0, 4).map((suggestion, index) => (
                  <TouchableOpacity
                    key={suggestion}
                    onPress={() => handleSelectSuggestion(suggestion)}
                    className={`px-4 py-3`}
                    accessibilityRole="button"
                    accessibilityLabel={`Select title suggestion: ${suggestion}`}
                  >
                    <Text className="text-base text-grey-alpha-500">
                      {suggestion}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            ) : null}
          </View>

          {/* Description Input */}
          <View className="mt-5 px-4">
            <TextInput
              value={liftDescription}
              onChangeText={setLiftDescription}
              placeholder="Describe your lift request here..."
              placeholderTextColor={colors['grey-alpha']['250']}
              className="min-h-[20px] border-b-2 pb-2 text-base text-grey-alpha-500"
              multiline
              textAlignVertical="top"
              returnKeyType="default"
              onFocus={() => setDescriptionFocused(true)}
              onBlur={() => setDescriptionFocused(false)}
              style={{
                borderColor: descriptionFocused
                  ? colors.primary.purple
                  : colors['grey-plain']['450'],
              }}
            />

            {/* Description Helper */}
            <View className="mt-2 flex-row items-start gap-2">
              <Info
                size={16}
                color={colors['grey-alpha']['400']}
                strokeWidth={2.4}
                style={{ marginTop: 1 }}
              />
              <Text className="flex-1 text-xs text-grey-alpha-400">
                You can also tag others. Minimum of {DESCRIPTION_MIN_LENGTH}{' '}
                characters
              </Text>
            </View>

            {/* Help Me Write Button */}
            <TouchableOpacity
              onPress={handleHelpMeWrite}
              className="mt-3 flex-row items-center gap-2.5 self-start rounded-full px-3 py-2"
              style={{ backgroundColor: '#F8F2FF' }}
              activeOpacity={0.7}
            >
              <Image
                source={require('../../assets/images/sparkles.png')}
                style={{ width: 16, height: 16 }}
                contentFit="contain"
              />
              <Text className="text-sm font-medium text-grey-alpha-500">
                Help me write
              </Text>
            </TouchableOpacity>
          </View>

          {/* Type Selector */}
          {showTypeSelector ? (
            <View className="mt-5">
              <LiftTypeSelector
                selectedType={liftType}
                onSelectType={handleNavigateToLiftType}
              />
            </View>
          ) : (
            <View className="mt-6">
              {hasBoth ? (
                // Combined view for both monetary and non-monetary
                <TouchableOpacity
                  onPress={handleNavigateToLiftType}
                  className="flex-row items-center justify-between px-4 py-3"
                  accessibilityRole="button"
                  accessibilityLabel="Edit lift details"
                >
                  <View className="flex-1">
                    <Text className="text-xs font-semibold text-grey-alpha-400">
                      Monetary and Non-monetary lift
                    </Text>
                    <Text className="mt-1 text-base font-semibold text-grey-alpha-500">
                      ₦{liftAmount.toLocaleString()} · {nonMonetarySummary}
                    </Text>
                  </View>
                  <ChevronRight
                    size={20}
                    color={colors['grey-alpha']['400']}
                    strokeWidth={2}
                  />
                </TouchableOpacity>
              ) : (
                // Individual views when only one type is selected
                <>
                  {hasMonetary && (
                    <TouchableOpacity
                      onPress={handleNavigateToLiftType}
                      className="flex-row items-center justify-between px-4 py-3"
                      accessibilityRole="button"
                      accessibilityLabel="Edit monetary lift amount"
                    >
                      <View className="flex-1">
                        <Text className="text-xs font-semibold text-grey-alpha-400">
                          Monetary lift
                        </Text>
                        <Text className="mt-1 text-base font-semibold text-grey-alpha-500">
                          ₦{liftAmount.toLocaleString()}
                        </Text>
                      </View>
                      <ChevronRight
                        size={20}
                        color={colors['grey-alpha']['400']}
                        strokeWidth={2}
                      />
                    </TouchableOpacity>
                  )}

                  {hasNonMonetary && (
                    <TouchableOpacity
                      onPress={handleNavigateToLiftType}
                      className="flex-row items-center justify-between px-4 py-3"
                      accessibilityRole="button"
                      accessibilityLabel="Edit non-monetary lift items"
                    >
                      <View className="flex-1">
                        <Text className="text-xs font-semibold text-grey-alpha-400">
                          Non-monetary lift
                        </Text>
                        <Text className="mt-1 text-base font-semibold text-grey-alpha-500">
                          {nonMonetarySummary || 'Add items'}
                        </Text>
                      </View>
                      <ChevronRight
                        size={20}
                        color={colors['grey-alpha']['400']}
                        strokeWidth={2}
                      />
                    </TouchableOpacity>
                  )}
                </>
              )}
            </View>
          )}

          {/* Media Section */}
          <View className="mt-6 px-4">
            {selectedMedia.length > 0 ? (
              <View>
                {/* Media Header */}
                <View className="mb-3 flex-row items-center justify-between">
                  <Text className="text-sm font-semibold text-grey-alpha-500">
                    {selectedMedia.length} media added
                  </Text>
                  <View className="flex-row items-center gap-4">
                    <TouchableOpacity
                      onPress={handleOpenMediaPicker}
                      hitSlop={10}
                      accessibilityLabel="Edit media"
                    >
                      <Edit2
                        size={20}
                        color={colors['grey-alpha']['500']}
                        strokeWidth={2}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={handleDeleteAllMedia}
                      hitSlop={10}
                      accessibilityLabel="Delete all media"
                    >
                      <Trash2
                        size={20}
                        color={colors.state.red}
                        strokeWidth={2}
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Media Thumbnails */}
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ gap: 8 }}
                >
                  {selectedMedia.map((item) => (
                    <View key={item.id} className="relative">
                      <Image
                        source={{ uri: item.uri }}
                        style={{ width: 100, height: 100, borderRadius: 12 }}
                        contentFit="cover"
                      />
                    </View>
                  ))}
                </ScrollView>
              </View>
            ) : (
              <TouchableOpacity
                onPress={handleOpenMediaPicker}
                className="bg-grey-alpha-100 flex-row items-center gap-3 rounded border border-grey-plain-450/40 px-4 py-4"
                accessibilityRole="button"
                accessibilityLabel="Add photos or videos"
              >
                <Image
                  source={require('../../assets/images/file-upload-image.png')}
                  style={{ width: 40, height: 40 }}
                  contentFit="contain"
                />
                <Text className="text-base font-medium text-grey-alpha-500">
                  Add Photos/Videos
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>

        {/* Media Picker Bottom Sheet */}
        <MediaPickerBottomSheet
          ref={mediaPickerRef}
          currentMedia={selectedMedia}
          onDone={handleMediaPickerDone}
        />

        {/* Audience Selection Bottom Sheet */}
        <AudienceBottomSheet
          ref={audienceBottomSheetRef}
          variant={audienceOfferType === 'everyone' ? 'see' : 'offer'}
          selectedType={audienceOfferType}
          onSelectAudience={handleSelectAudience}
        />
      </View>
    </KeyboardAvoidingView>
  );
}
