import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { CornerUpLeft, Search, MoreVertical } from 'lucide-react-native';
import { colors } from '@/theme/colors';

interface ArticleSection {
  type: 'title' | 'intro' | 'heading' | 'bullet' | 'text';
  content: string;
  icon?: string;
  level?: number;
}

interface ArticleContent {
  title: string;
  sections: ArticleSection[];
}

// Article content data
const articlesData: Record<string, ArticleContent> = {
  'article-onboarding-1': {
    title: 'Onboarding',
    sections: [
      {
        type: 'intro',
        content:
          "Welcome to the Lifteller App! We're thrilled to have you join our community. This guide will walk you through the essential steps to set up your profile and start using our main features.",
      },
      {
        type: 'heading',
        content: '1. 📋 Profile Setup',
        level: 1,
      },
      {
        type: 'text',
        content:
          'Your profile is your identity on [App Name]. A complete profile helps your friends find you!',
      },
      {
        type: 'bullet',
        content:
          'Username: You chose this during signup, but you can change it later in Settings > Account.',
      },
      {
        type: 'bullet',
        content:
          'Name & Picture: Tap the Edit Profile button to add your full name and a profile picture.',
      },
      {
        type: 'bullet',
        content:
          "Bio/Tagline: Tell the community about yourself in a short tagline! This helps people understand what you're interested in.",
      },
      {
        type: 'heading',
        content: '2. 🗺️ Navigating the App',
        level: 1,
      },
      {
        type: 'text',
        content:
          'The main features are accessible via the bottom navigation bar:',
      },
      {
        type: 'bullet',
        content:
          'Home/Feed Icon: This is your primary timeline, where you see content from users you follow.',
      },
      {
        type: 'bullet',
        content:
          'Search Icon: Discover new people, trending topics, and explore popular content.',
      },
      {
        type: 'bullet',
        content:
          '[Unique Feature Icon]: Access our unique [Unique Feature Name] to [briefly state the feature\'s purpose, e.g., "find nearby community events"].',
      },
      {
        type: 'bullet',
        content:
          'Profile Icon: Access your own profile and the main Settings menu.',
      },
      {
        type: 'heading',
        content: '3. 🎯 Getting Started with Lifts',
        level: 1,
      },
      {
        type: 'text',
        content:
          "Lifts are at the core of our platform. Here's how to get started:",
      },
      {
        type: 'bullet',
        content:
          'Request a Lift: Need help? Go to the Lifts tab and tap "Request Lift" to ask the community.',
      },
      {
        type: 'bullet',
        content:
          'Offer a Lift: Want to help? Tap "Offer Lift" to show others you\'re available.',
      },
    ],
  },
  'article-lift-1': {
    title: 'How to Request a Lift',
    sections: [
      {
        type: 'intro',
        content:
          'Requesting a lift is simple and helps you get assistance from your community. Follow these steps to make your first request.',
      },
      {
        type: 'heading',
        content: '1. Open the Lifts Tab',
        level: 1,
      },
      {
        type: 'text',
        content:
          'Navigate to the Lifts section from the main navigation menu at the bottom of your screen.',
      },
      {
        type: 'heading',
        content: '2. Tap Request Lift',
        level: 1,
      },
      {
        type: 'text',
        content:
          'Click the blue "Request Lift" button to start creating your request.',
      },
      {
        type: 'heading',
        content: '3. Fill in Your Details',
        level: 1,
      },
      {
        type: 'bullet',
        content: 'Destination: Enter where you need to go',
      },
      {
        type: 'bullet',
        content: 'Time: Select your preferred pickup time',
      },
      {
        type: 'bullet',
        content: 'Description: Add any additional details about your request',
      },
    ],
  },
  'article-wallet-activation': {
    title: 'Wallet activation',
    sections: [
      {
        type: 'intro',
        content:
          'During onboarding on the Lifteller mobile app, you will be guided through the wallet activation process. This is a simple and secure process that enables you to send and receive monetary lifts.',
      },
      {
        type: 'heading',
        content: 'Activation Steps',
        level: 1,
      },
      {
        type: 'bullet',
        content:
          'Complete your KYC verification by providing your BVN or other required identification documents.',
      },
      {
        type: 'bullet',
        content:
          'Set up your wallet passcode for secure transactions. This 6-digit code will be required for all wallet operations.',
      },
      {
        type: 'bullet',
        content:
          'Verify your phone number or email address to complete the activation process.',
      },
      {
        type: 'heading',
        content: 'What You Can Do After Activation',
        level: 1,
      },
      {
        type: 'bullet',
        content: 'Send and receive monetary lifts',
      },
      {
        type: 'bullet',
        content: 'Withdraw funds to your bank account',
      },
      {
        type: 'bullet',
        content: 'Fund your wallet using various payment methods',
      },
    ],
  },
  'article-wallet-policy': {
    title: 'Wallet policy',
    sections: [
      {
        type: 'intro',
        content:
          'Our wallet policy outlines the terms and conditions for using the Lifteller wallet service. Please read this carefully to understand your rights and responsibilities.',
      },
      {
        type: 'heading',
        content: 'Account Eligibility',
        level: 1,
      },
      {
        type: 'text',
        content:
          'To use the Lifteller wallet, you must be at least 18 years old and have completed the required KYC verification process.',
      },
      {
        type: 'heading',
        content: 'Transaction Limits',
        level: 1,
      },
      {
        type: 'text',
        content:
          'Transaction limits are set based on your account tier and verification level. You can view and manage your limits in Wallet Settings.',
      },
      {
        type: 'bullet',
        content:
          'Daily cumulative transaction limit: Set a maximum amount you can transact per day',
      },
      {
        type: 'bullet',
        content:
          'One-time transaction limit: Set a maximum amount for individual transactions',
      },
      {
        type: 'heading',
        content: 'Prohibited Activities',
        level: 1,
      },
      {
        type: 'bullet',
        content:
          'Using the wallet for illegal activities or money laundering',
      },
      {
        type: 'bullet',
        content:
          'Fraudulent transactions or chargebacks',
      },
      {
        type: 'bullet',
        content:
          'Violating any applicable laws or regulations',
      },
      {
        type: 'heading',
        content: 'Account Security',
        level: 1,
      },
      {
        type: 'text',
        content:
          'You are responsible for maintaining the security of your wallet passcode and account. Never share your passcode with anyone.',
      },
    ],
  },
  'article-wallet-fees': {
    title: 'Wallet fees, charges, and limits',
    sections: [
      {
        type: 'intro',
        content:
          'Understanding fees, charges, and transaction limits helps you make informed decisions when using your Lifteller wallet.',
      },
      {
        type: 'heading',
        content: 'Transaction Fees',
        level: 1,
      },
      {
        type: 'text',
        content:
          'Lifteller charges minimal fees for certain wallet operations to maintain the service:',
      },
      {
        type: 'bullet',
        content:
          'Sending monetary lifts: Free for all users',
      },
      {
        type: 'bullet',
        content:
          'Receiving monetary lifts: Free for all users',
      },
      {
        type: 'bullet',
        content:
          'Withdrawals: ₦50 per transaction',
      },
      {
        type: 'bullet',
        content:
          'Wallet funding: Free when using bank transfer, card charges may apply',
      },
      {
        type: 'heading',
        content: 'Transaction Limits',
        level: 1,
      },
      {
        type: 'text',
        content:
          'Transaction limits are in place to protect your account and comply with regulatory requirements:',
      },
      {
        type: 'heading',
        content: 'Tier 0 (Unverified)',
        level: 2,
      },
      {
        type: 'bullet',
        content: 'Daily limit: ₦50,000',
      },
      {
        type: 'bullet',
        content: 'Single transaction: ₦20,000',
      },
      {
        type: 'heading',
        content: 'Tier 1 (BVN Verified)',
        level: 2,
      },
      {
        type: 'bullet',
        content: 'Daily limit: ₦500,000',
      },
      {
        type: 'bullet',
        content: 'Single transaction: ₦200,000',
      },
      {
        type: 'heading',
        content: 'Tier 2 (NIN Verified)',
        level: 2,
      },
      {
        type: 'bullet',
        content: 'Daily limit: ₦2,000,000',
      },
      {
        type: 'bullet',
        content: 'Single transaction: ₦1,000,000',
      },
      {
        type: 'heading',
        content: 'Tier 3 (Full Verification)',
        level: 2,
      },
      {
        type: 'bullet',
        content: 'Daily limit: ₦5,000,000',
      },
      {
        type: 'bullet',
        content: 'Single transaction: ₦2,500,000',
      },
      {
        type: 'heading',
        content: 'Custom Limits',
        level: 1,
      },
      {
        type: 'text',
        content:
          'You can set custom daily cumulative and one-time transaction limits in Wallet Settings. These limits cannot exceed your tier maximums.',
      },
      {
        type: 'heading',
        content: 'Chargebacks and Disputes',
        level: 1,
      },
      {
        type: 'text',
        content:
          'If you initiate a chargeback or dispute a transaction, a processing fee of ₦1,000 may apply. Please contact support before initiating disputes.',
      },
    ],
  },
  'article-wallet-security': {
    title: 'Wallet Security',
    sections: [
      {
        type: 'intro',
        content:
          'Keeping your wallet secure is our top priority. Follow these best practices to protect your account and funds.',
      },
      {
        type: 'heading',
        content: 'Passcode Security',
        level: 1,
      },
      {
        type: 'bullet',
        content:
          'Never share your wallet passcode with anyone, including Lifteller staff',
      },
      {
        type: 'bullet',
        content:
          'Use a unique 6-digit passcode that you don\'t use elsewhere',
      },
      {
        type: 'bullet',
        content:
          'Change your passcode regularly in Wallet Settings',
      },
      {
        type: 'heading',
        content: 'Transaction Verification',
        level: 1,
      },
      {
        type: 'text',
        content:
          'Always verify transaction details before confirming. Once a transaction is completed, it cannot be reversed.',
      },
      {
        type: 'heading',
        content: 'Account Monitoring',
        level: 1,
      },
      {
        type: 'bullet',
        content:
          'Regularly review your transaction history',
      },
      {
        type: 'bullet',
        content:
          'Enable transaction notifications in Settings',
      },
      {
        type: 'bullet',
        content:
          'Report suspicious activity immediately',
      },
    ],
  },
};

