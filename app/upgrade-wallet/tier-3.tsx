import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput as RNTextInput,
  StyleSheet,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  CornerUpLeft,
  ChevronDown,
  Info,
  Upload,
  Check,
} from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';

import { Button } from '@/components/ui/Button';
import { colors } from '@/theme/colors';
import * as Haptics from 'expo-haptics';
import {
  BottomSheetComponent,
  BottomSheetRef,
} from '@/components/ui/BottomSheet';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';

type UtilityOption = 'electricity' | 'water' | 'gas' | null;

const UTILITY_OPTIONS = [
  { value: 'electricity', label: 'Electricity' },
  { value: 'water', label: 'Water' },
  { value: 'gas', label: 'Gas' },
];

export default function Tier3UpgradeScreen() {
  const router = useRouter();
  const [selectedUtility, setSelectedUtility] = useState<UtilityOption>(null);
  const [meterNumber, setMeterNumber] = useState('');
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showSuccessSheet, setShowSuccessSheet] = useState(false);
  const utilitySheetRef = useRef<BottomSheetRef>(null);
  const successSheetRef = useRef<BottomSheetRef>(null);

  const handleGoBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  const handleSelectUtility = (utility: UtilityOption) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedUtility(utility);
    utilitySheetRef.current?.close();
  };

  const handleOpenUtilityDropdown = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    utilitySheetRef.current?.expand();
  };

  const handleContactUs = () => {
    // TODO: Navigate to contact us
    console.log('Contact us');
  };

  const handleCaptureDocument = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    try {
      // Request permissions
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'We need access to your photos to upload utility bills.'
        );
        return;
      }

      // Show action sheet for camera or gallery
      Alert.alert(
        'Select Source',
        'Choose how you want to upload your utility bill',
        [
          {
            text: 'Camera',
            onPress: async () => {
              const result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                quality: 0.8,
              });

              if (!result.canceled && result.assets[0]) {
                setUploadedFile(result.assets[0].uri);
              }
            },
          },
          {
            text: 'Gallery',
            onPress: async () => {
              const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                quality: 0.8,
              });

              if (!result.canceled && result.assets[0]) {
                setUploadedFile(result.assets[0].uri);
              }
            },
          },
          {
            text: 'Cancel',
            style: 'cancel',
          },
        ]
      );
    } catch {
      Alert.alert('Error', 'Failed to upload document. Please try again.');
    }
  };

  const handleProceed = () => {
    if (!selectedUtility) {
      Alert.alert('Required', 'Please select a utility option');
      return;
    }

    if (!meterNumber.trim()) {
      Alert.alert('Required', 'Please enter your meter number');
      return;
    }

    if (!uploadedFile) {
      Alert.alert('Required', 'Please upload your utility bill');
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowConfirmation(true);
  };

  const handleConfirmSubmit = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowConfirmation(false);
    // Show success sheet after a brief delay
    setTimeout(() => {
      setShowSuccessSheet(true);
      setTimeout(() => {
        successSheetRef.current?.expand();
      }, 100);
    }, 300);
  };

  const handleCancelSubmit = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowConfirmation(false);
  };

  const handleGoToFeeds = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    successSheetRef.current?.close();
    setTimeout(() => {
      router.replace('/(tabs)/' as any);
    }, 300);
  };

  const handleGoToWallet = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    successSheetRef.current?.close();
    setTimeout(() => {
      router.replace('/(tabs)/wallet');
    }, 300);
  };

  const isFormValid =
    selectedUtility !== null &&
    meterNumber.trim().length > 0 &&
    uploadedFile !== null;

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'bottom']}>
      {/* Header */}
      <View className="flex-row items-center gap-4 border-b border-grey-plain-150 bg-white px-4 py-4">
        <TouchableOpacity onPress={handleGoBack} hitSlop={8}>
          <CornerUpLeft
            size={24}
            color={colors['grey-alpha']['500']}
            strokeWidth={2}
          />
        </TouchableOpacity>
        <Text className="flex-1 text-lg font-semibold text-grey-alpha-500">
          Upgrade to tier 3
        </Text>
      </View>

      {/* Content */}
      <ScrollView
        className="flex-1 bg-grey-plain-50"
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="rounded-t-3xl bg-white px-4 pt-6">
          {/* Select an option */}
          <View className="mb-6">
            <Text className="mb-3 text-base font-medium text-grey-alpha-500">
              Select an option
            </Text>

            <TouchableOpacity
              onPress={handleOpenUtilityDropdown}
              className="flex-row items-center justify-between rounded-xl border border-grey-plain-300 bg-white px-4 py-4"
              style={{ minHeight: 56 }}
              activeOpacity={0.7}
            >
              <Text
                className="flex-1 text-base"
                style={{
                  color: selectedUtility
                    ? colors['grey-alpha']['500']
                    : colors['grey-alpha']['250'],
                }}
              >
                {selectedUtility
                  ? UTILITY_OPTIONS.find((opt) => opt.value === selectedUtility)
                      ?.label
                  : '- Choose an option -'}
              </Text>
              <ChevronDown
                size={20}
                color={colors['grey-alpha']['400']}
                strokeWidth={2}
              />
            </TouchableOpacity>
          </View>

          {/* Enter your meter number */}
          <View className="mb-6">
            <Text className="mb-3 text-base font-medium text-grey-alpha-500">
              Enter your meter number
            </Text>

            <View
              className="rounded-xl border border-grey-plain-300 bg-white px-4 py-4"
              style={{ minHeight: 56 }}
            >
              <RNTextInput
                value={meterNumber}
                onChangeText={setMeterNumber}
                placeholder="Enter your meter number"
                placeholderTextColor={colors['grey-alpha']['400']}
                keyboardType="default"
                className="flex-1 text-base text-grey-alpha-500"
                style={{ fontSize: 16 }}
              />
            </View>
          </View>

          {/* Upload selected utility bill */}
          <View className="mb-6">
            <Text className="mb-3 text-base font-medium text-grey-alpha-500">
              Upload selected utility bill
            </Text>

            <TouchableOpacity
              onPress={handleCaptureDocument}
              activeOpacity={0.7}
              style={styles.uploadContainer}
            >
              {uploadedFile ? (
                <View className="items-center justify-center py-6">
                  <Text className="mb-2 text-base font-medium text-primary">
                    Document uploaded
                  </Text>
                  <Text className="text-sm text-grey-alpha-400">
                    Tap to change
                  </Text>
                </View>
              ) : (
                <View className="items-center justify-center py-8">
                  <Upload
                    size={32}
                    color={colors.primary.purple}
                    strokeWidth={2}
                  />
                  <Text
                    className="mt-3 text-base font-medium"
                    style={{ color: colors.primary.purple }}
                  >
                    Capture
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Information Note */}
          <View className="mb-6 flex-row items-start gap-2">
            <Info
              size={16}
              color={colors['grey-plain']['550']}
              strokeWidth={2}
            />
            <Text className="flex-1 text-sm leading-5 text-grey-plain-550">
              Utility bill must not be more than 3 months old.
            </Text>
          </View>

          {/* Contact Us */}
          <View className="mb-8 px-4">
            <Text className="text-center text-sm text-grey-plain-550">
              Kindly{' '}
              <Text
                onPress={handleContactUs}
                className="text-primary-purple underline"
              >
                contact us
              </Text>{' '}
              if you are experiencing any issue.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View className="absolute bottom-0 left-0 right-0 flex-row items-center justify-between border-t border-grey-plain-150 bg-white px-4 py-4">
        <TouchableOpacity onPress={handleGoBack} hitSlop={8}>
          <Text className="text-base font-medium text-grey-alpha-500">
            Go back
          </Text>
        </TouchableOpacity>
        <Button
          title="Proceed"
          onPress={handleProceed}
          variant="primary"
          size="medium"
          disabled={!isFormValid}
        />
      </View>

      {/* Utility Options Bottom Sheet */}
      <BottomSheetComponent ref={utilitySheetRef} snapPoints={['40%']}>
        <View className="px-6 pb-8">
          <Text className="mb-6 text-lg font-bold text-grey-alpha-500">
            Select an option
          </Text>

          {UTILITY_OPTIONS.map((option, index) => (
            <TouchableOpacity
              key={option.value}
              onPress={() => handleSelectUtility(option.value as UtilityOption)}
              className={`py-4 ${
                index !== UTILITY_OPTIONS.length - 1
                  ? 'border-b border-grey-plain-300'
                  : ''
              }`}
              activeOpacity={0.7}
            >
              <Text
                className="text-base font-medium"
                style={{
                  color:
                    selectedUtility === option.value
                      ? colors.primary.purple
                      : colors['grey-alpha']['500'],
                }}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </BottomSheetComponent>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        visible={showConfirmation}
        title="Submit utility bill"
        message="Are you sure you want to submit this document as your utility bill?"
        confirmText="Yes, submit"
        cancelText="No"
        onConfirm={handleConfirmSubmit}
        onCancel={handleCancelSubmit}
      />

      {/* Success Bottom Sheet */}
      {showSuccessSheet && (
        <UtilityBillSuccessBottomSheet
          ref={successSheetRef}
          onGoToFeeds={handleGoToFeeds}
          onGoToWallet={handleGoToWallet}
        />
      )}
    </SafeAreaView>
  );
}

// Success Bottom Sheet Component
const UtilityBillSuccessBottomSheet = React.forwardRef<
  BottomSheetRef,
  {
    onGoToFeeds: () => void;
    onGoToWallet: () => void;
  }
>(({ onGoToFeeds, onGoToWallet }, ref) => {
  return (
    <BottomSheetComponent ref={ref} snapPoints={['50%']}>
      <View className="items-center px-6 pb-8 pt-4">
        {/* Success Icon with Confetti Effect */}
        <View className="mb-6 items-center">
          <View className="relative">
            {/* Green Checkmark Circle */}
            <View
              className="h-16 w-16 items-center justify-center rounded-full"
              style={{ backgroundColor: colors.state.green }}
            >
              <Check color="#FFFFFF" size={32} strokeWidth={3} />
            </View>
            {/* Confetti elements */}
            <View
              className="absolute -right-2 -top-2 h-3 w-3 rounded-full"
              style={{ backgroundColor: colors.primary.purple }}
            />
            <View
              className="absolute -bottom-2 -left-2 h-2 w-2 rounded-full"
              style={{ backgroundColor: colors.yellow['50'] }}
            />
            <View
              className="absolute -right-4 top-4 h-2 w-2 rounded-full"
              style={{ backgroundColor: colors.state.green }}
            />
          </View>
        </View>

        {/* Title */}
        <Text className="mb-2 text-2xl font-bold text-grey-alpha-500">
          Utility bill submitted successfully
        </Text>

        {/* Description */}
        <Text className="mb-8 text-center text-base text-grey-plain-550">
          You have successfully submitted your utility bill.
        </Text>

        {/* Buttons */}
        <View className="w-full flex-row gap-3">
          {/* Go to Feeds Button */}
          <View className="flex-1">
            <Button
              title="Go to feeds"
              onPress={onGoToFeeds}
              variant="outline"
              className="w-full"
            />
          </View>

          {/* Go to Wallet Button (Primary) */}
          <View className="flex-1">
            <Button
              title="Go to wallet"
              onPress={onGoToWallet}
              variant="primary"
              className="w-full"
            />
          </View>
        </View>
      </View>
    </BottomSheetComponent>
  );
});

UtilityBillSuccessBottomSheet.displayName = 'UtilityBillSuccessBottomSheet';

const styles = StyleSheet.create({
  uploadContainer: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.primary.purple,
    borderRadius: 16,
    backgroundColor: colors['primary-tints']['purple']['50'],
    minHeight: 120,
    width: '50%',
    alignSelf: 'flex-start',
  },
});
