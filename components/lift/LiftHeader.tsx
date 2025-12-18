import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Search, Bell, MessageSquareText } from 'lucide-react-native';
import LogoColor from '@/assets/images/logo/logo-color.svg';
import { colors } from '@/theme/colors';

export function LiftHeader() {
  return (
    <View className="flex-row items-center justify-between bg-grey-plain-50 px-4 py-3">
      {/* Logo */}
      <View className="flex-row items-center gap-2">
        <Text className="text-2xl"> Lift</Text>
      </View>

      {/* Actions */}
      <View className="flex-row items-center gap-4">
        <TouchableOpacity className="p-1">
          <Search color={colors['grey-plain']['550']} size={24} />
        </TouchableOpacity>
        <TouchableOpacity className="p-1">
          <View className="relative">
            <Bell color={colors['grey-plain']['550']} size={24} />
            <View className="absolute -right-1 -top-1 h-5 min-w-[20px] items-center justify-center rounded-[10px] bg-state-red px-1">
              <Text className="text-[10px] font-bold text-grey-plain-50">
                2
              </Text>
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity className="p-1">
          <MessageSquareText color={colors['grey-plain']['550']} size={24} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
