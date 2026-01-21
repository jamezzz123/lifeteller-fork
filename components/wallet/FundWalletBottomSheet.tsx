import React, { forwardRef, useState } from 'react';
import { View, Text, TouchableOpacity, Share } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import { Share2, Copy } from 'lucide-react-native';
import {
  BottomSheetComponent,
  BottomSheetRef,
} from '@/components/ui/BottomSheet';
import { Button } from '@/components/ui/Button';
import { Toast } from '@/components/ui/Toast';
import { colors } from '@/theme/colors';

interface FundWalletBottomSheetProps {
  bankName: string;
  accountNumber: string;
  accountName: string;
}

export const FundWalletBottomSheet = forwardRef<
  BottomSheetRef,
  FundWalletBottomSheetProps
>(({ bankName, accountNumber, accountName }, ref) => {
  const [showCopyToast, setShowCopyToast] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const accountDetails = `Bank: ${bankName}\nAccount Number: ${accountNumber}\nAccount Name: ${accountName}`;

  const handleCopy = async (field: 'accountNumber' | 'details', value: string) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      await Clipboard.setStringAsync(value);
      setCopiedField(field);
      setShowCopyToast(true);
    } catch (error) {
      console.error('Error copying:', error);
    }
  };

  const handleShare = async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      await Share.share({
        message: `Fund my Lifteller wallet:\n\n${accountDetails}`,
      });
    } catch (error) {
      console.error('Error sharing account details:', error);
    }
  };

  const getToastMessage = () => {
    if (copiedField === 'accountNumber') return 'Account number copied!';
    if (copiedField === 'details') return 'Account details copied!';
    return 'Copied!';
  };

  return (
    <>
      <Toast
        visible={showCopyToast}
        message={getToastMessage()}
        duration={2000}
        onHide={() => {
          setShowCopyToast(false);
          setCopiedField(null);
        }}
      />
      <BottomSheetComponent
        ref={ref}
        title="Fund wallet"
        snapPoints={['50%']}
      >
        <View className="px-6 pb-6">
          <View
            className="mb-6 rounded-3xl border px-5 py-6"
            style={{
              backgroundColor: colors['grey-plain']['50'],
              borderColor: colors['grey-plain']['300'],
            }}
          >
            <View className="flex-row items-start justify-between">
              <View className="flex-1 pr-3">
                <Text className="text-sm font-medium text-grey-plain-550">
                  Account number
                </Text>
                <Text className="text-2xl font-semibold text-grey-alpha-500">
                  {accountNumber}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => handleCopy('accountNumber', accountNumber)}
                className="rounded-xl border p-2"
                hitSlop={8}
                style={{
                  borderColor: colors['primary-tints'].purple['100'],
                  backgroundColor: colors['primary-tints'].purple['50'],
                }}
              >
                <Copy color={colors.primary.purple} size={18} strokeWidth={2} />
              </TouchableOpacity>
            </View>

            <View className="mt-6">
              <Text className="text-sm font-medium text-grey-plain-550">
                Account name
              </Text>
              <Text className="text-xl font-semibold text-grey-alpha-500">
                {accountName}
              </Text>
            </View>

            <View className="mt-6">
              <Text className="text-sm font-medium text-grey-plain-550">
                Bank
              </Text>
              <Text className="text-xl font-semibold text-grey-alpha-500">
                {bankName}
              </Text>
            </View>
          </View>

          <View className="flex-row gap-4">
            <Button
              title="Share"
              onPress={handleShare}
              variant="outline"
              className="w-[50%]"
              iconLeft={
                <Share2
                  color={colors.primary.purple}
                  size={20}
                  strokeWidth={2}
                />
              }
            />
            <Button
              title="Copy Details"
              onPress={() => handleCopy('details', accountDetails)}
              iconLeft={
                <Copy
                  color={colors['grey-plain']['50']}
                  size={20}
                  strokeWidth={2}
                />
              }
              className="flex-1"
            />
          </View>
        </View>
      </BottomSheetComponent>
    </>
  );
});

FundWalletBottomSheet.displayName = 'FundWalletBottomSheet';
