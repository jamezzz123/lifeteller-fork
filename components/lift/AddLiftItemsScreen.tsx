import { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { X, Minus, Plus } from 'lucide-react-native';

import { colors } from '@/theme/colors';
import { Button } from '@/components/ui/Button';
import { LiftItem, useLiftDraft } from '@/context/LiftDraftContext';

const MAX_ITEMS = 5;

export default function AddLiftItemsScreen() {
  const { liftItems, setLiftItems } = useLiftDraft();
  const [items, setItems] = useState<LiftItem[]>(
    liftItems.length > 0 ? liftItems : []
  );

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
    // Filter out items with empty names
    const validItems = items.filter((item) => item.name.trim() !== '');
    setLiftItems(validItems);
    router.back();
  }

  function handleClose() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'bottom']}>
      {/* Header */}
      <View className="flex-row items-center justify-between border-b border-grey-plain-150 bg-white px-4 py-3">
        <View className="flex-row items-center gap-3">
          <TouchableOpacity onPress={handleClose}>
            <X
              color={colors['grey-plain']['550']}
              size={24}
              strokeWidth={2}
            />
          </TouchableOpacity>
          <Text className="text-lg font-semibold text-grey-alpha-500">
            Add items
          </Text>
        </View>

        <Button
          title="Done"
          onPress={handleDone}
          variant="primary"
          size="small"
          className="rounded-full px-6"
        />
      </View>

      <KeyboardAwareScrollView
        enableOnAndroid
        keyboardShouldPersistTaps="handled"
        extraScrollHeight={120}
        extraHeight={140}
        enableAutomaticScroll
        enableResetScrollToCoords={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Items Section */}
        <View>
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
                      className="mt-2 h-12 rounded-xl border border-grey-alpha-250 bg-grey-plain-150 px-3 text-base text-grey-alpha-500"
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
                        className="w-16 flex-1 px-3 py-3 text-base text-grey-alpha-500"
                      />
                      <View className="h-12 w-px bg-grey-plain-450/60" />
                      <TouchableOpacity
                        onPress={() => handleItemQuantityChange(item.id, -1)}
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
              className="mt-4 items-center justify-center rounded-full border px-4 py-3"
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
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}
