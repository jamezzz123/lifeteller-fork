import { forwardRef } from 'react';
import { Text, View } from 'react-native';
import { Check } from 'lucide-react-native';

import { Button } from '@/components/ui/Button';
import {
  BottomSheetComponent,
  BottomSheetRef,
} from '@/components/ui/BottomSheet';

type LiftSuccessBottomSheetProps = {
  recipientName: string;
  onGoToFeeds: () => void;
  onGoToMyLifts: () => void;
};

export const LiftSuccessBottomSheet = forwardRef<
  BottomSheetRef,
  LiftSuccessBottomSheetProps
>(({ recipientName, onGoToFeeds, onGoToMyLifts }, ref) => {
  return (
    <BottomSheetComponent ref={ref}>
      <View className="px-6 pb-4">
        {/* Success Icon */}
        <View className="mb-6 items-center">
          <View
            className="size-20 items-center justify-center rounded-2xl"
            style={{ backgroundColor: '#059652' }}
          >
            <Check size={48} color="#FFFFFF" strokeWidth={3} />
          </View>
        </View>

        {/* Title */}
        <Text className="mb-3 text-center text-2xl font-bold text-grey-alpha-500">
          Lift successfully sent
        </Text>

        {/* Description */}
        <Text className="mb-8 text-center text-base leading-6 text-grey-alpha-400">
          Your lift has been sent to{' '}
          <Text className="font-semibold text-grey-alpha-500">
            {recipientName}
          </Text>
          , and we have credited their lift wallet.
        </Text>

        {/* Action Buttons */}
        <View className="flex-row gap-3">
          <View className="flex-1">
            <Button
              title="Go to feeds"
              onPress={onGoToFeeds}
              variant="outline"
            />
          </View>
          <View className="flex-1">
            <Button
              title="Go to my lifts"
              onPress={onGoToMyLifts}
              variant="primary"
            />
          </View>
        </View>
      </View>
    </BottomSheetComponent>
  );
});

LiftSuccessBottomSheet.displayName = 'LiftSuccessBottomSheet';
