import { Text, TouchableOpacity, View } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import {
  BottomSheetComponent,
  BottomSheetRef,
} from '@/components/ui/BottomSheet';
import { colors } from '@/theme/colors';
import { forwardRef } from 'react';

export type AudienceOption = {
  key: string;
  label: string;
  description: string;
};

const SEE_AUDIENCE_OPTIONS: AudienceOption[] = [
  {
    key: 'everyone',
    label: 'Everyone',
    description: 'All users on Lifeteller can see this raised lift.',
  },
  {
    key: 'friends',
    label: 'Friends (1.7k)',
    description: 'People I follow, and they follow back',
  },
  {
    key: 'selected-people',
    label: 'Selected people',
    description: 'Choose specific people to see your raised lift.',
  },
  {
    key: 'my-list',
    label: 'My list',
    description: 'Choose from existing list or create a new one',
  },
  {
    key: 'friends-except',
    label: 'Friends except',
    description: 'Don`t show to some connections',
  },
  {
    key: 'private',
    label: 'Private',
    description: 'You can still share the link with others.',
  },
];

const OFFER_AUDIENCE_OPTIONS: AudienceOption[] = [
  {
    key: 'everyone',
    label: 'Everyone',
    description:
      'Your request will be available on feeds and all users on Lifeteller can offer you this lift.',
  },
  {
    key: 'friends',
    label: 'Friends (1.7k)',
    description:
      'Only people who follow me, and I follow back can see my request and offer me this lift.',
  },
  {
    key: 'chat-direct',
    label: 'Request via chat/direct message',
    description:
      "Select a specific person or people to request from. It won't appear on feeds.",
  },
  {
    key: 'my-list',
    label: 'My list',
    description:
      'Choose from existing list or create a new one to see your request and offer you this lift.',
  },
  {
    key: 'private',
    label: 'Private',
    description: 'You can still share your request link with others.',
  },
];

type AudienceBottomSheetProps = {
  onSelectAudience: (key: string) => void;
  selectedKey?: string;
  title?: string;
  options?: AudienceOption[];
  variant?: 'see' | 'offer';
};

export const AudienceBottomSheet = forwardRef<
  BottomSheetRef,
  AudienceBottomSheetProps
>(
  (
    {
      onSelectAudience,
      selectedKey,
      title: customTitle,
      options: customOptions,
      variant = 'see',
    },
    ref
  ) => {
    function handleSelect(key: string) {
      onSelectAudience(key);
    }

    // Use custom options if provided, otherwise fall back to variant-based defaults
    const options =
      customOptions ||
      (variant === 'offer' ? OFFER_AUDIENCE_OPTIONS : SEE_AUDIENCE_OPTIONS);

    // Use custom title if provided, otherwise fall back to variant-based defaults
    const title =
      customTitle ||
      (variant === 'offer'
        ? 'Who can offer me this lift'
        : 'Who can see the lift I am raising');

    return (
      <BottomSheetComponent ref={ref} snapPoints={['60%']}>
        <View className="pb-4">
          <Text className="px-4 mb-4 text-lg font-bold text-grey-alpha-500">
            {title}
          </Text>

          <View className="gap-4">
            {options.map((option) => {
              const isSelected = option.key === selectedKey;
              return (
                <TouchableOpacity
                  key={option.key}
                  onPress={() => handleSelect(option.key)}
                  className="pr-4 flex-row items-center border-b border-grey-plain-300 py-1"
                >
                  <View
                    className="mr-3 h-8"
                    style={{
                      width: 30,
                      marginLeft: -20,
                      borderRadius: isSelected ? 100 : 4,
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
  }
);

AudienceBottomSheet.displayName = 'AudienceBottomSheet';
