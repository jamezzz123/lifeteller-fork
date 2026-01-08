import { useRef, useState } from 'react';
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Switch,
  TextInput,
} from 'react-native';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import {
  ChevronLeft,
  Calendar,
  CalendarX,
  Users,
  Hand,
  Tag,
  MapPin,
  ChevronRight,
  Search,
} from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors } from '@/theme/colors';
import {
  AllowCollaboratorsBottomSheet,
  ScheduleRequestBottomSheet,
  CATEGORIES,
  LOCATIONS,
} from '@/components/lift';
import {
  BottomSheetComponent,
  BottomSheetRef,
} from '@/components/ui/BottomSheet';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useLiftDraft } from '@/context/LiftDraftContext';

interface MoreOptionsScreenProps {
  showCategoryAndLocation?: boolean;
  onBack?: () => void;
}

export default function MoreOptionsScreen({
  showCategoryAndLocation = true,
  onBack,
}: MoreOptionsScreenProps) {
  const { category, setCategory, location, setLocation } = useLiftDraft();

  const [scheduleLift] = useState(false);
  const [scheduleDate, setScheduleDate] = useState<Date | null>(null);
  const [liftEndDate, setLiftEndDate] = useState(false);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [allowCollaborators, setAllowCollaborators] = useState(false);
  const [collaboratorLimit, setCollaboratorLimit] = useState<
    'unlimited' | number
  >('unlimited');
  const [allowRequesters, setAllowRequesters] = useState(false);
  const [showRemoveCollaboratorsDialog, setShowRemoveCollaboratorsDialog] =
    useState(false);
  const [showRemoveRequestersDialog, setShowRemoveRequestersDialog] =
    useState(false);
  const [categorySearch, setCategorySearch] = useState('');
  const [locationSearch, setLocationSearch] = useState('');

  const scheduleSheetRef = useRef<BottomSheetRef>(null);
  const endDateSheetRef = useRef<BottomSheetRef>(null);
  const collaboratorsSheetRef = useRef<BottomSheetRef>(null);
  const categorySheetRef = useRef<BottomSheetRef>(null);
  const locationSheetRef = useRef<BottomSheetRef>(null);

  function handleScheduleDone(date: Date) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setScheduleDate(date);
  }

  function handleLiftEndDateToggle(value: boolean) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setLiftEndDate(value);
    if (value) {
      setTimeout(() => {
        endDateSheetRef.current?.expand();
      }, 300);
    } else {
      setEndDate(null);
    }
  }

  function handleEndDateDone(date: Date) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setEndDate(date);
  }

  function handleScheduleLiftPress() {
    if (scheduleLift) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      scheduleSheetRef.current?.expand();
    }
  }

  function handleLiftEndDatePress() {
    if (liftEndDate) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      endDateSheetRef.current?.expand();
    }
  }

  function handleAllowCollaboratorsToggle(value: boolean) {
    if (!value && allowCollaborators) {
      setShowRemoveCollaboratorsDialog(true);
    } else {
      setAllowCollaborators(value);
      if (value) {
        setTimeout(() => {
          collaboratorsSheetRef.current?.expand();
        }, 300);
      }
    }
  }

  function handleConfirmRemoveCollaborators() {
    setAllowCollaborators(false);
    setShowRemoveCollaboratorsDialog(false);
  }

  function handleCancelRemoveCollaborators() {
    setShowRemoveCollaboratorsDialog(false);
  }

  function handleAllowRequestersToggle(value: boolean) {
    if (!value && allowRequesters) {
      setShowRemoveRequestersDialog(true);
    } else {
      setAllowRequesters(value);
    }
  }

  function handleConfirmRemoveRequesters() {
    setAllowRequesters(false);
    setShowRemoveRequestersDialog(false);
  }

  function handleCancelRemoveRequesters() {
    setShowRemoveRequestersDialog(false);
  }

  function handleCollaboratorLimitDone(limit: 'unlimited' | number) {
    setCollaboratorLimit(limit);
    collaboratorsSheetRef.current?.close();
  }

  function handleCollaboratorsPress() {
    if (allowCollaborators) {
      collaboratorsSheetRef.current?.expand();
    }
  }

  const filteredCategories = CATEGORIES.filter((cat) =>
    cat.toLowerCase().includes(categorySearch.toLowerCase())
  );

  const filteredLocations = LOCATIONS.filter((loc) =>
    loc.toLowerCase().includes(locationSearch.toLowerCase())
  );

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

  function handleGoBack() {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'bottom']}>
      {/* Header */}
      <View className="flex-row items-center gap-3 border-b border-grey-plain-450/20 px-4 py-4">
        <TouchableOpacity onPress={handleGoBack} hitSlop={10}>
          <ChevronLeft
            size={24}
            color={colors['grey-alpha']['500']}
            strokeWidth={2}
          />
        </TouchableOpacity>
        <Text className="text-lg font-semibold text-grey-alpha-500">
          More options
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        {/* Select Category */}
        {showCategoryAndLocation && (
          <View className="border-b border-grey-plain-450/20 px-4 py-4">
            <TouchableOpacity
              onPress={() => categorySheetRef.current?.expand()}
              className="mb-3 flex-row items-center justify-between"
            >
              <View className="flex-row items-center gap-3">
                <Tag size={20} color={colors['grey-alpha']['500']} />
                <Text className="text-base font-medium text-grey-alpha-500">
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
                      className="text-sm font-medium"
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
        )}

        {/* Location */}
        {showCategoryAndLocation && (
          <View className="border-b border-grey-plain-450/20 px-4 py-4">
            <TouchableOpacity
              onPress={() => locationSheetRef.current?.expand()}
              className="mb-3 flex-row items-center justify-between"
            >
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
        )}

        {/* Schedule lift */}
        <TouchableOpacity
          onPress={handleScheduleLiftPress}
          className="border-b border-grey-plain-450/20 px-4 py-4"
          activeOpacity={scheduleLift ? 0.7 : 1}
        >
          <View className="flex-row items-center justify-between">
            <View className="flex-1 flex-row items-center gap-3">
              <Calendar size={24} color={colors['grey-alpha']['500']} />
              <View className="flex-1">
                <Text className="mb-1 text-base font-semibold text-grey-alpha-500">
                  Schedule lift
                </Text>
                {scheduleLift && scheduleDate ? (
                  <Text className="text-sm font-medium text-grey-alpha-500">
                    {scheduleDate.toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}{' '}
                    at{' '}
                    {scheduleDate.toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true,
                    })}{' '}
                    →
                  </Text>
                ) : (
                  <Text className="text-sm text-grey-alpha-400">
                    Choose a start date for your lift.
                  </Text>
                )}
              </View>
            </View>
            <Switch
              value={scheduleLift}
              trackColor={{
                false: colors['grey-plain']['450'],
                true: colors.primary.purple,
              }}
              thumbColor={colors['grey-plain']['50']}
            />
          </View>
        </TouchableOpacity>

        {/* Lift end date */}
        <TouchableOpacity
          onPress={handleLiftEndDatePress}
          className="border-b border-grey-plain-450/20 px-4 py-4"
          activeOpacity={liftEndDate ? 0.7 : 1}
        >
          <View className="flex-row items-center justify-between">
            <View className="flex-1 flex-row items-center gap-3">
              <CalendarX size={24} color={colors['grey-alpha']['500']} />
              <View className="flex-1">
                <Text className="mb-1 text-base font-semibold text-grey-alpha-500">
                  Lift end date
                </Text>
                {liftEndDate && endDate ? (
                  <Text className="text-sm font-medium text-grey-alpha-500">
                    {endDate.toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}{' '}
                    at{' '}
                    {endDate.toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true,
                    })}{' '}
                    →
                  </Text>
                ) : (
                  <Text className="text-sm text-grey-alpha-400">
                    This will end the lift even when the target is not met.
                  </Text>
                )}
              </View>
            </View>
            <Switch
              value={liftEndDate}
              onValueChange={handleLiftEndDateToggle}
              trackColor={{
                false: colors['grey-plain']['450'],
                true: colors.primary.purple,
              }}
              thumbColor={colors['grey-plain']['50']}
            />
          </View>
        </TouchableOpacity>

        {/* Allow collaborators */}
        <TouchableOpacity
          onPress={handleCollaboratorsPress}
          className="border-b border-grey-plain-450/20 px-4 py-4"
          activeOpacity={allowCollaborators ? 0.7 : 1}
        >
          <View className="flex-row items-center justify-between">
            <View className="flex-1 flex-row items-center gap-3">
              <Users size={24} color={colors['grey-alpha']['500']} />
              <View className="flex-1">
                <Text className="mb-1 text-base font-semibold text-grey-alpha-500">
                  Allow collaborators
                </Text>
                {allowCollaborators && collaboratorLimit !== 'unlimited' ? (
                  <Text className="text-sm font-medium text-grey-alpha-500">
                    {collaboratorLimit} →
                  </Text>
                ) : allowCollaborators ? (
                  <Text className="text-sm font-medium text-grey-alpha-500">
                    {typeof collaboratorLimit === 'number'
                      ? collaboratorLimit
                      : '5'}{' '}
                    →
                  </Text>
                ) : (
                  <Text className="text-sm text-grey-alpha-400">
                    Approve people&apos;s request to join you in supporting and
                    raising the lift.
                  </Text>
                )}
              </View>
            </View>
            <Switch
              value={allowCollaborators}
              onValueChange={handleAllowCollaboratorsToggle}
              trackColor={{
                false: colors['grey-plain']['450'],
                true: colors.primary.purple,
              }}
              thumbColor={colors['grey-plain']['50']}
            />
          </View>
        </TouchableOpacity>

        {/* Allow requesters */}
        <View className="border-b border-grey-plain-450/20 px-4 py-4">
          <View className="flex-row items-center justify-between">
            <View className="flex-1 flex-row items-center gap-3">
              <Hand size={24} color={colors['grey-alpha']['500']} />
              <View className="flex-1">
                <Text className="mb-1 text-base font-semibold text-grey-alpha-500">
                  Allow requesters
                </Text>
                <Text className="text-sm text-grey-alpha-400">
                  Approve people&apos;s request to join and benefit from the
                  lift you are raising.
                </Text>
              </View>
            </View>
            <Switch
              value={allowRequesters}
              onValueChange={handleAllowRequestersToggle}
              trackColor={{
                false: colors['grey-plain']['450'],
                true: colors.primary.purple,
              }}
              thumbColor={colors['grey-plain']['50']}
            />
          </View>
        </View>
      </ScrollView>

      {/* Schedule Request Bottom Sheet */}
      <ScheduleRequestBottomSheet
        ref={scheduleSheetRef}
        onDone={handleScheduleDone}
        initialDate={scheduleDate || undefined}
      />

      {/* End Date Bottom Sheet */}
      <ScheduleRequestBottomSheet
        ref={endDateSheetRef}
        onDone={handleEndDateDone}
        initialDate={endDate || undefined}
      />

      {/* Allow Collaborators Bottom Sheet */}
      <AllowCollaboratorsBottomSheet
        ref={collaboratorsSheetRef}
        currentLimit={collaboratorLimit}
        onDone={handleCollaboratorLimitDone}
      />

      {/* Remove Collaborators Confirmation */}
      <ConfirmDialog
        visible={showRemoveCollaboratorsDialog}
        title="Remove collaborators"
        message="Are you sure you want to remove this collaborators?"
        confirmText="Yes, remove"
        cancelText="No, go back"
        onConfirm={handleConfirmRemoveCollaborators}
        onCancel={handleCancelRemoveCollaborators}
        destructive
      />

      {/* Remove Requesters Confirmation */}
      <ConfirmDialog
        visible={showRemoveRequestersDialog}
        title="Don't allow requesters"
        message="People won't be able to join your lift as a beneficiary."
        confirmText="Yes, remove requesters"
        cancelText="No, go back"
        onConfirm={handleConfirmRemoveRequesters}
        onCancel={handleCancelRemoveRequesters}
        destructive
      />

      {/* Category Bottom Sheet */}
      {showCategoryAndLocation && (
        <BottomSheetComponent ref={categorySheetRef} snapPoints={['70%']}>
          <View className="px-4 pb-4">
            <Text className="mb-4 text-lg font-bold text-grey-alpha-500">
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
      )}

      {/* Location Bottom Sheet */}
      {showCategoryAndLocation && (
        <BottomSheetComponent ref={locationSheetRef} snapPoints={['70%']}>
          <View className="px-4 pb-4">
            <Text className="mb-4 text-lg font-bold text-grey-alpha-500">
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
              <Text className="text-base font-medium text-grey-alpha-500">
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
      )}
    </SafeAreaView>
  );
}
