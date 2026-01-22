import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import {
  CornerUpLeft,
  Search,
  Settings,
  MoreVertical,
  Check,
} from 'lucide-react-native';

import { colors } from '@/theme/colors';
import { FilterTabs } from '@/components/ui/FilterTabs';
import { useState, useRef } from 'react';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { LiftProgressBar } from '@/components/ui/LiftProgressBar';
import { Image } from 'expo-image';
import { BottomSheetComponent, BottomSheetRef } from '@/components/ui/BottomSheet';
import { ConfirmationModal } from '@/components/ui/ConfirmationModal';

interface LiftCardData {
  title: string;
  amount: number;
  currentAmount?: number;
  targetAmount?: number;
}

interface NotificationItemProps {
  actorName: string;
  actionText: string;
  contentSnippet: string;
  time: string;
  profileImage?: string;
  showRequestedLift?: boolean;
  showOfferLift?: boolean;
  liftData?: LiftCardData;
  onDecline?: () => void;
  onOfferLift?: () => void;
}

type NotificationListItem =
  | { type: 'header'; title: string; id: string }
  | { type: 'notification'; id: string; data: NotificationItemProps };

// Inline Components
const RequestedLiftCard = ({
  title,
  amount,
  currentAmount,
  targetAmount,
}: {
  title: string;
  amount: number;
  currentAmount: number;
  targetAmount: number;
}) => (
  <View className="border-grey-plain-300 gap-1 border rounded-lg p-4">
    <View className="flex-row justify-between mb-2">
      <Text className="text-sm font-medium">{title}</Text>
      <Text className="text-sm font-medium text-primary">₦{amount.toLocaleString()}</Text>
    </View>
    <LiftProgressBar amountTextSize="sm" currentAmount={currentAmount} targetAmount={targetAmount} />
  </View>
);

const OfferLiftCard = ({
  title,
  amount,
  onDecline,
  onOfferLift,
}: {
  title: string;
  amount: number;
  onDecline: () => void;
  onOfferLift: () => void;
}) => (
  <View className="border-grey-plain-300 gap-1 rounded-lg">
    <View className="flex-row justify-between p-4 border border-grey-plain-300 rounded-lg items-center">
      <Text className="text-sm font-medium">{title}</Text>
      <Text className="text-sm font-medium text-primary">₦{amount.toLocaleString()}</Text>
    </View>
    <View className="flex-row items-center justify-between">
      <Button
        title="Decline"
        variant="link-destructive"
        onPress={onDecline}
        size="small"
      />
      <Button
        title="Offer lift"
        variant="outline"
        onPress={onOfferLift}
        size="small"
      />
    </View>
  </View>
);

const EmptyState = ({
  onOfferLift,
  onRaiseLift,
}: {
  onOfferLift: () => void;
  onRaiseLift: () => void;
}) => (
  <View className="flex-1 items-center justify-center p-8">
    <Image style={{
      width: 150,
      height: 150
    }} source={require('@/assets/images/empty-state.png')} ></Image>
    <Text className="text-lg font-semibold text-grey-alpha-550 mb-2">
      No lift notifications yet
    </Text>
    <Text className="text-sm text-grey-alpha-400 text-center mb-6">
      When you have lift notifications, they will appear here.
    </Text>
    <View className="flex-row gap-3">
      <Button
        title="Offer a lift"
        variant="outline"
        onPress={onOfferLift}
        size="medium"
      />
      <Button
        title="Raise a lift"
        variant="primary"
        onPress={onRaiseLift}
        size="medium"
      />
    </View>
  </View>
);

const NotificationItem = ({
  actorName,
  actionText,
  contentSnippet,
  time,
  profileImage,
  showRequestedLift,
  showOfferLift,
  liftData,
  onDecline,
  onOfferLift,
}: NotificationItemProps) => {
  return (
    <View className="flex-row items-start pt-4">
      <Avatar
        profileImage={profileImage}
        name={actorName}
        size={40}
        showBadge={false}
        className="mr-3"
      />
      <View className="flex-1 gap-1 pb-4">
        <Text className="text-[15px] font-normal leading-5 text-grey-alpha-400">
          <Text className="font-semibold text-grey-alpha-550">{actorName}</Text>{' '}
          {actionText}
        </Text>

        <Text className="text-sm text-grey-alpha-400" numberOfLines={2}>
          {contentSnippet}
        </Text>
        {showRequestedLift && liftData && (
          <View className="mb-1">
            <RequestedLiftCard
              title={liftData.title}
              amount={liftData.amount}
              currentAmount={liftData.currentAmount ?? 0}
              targetAmount={liftData.targetAmount ?? liftData.amount}
            />
          </View>
        )}

        {showOfferLift && liftData && (
          <View className="mb-1">
            <OfferLiftCard
              title={liftData.title}
              amount={liftData.amount}
              onDecline={onDecline ?? (() => { })}
              onOfferLift={onOfferLift ?? (() => { })}
            />
          </View>
        )}


        <Text className="text-xs italic text-grey-alpha-400">{time}</Text>
      </View>
    </View >
  );
};

