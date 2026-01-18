import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import {
  CornerUpLeft,
  Bug,
  Search,
  ChevronRight,
  SquarePen,
  Clock,
  Image as ImageIcon,
  Check,
} from 'lucide-react-native';
import EmptyStateIllustration from '@/assets/images/empty-state.svg';
import { Button } from '@/components/ui/Button';
import { colors } from '@/theme/colors';

type IssueType = 'issue' | 'lift' | 'profile' | 'wallet';
type IssueStatus = 'resolved' | 'pending';

const MAX_TITLE_LENGTH = 55;

interface Issue {
  id: string;
  title: string;
  description: string;
  date: string;
  status: IssueStatus;
}

// Mock suggestions for issue title autocomplete
const titleSuggestions = [
  'Happy Friendship Day',
  'Inability to change password',
  'App crashes on startup',
  'Payment failed issue',
];

export default function ReportIssueScreen() {
  const [showForm, setShowForm] = useState(false);
  const [selectedType, setSelectedType] = useState<IssueType | null>(null);
  const [issueTitle, setIssueTitle] = useState('');
  const [issueDescription, setIssueDescription] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data - replace with actual data fetching
  const hasIssues = true;
  const issues: Issue[] = [
    {
      id: '71AA',
      title: 'Title of issue goes here',
      description: 'This is the description of the issue',
      date: '12/12/2025 - 10:04am',
      status: 'resolved',
    },
    {
      id: '72BB',
      title: 'Title of issue goes here',
      description: 'This is the description of the issue',
      date: '11/12/2025 - 2:30pm',
      status: 'pending',
    },
    {
      id: '73CC',
      title: 'Title of issue goes here',
      description: 'This is the description of the issue',
      date: '10/12/2025 - 9:15am',
      status: 'pending',
    },
    {
      id: '74DD',
      title: 'Title of issue goes here',
      description: 'This is the description of the issue',
      date: '09/12/2025 - 4:45pm',
      status: 'pending',
    },
  ];

  const totalIssues = issues.length;
  const resolvedCount = issues.filter((i) => i.status === 'resolved').length;
  const pendingCount = issues.filter((i) => i.status === 'pending').length;

  const filteredIssues = issues.filter((issue) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      issue.title.toLowerCase().includes(query) ||
      issue.description.toLowerCase().includes(query)
    );
  });

  const handleReportIssue = () => {
    setShowForm(true);
  };

  const handleTypeSelect = (type: IssueType) => {
    setSelectedType(type === selectedType ? null : type);
  };

  const handleTitleChange = (text: string) => {
    if (text.length <= MAX_TITLE_LENGTH) {
      setIssueTitle(text);
      setShowSuggestions(text.length > 0);
    }
  };

  const handleSuggestionSelect = (suggestion: string) => {
    if (suggestion.length <= MAX_TITLE_LENGTH) {
      setIssueTitle(suggestion);
    }
    setShowSuggestions(false);
  };

  const handleAddPhotos = () => {
    // TODO: Implement photo/video picker
    console.log('Add photos/videos pressed');
  };

  const handleSubmitReport = () => {
    // TODO: Implement issue report submission
    console.log('Submitting issue:', {
      type: selectedType,
      title: issueTitle,
      description: issueDescription,
    });
    // Navigate to success or back to issues list
    setShowForm(false);
  };

  const isFormValid =
    selectedType !== null &&
    issueTitle.trim().length > 0 &&
    issueDescription.trim().length > 0;

  const filteredSuggestions = titleSuggestions.filter((suggestion) =>
    suggestion.toLowerCase().includes(issueTitle.toLowerCase())
  );

  const getStatusBadgeStyle = (status: IssueStatus) => {
    switch (status) {
      case 'resolved':
        return {
          backgroundColor: colors['green-tint']['200'],
          textColor: colors['green-shades']['150'],
        };
      case 'pending':
        return {
          backgroundColor: colors['yellow-tint']['150'],
          textColor: colors.state.yellow,
        };
    }
  };

  // Empty State View
  if (!showForm && !hasIssues) {
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
            Report issue
          </Text>
        </View>

        {/* Empty State Content */}
        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 24,
            paddingBottom: 32,
          }}
          showsVerticalScrollIndicator={false}
        >
          <View className="items-center">
            {/* Illustration */}
            <View className="mb-8">
              <EmptyStateIllustration width={150} height={150} />
            </View>

            {/* Title */}
            <Text className="mb-4 text-center text-lg font-semibold text-grey-alpha-500">
              No issues reported yet
            </Text>

            {/* Description */}
            <View className="mb-8 items-center">
              <Text className="mb-2 text-center text-sm leading-5 text-grey-plain-550">
                You are yet to report any issue on Lifteller.
              </Text>
              <Text className="text-center text-sm leading-5 text-grey-plain-550">
                Reported issues will appear here.
              </Text>
            </View>

            {/* Report Issue Button */}
            <Button
              title="Report issue"
              onPress={handleReportIssue}
              variant="primary"
              size="medium"
              className="min-w-[200px]"
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Issues View (when there are issues)
  if (!showForm && hasIssues) {
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
            Report issue
          </Text>
        </View>

        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Summary Card */}
          <View
            className="mx-4 mt-4 flex-row rounded-2xl p-6"
            style={{ backgroundColor: colors.primary.purple }}
          >
            {/* Left Section - Total Issues (1/3 width) */}
            <View
              className="items-start justify-center"
              style={{ width: '33%' }}
            >
              <Text className="mb-1 text-sm text-white/80">Total issues</Text>
              <Text className="text-3xl font-bold text-white">
                {totalIssues}
              </Text>
            </View>

            {/* Right Section - White Inset Card (2/3 width) */}
            <View
              className="ml-4 rounded-xl bg-white p-4"
              style={{ width: '64%' }}
            >
              <View className="flex-row">
                {/* Resolved Section */}
                <View className="flex-1 items-start">
                  <Text className="mb-1 text-sm text-grey-plain-550">
                    Resolved
                  </Text>
                  <Text className="text-3xl font-bold text-grey-alpha-500">
                    {resolvedCount}
                  </Text>
                </View>

                {/* Divider */}
                <View
                  className="mx-2"
                  style={{
                    width: 1,
                    backgroundColor: colors['grey-plain']['300'],
                  }}
                />

                {/* Pending Section */}
                <View className="flex-1 items-start">
                  <Text className="mb-1 text-sm text-grey-plain-550">
                    Pending
                  </Text>
                  <Text className="text-3xl font-bold text-grey-alpha-500">
                    {pendingCount}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Report New Issue Button */}
          <View className="mx-4 mt-4">
            <Button
              title="Report new issue"
              onPress={handleReportIssue}
              variant="outline"
              size="medium"
              className="w-full border-primary"
            />
          </View>

          {/* Logged Issues Section */}
          <View className="mx-4 mt-6">
            <View className="mb-4 flex-row items-center justify-between">
              <Text className="text-lg font-semibold text-grey-alpha-500">
                Logged issues
              </Text>
              <TouchableOpacity
                onPress={() => router.push('/all-issues')}
                className="flex-row items-center gap-1"
              >
                <Text className="text-sm font-medium text-primary">
                  See all
                </Text>
                <ChevronRight
                  color={colors.primary.purple}
                  size={16}
                  strokeWidth={2}
                />
              </TouchableOpacity>
            </View>

            {/* Search Bar */}
            <View className="mb-4 flex-row items-center gap-3 rounded-full border border-grey-plain-300 bg-white px-4 py-3">
              <Search
                size={20}
                color={colors['grey-alpha']['400']}
                strokeWidth={2}
              />
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search by title or description of issue"
                placeholderTextColor={colors['grey-alpha']['400']}
                className="flex-1 text-base text-grey-alpha-500"
                style={{ fontSize: 16 }}
              />
            </View>

            {/* Issues List */}
            <View className="gap-3">
              {filteredIssues.map((issue) => {
                const statusStyle = getStatusBadgeStyle(issue.status);
                return (
                  <TouchableOpacity
                    key={issue.id}
                    onPress={() => router.push(`/issue/${issue.id}`)}
                    className="flex-row items-center gap-4 rounded-xl border border-grey-plain-150 bg-white p-4"
                    activeOpacity={0.7}
                  >
                    {/* Icon */}
                    <View
                      className="h-12 w-12 items-center justify-center rounded-full"
                      style={{
                        backgroundColor: colors['primary-tints'].purple['100'],
                      }}
                    >
                      <Bug
                        color={colors.primary.purple}
                        size={24}
                        strokeWidth={2}
                      />
                    </View>

                    {/* Content */}
                    <View className="flex-1">
                      <Text className="mb-1 text-base font-semibold text-grey-alpha-500">
                        {issue.title}
                      </Text>
                      <Text
                        className="mb-1 text-sm text-grey-plain-550"
                        numberOfLines={1}
                      >
                        {issue.description}
                      </Text>
                      <Text className="text-xs text-grey-plain-550">
                        {issue.date}
                      </Text>
                    </View>

                    {/* Right Side */}
                    <View className="items-end">
                      <Text className="mb-2 text-xs font-medium text-grey-plain-550">
                        ID: {issue.id}
                      </Text>
                      <View
                        className="rounded-full px-2.5 py-1"
                        style={{
                          backgroundColor: statusStyle?.backgroundColor,
                        }}
                      >
                        <Text
                          className="text-xs font-semibold capitalize"
                          style={{ color: statusStyle?.textColor }}
                        >
                          {issue.status}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Form View
  const issueTypes: { key: IssueType; label: string }[] = [
    { key: 'issue', label: 'Issue' },
    { key: 'lift', label: 'Lift' },
    { key: 'profile', label: 'Profile' },
    { key: 'wallet', label: 'Wallet' },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'bottom']}>
      {/* Header */}
      <View className="flex-row items-center border-b border-grey-plain-150 bg-white px-4 py-3">
        <TouchableOpacity
          onPress={() => setShowForm(false)}
          hitSlop={10}
          accessibilityLabel="Go back"
        >
          <CornerUpLeft
            color={colors['grey-plain']['550']}
            size={24}
            strokeWidth={2}
          />
        </TouchableOpacity>
        <Text className="ml-3 text-lg font-semibold text-grey-alpha-500">
          Report new issue
        </Text>
      </View>

      {/* Form Content */}
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingBottom: 100,
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Type Section */}
        <View className="px-4 pt-6">
          <View className="mb-4 flex-row items-center gap-2">
            <SquarePen
              color={colors['grey-alpha']['500']}
              size={20}
              strokeWidth={2}
            />
            <Text className="text-base font-semibold text-grey-alpha-500">
              Type
            </Text>
          </View>

          {/* Type Chips */}
          <View className="flex-row flex-wrap gap-2">
            {issueTypes.map((type) => {
              const isSelected = selectedType === type.key;
              return (
                <TouchableOpacity
                  key={type.key}
                  onPress={() => handleTypeSelect(type.key)}
                  className="flex-row items-center gap-1.5 rounded-full border px-4 py-2"
                  style={{
                    borderColor: isSelected
                      ? colors.primary.purple
                      : colors['grey-plain']['300'],
                    backgroundColor: isSelected
                      ? colors['primary-tints'].purple['50']
                      : 'white',
                  }}
                  activeOpacity={0.7}
                >
                  {isSelected && (
                    <Check
                      color={colors.primary.purple}
                      size={16}
                      strokeWidth={2.5}
                    />
                  )}
                  <Text
                    className="text-sm font-medium"
                    style={{
                      color: isSelected
                        ? colors.primary.purple
                        : colors['grey-alpha']['500'],
                    }}
                  >
                    {type.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Issue Title Section */}
        <View className="mt-6 px-4">
          <Text className="mb-2 text-sm text-grey-plain-550">Issue title</Text>
          <View className="relative">
            <TextInput
              value={issueTitle}
              onChangeText={handleTitleChange}
              onFocus={() => setShowSuggestions(issueTitle.length > 0)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              placeholder="Issue title"
              placeholderTextColor={colors['grey-alpha']['400']}
              className="border-b border-grey-plain-300 py-3 text-base text-grey-alpha-500"
              style={{ fontSize: 16 }}
            />
            <Text className="absolute bottom-3 right-0 text-sm text-grey-plain-550">
              {issueTitle.length}/{MAX_TITLE_LENGTH}
            </Text>
          </View>

          {/* Suggestions */}
          {showSuggestions && filteredSuggestions.length > 0 && (
            <View className="mt-2 rounded-xl border border-grey-plain-150 bg-white">
              {filteredSuggestions.map((suggestion, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleSuggestionSelect(suggestion)}
                  className="flex-row items-center gap-3 px-4 py-3"
                  style={{
                    borderBottomWidth:
                      index < filteredSuggestions.length - 1 ? 1 : 0,
                    borderBottomColor: colors['grey-plain']['150'],
                  }}
                >
                  <Clock
                    color={colors['grey-alpha']['400']}
                    size={18}
                    strokeWidth={2}
                  />
                  <Text className="flex-1 text-base text-grey-alpha-500">
                    {suggestion}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Issue Description Section */}
        <View className="mt-6 px-4">
          <Text className="mb-2 text-sm text-grey-plain-550">
            Issue description
          </Text>
          <View
            className="rounded-xl border border-grey-plain-300 p-4"
            style={{ minHeight: 150 }}
          >
            <TextInput
              value={issueDescription}
              onChangeText={setIssueDescription}
              placeholder="Type here"
              placeholderTextColor={colors['grey-alpha']['400']}
              multiline
              textAlignVertical="top"
              className="flex-1 text-base text-grey-alpha-500"
              style={{ fontSize: 16, minHeight: 120 }}
            />
          </View>
        </View>

        {/* Add Photos/Videos Section */}
        <TouchableOpacity
          onPress={handleAddPhotos}
          className="mx-4 mt-6 flex-row items-center gap-3"
          activeOpacity={0.7}
        >
          <ImageIcon color={colors.primary.purple} size={24} strokeWidth={2} />
          <Text className="text-base font-medium text-grey-alpha-500">
            Add Photos/Videos
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Report Button */}
      <View className="absolute bottom-0 left-0 right-0 border-t border-grey-plain-150 bg-white px-4 py-4">
        <View className="items-end">
          <Button
            title="Report"
            onPress={handleSubmitReport}
            variant="primary"
            size="medium"
            disabled={!isFormValid}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
