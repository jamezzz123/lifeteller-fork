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
  X,
  CloudDownload,
  Search,
  ChevronRight,
} from 'lucide-react-native';
import EmptyStateIllustration from '@/assets/images/empty-state.svg';
import { Checkbox } from '@/components/ui/Checkbox';
import { Button } from '@/components/ui/Button';
import { colors } from '@/theme/colors';

type DataType = 'all' | 'posts' | 'activity' | 'lifts' | 'messages';
type DataFormat = 'text' | 'json';
type RequestStatus = 'ready' | 'processing' | 'cancelled';

interface DataRequest {
  id: string;
  dataType: string;
  format: string;
  date: string;
  status: RequestStatus;
}

export default function DataRequestScreen() {
  const [showForm, setShowForm] = useState(false);
  const [selectedDataTypes, setSelectedDataTypes] = useState<Set<DataType>>(
    new Set(['activity'])
  );
  const [selectedFormat, setSelectedFormat] = useState<DataFormat | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data - replace with actual data fetching
  const hasDataRequests = true;
  const dataRequests: DataRequest[] = [
    {
      id: '71AA',
      dataType: 'All data',
      format: 'Text format',
      date: '12/12/2025 - 10:04am',
      status: 'ready',
    },
    {
      id: '72BB',
      dataType: 'Posts',
      format: 'JSON format',
      date: '11/12/2025 - 2:30pm',
      status: 'processing',
    },
    {
      id: '73CC',
      dataType: 'Activity',
      format: 'Text format',
      date: '10/12/2025 - 9:15am',
      status: 'cancelled',
    },
    {
      id: '74DD',
      dataType: 'Lifts',
      format: 'JSON format',
      date: '09/12/2025 - 4:45pm',
      status: 'processing',
    },
  ];

  const totalRequests = dataRequests.length;
  const readyCount = dataRequests.filter((r) => r.status === 'ready').length;
  const processingCount = dataRequests.filter(
    (r) => r.status === 'processing'
  ).length;

  const filteredRequests = dataRequests.filter((request) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      request.dataType.toLowerCase().includes(query) ||
      request.format.toLowerCase().includes(query)
    );
  });

  const handleRequestData = () => {
    setShowForm(true);
  };

  const toggleDataType = (type: DataType) => {
    const newSelection = new Set(selectedDataTypes);

    if (type === 'all') {
      if (newSelection.has('all')) {
        // Uncheck all
        newSelection.clear();
      } else {
        // Check all
        newSelection.clear();
        newSelection.add('all');
        newSelection.add('posts');
        newSelection.add('activity');
        newSelection.add('lifts');
        newSelection.add('messages');
      }
    } else {
      // If "all" is selected, uncheck it and set all individual types as selected
      if (newSelection.has('all')) {
        newSelection.delete('all');
        // Add all individual types since they were all selected via "all"
        newSelection.add('posts');
        newSelection.add('activity');
        newSelection.add('lifts');
        newSelection.add('messages');
      }

      // Toggle individual type
      if (newSelection.has(type)) {
        newSelection.delete(type);
      } else {
        newSelection.add(type);
      }

      // Check if all individual types are selected
      const individualTypes: DataType[] = [
        'posts',
        'activity',
        'lifts',
        'messages',
      ];
      const allSelected = individualTypes.every((t) => newSelection.has(t));
      if (allSelected) {
        newSelection.add('all');
      }
    }

    setSelectedDataTypes(newSelection);
  };

  const handleFormatSelect = (format: DataFormat) => {
    setSelectedFormat(format === selectedFormat ? null : format);
  };

  const handleProceed = () => {
    // TODO: Implement data request submission
    const dataTypes = Array.from(selectedDataTypes);
    const format = selectedFormat;
    console.log('Requesting data:', { dataTypes, format });
    // Navigate to success or next screen
  };

  const isDataTypeSelected = (type: DataType) => {
    if (type === 'all') {
      return selectedDataTypes.has('all');
    }
    // If "all" is selected, all individual types are considered selected
    if (selectedDataTypes.has('all')) {
      return true;
    }
    return selectedDataTypes.has(type);
  };

  const getStatusBadgeStyle = (status: RequestStatus) => {
    switch (status) {
      case 'ready':
        return {
          backgroundColor: colors['green-tint']['200'],
          textColor: colors['green-shades']['150'],
        };
      case 'processing':
        return {
          backgroundColor: colors['yellow-tint']['150'],
          textColor: colors.state.yellow,
        };
      case 'cancelled':
        return {
          backgroundColor: colors['grey-plain']['150'],
          textColor: colors['grey-plain']['550'],
        };
    }
  };

  // Empty State View
  if (!showForm && !hasDataRequests) {
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
            Data request
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
              No data request made yet
            </Text>

            {/* Description */}
            <View className="mb-8 items-center">
              <Text className="mb-2 text-center text-sm leading-5 text-grey-plain-550">
                You are yet to request for any data on Lifteller.
              </Text>
              <Text className="text-center text-sm leading-5 text-grey-plain-550">
                Requested data that will appear here.
              </Text>
            </View>

            {/* Request Data Button */}
            <Button
              title="Request data"
              onPress={handleRequestData}
              variant="primary"
              size="medium"
              className="min-w-[200px]"
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Data View (when there are requests)
  if (!showForm && hasDataRequests) {
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
            Data request
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
            {/* Left Section - Total Requests (1/3 width) */}
            <View
              className="items-start justify-center"
              style={{ width: '33%' }}
            >
              <Text className="mb-1 text-sm text-white/80">Total requests</Text>
              <Text className="text-3xl font-bold text-white">
                {totalRequests}
              </Text>
            </View>

            {/* Right Section - White Inset Card (2/3 width) */}
            <View
              className="ml-4 rounded-xl bg-white p-4"
              style={{ width: '64%' }}
            >
              <View className="flex-row">
                {/* Ready Section */}
                <View className="flex-1 items-start">
                  <Text className="mb-1 text-sm text-grey-plain-550">
                    Ready
                  </Text>
                  <Text className="text-3xl font-bold text-grey-alpha-500">
                    {readyCount}
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

                {/* Processing Section */}
                <View className="flex-1 items-start">
                  <Text className="mb-1 text-sm text-grey-plain-550">
                    Processing
                  </Text>
                  <Text className="text-3xl font-bold text-grey-alpha-500">
                    {processingCount}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Request New Data Button */}
          <View className="mx-4 mt-4">
            <Button
              title="Request new data"
              onPress={handleRequestData}
              variant="outline"
              size="medium"
              className="w-full border-primary"
            />
          </View>

          {/* Data Requested Section */}
          <View className="mx-4 mt-6">
            <View className="mb-4 flex-row items-center justify-between">
              <Text className="text-lg font-semibold text-grey-alpha-500">
                Data requested
              </Text>
              <TouchableOpacity
                onPress={() => {
                  // TODO: Navigate to see all
                }}
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
                placeholder="Search by data type or data format"
                placeholderTextColor={colors['grey-alpha']['400']}
                className="flex-1 text-base text-grey-alpha-500"
                style={{ fontSize: 16 }}
              />
            </View>

            {/* Request List */}
            <View className="gap-3">
              {filteredRequests.map((request) => {
                const statusStyle = getStatusBadgeStyle(request.status);
                return (
                  <View
                    key={request.id}
                    className="flex-row items-center gap-4 rounded-xl border border-grey-plain-150 bg-white p-4"
                  >
                    {/* Icon */}
                    <View
                      className="h-12 w-12 items-center justify-center rounded-full"
                      style={{
                        backgroundColor: colors['primary-tints'].purple['100'],
                      }}
                    >
                      <CloudDownload
                        color={colors.primary.purple}
                        size={24}
                        strokeWidth={2}
                      />
                    </View>

                    {/* Content */}
                    <View className="flex-1">
                      <Text className="mb-1 text-base font-semibold text-grey-alpha-500">
                        {request.dataType}
                      </Text>
                      <Text className="mb-1 text-sm text-grey-plain-550">
                        {request.format}
                      </Text>
                      <Text className="text-xs text-grey-plain-550">
                        {request.date}
                      </Text>
                    </View>

                    {/* Right Side */}
                    <View className="items-end">
                      <Text className="mb-2 text-xs font-medium text-grey-plain-550">
                        ID: {request.id}
                      </Text>
                      <View
                        className="rounded-full px-2.5 py-1"
                        style={{ backgroundColor: statusStyle.backgroundColor }}
                      >
                        <Text
                          className="text-xs font-semibold capitalize"
                          style={{ color: statusStyle.textColor }}
                        >
                          {request.status}
                        </Text>
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Form View
  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'bottom']}>
      {/* Header */}
      <View className="flex-row items-center justify-between border-b border-grey-plain-150 bg-white px-4 py-3">
        <TouchableOpacity
          onPress={() => setShowForm(false)}
          hitSlop={10}
          accessibilityLabel="Close"
        >
          <X color={colors['grey-plain']['550']} size={24} strokeWidth={2} />
        </TouchableOpacity>
        <Text className="flex-1 text-center text-lg font-semibold text-grey-alpha-500">
          Request data
        </Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Form Content */}
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingBottom: 100,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Data to download Section */}
        <View
          className="mx-4 mt-6 rounded-2xl p-2"
          style={{ backgroundColor: colors['grey-plain']['150'] }}
        >
          <Text className="mb-4 ml-3 mt-2 text-base font-semibold text-grey-alpha-500">
            Data to download
          </Text>
          <View className="gap-1">
            <View className="rounded-xl bg-white px-4 py-4">
              <Checkbox
                label="All data"
                checked={isDataTypeSelected('all')}
                onPress={() => toggleDataType('all')}
              />
            </View>
            <View className="rounded-xl bg-white px-4 py-4">
              <Checkbox
                label="Posts"
                checked={isDataTypeSelected('posts')}
                onPress={() => toggleDataType('posts')}
              />
            </View>
            <View className="rounded-xl bg-white px-4 py-4">
              <Checkbox
                label="Activity"
                checked={isDataTypeSelected('activity')}
                onPress={() => toggleDataType('activity')}
              />
            </View>
            <View className="rounded-xl bg-white px-4 py-4">
              <Checkbox
                label="Lifts"
                checked={isDataTypeSelected('lifts')}
                onPress={() => toggleDataType('lifts')}
              />
            </View>
            <View className="rounded-xl bg-white px-4 py-4">
              <Checkbox
                label="Messages"
                checked={isDataTypeSelected('messages')}
                onPress={() => toggleDataType('messages')}
              />
            </View>
          </View>
        </View>

        {/* Data format Section */}
        <View
          className="mx-4 mt-6 rounded-2xl p-2"
          style={{ backgroundColor: colors['grey-plain']['150'] }}
        >
          <Text className="mb-4 ml-3 mt-2 text-base font-semibold text-grey-alpha-500">
            Data format
          </Text>
          <View className="gap-1">
            <View className="rounded-xl bg-white px-4 py-4">
              <Checkbox
                label="Text"
                checked={selectedFormat === 'text'}
                onPress={() => handleFormatSelect('text')}
              />
            </View>
            <View className="rounded-xl bg-white px-4 py-4">
              <Checkbox
                label="JSON"
                checked={selectedFormat === 'json'}
                onPress={() => handleFormatSelect('json')}
              />
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Proceed Button */}
      <View className="absolute bottom-0 left-0 right-0 border-t border-grey-plain-150 bg-white px-4 py-4">
        <View className="items-end">
          <Button
            title="Proceed"
            onPress={handleProceed}
            variant="primary"
            size="medium"
            disabled={selectedDataTypes.size === 0 || selectedFormat === null}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
