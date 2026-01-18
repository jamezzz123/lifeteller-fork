import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TabView, TabBar, Route } from 'react-native-tab-view';
import { router } from 'expo-router';
import {
  CornerUpLeft,
  HelpCircle,
  Search,
  ChevronRight,
  Lightbulb,
  Wallet,
  Users,
  Shield,
  HandHelping,
} from 'lucide-react-native';
import { colors } from '@/theme/colors';

const { width } = Dimensions.get('window');

interface HelpTopic {
  id: string;
  icon: React.ComponentType<{
    color: string;
    size: number;
    strokeWidth: number;
  }>;
  title: string;
  articleCount: number;
  onPress?: () => void;
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
  expanded?: boolean;
}

function TopicCard({ topic }: { topic: HelpTopic }) {
  const IconComponent = topic.icon;

  return (
    <TouchableOpacity
      onPress={topic.onPress}
      className="mx-4 mb-3 flex-row items-center gap-4 rounded-xl border border-grey-plain-300 bg-white p-4"
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
        <Text className="mb-1 text-[15px] font-inter-semibold text-grey-alpha-500">
          {topic.title}
        </Text>
        <Text className="text-xs text-grey-plain-550">
          {topic.articleCount}{' '}
          {topic.articleCount === 1 ? 'article' : 'articles'}
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

function FAQItem({
  faq,
  expanded,
  onPress,
}: {
  faq: FAQ;
  expanded: boolean;
  onPress: () => void;
}) {
  return (
    <View>
      <TouchableOpacity
        onPress={onPress}
        className="flex-row items-start justify-between bg-white px-4 py-4"
        activeOpacity={0.7}
      >
        <View className="flex-1 pr-4">
          <Text className="text-base font-inter-semibold text-grey-alpha-500">
            {faq.question}
          </Text>
        </View>
        <ChevronRight
          color={colors['grey-plain']['550']}
          size={24}
          strokeWidth={2}
          style={{
            transform: [{ rotate: expanded ? '180deg' : '0deg' }],
          }}
        />
      </TouchableOpacity>

      {expanded && (
        <View className="bg-white px-4 pb-4">
          <View className="border-t border-grey-plain-150 pt-4">
            <Text className="text-base leading-6 text-grey-plain-550">
              {faq.answer}
            </Text>
          </View>
        </View>
      )}

      <View
        className="mx-4 h-px"
        style={{ backgroundColor: colors['grey-plain']['150'] }}
      />
    </View>
  );
}

function TopicsTab() {
  const topics: HelpTopic[] = [
    {
      id: 'onboarding',
      icon: Lightbulb,
      title: 'Onboarding',
      articleCount: 4,
      onPress: () => {
        router.push(`/help-center/onboarding`);
      },
    },
    {
      id: 'lift-lifting',
      icon: HandHelping,
      title: 'Lift and Lifting',
      articleCount: 17,
      onPress: () => {
        router.push(`/help-center/lift-lifting`);
      },
    },
    {
      id: 'wallet',
      icon: Wallet,
      title: 'Wallet',
      articleCount: 17,
      onPress: () => {
        router.push(`/help-center/wallet`);
      },
    },
    {
      id: 'community',
      icon: Users,
      title: 'Community',
      articleCount: 8,
      onPress: () => {
        router.push(`/help-center/community`);
      },
    },
    {
      id: 'security',
      icon: Shield,
      title: 'Security',
      articleCount: 12,
      onPress: () => {
        router.push(`/help-center/security`);
      },
    },
  ];

  return (
    <ScrollView
      className="mt-4 flex-1 bg-grey-plain-50"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 16 }}
    >
      {topics.map((topic) => (
        <TopicCard key={topic.id} topic={topic} />
      ))}
    </ScrollView>
  );
}

