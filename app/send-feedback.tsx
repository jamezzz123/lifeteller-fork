import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { CornerUpLeft } from 'lucide-react-native';
import { Button } from '@/components/ui/Button';
import { colors } from '@/theme/colors';

export default function SendFeedbackScreen() {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    // placeholder send behavior
    console.log('Send feedback:', message);
    setMessage('');
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'bottom']}>
      {/* Header */}
      <View className="flex-row items-center justify-between border-b border-grey-plain-150 bg-white px-4 py-3">
        <View className="flex-row items-center gap-3">
          <TouchableOpacity onPress={() => router.back()} className="mr-2">
            <CornerUpLeft
              color={colors['grey-plain']['550']}
              size={24}
              strokeWidth={2}
            />
          </TouchableOpacity>
          <Text className="text-lg font-semibold text-grey-alpha-500">
            Send feedback
          </Text>
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ paddingBottom: 160 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="px-4 pt-6">
            <Text className="text-base text-grey-plain-550">
              Share your thoughts and suggestions. We value them.
            </Text>

            <TextInput
              multiline
              placeholder="Type here"
              placeholderTextColor={colors['grey-plain']['300']}
              value={message}
              onChangeText={setMessage}
              style={{
                minHeight: 160,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: colors['grey-plain']['300'],
                padding: 12,
                marginTop: 6,
                backgroundColor: 'white',
                textAlignVertical: 'top',
                color: colors['grey-alpha']['500'],
              }}
            />

            <Text className="mt-6 text-sm text-grey-plain-550">
              For other issues, you can get help or contact support from the{' '}
              <Text
                onPress={() => router.push('/help-center')}
                style={{ color: colors.primary.purple, fontWeight: '600' }}
              >
                help center
              </Text>
              .
            </Text>
          </View>
        </ScrollView>

        {/* CTA */}
        <View className="absolute bottom-6 left-0 right-0 px-4">
          <Button
            title="Send Feedback"
            onPress={handleSend}
            disabled={message.trim().length === 0}
            size="large"
            variant={message.trim().length === 0 ? 'secondary' : 'primary'}
            className="w-full"
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
