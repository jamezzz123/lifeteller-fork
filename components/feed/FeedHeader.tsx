import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Search, Bell, MessageSquareText } from 'lucide-react-native';
import { router } from 'expo-router';
import LogoColor from '@/assets/images/logo/logo-color.svg';
import { colors } from '@/theme/colors';

export function FeedHeader() {
  return (
    <View className="flex-row items-center justify-between border-b border-grey-plain-300 bg-grey-plain-50 px-4 py-3">
      {/* Logo */}
      <View className="flex-row items-center gap-2">
        <LogoColor width={104} height={30} />
      </View>

      {/* Actions */}
      <View className="flex-row items-center gap-4">
        <TouchableOpacity className="p-1">
          <Search color={colors['grey-plain']['550']} size={24} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.push('/account-notification')}
          className="p-1"
        >
          <View className="relative">
            <Bell color={colors['grey-plain']['550']} size={24} />
            <View className="absolute -right-1 -top-1 h-5 min-w-[20px] items-center justify-center rounded-[10px] bg-state-red px-1">
              <Text className="text-[10px] font-inter-bold text-grey-plain-50">
                2
              </Text>
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          className="p-1"
          onPress={() => router.push('/messages' as any)}
        >
          <MessageSquareText color={colors['grey-plain']['550']} size={24} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
