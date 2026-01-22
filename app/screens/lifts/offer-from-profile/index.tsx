import { useEffect } from 'react';
import LiftCreationScreen from '@/components/lift/LiftCreationScreen';
import { router, useLocalSearchParams } from 'expo-router';
import { useLiftDraft } from '@/context/LiftDraftContext';

export default function OfferFromProfileLiftScreen() {
  const { setOfferTo } = useLiftDraft();
  const params = useLocalSearchParams<{
    recipientId: string;
    recipientFullName: string;
    recipientHandle: string;
    recipientProfileImage: string;
    recipientIsVerified: string;
  }>();

  // Set the offerTo user in context when component mounts
  useEffect(() => {
    if (params.recipientId) {
      setOfferTo({
        id: params.recipientId,
        fullName: params.recipientFullName || '',
        handle: params.recipientHandle || '',
        profileImage: params.recipientProfileImage || '',
        isVerified: params.recipientIsVerified === 'true',
      });
    }

    // Clean up when unmounting
    return () => {
      setOfferTo(null);
    };
  }, [
    params.recipientId,
    params.recipientFullName,
    params.recipientHandle,
    params.recipientProfileImage,
    params.recipientIsVerified,
    setOfferTo,
  ]);

  return (
    <LiftCreationScreen
      headerTitle="Offer Lift"
      actionButtonText="Offer lift"
      moreOptionsRoute="/screens/lifts/offer-from-profile/more-options"
      addItemsRoute="/screens/lifts/offer-from-profile/add-lift-items"
      onSubmit={() =>
        router.push('/screens/lifts/offer-from-profile/preview' as any)
      }
      showVisibilitySelector={false}
      showRecipientNumberSelector={false}
      showCollaboratorsSelector={false}
      showMedia={false}
      showExploreOption={false}
      showOfferAnon={true}
      usedAs="Offer"
    />
  );
}
