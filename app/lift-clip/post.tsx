import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import {
  MapPin,
  ChevronRight,
  CornerUpLeft,
  Search,
  Calendar,
  HandHelping,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { BottomSheetTextInput } from '@gorhom/bottom-sheet';

import { colors } from '@/theme/colors';
import { Button } from '@/components/ui/Button';
import { Dropdown } from '@/components/ui/Dropdown';
import { Toggle } from '@/components/ui/Toggle';
import { MaterialInput } from '@/components/ui/MaterialInput';
import {
  BottomSheetComponent,
  BottomSheetRef,
} from '@/components/ui/BottomSheet';
import {
  AudienceBottomSheet,
  AddCollaboratorsModal,
  ChooseListBottomSheet,
  ChooseFromListModal,
  CreateListModal,
  Contact,
  LOCATIONS,
  EnterAmountBottomSheet,
} from '@/components/lift';
import {
  useRequestLift,
  AudienceOfferType,
  List,
} from '@/context/request-lift';

export default function PostLiftClipScreen() {
  const params = useLocalSearchParams();
  const videoUri = params.videoUri as string;
  const linkedLiftName = params.name as string;

  const {
    audienceOfferType,
    setAudienceOfferType,
    selectedPeopleForAudience,
    setSelectedPeopleForAudience,
    selectedList,
    setSelectedList,
    location,
    setLocation,
    liftAmount,
    setLiftAmount,
  } = useRequestLift();

  const [description, setDescription] = useState('');
  const [requestLiftEnabled, setRequestLiftEnabled] = useState(false);
  const [scheduleLiftClip, setScheduleLiftClip] = useState(false);
  const [locationSearch, setLocationSearch] = useState('');
  const [showSelectedPeopleModal, setShowSelectedPeopleModal] = useState(false);
  const [showChooseListModal, setShowChooseListModal] = useState(false);
  const [showCreateListModal, setShowCreateListModal] = useState(false);
  const [isAmountSheetMounted, setIsAmountSheetMounted] = useState(false);

  const audienceSheetRef = useRef<BottomSheetRef>(null);
  const chooseListSheetRef = useRef<BottomSheetRef>(null);
  const locationSheetRef = useRef<BottomSheetRef>(null);
  const enterAmountSheetRef = useRef<BottomSheetRef>(null);

  const filteredLocations = LOCATIONS.filter((loc) =>
    loc.toLowerCase().includes(locationSearch.toLowerCase())
  );

  const handleBack = () => {
    router.back();
  };

  const handleNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push({
      pathname: '/lift-clip/final-preview' as any,
      params: {
        videoUri,
        name: linkedLiftName,
        description,
      },
    });
  };

  const handleLinkExistingLift = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push({
      pathname: '/lift-clip/link-clip' as any,
      params: { videoUri },
    });
  };

  const handleAudienceButtonPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    audienceSheetRef.current?.expand();
  };

  function handleAudienceSelect(type: AudienceOfferType) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setAudienceOfferType(type);
    audienceSheetRef.current?.close();

    if (type === 'selected-people' || type === 'chat-direct') {
      setShowSelectedPeopleModal(true);
    } else if (type === 'my-list') {
      chooseListSheetRef.current?.expand();
    }
  }

  function handleSelectedPeopleDone(people: Contact[]) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedPeopleForAudience(people);
    setShowSelectedPeopleModal(false);
  }

  function handleSelectList(list: List) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedList(list);
    chooseListSheetRef.current?.close();
    setShowChooseListModal(true);
  }

  function handleCreateNewList() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    chooseListSheetRef.current?.close();
    setShowCreateListModal(true);
  }

  function handleCreateListDone(people: Contact[], listName: string) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const newList: List = {
      id: Date.now().toString(),
      name: listName,
      peopleCount: people.length,
    };
    setSelectedList(newList);
    setShowCreateListModal(false);
  }

  function handleChooseFromListDone(list: List) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedList(list);
    setShowChooseListModal(false);
  }

  function handleLocationPress() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    locationSheetRef.current?.expand();
  }

  function handleLocationSelect(loc: string) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setLocation(loc);
    locationSheetRef.current?.close();
    setLocationSearch('');
  }

  function handleRequestLiftToggle(value: boolean) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setRequestLiftEnabled(value);
    if (value) {
      setIsAmountSheetMounted(true);
    } else {
      setLiftAmount(0);
    }
  }

  function handleRequestLiftPress() {
    if (requestLiftEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setIsAmountSheetMounted(true);
    }
  }

  function handleAmountDone(amount: string) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setLiftAmount(Number(amount));
    setIsAmountSheetMounted(false);
  }

  function handleAmountSheetClose() {
    setIsAmountSheetMounted(false);
  }

  function handleScheduleLiftClipToggle(value: boolean) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setScheduleLiftClip(value);
  }

  function getAudienceLabel() {
    switch (audienceOfferType) {
      case 'everyone':
        return 'Everyone';
      case 'friends':
        return 'Friends';
      case 'chat-direct':
        return 'Request via chat/direct message';
      case 'selected-people':
        return 'Selected people';
      case 'my-list':
        return selectedList ? selectedList.name : 'My list';
      case 'private':
        return 'Private';
      default:
        return 'Everyone';
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Header */}
        <View className="flex-row items-center justify-between border-b border-grey-plain-150 px-4 py-3">
          <TouchableOpacity
            onPress={handleBack}
            className="flex-row items-center gap-2"
          >
            <CornerUpLeft size={24} color={colors['grey-plain']['550']} />
            <Text className="font-inter-medium text-lg text-grey-plain-550">
              New lift clip
            </Text>
          </TouchableOpacity>
          <View style={{ width: 90 }}>
            <Button title="Preview" onPress={handleNext} size="small" />
          </View>
        </View>

        <ScrollView
          className="flex-1"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          {/* Profile and Audience */}
          <View className="flex-row items-center gap-3 px-4 py-4">
            <Image
              source={require('../../assets/images/welcome/collage-1.jpg')}
              style={{ width: 48, height: 48, borderRadius: 24 }}
            />
            <Dropdown
              label={getAudienceLabel()}
              onPress={handleAudienceButtonPress}
            />
          </View>

          {/* Video Thumbnail */}
          {videoUri && (
            <View className="px-4 py-2">
              <Image
                source={{ uri: videoUri }}
                style={{
                  width: 120,
                  height: 160,
                  borderRadius: 12,
                }}
                resizeMode="cover"
              />
            </View>
          )}
          {/* Description */}
          <View className="px-4 py-3">
            <MaterialInput
              value={description}
              onChangeText={setDescription}
              placeholder="This is the description of the lift, and it continues here. It should be short, concise, and brief. Even though we have little to no control over it. Users can also tag people to it."
              multiline
              size="small"
              numberOfLines={4}
            />
            <Text className="mt-2 text-xs text-grey-alpha-400">
              You can also tag others and use hashtags
            </Text>
          </View>
          {/* Link an existing lift */}
          {linkedLiftName ? (
            <TouchableOpacity
              onPress={handleLinkExistingLift}
              className="border-t border-grey-plain-150 px-4 py-4"
            >
              <Text className="text-primary-purple font-inter-medium text-sm">
                ✓ Linked to: {linkedLiftName}
              </Text>
              <Text className="mt-1 text-xs text-grey-alpha-400">
                Tap to change
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={handleLinkExistingLift}
              className="border-t border-grey-plain-150 px-4 py-4"
            >
              <Text className="font-inter-medium text-sm text-grey-alpha-500">
                Link an existing lift
              </Text>
            </TouchableOpacity>
          )}
          {/* Location */}
          <View className="border-t border-grey-plain-150 px-4 py-4">
            <TouchableOpacity
              onPress={handleLocationPress}
              className="mb-3 flex-row items-center justify-between"
            >
              <View className="flex-row items-center gap-3">
                <MapPin size={20} color={colors['grey-alpha']['500']} />
                <Text className="font-inter-medium text-base text-grey-alpha-500">
                  Location
                </Text>
              </View>
              <ChevronRight
                size={20}
                color={colors['grey-alpha']['400']}
                strokeWidth={2}
              />
            </TouchableOpacity>

            {/* Location chips */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 8 }}
            >
              {LOCATIONS.slice(0, 5).map((loc) => {
                const isSelected = location === loc;
                return (
                  <TouchableOpacity
                    key={loc}
                    onPress={() => setLocation(loc)}
                    className="rounded-lg px-4 py-2.5"
                    style={{
                      backgroundColor: isSelected
                        ? colors['primary-tints'].purple['100']
                        : colors['grey-plain']['150'],
                    }}
                  >
                    <Text
                      className="font-inter text-sm"
                      style={{
                        color: isSelected
                          ? colors.primary.purple
                          : colors['grey-alpha']['500'],
                      }}
                    >
                      {loc}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
          {/* Request lift settings */}
          <TouchableOpacity
            onPress={handleRequestLiftPress}
            className="border-t border-grey-plain-150 px-4 py-4"
            activeOpacity={requestLiftEnabled ? 0.7 : 1}
          >
            <View className="flex-row items-center justify-between">
              <View className="flex-1 flex-row items-center gap-3">
                <HandHelping size={24} color={colors['grey-alpha']['500']} />
                <View className="flex-1">
                  <Text className="mb-1 font-inter-semibold text-base text-grey-alpha-500">
                    Request lift settings
                  </Text>
                  {requestLiftEnabled && liftAmount > 0 ? (
                    <Text className="font-inter-medium text-sm text-grey-alpha-500">
                      ₦{liftAmount.toLocaleString()} →
                    </Text>
                  ) : (
                    <Text className="font-inter text-sm text-grey-alpha-400">
                      People can offer you lift when they see your lift clip
                    </Text>
                  )}
                </View>
              </View>
              <Toggle
                value={requestLiftEnabled}
                onValueChange={handleRequestLiftToggle}
              />
            </View>
          </TouchableOpacity>

          {/* Schedule lift clip */}
          <View className="border-t border-grey-plain-150 px-4 py-4">
            <View className="flex-row items-center justify-between">
              <View className="flex-1 flex-row items-center gap-3">
                <Calendar size={24} color={colors['grey-alpha']['500']} />
                <View className="flex-1">
                  <Text className="mb-1 font-inter-semibold text-base text-grey-alpha-500">
                    Schedule lift clip
                  </Text>
                  <Text className="font-inter text-sm text-grey-alpha-400">
                    Choose when to post your lift clip
                  </Text>
                </View>
              </View>
              <Toggle
                value={scheduleLiftClip}
                onValueChange={handleScheduleLiftClipToggle}
              />
            </View>
          </View>
        </ScrollView>

        {/* Audience Bottom Sheet */}
        <AudienceBottomSheet
          ref={audienceSheetRef}
          selectedKey={audienceOfferType}
          onSelectAudience={(key) =>
            handleAudienceSelect(key as AudienceOfferType)
          }
        />

        {/* Selected People Modal */}
        <AddCollaboratorsModal
          visible={showSelectedPeopleModal}
          currentCollaborators={selectedPeopleForAudience}
          onDone={handleSelectedPeopleDone}
          onClose={() => setShowSelectedPeopleModal(false)}
        />

        {/* Choose List Bottom Sheet */}
        <ChooseListBottomSheet
          ref={chooseListSheetRef}
          onSelectList={handleSelectList}
          onCreateNewList={handleCreateNewList}
        />

        {/* Choose From List Modal */}
        <ChooseFromListModal
          visible={showChooseListModal}
          onDone={handleChooseFromListDone}
          onClose={() => setShowChooseListModal(false)}
        />

        {/* Create List Modal */}
        <CreateListModal
          visible={showCreateListModal}
          onDone={handleCreateListDone}
          onClose={() => setShowCreateListModal(false)}
        />

        {/* Location Bottom Sheet */}
        <BottomSheetComponent
          ref={locationSheetRef}
          snapPoints={['70%', '90%']}
          keyboardBehavior="extend"
          android_keyboardInputMode="adjustResize"
          scrollable
        >
          <View className="px-4 pb-4">
            <Text className="mb-4 font-inter-bold text-lg text-grey-alpha-500">
              Choose location
            </Text>

            {/* Search Input */}
            <View className="mb-4 flex-row items-center gap-3 rounded-full border border-grey-plain-450 bg-grey-plain-200 px-4 py-3">
              <Search size={20} color={colors['grey-alpha']['400']} />
              <BottomSheetTextInput
                value={locationSearch}
                onChangeText={setLocationSearch}
                placeholder="Search for location"
                placeholderTextColor={colors['grey-alpha']['400']}
                className="flex-1 font-inter text-base text-grey-alpha-500"
              />
            </View>

            {/* Get Location Button */}
            <TouchableOpacity className="mb-4 flex-row items-center gap-3 rounded-2xl bg-grey-plain-200 px-4 py-4">
              <View className="size-10 items-center justify-center rounded-full bg-grey-plain-450/20">
                <MapPin size={20} color={colors['grey-alpha']['500']} />
              </View>
              <Text className="font-inter-medium text-base text-grey-alpha-500">
                Get my location on map
              </Text>
            </TouchableOpacity>

            {/* Location Chips */}
            <View className="mb-4 flex-row flex-wrap gap-2">
              {filteredLocations.map((loc) => (
                <TouchableOpacity
                  key={loc}
                  onPress={() => handleLocationSelect(loc)}
                  className="rounded-lg bg-grey-plain-200 px-4 py-2.5"
                >
                  <Text className="font-inter text-sm text-grey-alpha-500">
                    {loc}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </BottomSheetComponent>

        {/* Enter Amount Bottom Sheet */}
        {isAmountSheetMounted && (
          <EnterAmountBottomSheet
            ref={enterAmountSheetRef}
            title="Request lift amount"
            inputLabel="Amount"
            hintText="Enter the amount you want to request"
            onDone={handleAmountDone}
            onClose={handleAmountSheetClose}
            initialAmount={liftAmount > 0 ? liftAmount.toString() : ''}
          />
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
