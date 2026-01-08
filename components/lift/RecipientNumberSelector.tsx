import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Check, HandCoins, ChevronRight, UserCog } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { colors } from '@/theme/colors';

interface RecipientNumberSelectorProps {
  selectedAmount: string;
  onAmountChange: (amount: string) => void;
  onCustomAmountPress: () => void;
}

export const QUICK_AMOUNTS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20];

export function RecipientNumberSelector({
  selectedAmount,
  onAmountChange,
  onCustomAmountPress,
}: RecipientNumberSelectorProps) {
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
          <UserCog
            size={20}
            color={colors['grey-alpha']['500']}
            strokeWidth={2}
          />
          <Text className="text-base font-medium text-grey-alpha-500">
            Number of recipients
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
              {selectedAmount}
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
                  {amount}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}
