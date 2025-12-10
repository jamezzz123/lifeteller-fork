import { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { ChevronDown } from 'lucide-react-native';

import { colors } from '@/theme/colors';
import { FullScreenModal } from '@/components/ui/FullScreenModal';
import { List } from '@/app/request-lift/context';

// Mock data
const EXISTING_LISTS: List[] = [
  { id: '1', name: 'Close friends', peopleCount: 12 },
  { id: '2', name: 'Name of list goes here', peopleCount: 81 },
];

type ChooseFromListModalProps = {
  visible: boolean;
  onDone: (list: List) => void;
  onClose: () => void;
};

export function ChooseFromListModal({
  visible,
  onDone,
  onClose,
}: ChooseFromListModalProps) {
  const [selectedList, setSelectedList] = useState<List | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  function handleSelectList(list: List) {
    setSelectedList(list);
    setShowDropdown(false);
  }

  function handleDone() {
    if (selectedList) {
      onDone(selectedList);
      setSelectedList(null);
    }
  }

  function handleClose() {
    setSelectedList(null);
    setShowDropdown(false);
    onClose();
  }

  return (
    <FullScreenModal
      visible={visible}
      title="Choose from list"
      onClose={handleClose}
      rightButton={{
        label: 'Done',
        onPress: handleDone,
        disabled: !selectedList,
      }}
    >
      <View className="flex-1 px-4 pt-4">
        <Text className="mb-3 text-base font-medium text-grey-alpha-500">
          Choose a list
        </Text>

        {/* Dropdown */}
        <TouchableOpacity
          onPress={() => setShowDropdown(!showDropdown)}
          className="flex-row items-center justify-between rounded-lg border border-grey-plain-450 px-4 py-3"
        >
          <Text
            className="text-base"
            style={{
              color: selectedList
                ? colors['grey-alpha']['500']
                : colors['grey-alpha']['250'],
            }}
          >
            {selectedList ? selectedList.name : '- Select an option -'}
          </Text>
          <ChevronDown
            size={20}
            color={colors['grey-alpha']['400']}
            strokeWidth={2}
          />
        </TouchableOpacity>

        {/* Dropdown Options */}
        {showDropdown && (
          <View className="mt-2 overflow-hidden rounded-lg border border-grey-plain-450 bg-white">
            {EXISTING_LISTS.map((list) => (
              <TouchableOpacity
                key={list.id}
                onPress={() => handleSelectList(list)}
                className="border-b border-grey-plain-450/20 px-4 py-3 last:border-b-0"
              >
                <Text className="text-base text-grey-alpha-500">
                  {list.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    </FullScreenModal>
  );
}
