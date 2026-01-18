import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput as RNTextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { CornerUpLeft, Info } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/Button';
import { colors } from '@/theme/colors';
import * as Haptics from 'expo-haptics';

export default function BVNFormScreen() {
  const router = useRouter();
  const [bvn, setBvn] = useState('');

  const handleGoBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  const handleProceed = () => {
    if (!bvn.trim()) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Navigate to OTP verification
    router.push({
      pathname: '/upgrade-wallet/verify-otp' as any,
      params: { type: 'bvn', phoneNumber: '+2348134***778' },
    });
  };

  const handleContactUs = () => {
    // TODO: Navigate to contact us
    console.log('Contact us');
  };

  const isFormValid = bvn.trim().length >= 11;

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
        <Text className="flex-1 text-lg font-inter-semibold text-grey-alpha-500">
          Upgrade to tier 1
        </Text>
      </View>

      {/* Content */}
      <ScrollView
        className="flex-1 bg-grey-plain-50"
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="rounded-t-3xl bg-white px-4 pt-6">
          {/* Enter your BVN number */}
          <View className="mb-6">
            <Text className="mb-2 text-base font-inter-medium text-grey-alpha-500">
              Enter your BVN number
            </Text>

            <View
              className="rounded-xl border border-grey-plain-300 bg-white px-4 py-4"
              style={{ minHeight: 56 }}
            >
              <RNTextInput
                value={bvn}
                onChangeText={setBvn}
                placeholder="Enter your BVN"
                placeholderTextColor={colors['grey-alpha']['400']}
                keyboardType="number-pad"
                maxLength={11}
                className="flex-1 text-base text-grey-alpha-500"
                style={{ fontSize: 16 }}
              />
            </View>

            {/* Helper Text */}
            <View className="mt-3 flex-row items-start gap-2">
              <Info
                size={16}
                color={colors['grey-plain']['550']}
                strokeWidth={2}
              />
              <Text className="flex-1 text-sm leading-5 text-grey-plain-550">
                Dial *565*0# on your registered number to get your BVN.
              </Text>
            </View>
          </View>

          {/* Contact Us */}
          <View className="mb-8">
            <Text className="text-center text-sm text-grey-plain-550">
              Kindly{' '}
              <TouchableOpacity onPress={handleContactUs}>
                <Text className="text-primary-purple underline">contact us</Text>
              </TouchableOpacity>{' '}
              if you are experiencing any issue.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View className="absolute bottom-0 left-0 right-0 flex-row items-center justify-between border-t border-grey-plain-150 bg-white px-4 py-4">
        <TouchableOpacity onPress={handleGoBack} hitSlop={8}>
          <Text className="text-base font-inter-medium text-grey-alpha-500">
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
    </SafeAreaView>
  );
}

