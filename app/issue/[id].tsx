import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import {
  CornerUpLeft,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  MessageCircleQuestion,
} from 'lucide-react-native';
import { Image } from 'expo-image';
import { colors } from '@/theme/colors';

type IssueStatus = 'resolved' | 'pending';

interface IssueDetail {
  id: string;
  category: string;
  title: string;
  description: string;
  date: string;
  status: IssueStatus;
  images: string[];
}

const SCREEN_WIDTH = Dimensions.get('window').width;
const IMAGE_WIDTH = SCREEN_WIDTH - 32; // 16px padding on each side

export default function IssueDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  // Mock data - replace with actual data fetching based on id
  const issue: IssueDetail = {
    id: id || '71AA',
    category: 'Lift',
    title: 'Immediate post not publishing correctly',
    description: `When I attempt to publish a post immediately from the Scheduled Content list, the app confirms the action but the post never appears in my feed.

This happens every time I try to bypass the schedule and post immediately (100% reproducible).

Please help address this issue.

Thank you.`,
    date: '12/12/2025 - 10:09am',
    status: 'pending',
    images: [
      'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400',
      'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400',
      'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400',
    ],
  };

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

  const statusStyle = getStatusBadgeStyle(issue.status);

  const handlePrevImage = () => {
    if (currentImageIndex > 0) {
      const newIndex = currentImageIndex - 1;
      setCurrentImageIndex(newIndex);
      flatListRef.current?.scrollToIndex({ index: newIndex, animated: true });
    }
  };

  const handleNextImage = () => {
    if (currentImageIndex < issue.images.length - 1) {
      const newIndex = currentImageIndex + 1;
      setCurrentImageIndex(newIndex);
      flatListRef.current?.scrollToIndex({ index: newIndex, animated: true });
    }
  };

  const handleContactUs = () => {
    // TODO: Navigate to contact/support screen
    console.log('Contact us pressed');
  };

  const handleMoreOptions = () => {
    // TODO: Show more options bottom sheet
    console.log('More options pressed');
  };

  const renderImageItem = ({
    item,
    index,
  }: {
    item: string;
    index: number;
  }) => (
    <View
      style={{
        width: IMAGE_WIDTH,
        marginRight: index < issue.images.length - 1 ? 8 : 0,
      }}
    >
      <Image
        source={{ uri: item }}
        style={{
          width: '100%',
          height: 200,
          borderRadius: 12,
        }}
        contentFit="cover"
      />
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'bottom']}>
      {/* Header */}
      <View className="flex-row items-center justify-between border-b border-grey-plain-150 bg-white px-4 py-3">
        <TouchableOpacity onPress={() => router.back()} className="mr-3">
          <CornerUpLeft
            color={colors['grey-plain']['550']}
            size={24}
            strokeWidth={2}
          />
        </TouchableOpacity>
        <Text className="flex-1 text-lg font-semibold text-grey-alpha-500">
          Logged issue
        </Text>
        <TouchableOpacity onPress={handleMoreOptions}>
          <MoreVertical
            color={colors['grey-plain']['550']}
            size={24}
            strokeWidth={2}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Issue Header Info */}
        <View className="px-4 pt-4">
          {/* Category and Status Row */}
          <View className="mb-2 flex-row items-center justify-between">
            <View>
              <Text className="text-sm text-grey-plain-550">
                {issue.category}
              </Text>
              <Text className="text-sm font-medium text-grey-alpha-500">
                Issue ID: {issue.id}
              </Text>
            </View>
            <View
              className="rounded-full px-3 py-1"
              style={{ backgroundColor: statusStyle.backgroundColor }}
            >
              <Text
                className="text-sm font-semibold capitalize"
                style={{ color: statusStyle.textColor }}
              >
                {issue.status}
              </Text>
            </View>
          </View>

          {/* Issue Title */}
          <Text className="mb-4 text-xl font-bold text-grey-alpha-500">
            {issue.title}
          </Text>

          {/* Issue Description */}
          <Text className="mb-6 text-base leading-6 text-grey-alpha-500">
            {issue.description}
          </Text>
        </View>

        {/* Image Carousel */}
        {issue.images.length > 0 && (
          <View className="mb-6">
            <View className="relative">
              <FlatList
                ref={flatListRef}
                data={issue.images}
                renderItem={renderImageItem}
                keyExtractor={(item, index) => `image-${index}`}
                horizontal
                showsHorizontalScrollIndicator={false}
                pagingEnabled
                snapToInterval={IMAGE_WIDTH + 8}
                decelerationRate="fast"
                contentContainerStyle={{ paddingHorizontal: 16 }}
                onMomentumScrollEnd={(event) => {
                  const index = Math.round(
                    event.nativeEvent.contentOffset.x / (IMAGE_WIDTH + 8)
                  );
                  setCurrentImageIndex(index);
                }}
              />

              {/* Navigation Arrows */}
              {issue.images.length > 1 && (
                <>
                  {/* Left Arrow */}
                  {currentImageIndex > 0 && (
                    <TouchableOpacity
                      onPress={handlePrevImage}
                      className="absolute left-6 top-1/2 h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-sm"
                      style={{ transform: [{ translateY: -20 }] }}
                    >
                      <ChevronLeft
                        color={colors['grey-alpha']['500']}
                        size={24}
                        strokeWidth={2}
                      />
                    </TouchableOpacity>
                  )}

                  {/* Right Arrow */}
                  {currentImageIndex < issue.images.length - 1 && (
                    <TouchableOpacity
                      onPress={handleNextImage}
                      className="absolute right-6 top-1/2 h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-sm"
                      style={{ transform: [{ translateY: -20 }] }}
                    >
                      <ChevronRight
                        color={colors['grey-alpha']['500']}
                        size={24}
                        strokeWidth={2}
                      />
                    </TouchableOpacity>
                  )}
                </>
              )}
            </View>
          </View>
        )}

        {/* Date Logged */}
        <View className="px-4">
          <Text className="mb-1 text-sm text-grey-plain-550">Date logged</Text>
          <Text className="text-base font-medium text-grey-alpha-500">
            {issue.date}
          </Text>
        </View>
      </ScrollView>

      {/* Contact Us FAB */}
      <TouchableOpacity
        onPress={handleContactUs}
        className="absolute bottom-6 right-8 flex-row items-center gap-2 rounded-full px-5 py-3"
        style={{ backgroundColor: colors.primary.purple }}
        activeOpacity={0.8}
      >
        <MessageCircleQuestion color="white" size={20} strokeWidth={2} />
        <Text className="text-base font-semibold text-white">Contact us</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
