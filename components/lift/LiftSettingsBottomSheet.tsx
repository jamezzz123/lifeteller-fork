import React, { forwardRef } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { colors } from '@/theme/colors';
import * as Haptics from 'expo-haptics';
import { BottomSheetComponent, BottomSheetRef } from '@/components/ui/BottomSheet';

interface LiftSettingsBottomSheetProps {
  onSelectOneToOne: () => void;
  onSelectOneToMany: () => void;
  numberOfRecipients?: number;
}

export type LiftSettingsBottomSheetRef = BottomSheetRef;

export const LiftSettingsBottomSheet = forwardRef<
  LiftSettingsBottomSheetRef,
  LiftSettingsBottomSheetProps
>(
  (
    {
      onSelectOneToOne,
      onSelectOneToMany,
      numberOfRecipients = 7,
    }: LiftSettingsBottomSheetProps,
    ref: React.Ref<LiftSettingsBottomSheetRef>
  ) => {
    const handleSelectOneToOne = () => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onSelectOneToOne();
    };

    const handleSelectOneToMany = () => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onSelectOneToMany();
    };

    return (
      <BottomSheetComponent ref={ref} title="Offer lift settings">
        <View className="px-6">
          {/* One-to-one Option */}
          <TouchableOpacity
            onPress={handleSelectOneToOne}
            className="mb-4 flex-row items-center justify-between py-3"
            activeOpacity={0.7}
          >
            <View className="flex-1">
              <Text className="text-base font-inter-semibold text-grey-alpha-500">
                One-to-one
              </Text>
              <Text className="mt-1 text-sm text-grey-alpha-400">
                Choose a recipient and offer them a lift
              </Text>
            </View>
            <ChevronRight size={20} color={colors['grey-alpha']['400']} />
          </TouchableOpacity>

          {/* One-to-many Option */}
          <TouchableOpacity
            onPress={handleSelectOneToMany}
            className="flex-row items-center justify-between py-3"
            activeOpacity={0.7}
          >
            <View className="flex-1">
              <Text className="text-base font-inter-semibold text-grey-alpha-500">
                One-to-many
              </Text>
              <Text className="mt-1 text-sm text-grey-alpha-400">
                {numberOfRecipients} people
              </Text>
            </View>
            <ChevronRight size={20} color={colors['grey-alpha']['400']} />
          </TouchableOpacity>
        </View>
      </BottomSheetComponent>
    );
  }
);

LiftSettingsBottomSheet.displayName = 'LiftSettingsBottomSheet';
