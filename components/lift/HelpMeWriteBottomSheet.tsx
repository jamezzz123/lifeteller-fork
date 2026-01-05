import { forwardRef, useState, useImperativeHandle, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';

import {
  BottomSheetComponent,
  BottomSheetRef,
} from '@/components/ui/BottomSheet';
import { Button } from '@/components/ui/Button';
import { colors } from '@/theme/colors';

interface HelpMeWriteBottomSheetProps {
  originalText: string;
  onSelectRevision?: (revisedText: string) => void;
}

export type HelpMeWriteBottomSheetRef = BottomSheetRef;

const HelpMeWriteBottomSheet = forwardRef<
  HelpMeWriteBottomSheetRef,
  HelpMeWriteBottomSheetProps
>(({ originalText, onSelectRevision }, ref) => {
  const bottomSheetRef = useRef<BottomSheetRef>(null);
  const [revisedTexts, setRevisedTexts] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  useImperativeHandle(ref, () => ({
    expand: () => {
      bottomSheetRef.current?.expand();
      // Generate suggestions when opening
      if (originalText && revisedTexts.length === 0) {
        generateRevisions();
      }
    },
    close: () => {
      bottomSheetRef.current?.close();
    },
  }));

  // TODO: Replace with actual AI generation API call
  const generateRevisions = async () => {
    setIsGenerating(true);

    // Simulate AI generation delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Generate mock revised texts
    // In production, this would call your AI service
    const mockRevisions = [
      `${originalText}\n\nI would greatly appreciate any support you can provide during this challenging time. Your generosity would make a meaningful difference.`,
      `${originalText}\n\nAny assistance would be incredibly helpful. Thank you for considering my request and for your kindness.`,
      // `${originalText}\n\nI'm reaching out to my community for support. If you're able to help in any way, I would be deeply grateful for your contribution.`,
    ];

    setRevisedTexts(mockRevisions);
    setIsGenerating(false);
  };

  const handleRegenerate = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    generateRevisions();
  };

  const handleClose = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    bottomSheetRef.current?.close();
  };

  const handleSelectRevision = (revisedText: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onSelectRevision?.(revisedText);
    bottomSheetRef.current?.close();
  };

  return (
    <BottomSheetComponent ref={bottomSheetRef} snapPoints={['70%']}>
      <View className="flex-1 px-4">
        {/* Header */}
        <View className="mb-6 flex-row items-center gap-2">
          <Image
            source={require('../../assets/images/sparkles.png')}
            style={{ width: 24, height: 24 }}
            contentFit="contain"
          />
          <Text className="text-xl font-bold text-grey-alpha-500">
            Write with ai
          </Text>
        </View>

        {/* Content */}
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          {/* Original Text Section */}
          <View className="mb-6 border-b border-grey-plain-300 pb-3">
            <Text className="mb-2 text-xs font-semibold uppercase tracking-wide text-grey-alpha-400">
              Your Text
            </Text>
            <View className="rounded-2xl">
              <Text className="text-base leading-6 text-grey-alpha-500">
                {originalText || 'No text entered yet'}
              </Text>
            </View>
          </View>

          {/* Revised Texts Section */}
          {isGenerating ? (
            <View className="flex-1 items-center justify-center py-8">
              <Text className="text-sm text-grey-alpha-400">
                Generating suggestions...
              </Text>
            </View>
          ) : (
            <>
              {revisedTexts.map((revisedText, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleSelectRevision(revisedText)}
                  activeOpacity={0.7}
                  className="mb-4"
                >
                  <View
                    className="rounded-2xl p-4"
                    style={{ backgroundColor: colors['grey-alpha']['150'] }}
                  >
                    <Text className="mb-2 text-sm font-semibold uppercase tracking-wide text-grey-alpha-400">
                      Revised Text #{index + 1}
                    </Text>
                    <Text className="text-base leading-6 text-grey-alpha-500">
                      {revisedText}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </>
          )}
        </ScrollView>

        {/* Action Buttons */}
        <View className="flex-row gap-3 pb-4 pt-2">
          <View className="flex-1">
            <Button
              title="Close"
              onPress={handleClose}
              variant="outline"
              size="small"
            />
          </View>
          <View className="flex-1">
            <Button
              title="Regenerate"
              onPress={handleRegenerate}
              variant="primary"
              size="small"
              loading={isGenerating}
              disabled={isGenerating || !originalText}
            />
          </View>
        </View>
      </View>
    </BottomSheetComponent>
  );
});

HelpMeWriteBottomSheet.displayName = 'HelpMeWriteBottomSheet';

export default HelpMeWriteBottomSheet;
