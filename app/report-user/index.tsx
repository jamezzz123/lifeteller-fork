import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { CornerUpLeft } from 'lucide-react-native';
import { colors } from '@/theme/colors';
import { RadioButton } from '@/components/ui/RadioButton';
import { Button } from '@/components/ui/Button';
import { ReportUserConfirmationModal } from '@/components/profile/ReportUserConfirmationModal';

interface IssueType {
  id: string;
  label: string;
  description: string;
}

const ISSUE_TYPES: IssueType[] = [
  {
    id: 'scam',
    label: 'Scam',
    description: 'Money laundering, Ponzi scheme.',
  },
  {
    id: 'other',
    label: 'Other reason',
    description: 'Any other reason not listed above',
  },
];

export default function ReportUserScreen() {
  const params = useLocalSearchParams<{ userId?: string; username?: string }>();
  const userId = params.userId || '';
  const username = params.username || '';

  const [selectedIssueType, setSelectedIssueType] = useState<string | null>(
    null
  );
  const [issueDescription, setIssueDescription] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [currentStep, setCurrentStep] = useState<'type' | 'describe'>('type');

  const handleIssueTypeSelect = (issueId: string) => {
    setSelectedIssueType(issueId);
  };

  const handleNext = () => {
    if (currentStep === 'type' && selectedIssueType) {
      setCurrentStep('describe');
    }
  };

  const handleGoBack = () => {
    if (currentStep === 'describe') {
      setCurrentStep('type');
    } else {
      router.back();
    }
  };

  const handleReport = () => {
    if (issueDescription.trim().length > 0) {
      setShowConfirmation(true);
    }
  };

  const handleConfirm = () => {
    // TODO: Implement report user functionality
    console.log('Report user:', {
      userId,
      username,
      issueType: selectedIssueType,
      description: issueDescription,
    });
    setShowConfirmation(false);
    router.back();
  };

  const handleCancel = () => {
    setShowConfirmation(false);
  };

  // Step 1: Issue Type Selection
  if (currentStep === 'type') {
    return (
      <SafeAreaView className="flex-1 bg-white" edges={['top', 'bottom']}>
        {/* Header */}
        <View className="flex-row items-center border-b border-grey-plain-150 bg-white px-4 py-3">
          <TouchableOpacity onPress={handleGoBack} className="mr-3">
            <CornerUpLeft
              color={colors['grey-plain']['550']}
              size={24}
              strokeWidth={2}
            />
          </TouchableOpacity>
          <Text className="text-lg font-inter-semibold text-grey-alpha-500">
            Report user
          </Text>
        </View>

        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="px-4 pt-6">
            <Text className="mb-6 text-lg font-inter-semibold text-grey-alpha-500">
              What type of issue are you reporting?
            </Text>

            <View className="gap-3">
              {ISSUE_TYPES.map((issue) => (
                <TouchableOpacity
                  key={issue.id}
                  onPress={() => handleIssueTypeSelect(issue.id)}
                  className="rounded-xl border border-grey-plain-300 bg-white p-4"
                  activeOpacity={0.7}
                >
                  <View className="flex-row items-center">
                    <RadioButton
                      label=""
                      checked={selectedIssueType === issue.id}
                      onPress={() => handleIssueTypeSelect(issue.id)}
                    />
                    <View className="flex-1">
                      <Text className="mb-1 text-base font-inter-medium text-grey-alpha-500">
                        {issue.label}
                      </Text>
                      <Text className="text-sm text-grey-plain-550">
                        {issue.description}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>

        {/* Footer */}
        <View className="border-t border-grey-plain-150 bg-white px-4 py-4">
          <View className="flex-row items-center justify-between">
            <TouchableOpacity onPress={handleGoBack}>
              <Text
                className="text-base font-inter-medium"
                style={{ color: colors.primary.purple }}
              >
                Go back
              </Text>
            </TouchableOpacity>
            <Button
              title="Next"
              onPress={handleNext}
              variant="primary"
              size="medium"
              disabled={!selectedIssueType}
            />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // Step 2: Describe Issue
  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'bottom']}>
      {/* Header */}
      <View className="flex-row items-center border-b border-grey-plain-150 bg-white px-4 py-3">
        <TouchableOpacity onPress={handleGoBack} className="mr-3">
          <CornerUpLeft
            color={colors['grey-plain']['550']}
            size={24}
            strokeWidth={2}
          />
        </TouchableOpacity>
        <Text className="text-lg font-inter-semibold text-grey-alpha-500">
          Describe issue
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View className="px-4 pt-6">
          <Text className="mb-4 text-lg font-inter-semibold text-grey-alpha-500">
            Describe the issue
          </Text>

          <View
            className="rounded-xl border border-grey-plain-300 p-4"
            style={{ minHeight: 200 }}
          >
            <TextInput
              value={issueDescription}
              onChangeText={setIssueDescription}
              placeholder="Type here..."
              placeholderTextColor={colors['grey-alpha']['400']}
              multiline
              textAlignVertical="top"
              className="flex-1 text-base text-grey-alpha-500"
              style={{ fontSize: 16, minHeight: 180 }}
            />
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View className="border-t border-grey-plain-150 bg-white px-4 py-4">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity onPress={handleGoBack}>
            <Text
              className="text-base font-inter-medium"
              style={{ color: colors.primary.purple }}
            >
              Go back
            </Text>
          </TouchableOpacity>
          <Button
            title="Report user"
            onPress={handleReport}
            variant="primary"
            size="medium"
            disabled={issueDescription.trim().length === 0}
          />
        </View>
      </View>

      <ReportUserConfirmationModal
        visible={showConfirmation}
        username={username}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </SafeAreaView>
  );
}
