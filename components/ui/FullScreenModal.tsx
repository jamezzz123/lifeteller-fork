import { ReactNode } from 'react';
import { Modal, Platform, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X } from 'lucide-react-native';

import { colors } from '@/theme/colors';

type FullScreenModalProps = {
  visible: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  rightButton?: {
    label: string;
    onPress: () => void;
    disabled?: boolean;
  };
};

export function FullScreenModal({
  visible,
  title,
  onClose,
  children,
  rightButton,
}: FullScreenModalProps) {
  return (
    <Modal
      visible={visible}
      animationType="fade"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
      statusBarTranslucent={false}
    >
      <SafeAreaView className="flex-1 bg-background" edges={['top', 'bottom']}>
        <View className="flex-1">
          {/* Header */}
          <View
            className="flex-row items-center justify-between px-4 py-3"
            style={{ marginTop: Platform.OS === 'ios' ? 45 : 12 }}
          >
            <View className="flex-row items-center gap-3">
              <TouchableOpacity
                onPress={onClose}
                hitSlop={10}
                accessibilityLabel="Close"
              >
                <X
                  size={20}
                  color={colors['grey-alpha']['500']}
                  strokeWidth={2.6}
                />
              </TouchableOpacity>
              <Text className="text-base font-semibold text-grey-alpha-500">
                {title}
              </Text>
            </View>

            {rightButton && (
              <TouchableOpacity
                onPress={rightButton.onPress}
                disabled={rightButton.disabled}
                className="rounded-full px-6 py-2"
                style={{
                  backgroundColor: rightButton.disabled
                    ? colors['grey-plain']['450']
                    : colors.primary.purple,
                }}
                accessibilityLabel={rightButton.label}
              >
                <Text
                  className="text-sm font-semibold"
                  style={{
                    color: rightButton.disabled
                      ? colors['grey-alpha']['400']
                      : '#FFFFFF',
                  }}
                >
                  {rightButton.label}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Content */}
          {children}
        </View>
      </SafeAreaView>
    </Modal>
  );
}
