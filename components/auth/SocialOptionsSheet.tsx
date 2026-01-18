import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { View, Text, Pressable } from 'react-native';
import {
  BottomSheetComponent,
  BottomSheetRef,
} from '@/components/ui/BottomSheet';
import { Button } from '@/components/ui/Button';
import { colors } from '@/theme/colors';
import * as Haptics from 'expo-haptics';
import FacebookIcon from '@/assets/icons/facebook.svg';
import InstagramIcon from '@/assets/icons/instagram.svg';
import TwitterIcon from '@/assets/icons/twitter.svg';
import XIcon from '@/assets/icons/x.svg';
import LinkedInIcon from '@/assets/icons/linkedin.svg';

interface SocialOption {
  id: string;
  name: string;
  icon: React.ReactNode;
}

const SOCIAL_OPTIONS: SocialOption[] = [
  {
    id: 'facebook',
    name: 'Facebook',
    icon: <FacebookIcon width={24} height={24} />,
  },
  {
    id: 'tiktok',
    name: 'Tiktok',
    icon: <TwitterIcon width={24} height={24} />,
  },
  {
    id: 'instagram',
    name: 'Instagram',
    icon: <InstagramIcon width={24} height={24} />,
  },
  {
    id: 'twitter',
    name: 'X (Twitter)',
    icon: <XIcon width={24} height={24} />,
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: <LinkedInIcon width={24} height={24} />,
  },
];

interface SocialOptionsSheetProps {
  onSelect: (socialId: string) => void;
  onClose?: () => void;
}

export interface SocialOptionsSheetRef {
  open: () => void;
  close: () => void;
}

export const SocialOptionsSheet = forwardRef<
  SocialOptionsSheetRef,
  SocialOptionsSheetProps
>(({ onSelect, onClose }, ref) => {
  const [selectedId, setSelectedId] = useState<string>('tiktok');
  const bottomSheetRef = React.useRef<BottomSheetRef>(null);

  useImperativeHandle(ref, () => ({
    open: () => {
      bottomSheetRef.current?.expand();
    },
    close: () => {
      bottomSheetRef.current?.close();
    },
  }));

  function handleSelect(id: string) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedId(id);
  }

  function handleProceed() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onSelect(selectedId);
    bottomSheetRef.current?.close();
  }

  function handleClose() {
    bottomSheetRef.current?.close();
    onClose?.();
  }

  return (
    <BottomSheetComponent
      ref={bottomSheetRef}
      title="Select an option to proceed"
      onClose={handleClose}
    >
      <View className="px-6">
        <View className="mb-6">
          {SOCIAL_OPTIONS.map((option) => {
            const isSelected = selectedId === option.id;
            return (
              <Pressable
                key={option.id}
                onPress={() => handleSelect(option.id)}
                className={`
                  mb-3 flex-row items-center justify-between rounded-lg border px-4 py-3
                  ${isSelected ? 'border-primary bg-primary-tints-100' : 'border-grey-plain-300 bg-transparent'}
                `}
              >
                <View className="flex-row items-center">
                  {isSelected ? (
                    <View
                      className="mr-4 size-5 items-center justify-center rounded-full"
                      style={{ backgroundColor: colors.primary.purple }}
                    >
                      <View
                        className="size-4 items-center justify-center rounded-full"
                        style={{ backgroundColor: colors['grey-plain']['50'] }}
                      >
                        <View
                          className="size-3 rounded-full"
                          style={{ backgroundColor: colors.primary.purple }}
                        />
                      </View>
                    </View>
                  ) : (
                    <View
                      className="mr-4 size-5 rounded-full border-2"
                      style={{ borderColor: colors['grey-plain']['450'] }}
                    />
                  )}

                  <Text
                    className={`text-sm font-inter-semibold ${
                      isSelected ? 'text-primary' : 'text-grey-alpha-500'
                    }`}
                  >
                    {option.name}
                  </Text>
                </View>

                <View
                  className="h-10 w-10 items-center justify-center rounded-full"
                  style={{
                    backgroundColor: isSelected
                      ? colors['primary-tints']['purple']['100']
                      : colors['grey-plain']['300'],
                  }}
                >
                  {option.icon}
                </View>
              </Pressable>
            );
          })}
        </View>

        {/* Proceed Button */}
        <View className="items-end">
          <Button
            title="Proceed"
            onPress={handleProceed}
            variant="primary"
            size="medium"
          />
        </View>
      </View>
    </BottomSheetComponent>
  );
});

SocialOptionsSheet.displayName = 'SocialOptionsSheet';
