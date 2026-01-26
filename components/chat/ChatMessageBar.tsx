import React from 'react';
import { View, TouchableOpacity, TextInput as RNTextInput } from 'react-native';
import { Smile, Paperclip, Camera, Mic, SendHorizontal } from 'lucide-react-native';
import { colors } from '@/theme/colors';

interface ChatMessageBarProps {
  message: string;
  onChangeMessage: (value: string) => void;
  onSend: () => void;
  onOpenAttachments?: () => void;
  onOpenCamera?: () => void;
  onOpenEmoji?: () => void;
  placeholder?: string;
  hasAttachments?: boolean;
}

export function ChatMessageBar({
  message,
  onChangeMessage,
  onSend,
  onOpenAttachments,
  onOpenCamera,
  onOpenEmoji,
  placeholder = 'Start a message...',
  hasAttachments = false,
}: ChatMessageBarProps) {
  const hasMessage = message.trim().length > 0;
  const showSend = hasMessage || hasAttachments;

  return (
    <View className="border-t border-grey-plain-150 bg-white px-4 py-3">
      <View className="flex-row items-start gap-3">
        <TouchableOpacity className="p-1" onPress={onOpenEmoji}>
          <Smile color={colors['grey-plain']['550']} size={24} />
        </TouchableOpacity>

        <View className="flex-1 flex-row items-center rounded-3xl border border-grey-plain-300 bg-grey-plain-50 px-4 py-2">
          <RNTextInput
            value={message}
            onChangeText={onChangeMessage}
            placeholder={placeholder}
            placeholderTextColor={colors['grey-alpha']['400']}
            className="flex-1 text-base text-grey-alpha-500"
            style={{
              fontSize: 16,
              textAlignVertical: 'center',
              paddingVertical: 0,
              minHeight: 20,
            }}
            multiline
            maxLength={500}
          />
        </View>

        <View className="flex flex-row items-center gap-3">
          <TouchableOpacity onPress={onOpenAttachments} className="p-1">
            <Paperclip color={colors['grey-plain']['550']} size={24} />
          </TouchableOpacity>

          <TouchableOpacity onPress={onOpenCamera} className="p-1">
            <Camera color={colors['grey-plain']['550']} size={24} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onSend}
            className="items-center justify-center rounded-full"
            style={{
              width: 48,
              height: 48,
              backgroundColor: colors.primary.purple,
            }}
          >
            {showSend ? (
              <SendHorizontal color={colors['grey-plain']['50']} size={24} />
            ) : (
              <Mic color={colors['grey-plain']['50']} size={24} />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
