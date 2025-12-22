import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Image } from 'expo-image';
import {
  CornerUpLeft,
  BadgeCheck,
  EllipsisVertical,
  CheckCircle2,
  XCircle,
  Trash2,
  CheckCheck,
  MessageSquareText,
} from 'lucide-react-native';
import { colors } from '@/theme/colors';
import { mockLifts } from '@/data/mockLifts';
import { formatAmount } from '@/utils/formatAmount';
import {
  BottomSheetComponent,
  BottomSheetRef,
} from '@/components/ui/BottomSheet';

type TabType = 'monetary' | 'non-monetary';

const MESSAGE_TEMPLATES = [
  'Thank you for the gift, Toba. I appreciate it.',
  'I am in awe. Thank you for the monetary lift.',
  'Ose, omo lya mi. I dey with you. Mafo!!',
];

export default function LifterDetailsScreen() {
  const router = useRouter();
  const { id, liftId } = useLocalSearchParams<{ id: string; liftId: string }>();
  const [activeTab, setActiveTab] = useState<TabType>('non-monetary');
  const itemMenuBottomSheetRef = useRef<BottomSheetRef>(null);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  // Get lift data and lifter info
  const liftData = mockLifts.find((lift) => lift.id === liftId);
  const lifter = liftData?.monetary?.coRaisers?.find(
    (raiser) => raiser.id === id
  );

  if (!liftData || !lifter) {
    return (
      <SafeAreaView className="flex-1 bg-grey-plain-50">
        <View className="flex-1 items-center justify-center">
          <Text className="text-grey-plain-550">Lifter not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleItemMenuPress = (item: any) => {
    setSelectedItem(item);
    itemMenuBottomSheetRef.current?.expand();
  };

  const handleMenuAction = (action: string) => {
    itemMenuBottomSheetRef.current?.close();
    // TODO: Implement actual actions
    console.log(`Action: ${action} for item:`, selectedItem);
  };

  const handleTemplatePress = (template: string) => {
    // TODO: Implement send message logic
    console.log('Template selected:', template);
  };

  // Mock data for non-monetary items
  const nonMonetaryItems = [
    {
      id: '1',
      name: 'Mouse',
      quantity: '1pcs',
      date: '12/12/2025 - 1:09:08am',
    },
    {
      id: '2',
      name: 'Mouse',
      quantity: '2pcs',
      date: '12/12/2025 - 1:09:08am',
    },
  ];

  // Mock monetary contributions
  const monetaryContributions = [
    { id: '1', amount: 5000, date: '12/12/2025 - 1:09:08am' },
    { id: '2', amount: 5000, date: '12/12/2025 - 1:09:08am' },
    { id: '3', amount: 5000, date: '12/12/2025 - 1:09:08am' },
  ];

  const totalAmount = monetaryContributions.reduce(
    (sum, contribution) => sum + contribution.amount,
    0
  );

  return (
    <SafeAreaView className="flex-1 bg-grey-plain-50" edges={['top']}>
      {/* Header */}
      <View className="border-b border-grey-plain-150 bg-white px-4 py-3">
        <View className="flex-row items-center gap-3">
          <TouchableOpacity onPress={() => router.back()}>
            <CornerUpLeft color={colors['grey-plain']['550']} size={24} />
          </TouchableOpacity>
          <Text className="text-lg font-semibold text-grey-alpha-500">
            Lift details
          </Text>
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <View className="border-b border-grey-plain-150 bg-white px-4 py-4">
          <View className="flex-row items-center gap-3">
            <View className="h-12 w-12 overflow-hidden rounded-full bg-grey-plain-300">
              <Image
                source={{ uri: lifter.avatar }}
                style={{ width: 48, height: 48 }}
                contentFit="cover"
              />
            </View>
            <View className="flex-1">
              <View className="mb-1 flex-row items-center gap-1.5">
                <Text className="text-base font-semibold text-grey-alpha-500">
                  {lifter.name}
                </Text>
                <BadgeCheck color={colors.primary.purple} size={16} />
              </View>
              <Text className="text-sm text-grey-plain-550">
                @{lifter.name.toLowerCase().replace(/\s+/g, '')}
              </Text>
            </View>
          </View>
        </View>

        {/* Tabs */}
        <View className="flex-row border-b border-grey-plain-150 bg-white">
          <TouchableOpacity
            onPress={() => setActiveTab('monetary')}
            className="items-center p-3"
          >
            <View
              className={`pb-3 ${activeTab === 'monetary' ? 'border-b-2 border-primary' : ''}`}
            >
              <Text
                className={`text-base ${
                  activeTab === 'monetary'
                    ? 'font-semibold text-grey-alpha-500'
                    : 'text-grey-plain-550'
                }`}
              >
                Monetary{' '}
                <Text className="text-grey-plain-550">
                  ({monetaryContributions.length})
                </Text>
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab('non-monetary')}
            className=" items-center p-3"
          >
            <View
              className={`pb-3 ${activeTab === 'non-monetary' ? 'border-b-2 border-primary' : ''}`}
            >
              <Text
                className={`text-base ${
                  activeTab === 'non-monetary'
                    ? 'font-semibold text-grey-alpha-500'
                    : 'text-grey-plain-550'
                }`}
              >
                Non-monetary{' '}
                <Text className="text-grey-plain-550">
                  ({nonMonetaryItems.length})
                </Text>
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        <View className="bg-white">
          {activeTab === 'monetary' ? (
            <View className="px-4">
              {/* Total Lift Amount */}
              <View className="my-4 rounded-xl bg-grey-plain-100 p-4">
                <Text className="mb-2 text-sm text-grey-plain-550">
                  Total lift amount
                </Text>
                <Text className="text-2xl font-bold text-grey-alpha-500">
                  {formatAmount(totalAmount)}
                </Text>
              </View>

              {/* Contributions List */}
              <View className="gap-6 pb-4">
                {monetaryContributions.map((contribution) => (
                  <View
                    key={contribution.id}
                    className="flex-row items-center justify-between"
                  >
                    <Text className="text-base font-semibold text-grey-alpha-500">
                      {formatAmount(contribution.amount)}
                    </Text>
                    <Text className="text-xs text-grey-plain-550">
                      {contribution.date}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          ) : (
            <View className="px-4 py-4">
              {nonMonetaryItems.map((item, index) => (
                <View
                  key={item.id}
                  className={`flex-row items-center justify-between py-4 ${
                    index < nonMonetaryItems.length - 1
                      ? 'border-b border-grey-plain-150'
                      : ''
                  }`}
                >
                  <View className="flex-1">
                    <Text className="text-base font-semibold text-grey-alpha-500">
                      {item.name}{' '}
                      <Text className="font-normal">({item.quantity})</Text>
                    </Text>
                    <Text className="mt-1 text-xs text-grey-plain-550">
                      {item.date}
                    </Text>
                  </View>
                  <TouchableOpacity onPress={() => handleItemMenuPress(item)}>
                    <EllipsisVertical
                      color={colors['grey-plain']['550']}
                      size={20}
                    />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Uplifting Message */}
        <View className="mt-2 bg-white px-4 py-4">
          <View className="mb-2 flex-row items-center justify-between">
            <Text className="text-base font-semibold text-grey-alpha-500">
              Uplifting message
            </Text>
            <Text className="text-xs text-grey-plain-550">
              12/12/2025 - 1:09:08am
            </Text>
          </View>
          <Text className="text-sm leading-5 text-grey-alpha-500">
            I hope you get all the good things that you deserve in life. Happy
            birthday, Eje mi. 🙌
          </Text>
        </View>

        {/* Message Section */}
        <View className="mt-2 bg-white px-4 py-4">
          <View className="mb-4 flex-row items-center justify-between">
            <View className="flex-row items-center gap-2">
              <MessageSquareText
                color={colors['grey-alpha']['500']}
                size={20}
              />
              <Text className="text-base font-semibold text-grey-alpha-500">
                Message {lifter.name.split(' ')[0]}
              </Text>
            </View>
            <TouchableOpacity>
              <Text className="text-primary-purple text-sm font-semibold">
                →
              </Text>
            </TouchableOpacity>
          </View>

          {/* Templates */}
          <View className="gap-3">
            {MESSAGE_TEMPLATES.map((template, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleTemplatePress(template)}
                className="rounded-xl bg-grey-plain-100 p-4"
              >
                <Text className="text-sm leading-5 text-grey-alpha-500">
                  {template}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Item Menu Bottom Sheet */}
      <BottomSheetComponent ref={itemMenuBottomSheetRef}>
        <View className="px-6 pb-4">
          <TouchableOpacity
            onPress={() => handleMenuAction('provided')}
            className="flex-row items-center gap-3 py-4"
          >
            <CheckCircle2 color={colors['grey-alpha']['500']} size={20} />
            <Text className="text-base text-grey-alpha-500">
              Yes, lifter has provided the offer
            </Text>
          </TouchableOpacity>

          <View className="h-px bg-grey-plain-150" />

          <TouchableOpacity
            onPress={() => handleMenuAction('not-provided')}
            className="flex-row items-center gap-3 py-4"
          >
            <XCircle color={colors['grey-alpha']['500']} size={20} />
            <Text className="text-base text-grey-alpha-500">
              No, lifter did not provide the offer
            </Text>
          </TouchableOpacity>

          <View className="h-px bg-grey-plain-150" />

          <TouchableOpacity
            onPress={() => handleMenuAction('remove-item')}
            className="flex-row items-center gap-3 py-4"
          >
            <Trash2 color={colors['grey-alpha']['500']} size={20} />
            <Text className="text-base text-grey-alpha-500">
              Remove this item from this lifter
            </Text>
          </TouchableOpacity>

          <View className="h-px bg-grey-plain-150" />

          <TouchableOpacity
            onPress={() => handleMenuAction('provided-all')}
            className="flex-row items-center gap-3 py-4"
          >
            <CheckCheck color={colors['grey-alpha']['500']} size={20} />
            <Text className="text-base text-grey-alpha-500">
              Lifter has provided all non-monetary offer
            </Text>
          </TouchableOpacity>

          <View className="h-px bg-grey-plain-150" />

          <TouchableOpacity
            onPress={() => handleMenuAction('remove-all')}
            className="flex-row items-center gap-3 py-4"
          >
            <Trash2 color={colors['grey-alpha']['500']} size={20} />
            <Text className="text-base text-grey-alpha-500">
              Remove all items from this lifter
            </Text>
          </TouchableOpacity>
        </View>
      </BottomSheetComponent>
    </SafeAreaView>
  );
}
