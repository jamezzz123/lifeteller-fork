import { useState } from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';
import {
  X,
  Minus,
  Plus,
  ImageIcon,
  Video,
  Trash,
  Trash2,
  ChevronDown,
  ChevronRight,
  Pencil,
} from 'lucide-react-native';

import { colors } from '@/theme/colors';
import { Button } from '@/components/ui/Button';
import { LiftItem, useLiftDraft } from '@/context/LiftDraftContext';
import { Checkbox } from '../ui/Checkbox';
import { QuantitySelector } from './QuantitySelector';
import { QuantityBottomSheet } from './QuantityBottomSheet';

const MAX_ITEMS = 5;

type MediaButtonProps = {
  onPress: () => void;
  icon: React.ReactNode;
  label: string;
};

function MediaButton({ onPress, icon, label }: MediaButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-1 flex-row items-center justify-center gap-2 rounded-lg border-grey-plain-300 bg-primary-tints-50 py-3"
    >
      {icon}
      <Text className="font-inter-medium text-sm text-grey-alpha-500">
        {label}
      </Text>
    </TouchableOpacity>
  );
}

export default function AddLiftItemsScreen() {
  const { liftItems, setLiftItems } = useLiftDraft();
  const [items, setItems] = useState<LiftItem[]>(
    liftItems.length > 0 ? liftItems : []
  );
  const [setAsDefault, setSetAsDefault] = useState(false);
  const [numberOfRecipients, setNumberOfRecipients] = useState('1');
  const [isNumberOfRecipientSheetMounted, setIsNumberOfRecipientSheetMounted] =
    useState(false);

  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [editingItems, setEditingItems] = useState<Set<string>>(new Set());

  function handleAddItem() {
    if (items.length >= MAX_ITEMS) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const newId = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    setItems([
      ...items,
      {
        id: newId,
        name: '',
        quantity: 1,
        media: [],
      },
    ]);
    
    // Auto expand and edit the new item
    setExpandedItems((prev) => {
      const next = new Set(prev);
      next.add(newId);
      return next;
    });
    setEditingItems((prev) => {
      const next = new Set(prev);
      next.add(newId);
      return next;
    });
  }

  function handleSaveItem(id: string) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Collapse and stop editing
    setExpandedItems((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    setEditingItems((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }

  function toggleExpand(id: string) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function startEditing(id: string) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setEditingItems((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
    // Also ensure it's expanded
    setExpandedItems((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
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

  function handleCustomAmountPressOnNR() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsNumberOfRecipientSheetMounted(true);
  }

  function handleNRDone(amount: string) {
    setNumberOfRecipients(amount);
    setIsNumberOfRecipientSheetMounted(false);
  }

  function handleNumberOfRecipientSheetClose() {
    setIsNumberOfRecipientSheetMounted(false);
  }

  async function handlePickImage(itemId: string) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      const newMedia = result.assets.map((asset) => ({
        id: Math.random().toString(),
        uri: asset.uri,
        type: 'image' as const,
        fileName: asset.fileName || undefined,
      }));
      setItems(
        items.map((item) =>
          item.id === itemId
            ? { ...item, media: [...item.media, ...newMedia] }
            : item
        )
      );
    }
  }

  async function handlePickVideo(itemId: string) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['videos'],
      allowsMultipleSelection: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      const newMedia = result.assets.map((asset) => ({
        id: Math.random().toString(),
        uri: asset.uri,
        type: 'video' as const,
        fileName: asset.fileName || undefined,
      }));
      setItems(
        items.map((item) =>
          item.id === itemId
            ? { ...item, media: [...item.media, ...newMedia] }
            : item
        )
      );
    }
  }

  function handleRemoveMedia(itemId: string, mediaId: string) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setItems(
      items.map((item) =>
        item.id === itemId
          ? { ...item, media: item.media.filter((m) => m.id !== mediaId) }
          : item
      )
    );
  }

  function handleClearItemMedia(itemId: string) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setItems(
      items.map((item) => (item.id === itemId ? { ...item, media: [] } : item))
    );
  }

  function getMediaCountText(media: LiftItem['media']) {
    const imageCount = media.filter((m) => m.type === 'image').length;
    const videoCount = media.filter((m) => m.type === 'video').length;
    const parts = [];
    if (imageCount > 0)
      parts.push(`${imageCount} image${imageCount > 1 ? 's' : ''}`);
    if (videoCount > 0)
      parts.push(`${videoCount} video${videoCount > 1 ? 's' : ''}`);
    return parts.join(', ');
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      {/* Header */}
      <View className="flex-row items-center justify-between border-b border-grey-plain-150 bg-white px-4 py-3">
        <View className="flex-row items-center gap-3">
          <TouchableOpacity onPress={handleClose}>
            <X color={colors['grey-plain']['550']} size={24} strokeWidth={2} />
          </TouchableOpacity>
          <Text className="font-inter-medium text-lg text-grey-alpha-500">
            Add Lift items
          </Text>
        </View>

        {/* <Button
          title="Done"
          onPress={handleDone}
          variant="primary"
          size="small"
          className="rounded-full px-6"
        /> */}
      </View>

      <KeyboardAwareScrollView
        enableOnAndroid
        keyboardShouldPersistTaps="handled"
        extraScrollHeight={120}
        extraHeight={140}
        enableAutomaticScroll
        enableResetScrollToCoords={false}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 8,
          paddingBottom: 40,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Items Section */}
        <View>
          <View className=" py-3">
            <Checkbox
              label="Users can request for more than one item."
              className="text-sm"
              checked={setAsDefault}
              onPress={() => setSetAsDefault(!setAsDefault)}
            />
          </View>
          <Text className="font-inter text-sm text-grey-alpha-500">
            You can add up to 5 items.
          </Text>

          <View className="mt-4 gap-4">
            {items.map((item, index) => {
              const isExpanded = expandedItems.has(item.id);
              const isEditing = editingItems.has(item.id);

              return (
                <View
                  key={item.id}
                  className="overflow-hidden rounded-t-2xl border border-grey-plain-300"
                  style={{
                    backgroundColor: colors['grey-plain']['150'],
                  }}
                >
                  {/* Item Header */}
                  <TouchableOpacity
                    onPress={() => toggleExpand(item.id)}
                    className="flex-row items-center justify-between px-4 py-3"
                  >
                    <View className="flex-row items-center gap-2">
                      {isExpanded ? (
                        <ChevronDown
                          size={20}
                          color={colors['grey-alpha']['500']}
                        />
                      ) : (
                        <ChevronRight
                          size={20}
                          color={colors['grey-alpha']['500']}
                        />
                      )}
                      <Text className="font-inter-medium text-sm text-grey-alpha-400">
                        Item #{index + 1}
                        <Text className="font-inter-semibold text-base text-grey-alpha-500">{item.name ? ` - ${item.name}` : ''}</Text>
                        {!isEditing && item.quantity > 1
                          ? ` (${item.quantity})`
                          : ''}
                      </Text>
                    </View>

                    <View className="flex-row items-center gap-3">
                      <TouchableOpacity
                        onPress={() => startEditing(item.id)}
                        hitSlop={8}
                      >
                        <Pencil
                          size={18}
                          color={colors['grey-alpha']['500']}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => handleRemoveItem(item.id)}
                        hitSlop={8}
                        accessibilityRole="button"
                        accessibilityLabel={`Remove item ${index + 1}`}
                      >
                        <Trash2
                          size={18}
                          color={colors.state.red}
                          strokeWidth={2}
                        />
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>

                  {/* Body */}
                  {isExpanded && (
                    <View className="px-4 pb-4">
                      {isEditing ? (
                        // EDIT MODE
                        <View className="mt-1 rounded-lg bg-white p-2">
                          <View className="mt-4">
                            <Text className="font-inter-semibold text-xs text-grey-alpha-400">
                              Item name
                            </Text>
                            <TextInput
                              value={item.name}
                              onChangeText={(text) =>
                                handleItemNameChange(item.id, text)
                              }
                              placeholder="Laptop"
                              placeholderTextColor={colors['grey-alpha']['250']}
                              className="mt-2 h-12 rounded-xl  border border-grey-alpha-250 bg-grey-plain-150 px-3 font-inter-medium text-base text-grey-alpha-500"
                            />
                          </View>

                          <View className="mt-4">
                            <Text className="font-inter-semibold text-xs text-grey-alpha-400">
                              Quantity available
                            </Text>
                            <View className="mt-2 flex-row overflow-hidden rounded-xl border border-grey-plain-450/60 bg-grey-plain-150">
                              <TextInput
                                value={item.quantity.toString()}
                                onChangeText={(text) =>
                                  handleItemQuantityInputChange(item.id, text)
                                }
                                keyboardType="numeric"
                                className="w-16 flex-1 px-3 py-3 font-inter-medium text-base text-grey-alpha-500"
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
                                onPress={() =>
                                  handleItemQuantityChange(item.id, 1)
                                }
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

                          {/* Quantity Selector */}
                          <QuantitySelector
                            selectedQuantity={numberOfRecipients}
                            onQuantityChange={setNumberOfRecipients}
                            onCustomValuePress={handleCustomAmountPressOnNR}
                          />

                          {/* Media Section for this item */}
                          <View className="py-4">
                            {item.media.length > 0 && (
                              <View className="mb-4 flex-row items-center justify-between">
                                <TouchableOpacity
                                  onPress={() => handleClearItemMedia(item.id)}
                                  hitSlop={10}
                                >
                                  <Trash
                                    size={20}
                                    color={colors.state.red}
                                    strokeWidth={2}
                                  />
                                </TouchableOpacity>
                                <Text className="font-inter text-sm text-grey-alpha-400">
                                  {getMediaCountText(item.media)}
                                </Text>
                              </View>
                            )}

                            {item.media.length > 0 && (
                              <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                className="mb-4"
                                contentContainerStyle={{ gap: 8 }}
                              >
                                {item.media.map((mediaItem) => (
                                  <View
                                    key={mediaItem.id}
                                    className="relative"
                                  >
                                    <Image
                                      source={{ uri: mediaItem.uri }}
                                      style={{
                                        width: 100,
                                        height: 100,
                                        borderRadius: 8,
                                      }}
                                      contentFit="cover"
                                    />
                                    <TouchableOpacity
                                      onPress={() =>
                                        handleRemoveMedia(
                                          item.id,
                                          mediaItem.id
                                        )
                                      }
                                      className="absolute right-1 top-1 rounded-full bg-black/60 p-1"
                                    >
                                      <Trash2
                                        size={14}
                                        color="white"
                                        strokeWidth={2}
                                      />
                                    </TouchableOpacity>
                                    {mediaItem.type === 'video' && (
                                      <View className="absolute bottom-1 left-1 rounded bg-black/60 px-1.5 py-0.5">
                                        <Text className="font-inter text-xs text-white">
                                          Video
                                        </Text>
                                      </View>
                                    )}
                                  </View>
                                ))}
                              </ScrollView>
                            )}

                            <View className="flex-row gap-3">
                              <MediaButton
                                onPress={() => handlePickImage(item.id)}
                                icon={
                                  <ImageIcon
                                    size={20}
                                    color={colors.primary.purple}
                                    strokeWidth={2}
                                  />
                                }
                                label="Add image"
                              />

                              <MediaButton
                                onPress={() => handlePickVideo(item.id)}
                                icon={
                                  <Video
                                    size={20}
                                    color={colors.primary.purple}
                                    strokeWidth={2}
                                  />
                                }
                                label="Add video"
                              />
                            </View>
                            <TouchableOpacity
                              onPress={() => handleSaveItem(item.id)}
                              className="my-4 flex-row items-center justify-center rounded-full border px-4 py-3"
                              style={{
                                borderColor: colors.primary.purple,
                                backgroundColor:
                                  colors['primary-tints'].purple['50'],
                              }}
                            >
                              <Text
                                className="font-inter-medium text-sm"
                                style={{ color: colors.primary.purple }}
                              >
                                Add item
                              </Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      ) : (
                        // READ ONLY MODE
                        <View className="mt-1 rounded-lg p-4">
                          <View>
                            <Text className="font-inter text-sm text-grey-alpha-400">
                              Item name
                            </Text>
                            <Text className="mt-1 font-inter-semibold text-base text-grey-alpha-500">
                              {item.name || 'No name'}
                            </Text>
                          </View>

                          <View className="mt-4">
                            <Text className="font-inter text-sm text-grey-alpha-400">
                              Quantity available
                            </Text>
                            <Text className="mt-1 font-inter-semibold text-base text-grey-alpha-500">
                              {item.quantity}
                            </Text>
                          </View>

                          {item.media.length > 0 && (
                            <View className="mt-4">
                              <Text className="mb-2 font-inter text-sm text-grey-alpha-400">
                                Media
                              </Text>
                              <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={{ gap: 8 }}
                              >
                                {item.media.map((mediaItem) => (
                                  <View
                                    key={mediaItem.id}
                                    className="relative"
                                  >
                                    <Image
                                      source={{ uri: mediaItem.uri }}
                                      style={{
                                        width: 80,
                                        height: 80,
                                        borderRadius: 8,
                                      }}
                                      contentFit="cover"
                                    />
                                    {mediaItem.type === 'video' && (
                                      <View className="absolute bottom-1 left-1 rounded bg-black/60 px-1.5 py-0.5">
                                        <Text className="font-inter text-xs text-white">
                                          Video
                                        </Text>
                                      </View>
                                    )}
                                  </View>
                                ))}
                              </ScrollView>
                            </View>
                          )}
                        </View>
                      )}
                    </View>
                  )}
                </View>
              );
            })}
          </View>

          {items.length < MAX_ITEMS && (
            <View className="w-1/2 mx-auto">
            <TouchableOpacity
              onPress={handleAddItem}
              className="mt-4 flex-row items-center justify-center rounded-full border px-4 py-3"
              style={{
                borderColor: colors.primary.purple,
                backgroundColor: colors['primary-tints'].purple['50'],
              }}
            >
              <Text
                className="font-inter-medium text-base"
                style={{ color: colors.primary.purple }}
              >
                Add another item
              </Text>
              <Plus size={16} color={colors.primary.purple} strokeWidth={2} />
            </TouchableOpacity>
            </View>
          )}
        </View>
      </KeyboardAwareScrollView>

       {/* Footer Buttons */}
        <View className="border-t border-grey-plain-300 bg-grey-alpha-100 px-4 py-6">
          <View className="flex-row gap-3 justify-end ">
            <View className="items-center">
              <Button
                title={'Done'}
                onPress={handleDone}
                variant="primary"
                className="rounded-full"
                disabled={false}
              />
            </View>
          </View>
        </View>

      {/* Quantity Bottom Sheet */}
      {isNumberOfRecipientSheetMounted && (
        <QuantityBottomSheet
          initialQuantity={numberOfRecipients}
          onDone={handleNRDone}
          onClose={handleNumberOfRecipientSheetClose}
        />
      )}
    </SafeAreaView>
  );
}
