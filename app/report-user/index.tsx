import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { CornerUpLeft } from 'lucide-react-native';
import { colors } from '@/theme/colors';
import { RadioButton } from '@/components/ui/RadioButton';
import { Button } from '@/components/ui/Button';
import { ConfirmationModal } from '@/components/ui/ConfirmationModal';
import { Toast } from '@/components/ui/Toast';

interface IssueType {
  id: string;
  label: string;
  description: string;
}

const ISSUE_TYPES: IssueType[] = [
  {
    id: 'scam-1',
    label: 'Scam',
    description: 'Money laundering, Ponzi scheme.',
  },
  {
    id: 'scam-2',
    label: 'Scam',
    description: 'Money laundering, Ponzi scheme.',
  },
  {
    id: 'scam-3',
    label: 'Scam',
    description: 'Money laundering, Ponzi scheme.',
  },
  {
    id: 'scam-4',
    label: 'Scam',
    description: 'Money laundering, Ponzi scheme.',
  },
  {
    id: 'scam-5',
    label: 'Scam',
    description: 'Money laundering, Ponzi scheme.',
  },
  {
    id: 'scam-6',
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
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showReportToast, setShowReportToast] = useState(false);
  const [shouldReturn, setShouldReturn] = useState(false);

  const handleIssueTypeSelect = (issueId: string) => {
    setSelectedIssueType(issueId);
  };

  const handleReport = () => {
    if (selectedIssueType) {
      setShowConfirmation(true);
    }
  };

  const handleConfirm = () => {
    // TODO: Implement report user functionality
    console.log('Report user:', {
      userId,
      username,
      issueType: selectedIssueType,
    });
    setShowConfirmation(false);
    setShowReportToast(true);
    setShouldReturn(true);
  };

  const handleCancel = () => {
    setShowConfirmation(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'bottom']}>
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
          Report user
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="px-4 pt-6">
          <Text className="mb-6 text-lg font-semibold text-grey-alpha-500">
            What type of issue are you reporting?
          </Text>

          <View className="gap-3">
            {ISSUE_TYPES.map((issue) => {
              const isActive = selectedIssueType === issue.id;
              return (
                <TouchableOpacity
                  key={issue.id}
                  onPress={() => handleIssueTypeSelect(issue.id)}
                  className="rounded-xl border p-4"
                  style={{
                    borderColor: isActive
                      ? colors.primary.purple
                      : colors['grey-plain']['300'],
                    backgroundColor: isActive
                      ? colors['primary-tints'].purple['50']
                      : colors['grey-plain']['50'],
                  }}
                  activeOpacity={0.7}
                >
                  <View className="flex-row items-center">
                    <RadioButton
                      label=""
                      checked={isActive}
                      onPress={() => handleIssueTypeSelect(issue.id)}
                    />
                    <View className="flex-1">
                      <Text className="mb-1 text-base font-medium text-grey-alpha-500">
                        {issue.label}
                      </Text>
                      <Text className="text-sm text-grey-plain-550">
                        {issue.description}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View className="border-t border-grey-plain-150 bg-white px-4 py-4">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity onPress={() => router.back()}>
            <Text
              className="text-base font-medium"
              style={{ color: colors.primary.purple }}
            >
              Go back
            </Text>
          </TouchableOpacity>
          <Button
            title="Report"
            onPress={handleReport}
            variant="primary"
            size="medium"
            disabled={!selectedIssueType}
          />
        </View>
      </View>

      <ConfirmationModal
        visible={showConfirmation}
        title="Confirm and Report user?"
        message="We will investigate this user promptly and notify you of the outcome."
        confirmText="Report"
        cancelText="Cancel"
        destructive
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />

      <Toast
        visible={showReportToast}
        message="User reported successfully."
        onHide={() => {
          setShowReportToast(false);
          if (shouldReturn) {
            setShouldReturn(false);
            router.back();
          }
        }}
      />
    </SafeAreaView>
  );
}
