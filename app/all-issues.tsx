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
import { CornerUpLeft, Search, Bug } from 'lucide-react-native';
import { colors } from '@/theme/colors';

type IssueStatus = 'resolved' | 'pending';

interface Issue {
  id: string;
  title: string;
  description: string;
  date: string;
  status: IssueStatus;
}

export default function AllIssuesScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data - replace with actual data fetching
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
      date: '12/12/2025 - 10:04am',
      status: 'pending',
    },
    {
      id: '73CC',
      title: 'Title of issue goes here',
      description: 'This is the description of the issue',
      date: '12/12/2025 - 10:04am',
      status: 'pending',
    },
    {
      id: '74DD',
      title: 'Title of issue goes here',
      description: 'This is the description of the issue',
      date: '12/12/2025 - 10:04am',
      status: 'pending',
    },
    {
      id: '75EE',
      title: 'Title of issue goes here',
      description: 'This is the description of the issue',
      date: '12/12/2025 - 10:04am',
      status: 'pending',
    },
    {
      id: '76FF',
      title: 'Title of issue goes here',
      description: 'This is the description of the issue',
      date: '12/12/2025 - 10:04am',
      status: 'pending',
    },
  ];

  const filteredIssues = issues.filter((issue) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      issue.title.toLowerCase().includes(query) ||
      issue.description.toLowerCase().includes(query)
    );
  });

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

  const handleIssuePress = (issueId: string) => {
    router.push(`/issue/${issueId}`);
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
        <Text className="text-lg font-semibold text-grey-alpha-500">
          All issues
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Search Bar */}
        <View className="mx-4 mt-4 flex-row items-center gap-3 rounded-full border border-grey-plain-300 bg-white px-4 py-3">
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
        <View className="mx-4 mt-4 gap-3">
          {filteredIssues.map((issue) => {
            const statusStyle = getStatusBadgeStyle(issue.status);
            return (
              <TouchableOpacity
                key={issue.id}
                onPress={() => handleIssuePress(issue.id)}
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
                      backgroundColor: statusStyle.backgroundColor,
                    }}
                  >
                    <Text
                      className="text-xs font-semibold capitalize"
                      style={{ color: statusStyle.textColor }}
                    >
                      {issue.status}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

