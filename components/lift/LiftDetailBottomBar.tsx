import React from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HandHeart } from 'lucide-react-native';
import { colors } from '@/theme/colors';
import { LiftProgressBar } from '@/components/ui/LiftProgressBar';
import { Button } from '@/components/ui/Button';

interface LiftData {
  title: string;
  currentAmount: number;
  targetAmount: number;
}

interface LiftDetailBottomBarProps {
  lift: LiftData;
}

export function LiftDetailBottomBar({ lift }: LiftDetailBottomBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="bg-grey-alpha-100 absolute bottom-0 left-0 right-0 border-t border-grey-plain-300 bg-white px-4 py-4 pt-7"
      style={{
        paddingBottom: Math.max(insets.bottom, 16),
      }}
    >
      {/* Progress Bar */}
      <View className="mb-4">
        <LiftProgressBar
          currentAmount={lift.currentAmount}
          targetAmount={lift.targetAmount}
          showAmount={true}
        />
      </View>

      {/* Action Buttons */}
      <View className="flex-row gap-3">
        <Button
          title="Share"
          onPress={() => {
            // TODO: Handle share action
            console.log('Share');
          }}
          variant="outline"
          size="medium"
        />
        <Button
          title="Offer Lift"
          iconLeft={<HandHeart color={colors['grey-plain']['50']} size={20} />}
          onPress={() => {
            // TODO: Handle offer lift action
            console.log('Offer Lift');
          }}
          variant="primary"
          size="medium"
          className="flex-1"
        />
      </View>
    </View>
  );
}
