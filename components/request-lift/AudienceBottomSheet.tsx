import { Text, TouchableOpacity, View } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import {
  BottomSheetComponent,
  BottomSheetRef,
} from '@/components/ui/BottomSheet';
import { colors } from '@/theme/colors';
import { AudienceOfferType } from '@/app/request-lift/context';
import { forwardRef } from 'react';

type AudienceOption = {
  type: AudienceOfferType;
  label: string;
  description: string;
};

const SEE_AUDIENCE_OPTIONS: AudienceOption[] = [
  {
    type: 'everyone',
    label: 'Everyone',
    description: 'All users on Lifeteller can see this raised lift.',
  },
  {
    type: 'friends',
    label: 'Friends (1.7k)',
    description: 'People I follow, and they follow back',
  },
  {
    type: 'selected-people',
    label: 'Selected people',
    description: 'Choose specific people to see your raised lift.',
  },
  {
    type: 'my-list',
    label: 'My list',
    description: 'Choose from existing list or create a new one',
  },
  {
    type: 'private',
    label: 'Private',
    description: 'You can still share the link with others.',
  },
];

const OFFER_AUDIENCE_OPTIONS: AudienceOption[] = [
  {
    type: 'everyone',
    label: 'Everyone',
    description:
      'Your request will be available on feeds and all users on Lifeteller can offer you this lift.',
  },
  {
    type: 'friends',
    label: 'Friends (1.7k)',
    description:
      'Only people who follow me, and I follow back can see my request and offer me this lift.',
  },
  {
    type: 'chat-direct',
    label: 'Request via chat/direct message',
    description:
      'Select a specific person or people to request from. It won’t appear on feeds.',
  },
  {
    type: 'my-list',
    label: 'My list',
    description:
      'Choose from existing list or create a new one to see your request and offer you this lift.',
  },
  {
    type: 'private',
    label: 'Private',
    description: 'You can still share your request link with others.',
  },
];

type AudienceBottomSheetProps = {
  onSelectAudience: (type: AudienceOfferType) => void;
  variant?: 'see' | 'offer';
  selectedType?: AudienceOfferType;
};

export const AudienceBottomSheet = forwardRef<
  BottomSheetRef,
  AudienceBottomSheetProps
>(({ onSelectAudience, variant = 'see', selectedType }, ref) => {
  function handleSelect(type: AudienceOfferType) {
    onSelectAudience(type);
  }

  const options =
    variant === 'offer' ? OFFER_AUDIENCE_OPTIONS : SEE_AUDIENCE_OPTIONS;
  const title =
    variant === 'offer'
      ? 'Who can offer me this lift'
      : 'Who can see the lift I am raising';

  return (
    <BottomSheetComponent ref={ref} snapPoints={['60%']}>
      <View className="px-4 pb-4">
        <Text className="mb-4 text-lg font-bold text-grey-alpha-500">
          {title}
        </Text>

        <View className="gap-4">
          {options.map((option) => {
            const isSelected = option.type === selectedType;
            return (
              <TouchableOpacity
                key={option.type}
                onPress={() => handleSelect(option.type)}
                className="flex-row items-center"
              >
                <View
                  className="mr-3 self-stretch rounded-xl"
                  style={{
                    width: 4,
                    backgroundColor: isSelected
                      ? colors.primary.purple
                      : 'transparent',
                  }}
                />
                <View className="flex-1 flex-row items-center justify-between">
                  <View className="flex-1">
                    <Text
                      className="mb-1 text-base font-medium"
                      style={{
                        color: isSelected
                          ? colors.primary.purple
                          : colors['grey-alpha']['500'],
                      }}
                    >
                      {option.label}
                    </Text>
                    <Text
                      className="text-sm"
                      style={{
                        color: isSelected
                          ? colors['grey-alpha']['500']
                          : colors['grey-alpha']['400'],
                      }}
                    >
                      {option.description}
                    </Text>
                  </View>
                  <ChevronRight
                    size={20}
                    color={
                      isSelected
                        ? colors.primary.purple
                        : colors['grey-alpha']['400']
                    }
                    strokeWidth={2}
                  />
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </BottomSheetComponent>
  );
});

AudienceBottomSheet.displayName = 'AudienceBottomSheet';
