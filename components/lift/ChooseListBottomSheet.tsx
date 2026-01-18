import { Text, TouchableOpacity, View } from 'react-native';
import { ChevronRight, Plus } from 'lucide-react-native';
import { BottomSheetComponent, BottomSheetRef } from '@/components/ui/BottomSheet';
import { colors } from '@/theme/colors';
import { List } from '@/context/request-lift';
import { forwardRef } from 'react';

// Mock data for existing lists
const EXISTING_LISTS: List[] = [
  { id: '1', name: 'Close friends', peopleCount: 12 },
  { id: '2', name: 'Name of list goes here', peopleCount: 81 },
];

type ChooseListBottomSheetProps = {
  onSelectList: (list: List) => void;
  onCreateNewList: () => void;
};

export const ChooseListBottomSheet = forwardRef<
  BottomSheetRef,
  ChooseListBottomSheetProps
>(({ onSelectList, onCreateNewList }, ref) => {
  return (
    <BottomSheetComponent ref={ref} snapPoints={['50%']}>
      <View className="px-4 pb-4">
        <Text className="mb-6 text-2xl font-inter-bold text-grey-alpha-500">
          Choose a list
        </Text>

        <View className="gap-4">
          {/* Existing Lists */}
          {EXISTING_LISTS.map((list) => (
            <TouchableOpacity
              key={list.id}
              onPress={() => onSelectList(list)}
              className="flex-row items-center justify-between border-b border-grey-plain-450/20 pb-4"
            >
              <View className="flex-1">
                <Text className="mb-1 text-lg font-inter-bold text-grey-alpha-500">
                  {list.name}
                </Text>
                <Text className="text-sm text-grey-alpha-400">
                  {list.name === 'Close friends'
                    ? `People you often interact with (${list.peopleCount} people)`
                    : `${list.peopleCount} people`}
                </Text>
              </View>
              <ChevronRight
                size={20}
                color={colors['grey-alpha']['400']}
                strokeWidth={2}
              />
            </TouchableOpacity>
          ))}

          {/* Create New List */}
          <TouchableOpacity
            onPress={onCreateNewList}
            className="flex-row items-center justify-between pt-2"
          >
            <View className="flex-1">
              <Text className="mb-1 text-lg font-inter-bold text-grey-alpha-500">
                Create new list
              </Text>
              <Text className="text-sm text-grey-alpha-400">
                Only those who you follow and they follow back can be added to
                your lists
              </Text>
            </View>
            <View className="ml-3 size-6 items-center justify-center">
              <Plus
                size={24}
                color={colors['grey-alpha']['500']}
                strokeWidth={2.5}
              />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </BottomSheetComponent>
  );
});

ChooseListBottomSheet.displayName = 'ChooseListBottomSheet';
