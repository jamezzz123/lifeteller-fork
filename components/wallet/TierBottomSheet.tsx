import React, { useState, forwardRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { router } from 'expo-router';
import {
  BottomSheetComponent,
  BottomSheetRef,
} from '@/components/ui/BottomSheet';
import { Button } from '@/components/ui/Button';
import { colors } from '@/theme/colors';
import * as Haptics from 'expo-haptics';

interface TierInfo {
  id: string;
  name: string;
  isCurrent: boolean;
  feature: string;
  requirement: string;
}

interface TierBottomSheetProps {
  currentTier?: string;
  onUpgrade?: (targetTier: string) => void;
}

export const TierBottomSheet = forwardRef<BottomSheetRef, TierBottomSheetProps>(
  ({ currentTier = 'Tier 0', onUpgrade }, ref) => {
    // Find the current tier ID and expand it by default
    const getCurrentTierId = () => {
      const tierMap: Record<string, string> = {
        'Tier 0': 'tier-0',
        'Tier 1': 'tier-1',
        'Tier 2': 'tier-2',
        'Tier 3': 'tier-3',
      };
      return tierMap[currentTier] || 'tier-0';
    };

    const [expandedTier, setExpandedTier] =
      useState<string>(getCurrentTierId());

    const tiers: TierInfo[] = [
      {
        id: 'tier-0',
        name: 'Tier 0',
        isCurrent: currentTier === 'Tier 0',
        feature:
          'User can only perform transaction of max of 20,000 and single inflow of 50,000 is allowed.',
        requirement: 'BVN or NIN',
      },
      {
        id: 'tier-1',
        name: 'Tier 1',
        isCurrent: currentTier === 'Tier 1',
        feature: 'Enhanced transaction limits and features for Tier 1 users.',
        requirement: 'Additional verification required',
      },
      {
        id: 'tier-2',
        name: 'Tier 2',
        isCurrent: currentTier === 'Tier 2',
        feature: 'Advanced features and higher transaction limits.',
        requirement: 'Full KYC verification',
      },
      {
        id: 'tier-3',
        name: 'Tier 3',
        isCurrent: currentTier === 'Tier 3',
        feature: 'Premium tier with maximum benefits and limits.',
        requirement: 'Complete verification and approval',
      },
    ];

    const handleToggleTier = (tierId: string) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setExpandedTier(expandedTier === tierId ? '' : tierId);
    };

    const handleUpgrade = () => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      const currentTierIndex = tiers.findIndex((t) => t.isCurrent);
      const nextTier = tiers[currentTierIndex + 1];
      if (nextTier && onUpgrade) {
        onUpgrade(nextTier.name);
      } else {
        // Navigate to upgrade wallet screen
        const nextTierName = nextTier
          ? nextTier.name.toLowerCase().replace(' ', '-')
          : 'tier-1';
        router.push({
          pathname: '/upgrade-wallet' as any,
          params: { targetTier: nextTierName },
        });
      }
      if (ref && typeof ref !== 'function' && ref.current) {
        ref.current.close();
      }
    };

    const getNextTierName = () => {
      const currentTierIndex = tiers.findIndex((t) => t.isCurrent);
      const nextTier = tiers[currentTierIndex + 1];
      return nextTier ? nextTier.name : 'Tier 1';
    };

    return (
      <BottomSheetComponent ref={ref} snapPoints={['85%']}>
        <View className="flex-1">
          {/* Title */}
          <View className="px-6 pb-4">
            <Text className="text-xl font-inter-semibold text-grey-alpha-500">
              Level features
            </Text>
          </View>

          {/* Tiers List */}
          <ScrollView
            className="flex-1 bg-grey-plain-50"
            contentContainerStyle={{
              paddingHorizontal: 24,
              paddingTop: 8,
              paddingBottom: 100,
            }}
            showsVerticalScrollIndicator={false}
          >
            {tiers.map((tier) => {
              const isExpanded = expandedTier === tier.id;

              return (
                <View
                  key={tier.id}
                  style={{
                    borderWidth: 1,
                    borderColor: colors['grey-plain']['300'],
                    backgroundColor: colors['grey-plain']['150'],
                  }}
                >
                  {/* Tier Header */}
                  <TouchableOpacity
                    onPress={() => handleToggleTier(tier.id)}
                    className="flex-row items-center justify-between px-4 py-4"
                    activeOpacity={0.7}
                  >
                    <View className="flex-row items-center gap-2">
                      <View
                        style={{
                          width: 20,
                          height: 20,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        <ChevronRight
                          color={colors['grey-plain']['550']}
                          size={20}
                          strokeWidth={3}
                          style={{
                            transform: [
                              { rotate: isExpanded ? '90deg' : '0deg' },
                            ],
                          }}
                        />
                      </View>
                      <Text className="text-base font-inter-medium text-grey-alpha-500">
                        {tier.name}
                      </Text>
                      {tier.isCurrent && (
                        <View
                          className="rounded-full px-2.5 py-0.5"
                          style={{
                            backgroundColor: colors['grey-plain']['150'],
                          }}
                        >
                          <Text className="text-xs font-inter-medium text-grey-plain-550">
                            Current level
                          </Text>
                        </View>
                      )}
                    </View>
                    {!isExpanded && (
                      <Text className="text-sm text-grey-plain-550">
                        See features
                      </Text>
                    )}
                  </TouchableOpacity>

                  {/* Tier Details (Expanded) */}
                  {isExpanded && (
                    <View
                      className="border-t border-grey-plain-150 bg-white px-4 pb-4 pt-3"
                      style={{
                        paddingLeft: 28,
                      }}
                    >
                      <View className="mb-3">
                        <Text className="mb-1 text-sm font-inter-semibold text-grey-alpha-500">
                          Feature:
                        </Text>
                        <Text className="text-sm leading-5 text-grey-plain-550">
                          {tier.feature}
                        </Text>
                      </View>
                      <View>
                        <Text className="mb-1 text-sm font-inter-semibold text-grey-alpha-500">
                          Requirement:
                        </Text>
                        <Text className="text-sm leading-5 text-grey-plain-550">
                          {tier.requirement}
                        </Text>
                      </View>
                    </View>
                  )}
                </View>
              );
            })}
          </ScrollView>

          {/* Upgrade Button */}
          <View className="absolute bottom-0 left-0 right-0 border-t border-grey-plain-150 bg-white px-6 py-4">
            <Button
              title={`Upgrade to ${getNextTierName().toLowerCase()}`}
              onPress={handleUpgrade}
              variant="primary"
              size="medium"
              className="w-full"
            />
          </View>
        </View>
      </BottomSheetComponent>
    );
  }
);

TierBottomSheet.displayName = 'TierBottomSheet';
