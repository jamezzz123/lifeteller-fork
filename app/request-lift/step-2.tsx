import { useMemo, useState, useEffect, useCallback } from 'react';
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
import { Info, ChevronRight } from 'lucide-react-native';

import { colors } from '@/theme/colors';
import {
  RequestMethodSelector,
  LiftTypeSelector,
  LiftTypeModal,
  filterTitleSuggestions,
  LiftType,
} from '@/components/request-lift';
import { LiftItem, useRequestLift } from './context';

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
    setLiftType,
    liftAmount,
    setLiftAmount,
    liftItems,
    setLiftItems,
    setCanProceed,
    onNextRef,
  } = useRequestLift();

  const [showTitleSuggestions, setShowTitleSuggestions] = useState(false);
  const [showLiftTypeModal, setShowLiftTypeModal] = useState(false);
  const [pendingLiftType, setPendingLiftType] = useState<LiftType>(null);

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
    setCanProceed(isValid);
    onNextRef.current = handleNext;
    return () => {
      onNextRef.current = null;
    };
  }, [isValid, setCanProceed, handleNext, onNextRef]);

  function handleTitleChange(text: string) {
    if (text.length <= TITLE_MAX_LENGTH) {
      setLiftTitle(text);
      setShowTitleSuggestions(text.length > 0);
    }
  }

  function handleSelectSuggestion(suggestion: string) {
    setLiftTitle(suggestion);
    setShowTitleSuggestions(false);
  }

  function handleRequestMethodPress() {
    // Navigate back to step 1 to modify selected contacts
    router.back();
  }

  function handleOpenLiftTypeModal(type?: LiftType) {
    setPendingLiftType(type ?? liftType);
    setShowLiftTypeModal(true);
  }

  function handleCloseLiftTypeModal() {
    setShowLiftTypeModal(false);
    setPendingLiftType(null);
  }

  function handleLiftTypeModalDone(
    type: LiftType,
    amount: number,
    items: LiftItem[]
  ) {
    setLiftType(type);
    setLiftAmount(amount);
    setLiftItems(items);
    setShowLiftTypeModal(false);
    setPendingLiftType(null);
  }

  const hasMonetary = liftAmount > 0;
  const hasNonMonetary = liftItems.length > 0;
  const showTypeSelector = !hasMonetary && !hasNonMonetary;
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
          contentContainerStyle={{ paddingBottom: 32 }}
        >
          {/* Request Method Selector */}
          <View className="pt-5">
            <RequestMethodSelector
              selectedCount={selectedContacts.length}
              userAvatar={require('../../assets/images/welcome/collage-1.jpg')}
              onPress={handleRequestMethodPress}
            />
          </View>

          {/* Title Input */}
          <View className="relative z-10 mt-5 px-4">
            <TextInput
              value={liftTitle}
              onChangeText={handleTitleChange}
              placeholder="Enter lift title"
              placeholderTextColor={colors['grey-alpha']['250']}
              className="border-b-2 border-primary pb-2 text-lg text-grey-alpha-500"
              returnKeyType="next"
              onFocus={() => setShowTitleSuggestions(liftTitle.length > 0)}
              onBlur={() => {
                // Delay to allow suggestion tap to register
                setTimeout(() => setShowTitleSuggestions(false), 200);
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
              <View className="absolute left-4 right-4 top-full z-50 mt-1 overflow-hidden rounded-2xl border border-grey-plain-450/70 bg-grey-plain-50 shadow-lg">
                {titleSuggestions.slice(0, 4).map((suggestion, index) => (
                  <TouchableOpacity
                    key={suggestion}
                    onPress={() => handleSelectSuggestion(suggestion)}
                    className={`px-4 py-3 ${
                      index < titleSuggestions.slice(0, 4).length - 1
                        ? 'border-b border-grey-plain-450/60'
                        : ''
                    }`}
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
              className="min-h-[20px] border-b-2 border-primary pb-2 text-base text-grey-alpha-500"
              multiline
              textAlignVertical="top"
              returnKeyType="default"
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
          </View>

          {/* Type Selector */}
          {showTypeSelector ? (
            <View className="mt-5">
              <LiftTypeSelector
                selectedType={pendingLiftType ?? liftType}
                onSelectType={handleOpenLiftTypeModal}
              />
            </View>
          ) : (
            <View className="mt-6 gap-3 px-4">
              {hasMonetary && (
                <TouchableOpacity
                  onPress={() => handleOpenLiftTypeModal('Monetary')}
                  className="flex-row items-center justify-between rounded-2xl border border-grey-plain-450/60 bg-grey-plain-50 px-4 py-3"
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
                  onPress={() => handleOpenLiftTypeModal('Non-monetary')}
                  className="flex-row items-center justify-between rounded-2xl border border-grey-plain-450/60 bg-grey-plain-50 px-4 py-3"
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
            </View>
          )}
        </ScrollView>

        {/* Lift Type Modal */}
        <LiftTypeModal
          visible={showLiftTypeModal}
          currentType={pendingLiftType ?? liftType}
          currentAmount={liftAmount}
          currentItems={liftItems}
          onDone={handleLiftTypeModalDone}
          onClose={handleCloseLiftTypeModal}
        />
      </View>
    </KeyboardAvoidingView>
  );
}
