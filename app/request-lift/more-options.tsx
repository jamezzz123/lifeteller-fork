import { useRef, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import {
  ChevronLeft,
  Calendar,
  CalendarX,
  Users,
  Hand,
} from 'lucide-react-native';

import { colors } from '@/theme/colors';
import { Toggle } from '@/components/ui/Toggle';
import {
  AllowCollaboratorsBottomSheet,
  ScheduleRequestBottomSheet,
} from '@/components/lift';
import { BottomSheetRef } from '@/components/ui/BottomSheet';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';

export default function MoreOptionsScreen() {
  const [scheduleLift,] = useState(false);
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

  const scheduleSheetRef = useRef<BottomSheetRef>(null);
  const endDateSheetRef = useRef<BottomSheetRef>(null);
  const collaboratorsSheetRef = useRef<BottomSheetRef>(null);

  // function handleScheduleLiftToggle(value: boolean) {

  //   Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  //   setScheduleLift(value);
  //   if (value) {
  //     // Open schedule picker when toggled on
  //     setTimeout(() => {
  //       scheduleSheetRef.current?.expand();
  //     }, 300);
  //   } else {
  //     setScheduleDate(null);
  //   }
  // }

  function handleScheduleDone(date: Date) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setScheduleDate(date);
  }

  function handleLiftEndDateToggle(value: boolean) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setLiftEndDate(value);
    if (value) {
      // Open end date picker when toggled on
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
      // Show confirmation dialog when turning off
      setShowRemoveCollaboratorsDialog(true);
    } else {
      setAllowCollaborators(value);
      if (value) {
        // Open bottom sheet when toggled on
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
      // Show confirmation dialog when turning off
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

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center gap-3 border-b border-grey-plain-450/20 px-4 py-4">
        <TouchableOpacity onPress={() => router.back()} hitSlop={10}>
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
            <Toggle
              value={scheduleLift}
              onValueChange={() => {}}
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
            <Toggle
              value={liftEndDate}
              onValueChange={handleLiftEndDateToggle}
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
            <Toggle
              value={allowCollaborators}
              onValueChange={handleAllowCollaboratorsToggle}
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
            <Toggle
              value={allowRequesters}
              onValueChange={handleAllowRequestersToggle}
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
    </View>
  );
}
