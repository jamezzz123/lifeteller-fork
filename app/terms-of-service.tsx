import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { CornerUpLeft } from 'lucide-react-native';
import { colors } from '@/theme/colors';

interface Section {
  title: string;
  content: string[];
}

const termsContent: Section[] = [
  {
    title: '1. Acceptance of Terms',
    content: [
      'By accessing or using the Lifteller mobile application ("App"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use the App.',
      'We reserve the right to modify these Terms at any time. Your continued use of the App following the posting of changes constitutes acceptance of those changes.',
    ],
  },
  {
    title: '2. Description of Service',
    content: [
      'Lifteller is a social platform that enables users to create "Lifts" - requests or offers for help that can be shared and supported within the community. Users can Request, Offer, Raise, or Group Lift to support one another.',
      'The App facilitates connections between individuals seeking assistance and those willing to provide help, creating a community of mutual support and kindness.',
    ],
  },
  {
    title: '3. User Accounts',
    content: [
      'To use certain features of the App, you must create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.',
      'You agree to provide accurate, current, and complete information during registration and to update such information as necessary to keep it accurate, current, and complete.',
      'You must be at least 18 years old to create an account and use the App.',
    ],
  },
  {
    title: '4. User Conduct',
    content: [
      'You agree not to use the App to:',
      '• Post false, misleading, or fraudulent content',
      '• Harass, abuse, or harm other users',
      '• Violate any applicable laws or regulations',
      '• Impersonate any person or entity',
      '• Interfere with or disrupt the App or servers',
      '• Collect user information without consent',
      '• Use the App for any illegal or unauthorized purpose',
    ],
  },
  {
    title: '5. Lift Points and Rewards',
    content: [
      'Users may earn Lift Points through various activities on the platform. Lift Points are a virtual reward system and hold no monetary value outside the App.',
      'We reserve the right to modify, suspend, or discontinue the Lift Points system at any time without notice.',
      'Lift Points cannot be transferred, sold, or exchanged for cash.',
    ],
  },
  {
    title: '6. Content Ownership',
    content: [
      'You retain ownership of content you post on the App. By posting content, you grant Lifteller a non-exclusive, worldwide, royalty-free license to use, display, reproduce, and distribute your content in connection with the App.',
      'You represent that you have the right to post all content you submit and that such content does not infringe on the rights of any third party.',
    ],
  },
  {
    title: '7. Privacy',
    content: [
      'Your use of the App is also governed by our Privacy Policy. Please review our Privacy Policy to understand our practices regarding the collection and use of your information.',
    ],
  },
  {
    title: '8. Disclaimers',
    content: [
      'THE APP IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED.',
      'Lifteller does not guarantee the accuracy, completeness, or reliability of any content posted by users. We are not responsible for any interactions between users.',
      'We do not verify the identity or intentions of users and recommend exercising caution when engaging with others on the platform.',
    ],
  },
  {
    title: '9. Limitation of Liability',
    content: [
      'TO THE MAXIMUM EXTENT PERMITTED BY LAW, LIFTELLER SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING FROM YOUR USE OF THE APP.',
      'Our total liability shall not exceed the amount you paid to us, if any, in the twelve (12) months preceding the claim.',
    ],
  },
  {
    title: '10. Termination',
    content: [
      'We may terminate or suspend your account and access to the App at any time, without prior notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties.',
      'Upon termination, your right to use the App will immediately cease, and any Lift Points or other rewards will be forfeited.',
    ],
  },
  {
    title: '11. Governing Law',
    content: [
      'These Terms shall be governed by and construed in accordance with the laws of the Federal Republic of Nigeria, without regard to its conflict of law provisions.',
      'Any disputes arising under these Terms shall be resolved through binding arbitration in Lagos, Nigeria.',
    ],
  },
  {
    title: '12. Contact Information',
    content: [
      'If you have any questions about these Terms, please contact us at:',
      'Email: support@lifteller.com',
      'Address: Lagos, Nigeria',
    ],
  },
];

export default function TermsOfServiceScreen() {
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
          Terms of Service
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Last Updated */}
        <View className="px-4 pt-6">
          <Text className="mb-2 text-sm text-grey-plain-550">
            Last updated: December 1, 2025
          </Text>
          <Text className="mb-6 text-base leading-6 text-grey-alpha-500">
            Welcome to Lifteller. Please read these Terms of Service carefully
            before using our application.
          </Text>
        </View>

        {/* Terms Sections */}
        <View className="px-4">
          {termsContent.map((section, index) => (
            <View key={index} className="mb-6">
              <Text className="mb-3 text-base font-inter-semibold text-grey-alpha-500">
                {section.title}
              </Text>
              {section.content.map((paragraph, pIndex) => (
                <Text
                  key={pIndex}
                  className="mb-2 text-base leading-6 text-grey-plain-550"
                >
                  {paragraph}
                </Text>
              ))}
            </View>
          ))}
        </View>

        {/* Footer Note */}
        <View className="mx-4 mt-4 rounded-xl bg-grey-plain-150 p-4">
          <Text className="text-center text-sm text-grey-plain-550">
            By using Lifteller, you acknowledge that you have read, understood,
            and agree to be bound by these Terms of Service.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