export default function AccountNotificationScreen() {
  const moreOptionsSheetRef = useRef<BottomSheetRef>(null);
  const [showMarkAllReadConfirm, setShowMarkAllReadConfirm] = useState(false);

  const handleSearch = () => {
    // TODO: Implement search
  };

  const handleSettings = () => {
    router.push('/settings');
  };

  const handleOfferLift = () => {
    router.push('/screens/lifts/offer');
  };

  const handleRaiseLift = () => {
    router.push('/screens/lifts/raise');
  };

  const handleMore = () => {
    moreOptionsSheetRef.current?.expand();
  };

  const handleMarkAllAsRead = () => {
    moreOptionsSheetRef.current?.close();
    setShowMarkAllReadConfirm(true);
  };

  const confirmMarkAllAsRead = () => {
    setShowMarkAllReadConfirm(false);
    // TODO: Implement mark all as read functionality
    console.log('All notifications marked as read');
  };

  const customFilters = [
    { id: 'all', label: 'All', count: 1 },
    { id: 'lifts', label: 'Lifts' },
    { id: 'unread', label: 'Unread' },
    { id: 'read', label: 'Read' },
  ];
  const [activeFilter, setActiveFilter] = useState('all');
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const PAGE_SIZE = 8;

  const todayNotifications = [
    {
      actorName: "Isaac Tolulope",
      actionText: "commented on your post",
      contentSnippet: "After now that we are married, life is beautiful",
      time: "11:56am",
      profileImage: "https://i.pravatar.cc/150?img=12",
    },
    {
      actorName: "Adaeze Nwosu",
      actionText: "liked your lift",
      contentSnippet: "Keep pushing forward, we believe in you!",
      time: "10:30am",
      profileImage: "https://i.pravatar.cc/150?img=12",
    },
    {
      actorName: "Chukwuemeka Obi",
      actionText: "started following you",
      contentSnippet: "Looking forward to connecting with you",
      time: "09:15am",
      profileImage: "https://i.pravatar.cc/150?img=12",
    },
    {
      actorName: "Folake Adeyemi",
      actionText: "shared your post",
      contentSnippet: "This is so inspiring, everyone needs to see this",
      time: "08:00am",
      profileImage: "https://i.pravatar.cc/150?img=12",
    },
  ];

  const yesterdayNotifications = [
    {
      actorName: "Kunle Bakare",
      actionText: "commented on your lift",
      contentSnippet: "You're doing great work here, keep it up!",
      time: "Yesterday, 6:45pm",
      profileImage: "https://i.pravatar.cc/150?img=12",
    },
    {
      actorName: "Ngozi Eze",
      actionText: "mentioned you in a comment",
      contentSnippet: "I think you should check this out",
      time: "Yesterday, 4:20pm",
      profileImage: "https://i.pravatar.cc/150?img=12",
    },
    {
      actorName: "Tunde Adebayo",
      actionText: "reacted to your story",
      contentSnippet: "This really touched my heart",
      time: "Yesterday, 2:00pm",
      profileImage: "https://i.pravatar.cc/150?img=12",
    },
    {
      actorName: "Blessing Okoro",
      actionText: "sent you a message",
      contentSnippet: "Hi, I wanted to ask about your recent lift",
      time: "Yesterday, 11:30am",
      profileImage: "https://i.pravatar.cc/150?img=12",
    },
  ];

  const fridayNotifications = [
    {
      actorName: "Emmanuel Okonkwo",
      actionText: "requested a lift for",
      contentSnippet: "Help Emmanuel cover his school fees",
      time: "Friday, 5:30pm",
      profileImage: "https://i.pravatar.cc/150?img=12",
      showRequestedLift: true,
      liftData: {
        title: "School Fees Support",
        amount: 50000,
        currentAmount: 15000,
        targetAmount: 50000,
      },
    },
    {
      actorName: "Amina Yusuf",
      actionText: "wants to offer you a lift",
      contentSnippet: "I would like to support your medical expenses",
      time: "Friday, 3:15pm",
      profileImage: "https://i.pravatar.cc/150?img=12",
      showOfferLift: true,
      liftData: {
        title: "Medical Expenses",
        amount: 25000,
      },
    },
    {
      actorName: "Chidinma Agu",
      actionText: "requested a lift for",
      contentSnippet: "Help Chidinma start her small business",
      time: "Friday, 1:00pm",
      profileImage: "https://i.pravatar.cc/150?img=12",
      showRequestedLift: true,
      liftData: {
        title: "Small Business Startup",
        amount: 100000,
        currentAmount: 45000,
        targetAmount: 100000,
      },
    },
    {
      actorName: "Olumide Fash",
      actionText: "wants to offer you a lift",
      contentSnippet: "Saw your lift request and want to help",
      time: "Friday, 10:45am",
      profileImage: "https://i.pravatar.cc/150?img=12",
      showOfferLift: true,
      liftData: {
        title: "House Rent Assistance",
        amount: 75000,
      },
    },
  ];

  // Build flattened list with section headers
  const allNotifications: NotificationListItem[] = [
    { type: 'header', title: 'Today', id: 'header-today' },
    ...todayNotifications.map((n, i) => ({
      type: 'notification' as const,
      id: `today-${i}`,
      data: n,
    })),
    { type: 'header', title: 'Yesterday', id: 'header-yesterday' },
    ...yesterdayNotifications.map((n, i) => ({
      type: 'notification' as const,
      id: `yesterday-${i}`,
      data: n,
    })),
    { type: 'header', title: 'Friday', id: 'header-friday' },
    ...fridayNotifications.map((n, i) => ({
      type: 'notification' as const,
      id: `friday-${i}`,
      data: n,
    })),
  ];

  const [visibleNotifications, setVisibleNotifications] = useState(() =>
    allNotifications.slice(0, PAGE_SIZE)
  );

  const hasMore = visibleNotifications.length < allNotifications.length;

  const handleLoadMore = () => {
    if (isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);
    setTimeout(() => {
      setVisibleNotifications((current) => {
        const nextCount = Math.min(
          allNotifications.length,
          current.length + PAGE_SIZE
        );
        return allNotifications.slice(0, nextCount);
      });
      setIsLoadingMore(false);
    }, 800);
  };

  const renderItem = ({ item }: { item: NotificationListItem }) => {
    if (item.type === 'header') {
      return (
        <Text className="text-sm font-semibold text-grey-alpha-450 mb-2 mt-4">
          {item.title}
        </Text>
      );
    }

    return (
      <NotificationItem
        {...item.data}
        onDecline={() => console.log('Declined')}
        onOfferLift={handleOfferLift}
      />
    );
  };

  const renderFooter = () => (
    <TouchableOpacity
      onPress={handleLoadMore}
      disabled={isLoadingMore || !hasMore}
      className="items-center justify-center py-6"
      activeOpacity={0.7}
    >
      <Text className="text-[15px] font-medium text-grey-plain-550">
        {isLoadingMore
          ? 'Loading...'
          : hasMore
            ? 'Load more...'
            : 'No more notifications'}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      {/* Header */}
      <View className="flex-row items-center justify-between border-b border-grey-plain-300 bg-grey-plain-50 px-4 py-3">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.back()} className="mr-3">
            <CornerUpLeft color={colors['grey-plain']['550']} size={24} />
          </TouchableOpacity>
          <Text className="text-lg font-semibold text-grey-alpha-450">
            Notifications
          </Text>
        </View>

        <View className="flex-row items-center gap-4">
          <TouchableOpacity onPress={handleSearch}>
            <Search color={colors['grey-alpha']['400']} size={22} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSettings}>
            <Settings color={colors['grey-alpha']['400']} size={22} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleMore}>
            <MoreVertical color={colors['grey-alpha']['400']} size={22} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      <View className="flex-1 px-4">
        <FilterTabs
          filters={customFilters}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          showCounts={true}
          scrollable={true}
          contentContainerClassName="py-3"
        />

        {activeFilter === 'lifts' ? (
          <EmptyState
            onOfferLift={handleOfferLift}
            onRaiseLift={handleRaiseLift}
          />
        ) : (
          <FlatList
            data={visibleNotifications}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            ListFooterComponent={renderFooter}
            contentContainerStyle={{
              paddingBottom: 100,
            }}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      {/* More Options Bottom Sheet */}
      <BottomSheetComponent ref={moreOptionsSheetRef}>
        <View className="px-6">
          <TouchableOpacity
            onPress={handleMarkAllAsRead}
            className="flex-row items-center gap-3 py-4"
            activeOpacity={0.7}
          >
            <Check color={colors['grey-alpha']['500']} size={20} />
            <Text className="text-base text-grey-alpha-500">
              Mark all as read
            </Text>
          </TouchableOpacity>
        </View>
      </BottomSheetComponent>

      {/* Mark All Read Confirmation Modal */}
      <ConfirmationModal
        visible={showMarkAllReadConfirm}
        title="Mark all notification as read"
        message="Are you sure you want to mark all notifications as read?"
        cancelText="No"
        confirmText="Yes, mark"
        onCancel={() => setShowMarkAllReadConfirm(false)}
        onConfirm={confirmMarkAllAsRead}
      />
    </SafeAreaView>
  );
}