function FAQsTab() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const faqs: FAQ[] = [
    {
      id: 'faq-1',
      question: 'How do I create an account?',
      answer:
        'To create an account, tap on the "Get Started" button on the welcome screen, enter your email or phone number, and follow the onboarding steps to set up your profile.',
    },
    {
      id: 'faq-2',
      question: 'How do I request a lift?',
      answer:
        'Go to the Lifts tab, tap the "Request Lift" button, enter your destination, select your preferred time, and submit your request. Other users can then accept your lift request.',
    },
    {
      id: 'faq-3',
      question: 'What is a lift credit?',
      answer:
        'A lift credit is a currency within the Lifteller app that you earn by offering lifts and can use when requesting lifts. It encourages community participation and reciprocal help.',
    },
    {
      id: 'faq-4',
      question: 'How do I add a payment method?',
      answer:
        'Go to Settings > Wallet, tap "Add Payment Method", and follow the secure payment setup process. We support multiple payment options for your convenience.',
    },
    {
      id: 'faq-5',
      question: 'Is my personal information safe?',
      answer:
        'Yes, we take security seriously. Your data is encrypted and protected. You can review our Privacy Policy in the Settings > Help and Feedback section for more details.',
    },
    {
      id: 'faq-6',
      question: 'How do I report a user?',
      answer:
        'If you encounter inappropriate behavior, you can report a user by going to their profile, tapping the menu icon, and selecting "Report User". Our team will review the report promptly.',
    },
  ];

  return (
    <ScrollView
      className="flex-1 bg-grey-plain-50"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 16 }}
    >
      <View className="mt-4 overflow-hidden rounded-2xl bg-white">
        {faqs.map((faq, index) => (
          <View key={faq.id}>
            <FAQItem
              faq={faq}
              expanded={expandedId === faq.id}
              onPress={() =>
                setExpandedId(expandedId === faq.id ? null : faq.id)
              }
            />
            {index === faqs.length - 1 && (
              <View style={{ backgroundColor: colors['grey-plain']['150'] }} />
            )}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

export default function HelpCenterScreen() {
  const [index, setIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const routes: Route[] = [
    { key: 'topics', title: 'Topics' },
    { key: 'faqs', title: 'FAQs' },
  ];

  const renderScene = ({ route }: { route: Route }) => {
    switch (route.key) {
      case 'topics':
        return <TopicsTab />;
      case 'faqs':
        return <FAQsTab />;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'bottom']}>
      {/* Header */}
      <View className="border-b border-grey-plain-150 bg-white px-4 py-3">
        <View className="mb-4 flex-row items-center gap-3">
          <TouchableOpacity onPress={() => router.back()}>
            <CornerUpLeft
              color={colors['grey-plain']['550']}
              size={24}
              strokeWidth={2}
            />
          </TouchableOpacity>
          <Text className="text-lg font-inter-semibold text-grey-alpha-500">
            Help center
          </Text>
        </View>

        {/* Search Input */}
        <View
          className="flex-row items-center gap-3 rounded-full px-4 py-2.5"
          style={{ backgroundColor: colors['grey-plain']['100'] }}
        >
          <Search
            color={colors['grey-plain']['550']}
            size={20}
            strokeWidth={2}
          />
          <TextInput
            placeholder="Search by topic, issue, or question"
            placeholderTextColor={colors['grey-plain']['550']}
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="flex-1 text-sm text-grey-alpha-500"
          />
        </View>
      </View>

      {/* Tab View */}
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width }}
        renderTabBar={(props) => (
          <TabBar
            {...props}
            indicatorStyle={{
              backgroundColor: colors.primary.purple,
              height: 2,
            }}
            style={{
              backgroundColor: 'white',
              borderBottomWidth: 1,
              borderBottomColor: colors['grey-plain']['150'],
            }}
            activeColor={colors.primary.purple}
            inactiveColor={colors['grey-plain']['550']}
            scrollEnabled
            tabStyle={{ width: 'auto', paddingHorizontal: 12 }}
            // @ts-ignore - renderLabel is a valid prop in react-native-tab-view
            renderLabel={({
              route,
              focused,
            }: {
              route: Route;
              focused: boolean;
            }) => (
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '600',
                  color: focused
                    ? colors.primary.purple
                    : colors['grey-plain']['550'],
                }}
              >
                {route.title}
              </Text>
            )}
          />
        )}
      />

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
          <HelpCircle color="white" size={20} strokeWidth={2} />
          <Text className="text-base font-inter-semibold text-white">Contact us</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
