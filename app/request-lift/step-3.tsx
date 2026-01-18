import { useEffect, useState, useCallback, useRef } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Switch,
} from 'react-native';
import { Image } from 'expo-image';
import { router, type Href } from 'expo-router';
import * as Haptics from 'expo-haptics';
import {
  ChevronRight,
  MapPin,
  Search,
  Tag,
  MoreHorizontal,
  UserPlus,
} from 'lucide-react-native';

import { colors } from '@/theme/colors';
import {
  CATEGORIES,
  LOCATIONS,
  AddCollaboratorsModal,
  AudienceBottomSheet,
  ChooseFromListModal,
  ChooseListBottomSheet,
  Contact,
  CreateListModal,
} from '@/components/lift';
import {
  useRequestLift,
  AudienceOfferType,
  List,
} from '@/context/request-lift';
import {
  BottomSheetComponent,
  BottomSheetRef,
} from '@/components/ui/BottomSheet';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Dropdown } from '@/components/ui/Dropdown';

export default function Step3Screen() {
  const {
    liftTitle,
    liftDescription,
    liftAmount,
    liftItems,
    category,
    setCategory,
    location,
    setLocation,
    collaborators,
    setCollaborators,
    audienceOfferType,
    setAudienceOfferType,
    selectedPeopleForAudience,
    setSelectedPeopleForAudience,
    selectedList,
    setSelectedList,
    setHeaderTitle,
    setNextButtonLabel,
    setCanProceed,
    onNextRef,
  } = useRequestLift();

  const [categorySearch, setCategorySearch] = useState('');
  const [locationSearch, setLocationSearch] = useState('');
  const [addCollaboratorsEnabled, setAddCollaboratorsEnabled] = useState(false);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);

  // Audience states
  const [showSelectedPeopleModal, setShowSelectedPeopleModal] = useState(false);
  const [showChooseListModal, setShowChooseListModal] = useState(false);
  const [showCreateListModal, setShowCreateListModal] = useState(false);

  const categorySheetRef = useRef<BottomSheetRef>(null);
  const locationSheetRef = useRef<BottomSheetRef>(null);
  const audienceSheetRef = useRef<BottomSheetRef>(null);
  const chooseListSheetRef = useRef<BottomSheetRef>(null);

  const filteredCategories = CATEGORIES.filter((cat) =>
    cat.toLowerCase().includes(categorySearch.toLowerCase())
  );

  const filteredLocations = LOCATIONS.filter((loc) =>
    loc.toLowerCase().includes(locationSearch.toLowerCase())
  );

  const isValid = category.length > 0 && location.length > 0;

  const handleNext = useCallback(() => {
    if (!isValid) return;
    router.push('/request-lift/step-4' as Href);
  }, [isValid]);

  useEffect(() => {
    // Set custom header for this step
    setHeaderTitle('Lift settings');
    setNextButtonLabel('Preview');
    setCanProceed(isValid);
    onNextRef.current = handleNext;
    return () => {
      onNextRef.current = null;
    };
  }, [
    isValid,
    setCanProceed,
    handleNext,
    onNextRef,
    setHeaderTitle,
    setNextButtonLabel,
  ]);

  // Auto-navigate to collaborators page when toggle is turned on
  useEffect(() => {
    if (addCollaboratorsEnabled && collaborators.length === 0) {
      const timer = setTimeout(() => {
        router.push('/request-lift/add-collaborators' as any);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [addCollaboratorsEnabled, collaborators.length]);

  function handleCategorySelect(cat: string) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCategory(cat);
    categorySheetRef.current?.close();
    setCategorySearch('');
  }

  function handleLocationSelect(loc: string) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setLocation(loc);
    locationSheetRef.current?.close();
    setLocationSearch('');
  }

  function handleNavigateToCollaborators() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/request-lift/add-collaborators' as any);
  }

  function handleToggleCollaborators(enabled: boolean) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (!enabled && collaborators.length > 0) {
      // Show confirmation dialog if there are collaborators
      setShowRemoveConfirm(true);
    } else {
      setAddCollaboratorsEnabled(enabled);
    }
  }

  function handleConfirmRemove() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setCollaborators([]);
    setAddCollaboratorsEnabled(false);
    setShowRemoveConfirm(false);
  }

  function handleCancelRemove() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowRemoveConfirm(false);
  }

  // Format collaborators display
  const getCollaboratorsDisplay = () => {
    if (collaborators.length === 0) return '';
    if (collaborators.length === 1) return collaborators[0].name;
    const firstName = collaborators[0].name;
    const othersCount = collaborators.length - 1;
    return `${firstName} and ${othersCount} ${othersCount === 1 ? 'other' : 'others'}`;
  };

  // Handle audience selection
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
    // Create a new list (in real app, this would save to backend)
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

  function handleAudienceButtonPress() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    audienceSheetRef.current?.expand();
  }

  // Get audience display label
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
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View className="flex-1 bg-white">
        <ScrollView
          className="flex-1"
          keyboardShouldPersistTaps="handled"
          contentContainerClassName="flex-grow pb-8"
          showsVerticalScrollIndicator={false}
        >
          {/* Summary Section */}
          <View className="border-b border-grey-plain-450/20 px-4 py-4">
            {/* User Avatar and Audience */}
            <View className="mb-3 flex-row items-center gap-3">
              <Image
                source={require('../../assets/images/welcome/collage-1.jpg')}
                style={{ width: 48, height: 48, borderRadius: 24 }}
                contentFit="cover"
              />
              <Dropdown
                label={getAudienceLabel()}
                onPress={handleAudienceButtonPress}
              />
            </View>

            {/* Title */}
            <Text className="mb-2 text-xl font-inter-bold text-grey-alpha-500">
              {liftTitle || 'Untitled'}
            </Text>

            {/* Description */}
            <Text
              className="mb-3 text-sm text-grey-alpha-400"
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {liftDescription || 'No description'}
            </Text>

            {/* Lift Type Info */}
            {(liftAmount > 0 || liftItems.length > 0) && (
              <View className="flex-row flex-wrap gap-1">
                <View
                  className="rounded-full px-3 py-1"
                  style={{ backgroundColor: '#F8F8F8' }}
                >
                  <Text className="text-xs font-inter-medium text-black">
                    4 Images/Videos
                  </Text>
                </View>
                {liftAmount > 0 && (
                  <View
                    className="rounded-full px-3 py-1"
                    style={{ backgroundColor: '#F8F8F8' }}
                  >
                    <Text className="text-xs font-inter-medium text-black">
                      ₦{liftAmount.toLocaleString()}
                    </Text>
                  </View>
                )}
                {liftItems.map((item, index) => (
                  <View
                    key={item.id}
                    className="rounded-full px-3 py-1"
                    style={{ backgroundColor: '#F8F8F8' }}
                  >
                    <Text className="text-xs font-inter-medium text-black">
                      {item.name || `Item ${index + 1}`} ({item.quantity})
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Select Category */}
          <View className="border-b border-grey-plain-450/20 px-4 py-4">
            <TouchableOpacity
              onPress={() => categorySheetRef.current?.expand()}
              className="mb-3 flex-row items-center justify-between"
            >
              <View className="flex-row items-center gap-3">
                <Tag size={20} color={colors['grey-alpha']['500']} />
                <Text className="text-base font-inter-medium text-grey-alpha-500">
                  Select category
                </Text>
              </View>
              <ChevronRight
                size={20}
                color={colors['grey-alpha']['400']}
                strokeWidth={2}
              />
            </TouchableOpacity>

            {/* Category chips */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 8 }}
            >
              {CATEGORIES.map((cat) => {
                const isSelected = category === cat;
                return (
                  <TouchableOpacity
                    key={cat}
                    onPress={() => setCategory(cat)}
                    className="rounded-lg px-4 py-2.5"
                    style={{
                      backgroundColor: isSelected
                        ? colors['primary-tints'].purple['100']
                        : colors['grey-plain']['150'],
                    }}
                  >
                    <Text
                      className="text-sm font-inter-medium"
                      style={{
                        color: isSelected
                          ? colors.primary.purple
                          : colors['grey-alpha']['500'],
                      }}
                    >
                      {cat}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* Location */}
          <View className="border-b border-grey-plain-450/20 px-4 py-4">
            <TouchableOpacity
              onPress={() => locationSheetRef.current?.expand()}
              className="mb-3 flex-row items-center justify-between"
            >
              <View className="flex-row items-center gap-3">
                <MapPin size={20} color={colors['grey-alpha']['500']} />
                <Text className="text-base font-inter-medium text-grey-alpha-500">
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
              {LOCATIONS.map((loc) => {
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
                      className="text-sm"
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

          {/* Add Collaborators */}
          <View className="border-b border-grey-plain-450/20 px-4 py-4">
            {!addCollaboratorsEnabled || collaborators.length === 0 ? (
              <View className="flex-row items-start justify-between">
                <View className="flex-1 flex-row gap-3">
                  <UserPlus size={20} color={colors['grey-alpha']['500']} />
                  <View className="flex-1">
                    <Text className="mb-1 text-base font-inter-semibold text-grey-alpha-500">
                      Add collaborators
                    </Text>
                    <Text className="text-sm text-grey-alpha-400">
                      Add people to join you in raising the lift. They have to
                      approve your request.
                    </Text>
                  </View>
                </View>
                <Switch
                  value={addCollaboratorsEnabled}
                  onValueChange={handleToggleCollaborators}
                  trackColor={{
                    false: colors['grey-plain']['450'],
                    true: colors.primary.purple,
                  }}
                  thumbColor={colors['grey-plain']['50']}
                />
              </View>
            ) : (
              <TouchableOpacity
                onPress={handleNavigateToCollaborators}
                className="flex-row items-center justify-between"
              >
                <View className="flex-1 flex-row items-center gap-3">
                  <UserPlus size={20} color={colors['grey-alpha']['500']} />
                  <View className="flex-1 flex-row items-center gap-2">
                    <Image
                      source={collaborators[0].avatar}
                      style={{ width: 32, height: 32, borderRadius: 16 }}
                      contentFit="cover"
                    />
                    <Text className="flex-1 text-base font-inter-medium text-grey-alpha-500">
                      {getCollaboratorsDisplay()}
                    </Text>
                  </View>
                </View>
                <View className="flex-row items-center gap-2">
                  <Switch
                    value={addCollaboratorsEnabled}
                    onValueChange={handleToggleCollaborators}
                    trackColor={{
                      false: colors['grey-plain']['450'],
                      true: colors.primary.purple,
                    }}
                    thumbColor={colors['grey-plain']['50']}
                  />
                </View>
              </TouchableOpacity>
            )}
          </View>

          {/* More Options (Audience) */}
          {/* <View className="border-b border-grey-plain-450/20 px-4 py-4">
          <TouchableOpacity
            onPress={() => audienceSheetRef.current?.expand()}
            className="flex-row items-center justify-between"
          >
            <View className="flex-row items-center gap-3">
              <MoreHorizontal size={20} color={colors['grey-alpha']['500']} />
              <Text className="text-base font-inter-medium text-grey-alpha-500">
                More options (Audience)
              </Text>
            </View>
            <ChevronRight
              size={20}
              color={colors['grey-alpha']['400']}
              strokeWidth={2}
            />
          </TouchableOpacity>
        </View> */}

          {/* More Options (Settings) */}
          <View className="px-4 py-4">
            <TouchableOpacity
              onPress={() => router.push('/request-lift/more-options')}
              className="flex-row items-center justify-between"
            >
              <View className="flex-row items-center gap-3">
                <MoreHorizontal size={20} color={colors['grey-alpha']['500']} />
                <Text className="text-base font-inter-medium text-grey-alpha-500">
                  More options
                </Text>
              </View>
              <ChevronRight
                size={20}
                color={colors['grey-alpha']['400']}
                strokeWidth={2}
              />
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Category Bottom Sheet */}
        <BottomSheetComponent ref={categorySheetRef} snapPoints={['70%']}>
          <View className="px-4 pb-4">
            <Text className="mb-4 text-lg font-inter-bold text-grey-alpha-500">
              Choose category
            </Text>

            {/* Search Input */}
            <View className="bg-grey-plain-200 mb-4 flex-row items-center gap-3 rounded-full border border-grey-plain-450 px-4 py-3">
              <Search size={20} color={colors['grey-alpha']['400']} />
              <TextInput
                value={categorySearch}
                onChangeText={setCategorySearch}
                placeholder="Search for category"
                placeholderTextColor={colors['grey-alpha']['400']}
                className="flex-1 text-base text-grey-alpha-500"
              />
            </View>

            {/* Category List */}
            <ScrollView className="max-h-96">
              {filteredCategories.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  onPress={() => handleCategorySelect(cat)}
                  className="flex-row items-center justify-between border-b border-grey-plain-450/20 py-4"
                >
                  <Text className="text-base text-grey-alpha-500">{cat}</Text>
                  <ChevronRight
                    size={20}
                    color={colors['grey-alpha']['400']}
                    strokeWidth={2}
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </BottomSheetComponent>

        {/* Location Bottom Sheet */}
        <BottomSheetComponent ref={locationSheetRef} snapPoints={['70%']}>
          <View className="px-4 pb-4">
            <Text className="mb-4 text-lg font-inter-bold text-grey-alpha-500">
              Choose location
            </Text>

            {/* Search Input */}
            <View className="bg-grey-plain-200 mb-4 flex-row items-center gap-3 rounded-full border border-grey-plain-450 px-4 py-3">
              <Search size={20} color={colors['grey-alpha']['400']} />
              <TextInput
                value={locationSearch}
                onChangeText={setLocationSearch}
                placeholder="Search for location"
                placeholderTextColor={colors['grey-alpha']['400']}
                className="flex-1 text-base text-grey-alpha-500"
              />
            </View>

            {/* Get Location Button */}
            <TouchableOpacity className="bg-grey-plain-200 mb-4 flex-row items-center gap-3 rounded-2xl px-4 py-4">
              <View className="size-10 items-center justify-center rounded-full bg-grey-plain-450/20">
                <MapPin size={20} color={colors['grey-alpha']['500']} />
              </View>
              <Text className="text-base font-inter-medium text-grey-alpha-500">
                Get my location on map
              </Text>
            </TouchableOpacity>

            {/* Location Chips */}
            <View className="mb-4 flex-row flex-wrap gap-2">
              {filteredLocations.map((loc) => (
                <TouchableOpacity
                  key={loc}
                  onPress={() => handleLocationSelect(loc)}
                  className="bg-grey-plain-200 rounded-lg px-4 py-2.5"
                >
                  <Text className="text-sm text-grey-alpha-500">{loc}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </BottomSheetComponent>

        {/* Remove Collaborators Confirmation */}
        <ConfirmDialog
          visible={showRemoveConfirm}
          title="Are you sure you want to remove all collaborators?"
          message='They can still request to join and support your lift if you enable the "Allow collaborators" settings.'
          confirmText="Yes, remove"
          cancelText="No, go back"
          onConfirm={handleConfirmRemove}
          onCancel={handleCancelRemove}
          destructive
        />

        {/* Audience Bottom Sheet */}
        <AudienceBottomSheet
          ref={audienceSheetRef}
          selectedKey={audienceOfferType}
          onSelectAudience={(key) => handleAudienceSelect(key as AudienceOfferType)}
        />

        {/* Selected People Modal (for "Selected people" audience) */}
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
      </View>
    </KeyboardAvoidingView>
  );
}
