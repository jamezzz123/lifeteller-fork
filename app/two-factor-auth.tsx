import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import {
  CornerUpLeft,
  MessageSquareDot,
  Mail,
  Smartphone,
  ChevronRight,
  CheckCircle2,
} from 'lucide-react-native';
import { colors } from '@/theme/colors';

interface TwoFactorMethod {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{
    color: string;
    size: number;
    strokeWidth: number;
  }>;
  isActive: boolean;
  activatedDate?: string;
  isComingSoon?: boolean;
}

export default function TwoFactorAuthScreen() {
  const methods: TwoFactorMethod[] = [
    {
      id: 'sms',
      name: 'Text/SMS',
      description: 'Verify your login with an SMS OTP',
      icon: MessageSquareDot,
      isActive: false,
    },
    {
      id: 'email',
      name: 'Email',
      description: 'Verify your login with an email OTP',
      icon: Mail,
      isActive: true,
      activatedDate: '8 Dec 2024',
    },
    {
      id: 'authenticator',
      name: 'Authenticator app',
      description: 'Google, Microsoft, etc...',
      icon: Smartphone,
      isActive: false,
      isComingSoon: true,
    },
  ];

  const handleMethodPress = (methodId: string) => {
    const method = methods.find((m) => m.id === methodId);
    if (!method || method.isComingSoon) {
      return;
    }
    // TODO: Navigate to setup/configure screen for this method
    console.log('Configure method:', methodId);
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'bottom']}>
      {/* Header */}
      <View className="flex-row items-center border-b border-grey-plain-150 bg-white px-4 py-3">
        <TouchableOpacity onPress={() => router.back()} className="mr-3">
          <CornerUpLeft
            color={colors['grey-plain']['550']}
            size={24}
            strokeWidth={2}
          />
        </TouchableOpacity>
        <Text className="text-lg font-inter-semibold text-grey-alpha-500">
          Two-factor authentication (2FA)
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        {/* Activate 2FA Section */}
        <View
          className="mx-4 mt-6 rounded-2xl p-2"
          style={{ backgroundColor: colors['grey-plain']['150'] }}
        >
          <Text className="mb-4 ml-3 mt-2 text-base font-inter-semibold text-grey-alpha-500">
            Activate your 2FA
          </Text>

          <View className="gap-1">
            {methods.map((method) => {
              const IconComponent = method.icon;
              const isDisabled = method.isComingSoon;

              return (
                <TouchableOpacity
                  key={method.id}
                  onPress={() => handleMethodPress(method.id)}
                  disabled={isDisabled}
                  className={`flex-row items-center gap-3 rounded-xl bg-white px-4 py-4 ${
                    isDisabled ? 'opacity-60' : ''
                  }`}
                  activeOpacity={isDisabled ? 1 : 0.7}
                >
                  <View
                    className="h-10 w-10 items-center justify-center rounded-full"
                    style={{
                      backgroundColor: colors['primary-tints'].purple['50'],
                    }}
                  >
                    <IconComponent
                      color={colors.primary.purple}
                      size={20}
                      strokeWidth={2}
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="mb-1 text-[15px] font-inter-semibold text-grey-alpha-500">
                      {method.name}
                    </Text>
                    <Text className="text-sm text-grey-plain-550">
                      {method.description}
                    </Text>
                    {method.isActive && method.activatedDate && (
                      <View className="mt-2 flex-row items-center gap-1.5">
                        <View
                          className="flex-row items-center gap-1.5 rounded-full px-2 py-0.5"
                          style={{
                            backgroundColor: colors['green-tint']['200'],
                          }}
                        >
                          <CheckCircle2
                            color={colors['green-shades']['150']}
                            size={12}
                            strokeWidth={2.5}
                          />
                          <Text
                            className="text-xs font-inter-medium"
                            style={{ color: colors['green-shades']['150'] }}
                          >
                            On since {method.activatedDate}
                          </Text>
                        </View>
                      </View>
                    )}
                    {method.isComingSoon && (
                      <View className="mt-2">
                        <View
                          className="self-start rounded-full px-2 py-0.5"
                          style={{
                            backgroundColor: colors['grey-plain']['300'],
                          }}
                        >
                          <Text className="text-xs font-inter-medium text-grey-plain-550">
                            Coming soon
                          </Text>
                        </View>
                      </View>
                    )}
                  </View>
                  {!isDisabled && (
                    <ChevronRight
                      color={colors['grey-plain']['550']}
                      size={20}
                      strokeWidth={2}
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Info Text */}
        <View className="mx-4 mt-4 px-2">
          <Text className="text-sm text-grey-plain-550">
            You can activate more than one options for your two-factor
            authentication.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
