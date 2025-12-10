import { useRef, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View, Switch } from 'react-native';
import { router } from 'expo-router';
import { ChevronLeft, Calendar, CalendarX, Users, Hand } from 'lucide-react-native';

import { colors } from '@/theme/colors';
import { AllowCollaboratorsBottomSheet } from '@/components/request-lift';
import { BottomSheetRef } from '@/components/ui/BottomSheet';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';

export default function MoreOptionsScreen() {
  const [scheduleLift, setScheduleLift] = useState(false);
  const [liftEndDate, setLiftEndDate] = useState(false);
  const [allowCollaborators, setAllowCollaborators] = useState(false);
  const [collaboratorLimit, setCollaboratorLimit] = useState<'unlimited' | number>('unlimited');
  const [allowRequesters, setAllowRequesters] = useState(false);
  const [showRemoveCollaboratorsDialog, setShowRemoveCollaboratorsDialog] = useState(false);
  const [showRemoveRequestersDialog, setShowRemoveRequestersDialog] = useState(false);

  const collaboratorsSheetRef = useRef<BottomSheetRef>(null);

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

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 32 }}>
        {/* Schedule lift */}
        <View className="border-b border-grey-plain-450/20 px-4 py-4">
          <View className="flex-row items-center justify-between">
            <View className="flex-1 flex-row items-center gap-3">
              <Calendar size={24} color={colors['grey-alpha']['500']} />
              <View className="flex-1">
                <Text className="mb-1 text-base font-semibold text-grey-alpha-500">
                  Schedule lift
                </Text>
                <Text className="text-sm text-grey-alpha-400">
                  Choose a start date for your lift.
                </Text>
              </View>
            </View>
            <Switch
              value={scheduleLift}
              onValueChange={setScheduleLift}
              trackColor={{
                false: colors['grey-plain']['450'],
                true: colors.primary.purple,
              }}
              thumbColor={colors['grey-plain']['50']}
            />
          </View>
        </View>

        {/* Lift end date */}
        <View className="border-b border-grey-plain-450/20 px-4 py-4">
          <View className="flex-row items-center justify-between">
            <View className="flex-1 flex-row items-center gap-3">
              <CalendarX size={24} color={colors['grey-alpha']['500']} />
              <View className="flex-1">
                <Text className="mb-1 text-base font-semibold text-grey-alpha-500">
                  Lift end date
                </Text>
                <Text className="text-sm text-grey-alpha-400">
                  This will end the lift even when the target is not met.
                </Text>
              </View>
            </View>
            <Switch
              value={liftEndDate}
              onValueChange={setLiftEndDate}
              trackColor={{
                false: colors['grey-plain']['450'],
                true: colors.primary.purple,
              }}
              thumbColor={colors['grey-plain']['50']}
            />
          </View>
        </View>

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
                    {typeof collaboratorLimit === 'number' ? collaboratorLimit : '5'} →
                  </Text>
                ) : (
                  <Text className="text-sm text-grey-alpha-400">
                    Approve people's request to join you in supporting and
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
                  Approve people's request to join and benefit from the lift you
                  are raising.
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
