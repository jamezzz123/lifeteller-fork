import { useState, useEffect } from 'react';
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Check, Minus, Plus } from 'lucide-react-native';

import { colors } from '@/theme/colors';
import { Button } from '@/components/ui/Button';
import { LiftType } from '@/components/lift/LiftTypeSelector';
import { LiftItem, useRequestLift } from '@/context/request-lift';

const PRESET_AMOUNTS = [5000, 10000, 20000, 30000, 50000, 100000];
const MAX_ITEMS = 5;

export default function LiftTypeScreen() {
  const {
    liftType,
    setLiftType,
    liftAmount,
    setLiftAmount,
    liftItems,
    setLiftItems,
    setHeaderTitle,
  } = useRequestLift();

  const [selectedType, setSelectedType] = useState<LiftType>(liftType);
  const [amount, setAmount] = useState(
    liftAmount > 0 ? liftAmount.toString() : ''
  );
  const [items, setItems] = useState<LiftItem[]>(
    liftItems.length > 0 ? liftItems : []
  );

  // Set header title
  useEffect(() => {
    setHeaderTitle('Lift type');
  }, [setHeaderTitle]);

  function handleAmountChange(text: string) {
    const numericText = text.replace(/[^0-9]/g, '');
    setAmount(numericText);
  }

  function handlePresetAmount(presetAmount: number) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setAmount(presetAmount.toString());
  }

  function handleAddItem() {
    if (items.length >= MAX_ITEMS) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setItems([
      ...items,
      {
        id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        name: '',
        quantity: 1,
      },
    ]);
  }

  function handleRemoveItem(id: string) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setItems(items.filter((item) => item.id !== id));
  }

  function handleItemNameChange(id: string, name: string) {
    setItems(items.map((item) => (item.id === id ? { ...item, name } : item)));
  }

  function handleItemQuantityChange(id: string, change: number) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setItems(
      items.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    );
  }

  function handleItemQuantityInputChange(id: string, text: string) {
    const numericValue = parseInt(text.replace(/[^0-9]/g, ''), 10);
    setItems(
      items.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: Number.isNaN(numericValue)
                ? 1
                : Math.max(1, numericValue),
            }
          : item
      )
    );
  }

  function handleDone() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // Save to Context
    setLiftType(selectedType);
    setLiftAmount(amount ? parseInt(amount, 10) : 0);
    setLiftItems(items);
    // Navigate back
    router.back();
  }

  const types: { value: LiftType; label: string }[] = [
    { value: 'Monetary', label: 'Monetary' },
    { value: 'Non-monetary', label: 'Non-monetary' },
    { value: 'Both', label: 'Both' },
  ];

  const formattedAmount = amount ? parseInt(amount, 10).toLocaleString() : '';
  const showItems = selectedType === 'Non-monetary' || selectedType === 'Both';

  return (
    <View className="flex-1 bg-background">
      <ScrollView
          className="flex-1 px-4 pt-4"
          contentContainerStyle={{ paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Type Selector */}
          <View className="flex-row gap-3">
            {types.map(({ value, label }) => {
              const isSelected = selectedType === value;
              return (
                <TouchableOpacity
                  key={value}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setSelectedType(value);
                  }}
                  className="flex-row items-center gap-2 rounded-xl px-4 py-2.5"
                  style={{
                    backgroundColor: isSelected
                      ? colors['primary-tints'].purple['100']
                      : colors['grey-alpha']['150'],
                  }}
                  accessibilityRole="button"
                  accessibilityLabel={`Select ${label}`}
                >
                  {isSelected && (
                    <Check
                      size={16}
                      color={colors['grey-alpha']['450']}
                      strokeWidth={3}
                    />
                  )}
                  <Text className="text-sm font-semibold text-grey-alpha-450">
                    {label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Amount Section - Only show for Monetary or Both */}
          {(selectedType === 'Monetary' || selectedType === 'Both') && (
            <>
              <Text className="mt-6 text-base font-semibold text-grey-alpha-500">
                Amount
              </Text>

              <View className="flex-row items-center gap-2 border-b border-grey-plain-450/60 pb-2">
                <Text className="text-2xl font-bold text-grey-alpha-500">
                  ₦
                </Text>
                <TextInput
                  value={formattedAmount}
                  onChangeText={handleAmountChange}
                  placeholder="5,000"
                  placeholderTextColor={colors['grey-alpha']['250']}
                  keyboardType="numeric"
                  className="flex-1 text-2xl font-bold text-grey-alpha-500"
                />
              </View>

              <View className="mt-6 flex-row flex-wrap gap-3">
                {PRESET_AMOUNTS.map((presetAmount) => {
                  const isSelected = amount === presetAmount.toString();
                  return (
                    <TouchableOpacity
                      key={presetAmount}
                      onPress={() => handlePresetAmount(presetAmount)}
                      className="items-center justify-center rounded-xl px-4 py-3"
                      style={{
                        flexBasis: '30%',
                        flexGrow: 1,
                        borderWidth: 1.2,
                        borderColor: isSelected
                          ? colors.primary.purple
                          : colors['grey-plain']['450'],
                        backgroundColor: isSelected
                          ? colors['primary-tints'].purple['50']
                          : colors['grey-alpha']['150'],
                      }}
                      accessibilityRole="button"
                      accessibilityLabel={`Select ${presetAmount} naira`}
                    >
                      <Text
                        className="text-base font-semibold"
                        style={{
                          color: isSelected
                            ? colors.primary.purple
                            : colors['grey-alpha']['500'],
                        }}
                      >
                        ₦{presetAmount.toLocaleString()}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <View className="mt-6 border-t border-grey-plain-450/60" />
            </>
          )}

          {/* Items Section */}
          {showItems && (
            <View className="mt-6">
              <Text className="text-sm text-grey-alpha-400">
                You can add up to 5 items.
              </Text>

              <View className="mt-4 gap-4">
                {items.map((item, index) => (
                  <View
                    key={item.id}
                    className="rounded-2xl px-4 py-3"
                    style={{
                      backgroundColor: colors['grey-plain']['150'],
                    }}
                  >
                    <View className="flex-row items-center justify-between">
                      <Text className="text-sm font-semibold text-grey-alpha-500">
                        Item #{index + 1}
                      </Text>
                      <TouchableOpacity
                        onPress={() => handleRemoveItem(item.id)}
                        accessibilityRole="button"
                        accessibilityLabel={`Remove item ${index + 1}`}
                      >
                        <Text
                          className="text-sm font-semibold"
                          style={{ color: colors.state.red }}
                        >
                          Remove item
                        </Text>
                      </TouchableOpacity>
                    </View>

                    <View className="mt-3 rounded-lg bg-white p-2">
                      <View className="mt-4">
                        <Text className="text-xs font-semibold text-grey-alpha-400">
                          Item name
                        </Text>
                        <TextInput
                          value={item.name}
                          onChangeText={(text) =>
                            handleItemNameChange(item.id, text)
                          }
                          placeholder="Laptop"
                          placeholderTextColor={colors['grey-alpha']['250']}
                          className="mt-2 h-12 rounded-xl border border-grey-alpha-250  bg-grey-plain-150 px-3 text-base  text-grey-alpha-500"
                        />
                      </View>

                      <View className="mt-4">
                        <Text className="text-xs font-semibold text-grey-alpha-400">
                          Quantity needed
                        </Text>
                        <View className="mt-2 flex-row overflow-hidden rounded-xl border border-grey-plain-450/60 bg-grey-plain-150">
                          <TextInput
                            value={item.quantity.toString()}
                            onChangeText={(text) =>
                              handleItemQuantityInputChange(item.id, text)
                            }
                            keyboardType="numeric"
                            className="w-16 flex-1 px-3 py-3  text-base text-grey-alpha-500"
                          />
                          <View className="h-12 w-px bg-grey-plain-450/60" />
                          <TouchableOpacity
                            onPress={() =>
                              handleItemQuantityChange(item.id, -1)
                            }
                            disabled={item.quantity <= 1}
                            className="w-12 items-center justify-center"
                          >
                            <Minus
                              size={18}
                              color={colors['grey-alpha']['500']}
                              strokeWidth={2.6}
                              opacity={item.quantity <= 1 ? 0.4 : 1}
                            />
                          </TouchableOpacity>
                          <View className="h-12 w-px bg-grey-plain-450/60" />
                          <TouchableOpacity
                            onPress={() => handleItemQuantityChange(item.id, 1)}
                            className="w-12 items-center justify-center"
                          >
                            <Plus
                              size={18}
                              color={colors['grey-alpha']['500']}
                              strokeWidth={2.6}
                            />
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </View>
                ))}
              </View>

              {items.length < MAX_ITEMS && (
                <TouchableOpacity
                  onPress={handleAddItem}
                  className="mt-1 items-center justify-center rounded-full border px-4 py-3"
                  style={{
                    borderColor: colors.primary.purple,
                    backgroundColor: colors['primary-tints'].purple['50'],
                  }}
                >
                  <Text
                    className="text-base font-semibold"
                    style={{ color: colors.primary.purple }}
                  >
                    Add item
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
      </ScrollView>

      {/* Done Button */}
      <View className="border-t border-grey-plain-450/40 bg-grey-alpha-150 px-4 py-4">
        <View className="flex w-1/2 self-end">
          <Button title="Done" onPress={handleDone} />
        </View>
      </View>
    </View>
  );
}
