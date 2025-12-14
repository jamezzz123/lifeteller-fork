import { forwardRef } from 'react';
import { Text, View } from 'react-native';
import { Check } from 'lucide-react-native';

import { Button } from '@/components/ui/Button';
import {
  BottomSheetComponent,
  BottomSheetRef,
} from '@/components/ui/BottomSheet';

type RequestSuccessBottomSheetProps = {
  onGoToFeeds: () => void;
  onShareRequest: () => void;
};

export const RequestSuccessBottomSheet = forwardRef<
  BottomSheetRef,
  RequestSuccessBottomSheetProps
>(({ onGoToFeeds, onShareRequest }, ref) => {
  return (
    <BottomSheetComponent ref={ref}>
      <View className="px-6">
        {/* Success Icon */}
        <View className="mb-6 items-center">
          <View
            className="size-16 items-center justify-center  rounded-2xl"
            style={{ backgroundColor: '#059652' }}
          >
            <Check size={32} color="#FFFFFF" strokeWidth={3} />
          </View>
        </View>

        {/* Title */}
        <Text className="mb-3 text-center text-xl font-bold text-grey-alpha-500">
          Lift request successfully posted
        </Text>

        {/* Description */}
        <Text className="mb-8 text-center text-sm leading-5 text-grey-alpha-400">
          We have created and posted your lift request. We will notify you of
          all interaction with you request.
        </Text>
      </View>

      {/* Action Buttons - Side by side */}
      <View className="flex-row justify-between gap-3   border-t border-grey-alpha-250 bg-grey-alpha-150 px-4 py-2">
        {/* <View className="flex-1"> */}
        <Button title="Go to feeds" onPress={onGoToFeeds} variant="outline" />
        {/* </View> */}
        {/* <View className="flex-1"> */}
        <Button
          title="Share lift request"
          onPress={onShareRequest}
          variant="primary"
        />
        {/* </View> */}
      </View>
    </BottomSheetComponent>
  );
});

RequestSuccessBottomSheet.displayName = 'RequestSuccessBottomSheet';
