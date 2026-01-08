import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Check, HandCoins, ChevronRight } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { colors } from '@/theme/colors';

interface LiftAmountSelectorProps {
  selectedAmount: string;
  onAmountChange: (amount: string) => void;
  onCustomAmountPress: () => void;
}

const QUICK_AMOUNTS = [
  5000, 10000, 20000, 50000, 100000, 200000, 500000, 1000000,
];

export function LiftAmountSelector({
  selectedAmount,
  onAmountChange,
  onCustomAmountPress,
}: LiftAmountSelectorProps) {
  const handleQuickAmount = (amount: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onAmountChange(amount.toString());
  };

  const handleCustomAmount = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onCustomAmountPress();
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);

  const isQuickAmount = (amount: number) =>
    selectedAmount === amount.toString();

  const isCustomAmount =
    selectedAmount &&
    !QUICK_AMOUNTS.some((amt) => amt.toString() === selectedAmount);

  return (
    <View className="px-4 py-4">
      {/* Header */}
      <View className="mb-3 flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <HandCoins
            size={20}
            color={colors['grey-alpha']['500']}
            strokeWidth={2}
          />
          <Text className="text-base font-medium text-grey-alpha-500">
            Lift amount
          </Text>
        </View>
        {!isCustomAmount && (
          <View>
            <TouchableOpacity
              className="border border-grey-plain-300"
              onPress={handleCustomAmount}
            >
              <Text className="rounded-sm p-2 text-sm font-medium text-grey-alpha-450">
                Custom amount
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Custom Amount Selected State */}
      {isCustomAmount ? (
        <TouchableOpacity
          onPress={handleCustomAmount}
          className="mb-3 flex-row items-center justify-between"
        >
          <View className="flex-row items-center gap-1.5  rounded-lg bg-primary-tints-100 px-4 py-2">
            <Check size={16} color={colors.primary.purple} strokeWidth={2.5} />
            <Text className="text-base font-medium text-primary">
              {formatCurrency(parseInt(selectedAmount))}
            </Text>
          </View>
          <ChevronRight
            size={20}
            color={colors['grey-alpha']['400']}
            strokeWidth={2}
          />
        </TouchableOpacity>
      ) : (
        /* Quick Amount Buttons */
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mb-3"
          contentContainerStyle={{ gap: 8 }}
        >
          {QUICK_AMOUNTS.map((amount) => {
            const isSelected = isQuickAmount(amount);
            return (
              <TouchableOpacity
                key={amount}
                onPress={() => handleQuickAmount(amount)}
                className={`flex-row items-center gap-1.5 rounded-lg px-4 py-2.5 ${
                  isSelected ? 'bg-primary-tints-100' : 'bg-grey-plain-150'
                }`}
              >
                {isSelected && (
                  <Check
                    size={16}
                    color={colors.primary.purple}
                    strokeWidth={2.5}
                  />
                )}
                <Text
                  className={`text-sm font-medium ${
                    isSelected ? 'text-primary' : 'text-grey-alpha-500'
                  }`}
                >
                  {formatCurrency(amount)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}

      {/* Helper Text */}
      <View className="flex-row items-center gap-1.5">
        <View className="size-4 items-center justify-center rounded-full bg-grey-alpha-150">
          <Text className="text-xs text-grey-alpha-400">i</Text>
        </View>
        <Text className="text-xs text-grey-alpha-400">
          Funds will be securely held in your Lift wallet.
        </Text>
      </View>
    </View>
  );
}
