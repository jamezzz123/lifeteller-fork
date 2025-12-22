import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import {
  CornerUpLeft,
  HelpCircle,
  MessageSquareHeart,
  Bug,
  FileText,
  ChevronRight,
  MessageCircleQuestionMark,
} from 'lucide-react-native';
import { colors } from '@/theme/colors';

interface HelpOption {
  id: string;
  icon: React.ComponentType<{
    color: string;
    size: number;
    strokeWidth: number;
  }>;
  title: string;
  description: string;
  onPress?: () => void;
}

function HelpOptionItem({ option }: { option: HelpOption }) {
  const IconComponent = option.icon;

  return (
    <TouchableOpacity
      onPress={option.onPress}
      className="flex-row items-center gap-4 rounded-xl bg-white px-4 py-4"
      activeOpacity={0.7}
    >
      <View
        className="h-12 w-12 items-center justify-center rounded-full"
        style={{
          backgroundColor: colors['primary-tints'].purple['50'],
        }}
      >
        <IconComponent
          color={colors.primary.purple}
          size={24}
          strokeWidth={2}
        />
      </View>
      <View className="flex-1">
        <Text className="mb-1 text-[15px] font-semibold text-grey-alpha-500">
          {option.title}
        </Text>
        <Text className="text-sm text-grey-plain-550">
          {option.description}
        </Text>
      </View>
      <ChevronRight
        color={colors['grey-plain']['550']}
        size={20}
        strokeWidth={2}
      />
    </TouchableOpacity>
  );
}

export default function HelpAndFeedbackScreen() {
  const helpOptions: HelpOption[] = [
    {
      id: 'help-center',
      icon: HelpCircle,
      title: 'Help center',
      description: 'Get help and FAQs',
      onPress: () => {
        router.push('/help-center');
      },
    },
    {
      id: 'send-feedback',
      icon: MessageSquareHeart,
      title: 'Send feedback',
      description: 'Share your thoughts and suggestions',
      onPress: () => {
        router.push('/send-feedback');
      },
    },
    {
      id: 'report-issue',
      icon: Bug,
      title: 'Report issue',
      description: 'Report any issue you are experiencing',
      onPress: () => {
        router.push('/report-issue');
      },
    },
    {
      id: 'terms-of-use',
      icon: FileText,
      title: 'Terms of use',
      description: 'Our service of use and engagement',
      onPress: () => {
        router.push('/terms-of-service');
      },
    },
    {
      id: 'privacy-policy',
      icon: FileText,
      title: 'Privacy policy',
      description: 'Learn how we protect your data',
      onPress: () => {
        router.push('/privacy-policy');
      },
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'bottom']}>
      {/* Header */}
      <View className="flex-row items-center justify-between border-b border-grey-plain-150 bg-white px-4 py-3">
        <View className="flex-row items-center gap-3">
          <TouchableOpacity onPress={() => router.back()} className="mr-3">
            <CornerUpLeft
              color={colors['grey-plain']['550']}
              size={24}
              strokeWidth={2}
            />
          </TouchableOpacity>
          <Text className="text-lg font-semibold text-grey-alpha-500">
            Help and feedback
          </Text>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 16 }}
      >
        {/* Section Title */}
        <View
          className="mx-4 mt-6 rounded-2xl p-2"
          style={{ backgroundColor: colors['grey-plain']['150'] }}
        >
          <Text className="mb-4 ml-3 mt-2 text-base font-semibold text-grey-alpha-500">
            Help and feedback
          </Text>

          {/* Help Options */}
          <View className="gap-1">
            {helpOptions.map((option) => (
              <HelpOptionItem key={option.id} option={option} />
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Contact Us Button - Fixed at bottom right */}
      <View className="absolute bottom-6 right-8">
        <TouchableOpacity
          className="flex-row items-center justify-center gap-2 rounded-full px-6 py-4"
          style={{ backgroundColor: colors.primary.purple }}
          onPress={() => {
            // TODO: Handle contact us
            console.log('Contact us');
          }}
          activeOpacity={0.8}
        >
          <MessageCircleQuestionMark color="white" size={20} />
          <Text className="text-base font-semibold text-white">Contact us</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
