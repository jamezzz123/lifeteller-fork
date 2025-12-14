import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { Check } from 'lucide-react-native';

interface QuickAmountButtonsProps {
  amounts: number[];
  selectedAmount: number | null;
  onSelect: (amount: number) => void;
}

export function QuickAmountButtons({
  amounts,
  selectedAmount,
  onSelect,
}: QuickAmountButtonsProps) {
  const rows: number[][] = [];
  for (let i = 0; i < amounts.length; i += 3) {
    rows.push(amounts.slice(i, i + 3));
  }

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);

  return (
    <View className="rounded-lg bg-grey-alpha-150 p-3">
      <View className="mb-6">
        {rows.map((row, rowIndex) => (
          <View
            key={`row-${rowIndex}`}
            className={`flex-row gap-2 ${rowIndex !== rows.length - 1 ? 'mb-2' : ''}`}
          >
            {row.map((amount) => {
              const isSelected = selectedAmount === amount;
              return (
                <TouchableOpacity
                  key={amount}
                  onPress={() => onSelect(amount)}
                  className={`flex-1 flex-row items-center gap-1.5 rounded-lg px-4 py-3 ${
                    selectedAmount === amount
                      ? 'bg-primary-tints-100'
                      : 'border-grey-alpha-250 bg-grey-plain-50'
                  }`}
                >
                  {isSelected && (
                    <Check
                      size={16}
                      color="#7538BA"
                      strokeWidth={2.2}
                    />
                  )}
                  <Text
                    className={`text-sm font-medium ${
                      selectedAmount === amount
                        ? 'text-primary'
                        : 'text-grey-alpha-450'
                    }`}
                  >
                    {formatCurrency(amount)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>
    </View>
  );
}
