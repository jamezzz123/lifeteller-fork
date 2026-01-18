import { Text, TouchableOpacity, View } from 'react-native';
import { SquarePen } from 'lucide-react-native';
import { colors } from '@/theme/colors';

export type LiftType = 'Monetary' | 'Non-monetary' | 'Both' | null;

type LiftTypeSelectorProps = {
  selectedType: LiftType;
  onSelectType: (type: LiftType) => void;
};

export function LiftTypeSelector({
  selectedType,
  onSelectType,
}: LiftTypeSelectorProps) {
  const types: LiftType[] = ['Monetary', 'Non-monetary', 'Both'];

  return (
    <View className="px-4">
      <View className="mb-3 flex-row items-center gap-2">
        <SquarePen
          size={18}
          color={colors['grey-alpha']['500']}
          strokeWidth={2}
        />
        <Text className="text-base font-inter-semibold text-grey-alpha-500">Type</Text>
      </View>

      <View className="flex-row gap-3">
        {types.map((type) => {
          return (
            <TouchableOpacity
              key={type}
              onPress={() => onSelectType(type)}
              className="rounded-lg px-5 py-2.5"
              style={{ backgroundColor: '#F3F4F6' }}
              accessibilityRole="button"
              accessibilityLabel={`Select ${type} type`}
            >
              <Text className="text-sm font-inter-medium text-grey-alpha-500">
                {type}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