function ArticleSectionComponent({ section }: { section: ArticleSection }) {
  switch (section.type) {
    case 'title':
      return (
        <Text className="mb-6 mt-6 text-3xl font-bold text-grey-alpha-500">
          {section.content}
        </Text>
      );
    case 'intro':
      return (
        <Text className="mb-6 text-base leading-6 text-grey-plain-550">
          {section.content}
        </Text>
      );
    case 'heading':
      return (
        <Text className="mb-4 mt-6 text-xl font-bold text-grey-alpha-500">
          {section.content}
        </Text>
      );
    case 'bullet':
      return (
        <View className="mb-3 flex-row">
          <Text className="mr-3 text-base text-grey-plain-550">•</Text>
          <Text className="flex-1 text-base leading-6 text-grey-plain-550">
            {section.content}
          </Text>
        </View>
      );
    case 'text':
      return (
        <Text className="mb-4 text-base leading-6 text-grey-plain-550">
          {section.content}
        </Text>
      );
    default:
      return null;
  }
}

export default function ArticleDetailScreen() {
  const { articleId } = useLocalSearchParams();
  const article = articlesData[(articleId as string) || 'article-onboarding-1'];

  if (!article) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <View className="flex-row items-center justify-between border-b border-grey-plain-150 bg-white px-4 py-3">
          <TouchableOpacity onPress={() => router.back()}>
            <CornerUpLeft
              color={colors['grey-plain']['550']}
              size={24}
              strokeWidth={2}
            />
          </TouchableOpacity>
        </View>
        <View className="flex-1 items-center justify-center">
          <Text className="text-grey-plain-550">Article not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'bottom']}>
      {/* Header */}
      <View className="border-b border-grey-plain-150 bg-white px-4 py-3">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity onPress={() => router.back()}>
            <CornerUpLeft
              color={colors['grey-plain']['550']}
              size={24}
              strokeWidth={2}
            />
          </TouchableOpacity>
          <Text className="ml-4 flex-1 text-lg font-semibold text-grey-alpha-500">
            Help article
          </Text>
          <View className="flex-row items-center gap-4">
            <TouchableOpacity>
              <Search
                color={colors['grey-alpha']['500']}
                size={24}
                strokeWidth={2}
              />
            </TouchableOpacity>
            <TouchableOpacity>
              <MoreVertical
                color={colors['grey-alpha']['500']}
                size={24}
                strokeWidth={2}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView
        className="flex-1 bg-white"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        {/* Article Content */}
        <View className="px-4 py-6">
          {/* Title */}
          <Text className="mb-6 text-3xl font-bold text-grey-alpha-500">
            {article.title}
          </Text>

          {/* Sections */}
          {article.sections.map((section, index) => (
            <ArticleSectionComponent key={index} section={section} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
