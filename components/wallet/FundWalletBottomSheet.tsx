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

  const handleCopy = async (field: 'accountNumber' | 'accountName' | 'bankName', value: string) => {
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
      const accountDetails = `Bank: ${bankName}\nAccount Number: ${accountNumber}\nAccount Name: ${accountName}`;
      await Share.share({
        message: `Fund my Lifteller wallet:\n\n${accountDetails}`,
      });
    } catch (error) {
      console.error('Error sharing account details:', error);
    }
  };

  const getToastMessage = () => {
    if (copiedField === 'accountNumber') return 'Account number copied!';
    if (copiedField === 'accountName') return 'Account name copied!';
    if (copiedField === 'bankName') return 'Bank name copied!';
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
        <View className="px-6">
          {/* Instructions */}
          <Text className="mb-6 text-base text-grey-plain-550">
            Transfer funds to the account details below to fund your wallet.
          </Text>

          {/* Bank Account Information Card */}
          <View
            className="mb-6 rounded-xl border p-4"
            style={{
              backgroundColor: colors['grey-plain']['50'],
              borderColor: colors['grey-plain']['300'],
            }}
          >
            {/* Bank Name */}
            <View className="mb-4">
              <Text className="mb-2 text-xs font-inter-medium text-grey-plain-550">
                Bank Name
              </Text>
              <View className="flex-row items-center justify-between">
                <Text className="flex-1 text-base font-inter-semibold text-grey-alpha-500">
                  {bankName}
                </Text>
                <TouchableOpacity
                  onPress={() => handleCopy('bankName', bankName)}
                  className="ml-2"
                  hitSlop={8}
                >
                  <Copy
                    color={colors['grey-alpha']['500']}
                    size={18}
                    strokeWidth={2}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Divider */}
            <View
              className="mb-4 h-px"
              style={{ backgroundColor: colors['grey-plain']['300'] }}
            />

            {/* Account Number */}
            <View className="mb-4">
              <Text className="mb-2 text-xs font-inter-medium text-grey-plain-550">
                Account Number
              </Text>
              <View className="flex-row items-center justify-between">
                <Text className="flex-1 text-base font-inter-semibold text-grey-alpha-500">
                  {accountNumber}
                </Text>
                <TouchableOpacity
                  onPress={() => handleCopy('accountNumber', accountNumber)}
                  className="ml-2"
                  hitSlop={8}
                >
                  <Copy
                    color={colors['grey-alpha']['500']}
                    size={18}
                    strokeWidth={2}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Divider */}
            <View
              className="mb-4 h-px"
              style={{ backgroundColor: colors['grey-plain']['300'] }}
            />

            {/* Account Name */}
            <View>
              <Text className="mb-2 text-xs font-inter-medium text-grey-plain-550">
                Account Name
              </Text>
              <View className="flex-row items-center justify-between">
                <Text className="flex-1 text-base font-inter-semibold text-grey-alpha-500">
                  {accountName}
                </Text>
                <TouchableOpacity
                  onPress={() => handleCopy('accountName', accountName)}
                  className="ml-2"
                  hitSlop={8}
                >
                  <Copy
                    color={colors['grey-alpha']['500']}
                    size={18}
                    strokeWidth={2}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Share Button */}
          <Button
            title="Share account details"
            onPress={handleShare}
            variant="outline"
            iconLeft={
              <Share2
                color={colors.primary.purple}
                size={20}
                strokeWidth={2}
              />
            }
            className="w-full"
          />
        </View>
      </BottomSheetComponent>
    </>
  );
});

FundWalletBottomSheet.displayName = 'FundWalletBottomSheet';
