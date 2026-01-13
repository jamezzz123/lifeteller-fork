import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import {
  CornerUpLeft,
  Search,
  MoreVertical,
  FileText,
  ChevronRight,
} from 'lucide-react-native';
import { colors } from '@/theme/colors';

interface Article {
  id: string;
  title: string;
  description: string;
  icon?: React.ComponentType<{
    color: string;
    size: number;
    strokeWidth: number;
  }>;
}

function ArticleCard({ article }: { article: Article }) {
  const IconComponent = article.icon || FileText;

  return (
    <TouchableOpacity
      onPress={() => router.push(`/help-center/article/${article.id}`)}
      className="mx-4 mb-3 flex-row items-start gap-4 rounded-xl border border-grey-plain-300 bg-white p-4"
      activeOpacity={0.7}
    >
      <View
        className="h-12 w-12 flex-shrink-0 items-center justify-center rounded-full"
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
          {article.title}
        </Text>
        <Text className="text-sm text-grey-plain-550" numberOfLines={2}>
          {article.description}
        </Text>
      </View>
      <ChevronRight color={colors['grey-plain']['550']} size={20} />
    </TouchableOpacity>
  );
}

// Topic data mapping
const topicsData: Record<
  string,
  { title: string; count: number; articles: Article[] }
> = {
  onboarding: {
    title: 'Onboarding',
    count: 4,
    articles: [
      {
        id: 'article-onboarding-1',
        title: 'Onboarding',
        description: 'During onboarding on the Lifteller mobi...',
        icon: FileText,
      },
      {
        id: 'article-onboarding-2',
        title: 'Onboarding',
        description: 'During onboarding on the Lifteller mobi...',
        icon: FileText,
      },
      {
        id: 'article-onboarding-3',
        title: 'Onboarding',
        description: 'During onboarding on the Lifteller mobi...',
        icon: FileText,
      },
      {
        id: 'article-onboarding-4',
        title: 'Onboarding',
        description: 'During onboarding on the Lifteller mobi...',
        icon: FileText,
      },
    ],
  },
  'lift-lifting': {
    title: 'Lift and Lifting',
    count: 17,
    articles: [
      {
        id: 'article-lift-1',
        title: 'How to Request a Lift',
        description: 'Learn how to create and manage lift requests...',
        icon: FileText,
      },
      {
        id: 'article-lift-2',
        title: 'How to Offer a Lift',
        description: 'Guide to offering lifts to other community members...',
        icon: FileText,
      },
      {
        id: 'article-lift-3',
        title: 'Lift Credits Explained',
        description: 'Understanding how lift credits work in the app...',
        icon: FileText,
      },
    ],
  },
  wallet: {
    title: 'Wallet',
    count: 4,
    articles: [
      {
        id: 'article-wallet-activation',
        title: 'Wallet activation',
        description: 'During onboarding on the Lifteller mobile app...',
        icon: FileText,
      },
      {
        id: 'article-wallet-policy',
        title: 'Wallet policy',
        description: 'Learn about our wallet policies and terms of service...',
        icon: FileText,
      },
      {
        id: 'article-wallet-fees',
        title: 'Wallet fees, charges, and limits',
        description: 'Understanding fees, charges, and transaction limits...',
        icon: FileText,
      },
      {
        id: 'article-wallet-security',
        title: 'Wallet Security',
        description: 'Tips for keeping your wallet secure...',
        icon: FileText,
      },
    ],
  },
  community: {
    title: 'Community',
    count: 8,
    articles: [
      {
        id: 'article-community-1',
        title: 'Community Guidelines',
        description: 'Rules and guidelines for community members...',
        icon: FileText,
      },
    ],
  },
  security: {
    title: 'Security',
    count: 12,
    articles: [
      {
        id: 'article-security-1',
        title: 'Two-Factor Authentication',
        description: 'How to enable and use 2FA for account security...',
        icon: FileText,
      },
    ],
  },
};

export default function TopicArticlesScreen() {
  const { topicId } = useLocalSearchParams();
  const topicKey = (topicId as string) || 'onboarding';
  const topicData = topicsData[topicKey];

  if (!topicData) {
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
          <Text className="text-grey-plain-550">Topic not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'bottom']}>
      {/* Header */}
      <View className="border-b border-grey-plain-150 bg-white px-4 py-3">
        <View className="mb-4 flex-row items-center justify-between">
          <View className="flex-row items-center gap-3">
            <TouchableOpacity onPress={() => router.back()}>
              <CornerUpLeft
                color={colors['grey-plain']['550']}
                size={24}
                strokeWidth={2}
              />
            </TouchableOpacity>
            <Text className="text-lg font-semibold text-grey-alpha-500">
              {topicData.title}
            </Text>
          </View>
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
        className="flex-1 bg-grey-plain-50"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 16 }}
      >
        {/* Article Count */}
        <View className="px-4 py-4">
          <Text className="text-base font-semibold text-grey-alpha-500">
            {topicData.count} {topicData.count === 1 ? 'article' : 'articles'}
          </Text>
        </View>

        {/* Articles List */}
        <View>
          {topicData.articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
