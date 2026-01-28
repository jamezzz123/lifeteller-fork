import { forwardRef } from 'react';
import { Text, View } from 'react-native';

import SuccessIcon from '@/assets/images/SuccessIcon.svg';
import { Button } from '@/components/ui/Button';
import {
  BottomSheetComponent,
  BottomSheetRef,
} from '@/components/ui/BottomSheet';

type RequestSuccessBottomSheetProps = {
  onGoToFeeds: () => void;
  onShareRequest: () => void;
  title?: string;
  description?: string;
  primaryButtonTitle?: string;
  secondaryButtonTitle?: string;
};

export const RequestSuccessBottomSheet = forwardRef<
  BottomSheetRef,
  RequestSuccessBottomSheetProps
>(
  (
    {
      onGoToFeeds,
      onShareRequest,
      title = 'Lift request successfully posted',
      description = 'We have created and posted your lift request. We will notify you of all interaction with you request.',
      primaryButtonTitle = 'Share lift request',
      secondaryButtonTitle = 'Go to feeds',
    },
    ref
  ) => {
    return (
      <BottomSheetComponent ref={ref}>
        <View className="px-6">
          {/* Success Icon */}
          <View className="mb-6 items-center">
            <SuccessIcon width={106} height={81} />
          </View>

          {/* Title */}
          <Text className="mb-3 text-center font-inter-bold text-xl text-grey-alpha-500">
            {title}
          </Text>

          {/* Description */}
          <Text className="mb-8 text-center font-inter text-sm leading-5 text-grey-alpha-400">
            {description}
          </Text>
        </View>

        {/* Action Buttons - Side by side */}
        <View className="flex-row justify-between gap-3   border-t border-grey-alpha-250 bg-grey-alpha-150 px-4 py-2">
          {/* <View className="flex-1"> */}
          <Button
            title={secondaryButtonTitle}
            onPress={onGoToFeeds}
            variant="outline"
          />
          {/* </View> */}
          {/* <View className="flex-1"> */}
          <Button
            title={primaryButtonTitle}
            onPress={onShareRequest}
            variant="primary"
          />
          {/* </View> */}
        </View>
      </BottomSheetComponent>
    );
  }
);

RequestSuccessBottomSheet.displayName = 'RequestSuccessBottomSheet';
