import { useCallback } from 'react';
import PreviewLiftScreen from '@/components/lift/PreviewLiftScreen';
import { useRaiseLift } from '@/lib/hooks/mutations/useRaiseLift';
import { useLiftDraft, LiftType } from '@/context/LiftDraftContext';
import type { RaiseLiftRequest } from '@/lib/api/schemas';

export default function Preview() {
  const raiseLift = useRaiseLift();
  const {
    title,
    description,
    liftType,
    liftAmount,
    audienceType,
    location,
    liftItems,
    collaborators,
    offerAnonymous,
    startDatetime,
    endDatetime,
    shouldAllowCollaborator,
    allowedCollaborators,
    shouldAllowRequester,
    allowedRequesters,
    autoDebit,
    reset,
  } = useLiftDraft();

  const handleSubmit = useCallback(async () => {
    const payload: RaiseLiftRequest = {
      title,
      description,
      lift_category: liftType === LiftType.Monetary ? 'MONETARY' : 'NON_MONETARY',
      is_hybrid: false,
      visibility: audienceType === 'everyone' ? 'PUBLIC' : 'FRIENDS',
      currency: 'NGN',
      lift_amount: liftType === LiftType.Monetary ? Number(liftAmount) || 0 : 0,
      auto_debit: autoDebit,
      items_metadata:
        liftType === LiftType.NonMonetary && liftItems.length > 0
          ? Object.fromEntries(
              liftItems.map((item) => [
                item.id,
                { name: item.name, quantity: item.quantity },
              ])
            )
          : undefined,
      location_name: location || undefined,
      start_datetime: startDatetime?.toISOString(),
      end_datetime: endDatetime?.toISOString(),
      should_allow_collaborator: shouldAllowCollaborator,
      allowed_collaborators: allowedCollaborators,
      collaborators: collaborators.map((c) => c.id),
      should_allow_requester: shouldAllowRequester,
      allowed_requesters: allowedRequesters,
      is_anonymous: offerAnonymous,
      media: [],
    };

    await raiseLift.mutateAsync(payload);
    reset();
  }, [
    title,
    description,
    liftType,
    liftAmount,
    audienceType,
    location,
    liftItems,
    collaborators,
    offerAnonymous,
    startDatetime,
    endDatetime,
    shouldAllowCollaborator,
    allowedCollaborators,
    shouldAllowRequester,
    allowedRequesters,
    autoDebit,
    raiseLift,
    reset,
  ]);

  const errorMessage = raiseLift.error
    ? raiseLift.error.message || 'Something went wrong. Please try again.'
    : null;

  return (
    <PreviewLiftScreen
      successRoute={'/(tabs)'}
      onSubmit={handleSubmit}
      isSubmitting={raiseLift.isPending}
      submitError={errorMessage}
    />
  );
}
