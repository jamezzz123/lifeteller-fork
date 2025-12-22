import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  CornerUpLeft,
  MessageSquare,
  MessageSquareText,
  X,
} from 'lucide-react-native';
import { colors } from '@/theme/colors';
import { mockLifts } from '@/data/mockLifts';
import { ProfileStack } from '@/components/ui/ProfileStack';
import { ConfirmationModal } from '@/components/ui/ConfirmationModal';
import { Button } from '@/components/ui/Button';
import { MaterialInput } from '@/components/ui/MaterialInput';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';

const MESSAGE_TEMPLATES = [
  'Thank you for the lift, I appreciate it.',
  'I am in awe. Thank you for the monetary lift.',
  'This is me saying a huge thank you for the lift',
];

export default function BroadcastMessageScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [message, setMessage] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Get lift data from mockLifts
  const liftData = mockLifts.find((lift) => lift.id === id);

  if (!liftData) {
    return (
      <SafeAreaView className="flex-1 bg-grey-plain-50">
        <View className="flex-1 items-center justify-center">
          <Text className="text-grey-plain-550">Lift not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const contributors = liftData.monetary?.coRaisers || [];
  const totalLifters = contributors.length;
  const profileImages = contributors.map((raiser) => raiser.avatar);

  const handleSendPress = () => {
    if (message.trim()) {
      setShowConfirmModal(true);
    }
  };

  const handleConfirmSend = () => {
    setShowConfirmModal(false);
    // TODO: Implement actual send logic
    router.back();
  };

  const handleTemplatePress = (template: string) => {
    setMessage(template);
  };

  return (
    <SafeAreaView className="flex-1 bg-grey-plain-50" edges={['top']}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View className="flex-row items-center justify-between border-b border-grey-plain-150 bg-white px-4 py-3">
          <TouchableOpacity onPress={() => router.back()}>
            <CornerUpLeft color={colors['grey-plain']['550']} size={24} />
          </TouchableOpacity>
          <Text className="flex-1 px-4 text-lg font-semibold text-grey-alpha-500">
            Send broadcast message
          </Text>

          <Button
            title="Send"
            size="small"
            onPress={handleSendPress}
            disabled={!message.trim()}
          ></Button>
        </View>

        <ScrollView
          className="flex-1 bg-white"
          showsVerticalScrollIndicator={false}
        >
          {/* Recipients */}
          <View className="flex-row items-center gap-3 border-b border-grey-plain-150 px-4 py-4">
            <ProfileStack
              profiles={profileImages}
              maxVisible={3}
              size={32}
              overlap={16}
            />
            <Text className="text-base text-grey-alpha-500">
              <Text className="font-semibold">
                {contributors[0]?.name || 'Lifter'}
              </Text>
              {totalLifters > 1 && (
                <Text className="text-grey-plain-550">
                  {' '}
                  and {totalLifters - 1} others
                </Text>
              )}
            </Text>
          </View>

          {/* Message Input */}
          <View className="px-4 pt-4">
            <MaterialInput
              size="small"
              value={message}
              onChangeText={setMessage}
              placeholder="Describe your appreciation message here..."
              placeholderTextColor={colors['grey-plain']['450']}
              multiline
              textAlignVertical="top"
            />
          </View>

          {/* Templates */}
          <View className="mt-6 px-4">
            <View className="mb-4 flex-row items-center gap-2">
              {/* <View className="bg-grey-plain-200 h-5 w-5 items-center justify-center rounded">
                <Text className="text-xs text-grey-plain-550">≡</Text>
              </View> */}
              <MessageSquareText size={16} />
              <Text className="text-base font-semibold text-grey-alpha-500">
                Templates
              </Text>
            </View>

            <View className="gap-3">
              {MESSAGE_TEMPLATES.map((template, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleTemplatePress(template)}
                  className="rounded-xl bg-grey-plain-100 p-4"
                >
                  <Text className="text-sm leading-5 text-grey-alpha-500">
                    {template}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Confirmation Modal */}
      <ConfirmDialog
        visible={showConfirmModal}
        title="Send broadcast message"
        message="Are you sure you want to send broadcast message to your lifters?"
        confirmText="Yes, send"
        cancelText="No"
        onConfirm={handleConfirmSend}
        onCancel={() => setShowConfirmModal(false)}
      />
    </SafeAreaView>
  );
}
