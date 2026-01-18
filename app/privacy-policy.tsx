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

const privacyContent: Section[] = [
  {
    title: '1. Information We Collect',
    content: [
      'We collect information you provide directly to us, including:',
      '• Account Information: Name, email address, phone number, profile picture, and other information you provide when creating an account.',
      '• Lift Information: Details about Lifts you create, including descriptions, amounts, images, and related content.',
      '• Communications: Messages, feedback, and other communications you send through the App.',
      '• Device Information: Device type, operating system, unique device identifiers, and mobile network information.',
      '• Location Information: With your consent, we may collect precise or approximate location data.',
    ],
  },
  {
    title: '2. How We Use Your Information',
    content: [
      'We use the information we collect to:',
      '• Provide, maintain, and improve the App',
      '• Process transactions and send related information',
      '• Send notifications about Lifts, messages, and account activity',
      '• Personalize your experience and show relevant content',
      '• Monitor and analyze trends, usage, and activities',
      '• Detect, prevent, and address fraud and security issues',
      '• Communicate with you about products, services, and events',
    ],
  },
  {
    title: '3. Information Sharing',
    content: [
      'We may share your information in the following circumstances:',
      '• With Other Users: Your profile information and Lifts are visible to other users of the App.',
      '• With Service Providers: We share information with vendors who assist in providing our services.',
      '• For Legal Reasons: We may disclose information if required by law or to protect rights and safety.',
      '• Business Transfers: In connection with any merger, sale, or acquisition of our business.',
      'We do not sell your personal information to third parties.',
    ],
  },
  {
    title: '4. Data Security',
    content: [
      'We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.',
      'This includes encryption of data in transit and at rest, secure authentication mechanisms, and regular security assessments.',
      'However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.',
    ],
  },
  {
    title: '5. Data Retention',
    content: [
      'We retain your personal information for as long as your account is active or as needed to provide you services.',
      'We may retain certain information for legitimate business purposes or as required by law, including for fraud prevention and safety.',
      'You can request deletion of your account and associated data at any time through the App settings.',
    ],
  },
  {
    title: '6. Your Rights and Choices',
    content: [
      'You have the following rights regarding your personal information:',
      '• Access: Request a copy of the personal information we hold about you.',
      '• Correction: Request correction of inaccurate or incomplete information.',
      '• Deletion: Request deletion of your personal information.',
      '• Portability: Request a copy of your data in a portable format.',
      '• Opt-out: Opt out of marketing communications at any time.',
      'To exercise these rights, please contact us or use the settings within the App.',
    ],
  },
  {
    title: '7. Cookies and Tracking',
    content: [
      'We use cookies and similar tracking technologies to collect information about your browsing activities.',
      'These technologies help us analyze app usage, remember your preferences, and improve our services.',
      'You can manage your cookie preferences through your device settings.',
    ],
  },
  {
    title: '8. Third-Party Services',
    content: [
      'The App may contain links to third-party websites or services that are not operated by us.',
      'We are not responsible for the privacy practices of these third parties. We encourage you to review their privacy policies before providing any personal information.',
    ],
  },
  {
    title: '9. Children\'s Privacy',
    content: [
      'The App is not intended for children under the age of 18. We do not knowingly collect personal information from children.',
      'If we learn that we have collected personal information from a child under 18, we will take steps to delete such information promptly.',
    ],
  },
  {
    title: '10. International Data Transfers',
    content: [
      'Your information may be transferred to and processed in countries other than your country of residence.',
      'We ensure appropriate safeguards are in place to protect your information when transferred internationally, in compliance with applicable data protection laws.',
    ],
  },
  {
    title: '11. Changes to This Policy',
    content: [
      'We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.',
      'We encourage you to review this Privacy Policy periodically for any changes.',
    ],
  },
  {
    title: '12. Contact Us',
    content: [
      'If you have any questions about this Privacy Policy or our data practices, please contact us at:',
      'Email: privacy@lifteller.com',
      'Address: Lagos, Nigeria',
      'You may also reach out through the Help & Feedback section in the App.',
    ],
  },
];

export default function PrivacyPolicyScreen() {
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
        <Text className="text-lg font-semibold text-grey-alpha-500">
          Privacy Policy
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
            Your privacy is important to us. This Privacy Policy explains how
            Lifteller collects, uses, and protects your personal information.
          </Text>
        </View>

        {/* Privacy Sections */}
        <View className="px-4">
          {privacyContent.map((section, index) => (
            <View key={index} className="mb-6">
              <Text className="mb-3 text-base font-semibold text-grey-alpha-500">
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
            By using Lifteller, you consent to the collection and use of your
            information as described in this Privacy Policy.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

