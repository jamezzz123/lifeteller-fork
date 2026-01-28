import React, { useRef, useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';
import * as Haptics from 'expo-haptics';
import {
  BottomSheetComponent,
  BottomSheetRef,
} from '@/components/ui/BottomSheet';
import { Button } from '@/components/ui/Button';
import { ProfileStack } from '@/components/ui/ProfileStack';
import { colors } from '@/theme/colors';
import { LiftItem } from '@/context/LiftDraftContext';

interface ItemsAddedBottomSheetProps {
  items: LiftItem[];
  onEdit: () => void;
  onDone: () => void;
  onClose?: () => void;
}

export function ItemsAddedBottomSheet({
  items,
  onEdit,
  onDone,
  onClose,
}: ItemsAddedBottomSheetProps) {
  const bottomSheetRef = useRef<BottomSheetRef>(null);

  // Auto-expand bottom sheet when component mounts
  useEffect(() => {
    const expandTimer = setTimeout(() => {
      bottomSheetRef.current?.expand();
    }, 50);

    return () => clearTimeout(expandTimer);
  }, []);

  const handleEdit = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    bottomSheetRef.current?.close();
    // Small delay to allow bottom sheet to close before navigating
    setTimeout(() => {
      onEdit();
    }, 200);
  };

  const handleDone = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    bottomSheetRef.current?.close();
    onDone();
  };

  return (
    <BottomSheetComponent ref={bottomSheetRef} scrollable onClose={onClose}>
      <View className="flex-1 px-4 pb-4">
        {/* Title */}
        <Text className="mb-4 text-lg font-bold text-grey-alpha-500">
          Items added
        </Text>

        {/* Table */}
        <View className="mb-6 overflow-hidden rounded-xl bg-white">
          {/* Table Header */}
          <View className="flex-row border-b border-grey-plain-200 bg-grey-plain-150 px-4 py-4">
            <Text className="flex-1 text-xs font-inter-medium uppercase text-grey-alpha-400">
              Item
            </Text>
            <Text className="text-xs font-inter-medium uppercase text-grey-alpha-400">
              Quantity
            </Text>
          </View>

          {/* Table Rows */}
          <ScrollView style={{ maxHeight: 300 }}>
            {items.map((item, index) => (
              <View
                key={item.id}
                className="flex-row items-center px-4 py-3"
                style={{
                  backgroundColor:
                    index % 2 === 1 ? colors['grey-plain']['100'] : 'white',
                }}
              >
                {/* Item Name */}
                <Text className="flex-1 text-base text-grey-alpha-500">
                  {item.name}
                </Text>

                {/* Item Images and Quantity */}
                <View className="flex-row items-center gap-2">
                  {/* Image Stack using ProfileStack */}
                  {item.media && item.media.length > 0 && (
                    <View className="flex-row items-center">
                      <ProfileStack
                        profiles={item.media.slice(0, 1).map((m) => m.uri)}
                        size={32}
                        maxVisible={1}
                      />
                      {item.media.length > 1 && (
                        <View
                          className="ml-[-8px] items-center justify-center rounded-full"
                          style={{
                            width: 24,
                            height: 24,
                            backgroundColor: colors['grey-alpha']['500'],
                          }}
                        >
                          <Text className="text-xs font-inter-medium text-white">
                            +{item.media.length - 1}
                          </Text>
                        </View>
                      )}
                    </View>
                  )}

                  {/* Quantity */}
                  <Text className="min-w-[20px] text-center text-base font-inter-medium text-grey-alpha-500">
                    {item.quantity}
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Action Buttons */}
        <View className="mx-10 flex-row gap-3">
          <View className="flex-1">
            <Button
              title="Edit"
              onPress={handleEdit}
              variant="outline"
              size="small"
              className="rounded-full"
            />
          </View>
          <View className="flex-1">
            <Button
              title="Done"
              onPress={handleDone}
              size="small"
              variant="primary"
              className="rounded-full"
            />
          </View>
        </View>
      </View>
    </BottomSheetComponent>
  );
}
