import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Switch,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import {
  MapPin,
  MoreHorizontal,
  ChevronRight,
  CornerUpLeft,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

import { colors } from '@/theme/colors';
import { Button } from '@/components/ui/Button';
import { Dropdown } from '@/components/ui/Dropdown';
import { BottomSheetRef } from '@/components/ui/BottomSheet';
import {
  AudienceBottomSheet,
  AddCollaboratorsModal,
  ChooseListBottomSheet,
  ChooseFromListModal,
  CreateListModal,
  Contact,
  LOCATIONS,
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
  } = useRequestLift();

  const [description, setDescription] = useState('');
  const [requestLiftEnabled, setRequestLiftEnabled] = useState(true);
  const [showSelectedPeopleModal, setShowSelectedPeopleModal] = useState(false);
  const [showChooseListModal, setShowChooseListModal] = useState(false);
  const [showCreateListModal, setShowCreateListModal] = useState(false);

  const audienceSheetRef = useRef<BottomSheetRef>(null);
  const chooseListSheetRef = useRef<BottomSheetRef>(null);

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
            <Text className="text-lg font-medium text-grey-plain-550">
              New lift clip
            </Text>
          </TouchableOpacity>
          <View style={{ width: 80 }}>
            <Button title="Next" onPress={handleNext} size="small" />
          </View>
        </View>

        <ScrollView
          className="flex-1"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Profile and Audience */}
          <View className="flex-row items-center gap-3 px-4 py-4">
            <Image
              source={require('../../assets/images/welcome/collage-1.jpg')}
              style={{ width: 48, height: 48, borderRadius: 24 }}
            />
            <Dropdown label={getAudienceLabel()} onPress={handleAudienceButtonPress} />
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
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="This is the description of the lift, and it continues here. It should be short, concise, and brief. Even though we have little to no control over it. Users can also tag people to it."
              placeholderTextColor={colors['grey-alpha']['400']}
              multiline
              numberOfLines={4}
              className="text-sm text-grey-alpha-500"
              style={{
                minHeight: 80,
                textAlignVertical: 'top',
              }}
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
              <Text className="text-primary-purple text-sm font-medium">
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
              <Text className="text-sm font-medium text-grey-alpha-500">
                Link an existing lift
              </Text>
            </TouchableOpacity>
          )}
          {/* Location */}
          <View className="border-t border-grey-plain-150 px-4 py-4">
            <TouchableOpacity className="mb-3 flex-row items-center justify-between">
              <View className="flex-row items-center gap-3">
                <MapPin size={20} color={colors['grey-alpha']['500']} />
                <Text className="text-base font-medium text-grey-alpha-500">
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
          {/* Request lift toggle */}
          <View className="border-t border-grey-plain-150 px-4 py-4">
            <View className="flex-row items-start justify-between">
              <View className="flex-1 flex-row gap-3">
                <View
                  className="size-6 items-center justify-center rounded-full"
                  style={{ backgroundColor: colors['grey-plain']['150'] }}
                >
                  <MapPin size={14} color={colors['grey-alpha']['500']} />
                </View>
                <View className="flex-1">
                  <Text className="mb-1 text-base font-semibold text-grey-alpha-500">
                    Request lift
                  </Text>
                  <Text className="text-sm text-grey-alpha-400">
                    People can offer you lift when they see your lift clip
                  </Text>
                </View>
              </View>
              <Switch
                value={requestLiftEnabled}
                onValueChange={setRequestLiftEnabled}
                trackColor={{
                  false: colors['grey-plain']['450'],
                  true: colors.primary.purple,
                }}
                thumbColor={colors['grey-plain']['50']}
              />
            </View>
          </View>
          {/* More options */}
          <View className="border-t border-grey-plain-150 px-4 py-4">
            <TouchableOpacity className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-3">
                <MoreHorizontal size={20} color={colors['grey-alpha']['500']} />
                <Text className="text-base font-medium text-grey-alpha-500">
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

        {/* Audience Bottom Sheet */}
        <AudienceBottomSheet
          ref={audienceSheetRef}
          selectedKey={audienceOfferType}
          onSelectAudience={(key) => handleAudienceSelect(key as AudienceOfferType)}
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
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
