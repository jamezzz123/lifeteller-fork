import { Text, TouchableOpacity, View } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { BottomSheetComponent, BottomSheetRef } from '@/components/ui/BottomSheet';
import { colors } from '@/theme/colors';
import { AudienceType } from '@/app/request-lift/context';
import { forwardRef } from 'react';

type AudienceOption = {
  type: AudienceType;
  label: string;
  description: string;
};

const AUDIENCE_OPTIONS: AudienceOption[] = [
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

type AudienceBottomSheetProps = {
  onSelectAudience: (type: AudienceType) => void;
};

export const AudienceBottomSheet = forwardRef<
  BottomSheetRef,
  AudienceBottomSheetProps
>(({ onSelectAudience }, ref) => {
  function handleSelect(type: AudienceType) {
    onSelectAudience(type);
  }

  return (
    <BottomSheetComponent ref={ref} snapPoints={['60%']}>
      <View className="px-4 pb-4">
        <Text className="mb-4 text-lg font-bold text-grey-alpha-500">
          Who can see the lift I am raising
        </Text>

        <View className="gap-4">
          {AUDIENCE_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option.type}
              onPress={() => handleSelect(option.type)}
              className="flex-row items-center justify-between"
            >
              <View className="flex-1">
                <Text className="mb-1 text-base font-medium text-grey-alpha-500">
                  {option.label}
                </Text>
                <Text className="text-sm text-grey-alpha-400">
                  {option.description}
                </Text>
              </View>
              <ChevronRight
                size={20}
                color={colors['grey-alpha']['400']}
                strokeWidth={2}
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </BottomSheetComponent>
  );
});

AudienceBottomSheet.displayName = 'AudienceBottomSheet';
