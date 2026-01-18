import React, { forwardRef, useState } from 'react';
import { View, Text, TouchableOpacity, Share } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import { Share2, Link, Download } from 'lucide-react-native';
import { Svg, Rect } from 'react-native-svg';
import {
  BottomSheetComponent,
  BottomSheetRef,
} from '@/components/ui/BottomSheet';
import { Toast } from '@/components/ui/Toast';
import { colors } from '@/theme/colors';

interface ShareProfileBottomSheetProps {
  username: string;
  profileUrl?: string;
}

// QR Code Placeholder SVG Component
function QRCodePlaceholder({ size = 200 }: { size?: number }) {
  const cellSize = size / 25; // 25x25 grid
  const padding = size * 0.1; // 10% padding

  // Generate a simple pattern for the QR code placeholder
  const generatePattern = () => {
    const pattern = [];
    for (let row = 0; row < 25; row++) {
      for (let col = 0; col < 25; col++) {
        // Create corner squares (position finder patterns)
        const isCornerSquare =
          (row < 7 && col < 7) ||
          (row < 7 && col >= 18) ||
          (row >= 18 && col < 7);

        // Create inner corner squares
        const isInnerCorner =
          (row >= 2 && row < 5 && col >= 2 && col < 5) ||
          (row >= 2 && row < 5 && col >= 20 && col < 23) ||
          (row >= 20 && row < 23 && col >= 2 && col < 5);

        // Create timing patterns (alternating pattern)
        const isTiming = row === 6 || col === 6 || row === 18 || col === 18;

        // Create deterministic data pattern
        const isDataPattern =
          !isCornerSquare &&
          !isInnerCorner &&
          !isTiming &&
          (row * 7 + col * 11) % 5 < 2;

        if (isCornerSquare || isInnerCorner || isTiming || isDataPattern) {
          pattern.push(
            <Rect
              key={`${row}-${col}`}
              x={padding + col * cellSize}
              y={padding + row * cellSize}
              width={cellSize}
              height={cellSize}
              fill="#000000"
            />
          );
        }
      }
    }
    return pattern;
  };

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <Rect x={0} y={0} width={size} height={size} fill="#FFFFFF" rx={12} />
      {generatePattern()}
    </Svg>
  );
}

export const ShareProfileBottomSheet = forwardRef<
  BottomSheetRef,
  ShareProfileBottomSheetProps
>(({ username, profileUrl }, ref) => {
  const defaultUrl = `https://lifteller.com/${username}`;
  const [showToast, setShowToast] = useState(false);

  const handleShareProfile = async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      await Share.share({
        message: `Check out @${username} on Lifteller: ${profileUrl || defaultUrl}`,
        url: profileUrl || defaultUrl,
      });
    } catch (error) {
      console.error('Error sharing profile:', error);
    }
  };

  const handleCopyLink = async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      await Clipboard.setStringAsync(profileUrl || defaultUrl);
      setShowToast(true);
    } catch (error) {
      console.error('Error copying link:', error);
    }
  };

  const handleDownload = async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      // TODO: Implement QR code download functionality
      // This would generate the QR code image and save it to the device
      console.log('Download QR code');
    } catch (error) {
      console.error('Error downloading QR code:', error);
    }
  };

  return (
    <>
      <Toast
        visible={showToast}
        message="Link copied!"
        duration={2000}
        onHide={() => setShowToast(false)}
      />
      <BottomSheetComponent
        ref={ref}
        title="Share profile"
        snapPoints={['40%']}
      >
        <View className="px-6">
          {/* QR Code */}
          <View className="items-center">
            <QRCodePlaceholder size={200} />
            <Text className="mt-4 text-base font-medium text-grey-alpha-500">
              @{username}
            </Text>
          </View>

          {/* Action Buttons */}
          <View className="mt-8 flex-row justify-around">
            {/* Share Profile Button */}
            <TouchableOpacity
              onPress={handleShareProfile}
              className="items-center"
              activeOpacity={0.7}
            >
              <View
                className="mb-2 h-14 w-14 items-center justify-center rounded-full"
                style={{ backgroundColor: colors['grey-plain']['150'] }}
              >
                <Share2
                  color={colors['grey-alpha']['500']}
                  size={24}
                  strokeWidth={2}
                />
              </View>
              <Text className="text-xs font-medium text-grey-alpha-500">
                Share profile
              </Text>
            </TouchableOpacity>

            {/* Copy Link Button */}
            <TouchableOpacity
              onPress={handleCopyLink}
              className="items-center"
              activeOpacity={0.7}
            >
              <View
                className="mb-2 h-14 w-14 items-center justify-center rounded-full"
                style={{ backgroundColor: colors['grey-plain']['150'] }}
              >
                <Link
                  color={colors['grey-alpha']['500']}
                  size={24}
                  strokeWidth={2}
                />
              </View>
              <Text className="text-xs font-medium text-grey-alpha-500">
                Copy link
              </Text>
            </TouchableOpacity>

            {/* Download Button */}
            <TouchableOpacity
              onPress={handleDownload}
              className="items-center"
              activeOpacity={0.7}
            >
              <View
                className="mb-2 h-14 w-14 items-center justify-center rounded-full"
                style={{ backgroundColor: colors['grey-plain']['150'] }}
              >
                <Download
                  color={colors['grey-alpha']['500']}
                  size={24}
                  strokeWidth={2}
                />
              </View>
              <Text className="text-xs font-medium text-grey-alpha-500">
                Download
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </BottomSheetComponent>
    </>
  );
});

ShareProfileBottomSheet.displayName = 'ShareProfileBottomSheet';
