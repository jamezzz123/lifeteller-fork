import { useState, useEffect, useCallback, useRef } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Switch,
} from 'react-native';
import { router, Href } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { User } from 'lucide-react-native';

import { colors } from '@/theme/colors';
import { ContactRow } from '@/components/lift';
import { MaterialInput } from '@/components/ui/MaterialInput';
import { Dropdown } from '@/components/ui/Dropdown';
import {
  LiftSettingsBottomSheet,
  LiftSettingsBottomSheetRef,
} from '@/components/lift/LiftSettingsBottomSheet';
import {
  NumberOfRecipientsBottomSheet,
  NumberOfRecipientsBottomSheetRef,
} from '@/components/lift/NumberOfRecipientsBottomSheet';
import { useOfferLiftProfile } from './context';

const MESSAGE_MAX_LENGTH = 400;

export default function Step2Screen() {
  const {
    selectedRecipient,
    liftType,
    setLiftType,
    numberOfRecipients,
    setNumberOfRecipients,
    offerMessage,
    setOfferMessage,
    offerAmount,
    setOfferAmount,
    isAnonymous,
    setIsAnonymous,
    setHeaderTitle,
    setNextButtonLabel,
    setCanProceed,
    onNextRef,
  } = useOfferLiftProfile();

  const liftSettingsSheetRef = useRef<LiftSettingsBottomSheetRef>(null);
  const numberOfRecipientsSheetRef = useRef<NumberOfRecipientsBottomSheetRef>(null);

  const [amountText, setAmountText] = useState(
    offerAmount > 0 ? offerAmount.toString() : ''
  );

  // Validation: message and amount required
  const isValid =
    offerMessage.trim().length > 0 &&
    offerAmount > 0 &&
    selectedRecipient !== null;

  const handleNext = useCallback(() => {
    if (!isValid) return;
    router.push('/offer-lift-profile/step-3' as Href);
  }, [isValid]);

  // Update canProceed and Next handler
  useEffect(() => {
    setHeaderTitle('Offer lift');
    setNextButtonLabel('Preview');
    setCanProceed(isValid);
    onNextRef.current = handleNext;
    return () => {
      onNextRef.current = null;
    };
  }, [
    isValid,
    setCanProceed,
    handleNext,
    onNextRef,
    setHeaderTitle,
    setNextButtonLabel,
  ]);

  function handleAmountChange(text: string) {
    // Remove non-numeric characters
    const cleaned = text.replace(/[^0-9]/g, '');
    setAmountText(cleaned);
    setOfferAmount(cleaned ? parseInt(cleaned, 10) : 0);
  }

  const handleOpenLiftSettings = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    liftSettingsSheetRef.current?.expand();
  }, []);

  const handleSelectOneToOne = useCallback(() => {
    setLiftType('one-to-one');
  }, [setLiftType]);

  const handleSelectOneToMany = useCallback(() => {
    setLiftType('one-to-many');
    // Open the number of recipients sheet
    setTimeout(() => {
      numberOfRecipientsSheetRef.current?.expand();
    }, 300);
  }, [setLiftType]);

  const handleConfirmNumberOfRecipients = useCallback(
    (count: number) => {
      setNumberOfRecipients(count);
    },
    [setNumberOfRecipients]
  );

  const getDropdownLabel = () => {
    if (liftType === 'one-to-one') {
      return 'One-to-one';
    }
    return `One-to-many (${numberOfRecipients})`;
  };

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
          {/* Selected Recipient */}
          <View className="mt-5 px-4">
            <Text className="text-sm font-inter-semibold text-grey-alpha-450">
              Offer to:
            </Text>

            {selectedRecipient && (
              <TouchableOpacity
                onPress={() => router.back()}
                className="mt-3 flex-row items-center"
              >
                <View className="flex-1">
                  <ContactRow
                    key={selectedRecipient?.id}
                    contact={selectedRecipient as any}
                    isSelected={false}
                    onSelect={() => {}}
                    disabled={false}
                  />
                </View>
                <View className="flex-2">
                  <Dropdown
                    label={getDropdownLabel()}
                    onPress={handleOpenLiftSettings}
                  />
                </View>
              </TouchableOpacity>
            )}
          </View>

          {/* Message Input */}
          <View className="mt-5 px-4">
            <MaterialInput
              value={offerMessage}
              onChangeText={(text) => {
                if (text.length <= MESSAGE_MAX_LENGTH) {
                  setOfferMessage(text);
                }
              }}
              placeholder="Chop your life G!! Happy birthday to you"
              multiline
              size="small"
              numberOfLines={2}
              returnKeyType="default"
              helperText="Happy Friendship Day"
            />
          </View>

          <View className="mt-5 px-4">
            <MaterialInput
              placeholder="Describe your lift offer here"
              multiline
              size="small"
              numberOfLines={2}
              returnKeyType="default"
              helperText="You can also tag others. Maximum of 400 characters"
            />
          </View>

          {/* Amount Input */}
          <View className="mt-6 px-4">
            <Text className="mb-3 text-sm font-inter-semibold text-grey-alpha-450">
              Amount
            </Text>
            <MaterialInput
              label=""
              prefix="₦"
              value={amountText}
              onChangeText={handleAmountChange}
              keyboardType="numeric"
              placeholder="0"
            />
          </View>

          {/* Offer Anonymously */}
          <View className="mt-6 px-4">
            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setIsAnonymous(!isAnonymous);
              }}
              className="flex-row items-center justify-between rounded-2xl bg-grey-plain-50 p-4"
              activeOpacity={0.7}
            >
              <View className="flex-1 flex-row items-start gap-3">
                <User
                  size={20}
                  color={colors['grey-alpha']['450']}
                  strokeWidth={2}
                />
                <View className="flex-1">
                  <Text className="text-base font-inter-semibold text-grey-alpha-500">
                    Offer lift anonymously
                  </Text>
                  <Text className="mt-1 text-sm text-grey-alpha-400">
                    People who see and join your lift offer won&apos;t know it is
                    you.
                  </Text>
                </View>
              </View>
              <Switch
                value={isAnonymous}
                onValueChange={(value) => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setIsAnonymous(value);
                }}
                trackColor={{
                  false: colors['grey-alpha']['250'],
                  true: colors.primary.purple,
                }}
                thumbColor="#FFFFFF"
              />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>

      {/* Lift Settings Bottom Sheet */}
      <LiftSettingsBottomSheet
        ref={liftSettingsSheetRef}
        onSelectOneToOne={handleSelectOneToOne}
        onSelectOneToMany={handleSelectOneToMany}
        numberOfRecipients={numberOfRecipients}
      />

      {/* Number of Recipients Bottom Sheet */}
      <NumberOfRecipientsBottomSheet
        ref={numberOfRecipientsSheetRef}
        initialValue={numberOfRecipients}
        onConfirm={handleConfirmNumberOfRecipients}
      />
    </KeyboardAvoidingView>
  );
}
