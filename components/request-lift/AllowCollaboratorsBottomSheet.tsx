import { forwardRef, useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

import { colors } from '@/theme/colors';
import { BottomSheetComponent, BottomSheetRef } from '@/components/ui/BottomSheet';

type AllowCollaboratorsBottomSheetProps = {
  currentLimit: 'unlimited' | number;
  onDone: (limit: 'unlimited' | number) => void;
};

const PRESET_LIMITS = [1, 2, 3, 5, 10];

export const AllowCollaboratorsBottomSheet = forwardRef<
  BottomSheetRef,
  AllowCollaboratorsBottomSheetProps
>(({ currentLimit, onDone }, ref) => {
  const [selectedMode, setSelectedMode] = useState<'unlimited' | 'limited'>(
    currentLimit === 'unlimited' ? 'unlimited' : 'limited'
  );
  const [customLimit, setCustomLimit] = useState(
    typeof currentLimit === 'number' ? currentLimit.toString() : ''
  );

  function handleDone() {
    if (selectedMode === 'unlimited') {
      onDone('unlimited');
    } else {
      const limit = parseInt(customLimit, 10);
      onDone(isNaN(limit) || limit <= 0 ? 5 : limit);
    }
  }

  function handlePresetSelect(value: number) {
    setCustomLimit(value.toString());
  }

  return (
    <BottomSheetComponent ref={ref} snapPoints={['60%']}>
      <View className="px-4 pb-4">
        <Text className="mb-2 text-lg font-inter-bold text-grey-alpha-500">
          Allow collaborators
        </Text>
        <Text className="mb-6 text-sm text-grey-alpha-400">
          Approve people&apos;s request to join you in supporting and raising the
          lift.
        </Text>

        {/* Unlimited / Limited Toggle */}
        <View className="mb-6 flex-row gap-3">
          <TouchableOpacity
            onPress={() => setSelectedMode('unlimited')}
            className="flex-1 items-center rounded-lg px-4 py-3"
            style={{
              backgroundColor:
                selectedMode === 'unlimited'
                  ? colors['primary-tints'].purple['100']
                  : colors['grey-plain']['150'],
            }}
          >
            <Text
              className="text-base font-inter-medium"
              style={{
                color:
                  selectedMode === 'unlimited'
                    ? colors.primary.purple
                    : colors['grey-alpha']['500'],
              }}
            >
              {selectedMode === 'unlimited' ? '✓ ' : ''}Unlimited
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setSelectedMode('limited')}
            className="flex-1 items-center rounded-lg px-4 py-3"
            style={{
              backgroundColor:
                selectedMode === 'limited'
                  ? colors['primary-tints'].purple['100']
                  : colors['grey-plain']['150'],
            }}
          >
            <Text
              className="text-base font-inter-medium"
              style={{
                color:
                  selectedMode === 'limited'
                    ? colors.primary.purple
                    : colors['grey-alpha']['500'],
              }}
            >
              {selectedMode === 'limited' ? '✓ ' : ''}Limited
            </Text>
          </TouchableOpacity>
        </View>

        {/* Limited Mode - Number Input */}
        {selectedMode === 'limited' && (
          <>
            <Text className="mb-3 text-sm text-grey-alpha-500">
              Enter number
            </Text>
            <TextInput
              value={customLimit}
              onChangeText={setCustomLimit}
              keyboardType="number-pad"
              className="mb-4 border-b-2 border-grey-plain-450 pb-2 text-base text-grey-alpha-500"
            />

            {/* Preset Numbers */}
            <View className="mb-6 flex-row flex-wrap gap-3">
              {PRESET_LIMITS.map((num) => (
                <TouchableOpacity
                  key={num}
                  onPress={() => handlePresetSelect(num)}
                  className="rounded-lg bg-grey-plain-150 px-6 py-3"
                >
                  <Text className="text-base font-inter-medium text-grey-alpha-500">
                    {num}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        {/* Done Button */}
        <TouchableOpacity
          onPress={handleDone}
          className="items-end"
        >
          <View
            className="rounded-full px-8 py-3"
            style={{ backgroundColor: colors.primary.purple }}
          >
            <Text className="text-base font-inter-semibold text-white">Done</Text>
          </View>
        </TouchableOpacity>
      </View>
    </BottomSheetComponent>
  );
});

AllowCollaboratorsBottomSheet.displayName = 'AllowCollaboratorsBottomSheet';
