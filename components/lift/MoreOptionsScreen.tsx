import { useRef, useState } from 'react';
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
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
  CreditCard,
  UserX,
} from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors } from '@/theme/colors';
import { Toggle } from '@/components/ui/Toggle';
import {
  AllowCollaboratorsBottomSheet,
  CalendarBottomSheet,
  CATEGORIES,
  LOCATIONS,
} from '@/components/lift';
import {
  BottomSheetComponent,
  BottomSheetRef,
} from '@/components/ui/BottomSheet';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useLiftDraft } from '@/context/LiftDraftContext';

// All possible setting keys
export type SettingKey =
  | 'category'
  | 'location'
  | 'scheduleLift'
  | 'liftEndDate'
  | 'requestEndDate'
  | 'allowCollaborators'
  | 'allowRequesters'
  | 'autoDebit'
  | 'offerAnonymously';

// Default settings shown (all settings)
const ALL_SETTINGS: SettingKey[] = [
  'category',
  'location',
  'scheduleLift',
  'liftEndDate',
  'allowCollaborators',
  'allowRequesters',
];

interface MoreOptionsScreenProps {
  /** Array of setting keys to show. If not provided, shows default settings */
  visibleSettings?: SettingKey[];
  onBack?: () => void;
}

export default function MoreOptionsScreen({
  visibleSettings = ALL_SETTINGS,
  onBack,
}: MoreOptionsScreenProps) {
  const { category, setCategory, location, setLocation } = useLiftDraft();

  // Helper to check if a setting should be shown
  const showSetting = (key: SettingKey) => visibleSettings.includes(key);

  const [scheduleLift, setScheduleLift] = useState(false);
  const [scheduleDate, setScheduleDate] = useState<Date | null>(null);
  const [liftEndDate, setLiftEndDate] = useState(false);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [requestEndDate, setRequestEndDate] = useState(false);
  const [requestEndDateValue, setRequestEndDateValue] = useState<Date | null>(
    null
  );
  const [allowCollaborators, setAllowCollaborators] = useState(false);
  const [collaboratorLimit, setCollaboratorLimit] = useState<
    'unlimited' | number
  >('unlimited');
  const [allowRequesters, setAllowRequesters] = useState(false);
  const [autoDebit, setAutoDebit] = useState(false);
  const [offerAnonymously, setOfferAnonymously] = useState(false);
  const [showRemoveCollaboratorsDialog, setShowRemoveCollaboratorsDialog] =
    useState(false);
  const [showRemoveRequestersDialog, setShowRemoveRequestersDialog] =
    useState(false);
  const [categorySearch, setCategorySearch] = useState('');
  const [locationSearch, setLocationSearch] = useState('');

  const scheduleSheetRef = useRef<BottomSheetRef>(null);
  const endDateSheetRef = useRef<BottomSheetRef>(null);
  const requestEndDateSheetRef = useRef<BottomSheetRef>(null);
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

  function handleScheduleLiftToggle(value: boolean) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setScheduleLift(value);
    if (value) {
      setTimeout(() => {
        scheduleSheetRef.current?.expand();
      }, 300);
    } else {
      setScheduleDate(null);
    }
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

  function handleRequestEndDateToggle(value: boolean) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setRequestEndDate(value);
    if (value) {
      setTimeout(() => {
        requestEndDateSheetRef.current?.expand();
      }, 300);
    } else {
      setRequestEndDateValue(null);
    }
  }

  function handleRequestEndDateDone(date: Date) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setRequestEndDateValue(date);
  }

  function handleRequestEndDatePress() {
    if (requestEndDate) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      requestEndDateSheetRef.current?.expand();
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

  function handleAutoDebitToggle(value: boolean) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setAutoDebit(value);
  }

  function handleOfferAnonymouslyToggle(value: boolean) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setOfferAnonymously(value);
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
        <Text className="font-inter-semibold text-lg text-grey-alpha-500">
          More options
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        {/* Auto-debit */}
        {showSetting('autoDebit') && (
          <View className="border-b border-grey-plain-450/20 px-4 py-4">
            <View className="flex-row items-center justify-between">
              <View className="flex-1 flex-row items-center gap-3">
                <CreditCard size={24} color={colors['grey-alpha']['500']} />
                <View className="flex-1">
                  <Text className="mb-1 font-inter-semibold text-base text-grey-alpha-500">
                    Auto-debit
                  </Text>
                  <Text className="font-inter text-sm text-grey-alpha-400">
                    First-come-first-serve basis. You won&apos;t need to approve
                    join requests.
                  </Text>
                </View>
              </View>
              <Toggle value={autoDebit} onValueChange={handleAutoDebitToggle} />
            </View>
          </View>
        )}

        {/* Offer lift anonymously */}
        {showSetting('offerAnonymously') && (
          <View className="border-b border-grey-plain-450/20 px-4 py-4">
            <View className="flex-row items-center justify-between">
              <View className="flex-1 flex-row items-center gap-3">
                <UserX size={24} color={colors['grey-alpha']['500']} />
                <View className="flex-1">
                  <Text className="mb-1 font-inter-semibold text-base text-grey-alpha-500">
                    Offer lift anonymously
                  </Text>
                  <Text className="font-inter text-sm text-grey-alpha-400">
                    People who see and join your lift offer won&apos;t know it
                    is you.
                  </Text>
                </View>
              </View>
              <Toggle
                value={offerAnonymously}
                onValueChange={handleOfferAnonymouslyToggle}
              />
            </View>
          </View>
        )}

        {/* Select Category */}
        {showSetting('category') && (
          <View className="border-b border-grey-plain-450/20 px-4 py-4">
            <TouchableOpacity
              onPress={() => categorySheetRef.current?.expand()}
              className="mb-3 flex-row items-center justify-between"
            >
              <View className="flex-row items-center gap-3">
                <Tag size={20} color={colors['grey-alpha']['500']} />
                <Text className="font-inter-medium text-base text-grey-alpha-500">
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
                      className="font-inter-medium text-sm"
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
        {showSetting('location') && (
          <View className="border-b border-grey-plain-450/20 px-4 py-4">
            <TouchableOpacity
              onPress={() => locationSheetRef.current?.expand()}
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
        )}

        {/* Schedule lift */}
        {showSetting('scheduleLift') && (
          <TouchableOpacity
            onPress={handleScheduleLiftPress}
            className="border-b border-grey-plain-450/20 px-4 py-4"
            activeOpacity={scheduleLift ? 0.7 : 1}
          >
            <View className="flex-row items-center justify-between">
              <View className="flex-1 flex-row items-center gap-3">
                <Calendar size={24} color={colors['grey-alpha']['500']} />
                <View className="flex-1">
                  <Text className="mb-1 font-inter-semibold text-base text-grey-alpha-500">
                    Schedule lift
                  </Text>
                  {scheduleLift && scheduleDate ? (
                    <Text className="font-inter-medium text-sm text-grey-alpha-500">
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
                    <Text className="font-inter text-sm text-grey-alpha-400">
                      Choose a start date for your lift.
                    </Text>
                  )}
                </View>
              </View>
              <Toggle value={scheduleLift} onValueChange={handleScheduleLiftToggle} />
            </View>
          </TouchableOpacity>
        )}

        {/* Lift end date */}
        {showSetting('liftEndDate') && (
          <TouchableOpacity
            onPress={handleLiftEndDatePress}
            className="border-b border-grey-plain-450/20 px-4 py-4"
            activeOpacity={liftEndDate ? 0.7 : 1}
          >
            <View className="flex-row items-center justify-between">
              <View className="flex-1 flex-row items-center gap-3">
                <CalendarX size={24} color={colors['grey-alpha']['500']} />
                <View className="flex-1">
                  <Text className="mb-1 font-inter-semibold text-base text-grey-alpha-500">
                    Request end date
                  </Text>
                  {liftEndDate && endDate ? (
                    <Text className="font-inter-medium text-sm text-grey-alpha-500">
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
                    <Text className="font-inter text-sm text-grey-alpha-400">
                      This will end the lift even when the target is not met.
                    </Text>
                  )}
                </View>
              </View>
              <Toggle
                value={liftEndDate}
                onValueChange={handleLiftEndDateToggle}
              />
            </View>
          </TouchableOpacity>
        )}

        {/* Request end date */}
        {showSetting('requestEndDate') && (
          <TouchableOpacity
            onPress={handleRequestEndDatePress}
            className="border-b border-grey-plain-450/20 px-4 py-4"
            activeOpacity={requestEndDate ? 0.7 : 1}
          >
            <View className="flex-row items-center justify-between">
              <View className="flex-1 flex-row items-center gap-3">
                <CalendarX size={24} color={colors['grey-alpha']['500']} />
                <View className="flex-1">
                  <Text className="mb-1 font-inter-semibold text-base text-grey-alpha-500">
                    Request end date
                  </Text>
                  {requestEndDate && requestEndDateValue ? (
                    <Text className="font-inter-medium text-sm text-grey-alpha-500">
                      {requestEndDateValue.toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}{' '}
                      at{' '}
                      {requestEndDateValue.toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true,
                      })}{' '}
                      →
                    </Text>
                  ) : (
                    <Text className="font-inter text-sm text-grey-alpha-400">
                      This will end the request even when the target is not met.
                    </Text>
                  )}
                </View>
              </View>
              <Toggle
                value={requestEndDate}
                onValueChange={handleRequestEndDateToggle}
              />
            </View>
          </TouchableOpacity>
        )}

        {/* Allow collaborators */}
        {showSetting('allowCollaborators') && (
          <TouchableOpacity
            onPress={handleCollaboratorsPress}
            className="border-b border-grey-plain-450/20 px-4 py-4"
            activeOpacity={allowCollaborators ? 0.7 : 1}
          >
            <View className="flex-row items-center justify-between">
              <View className="flex-1 flex-row items-center gap-3">
                <Users size={24} color={colors['grey-alpha']['500']} />
                <View className="flex-1">
                  <Text className="mb-1 font-inter-semibold text-base text-grey-alpha-500">
                    Allow collaborators
                  </Text>
                  {allowCollaborators && collaboratorLimit !== 'unlimited' ? (
                    <Text className="font-inter-medium text-sm text-grey-alpha-500">
                      {collaboratorLimit} →
                    </Text>
                  ) : allowCollaborators ? (
                    <Text className="font-inter-medium text-sm text-grey-alpha-500">
                      {typeof collaboratorLimit === 'number'
                        ? collaboratorLimit
                        : '5'}{' '}
                      →
                    </Text>
                  ) : (
                    <Text className="font-inter text-sm text-grey-alpha-400">
                      Approve people&apos;s request to join you in supporting
                      and raising the lift.
                    </Text>
                  )}
                </View>
              </View>
              <Toggle
                value={allowCollaborators}
                onValueChange={handleAllowCollaboratorsToggle}
              />
            </View>
          </TouchableOpacity>
        )}

        {/* Allow requesters */}
        {showSetting('allowRequesters') && (
          <View className="border-b border-grey-plain-450/20 px-4 py-4">
            <View className="flex-row items-center justify-between">
              <View className="flex-1 flex-row items-center gap-3">
                <Hand size={24} color={colors['grey-alpha']['500']} />
                <View className="flex-1">
                  <Text className="mb-1 font-inter-semibold text-base text-grey-alpha-500">
                    Allow requesters
                  </Text>
                  <Text className="font-inter text-sm text-grey-alpha-400">
                    Approve people&apos;s request to join and benefit from the
                    lift you are raising.
                  </Text>
                </View>
              </View>
              <Toggle
                value={allowRequesters}
                onValueChange={handleAllowRequestersToggle}
              />
            </View>
          </View>
        )}
      </ScrollView>

      {/* Schedule Request Bottom Sheet */}
      {showSetting('scheduleLift') && (
        <CalendarBottomSheet
          ref={scheduleSheetRef}
          onDone={handleScheduleDone}
          title={'Schedule Lift'}
          initialDate={scheduleDate || undefined}
        />
      )}

      {/* Lift End Date Bottom Sheet */}
      {showSetting('liftEndDate') && (
        <CalendarBottomSheet
          ref={endDateSheetRef}
          onDone={handleEndDateDone}
          title={'Lift End Date'}
          initialDate={endDate || undefined}
        />
      )}

      {/* Request End Date Bottom Sheet */}
      {showSetting('requestEndDate') && (
        <CalendarBottomSheet
          ref={requestEndDateSheetRef}
          title={'Request End Date'}
          onDone={handleRequestEndDateDone}
          initialDate={requestEndDateValue || undefined}
        />
      )}

      {/* Allow Collaborators Bottom Sheet */}
      {showSetting('allowCollaborators') && (
        <AllowCollaboratorsBottomSheet
          ref={collaboratorsSheetRef}
          currentLimit={collaboratorLimit}
          onDone={handleCollaboratorLimitDone}
        />
      )}

      {/* Remove Collaborators Confirmation */}
      {showSetting('allowCollaborators') && (
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
      )}

      {/* Remove Requesters Confirmation */}
      {showSetting('allowRequesters') && (
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
      )}

      {/* Category Bottom Sheet */}
      {showSetting('category') && (
        <BottomSheetComponent ref={categorySheetRef} snapPoints={['70%']}>
          <View className="px-4 pb-4">
            <Text className="mb-4 font-inter-bold text-lg text-grey-alpha-500">
              Choose category
            </Text>

            {/* Search Input */}
            <View className="mb-4 flex-row items-center gap-3 rounded-full border border-grey-plain-450 bg-grey-plain-200 px-4 py-3">
              <Search size={20} color={colors['grey-alpha']['400']} />
              <TextInput
                value={categorySearch}
                onChangeText={setCategorySearch}
                placeholder="Search for category"
                placeholderTextColor={colors['grey-alpha']['400']}
                className="flex-1 font-inter text-base text-grey-alpha-500"
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
                  <Text className="font-inter text-base text-grey-alpha-500">
                    {cat}
                  </Text>
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
      {showSetting('location') && (
        <BottomSheetComponent ref={locationSheetRef} snapPoints={['70%']}>
          <View className="px-4 pb-4">
            <Text className="mb-4 font-inter-bold text-lg text-grey-alpha-500">
              Choose location
            </Text>

            {/* Search Input */}
            <View className="mb-4 flex-row items-center gap-3 rounded-full border border-grey-plain-450 bg-grey-plain-200 px-4 py-3">
              <Search size={20} color={colors['grey-alpha']['400']} />
              <TextInput
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
      )}
    </SafeAreaView>
  );
}
