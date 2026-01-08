import LiftCreationScreen from '@/components/lift/LiftCreationScreen';
import { router } from 'expo-router';

export default function RaiseLiftScreen() {
  return (
    <LiftCreationScreen
      headerTitle="Offer Lift"
      actionButtonText="Offer lift"
      // collaboratorsRoute="/screens/lifts/offer/add-collaborators"
      moreOptionsRoute="/screens/lifts/offer/more-options"
      addItemsRoute="/screens/lifts/offer/add-lift-items"
      onSubmit={() => router.push('/screens/lifts/offer/preview' as any)}
      showVisibilitySelector={true}
      showRecipientNumberSelector={true}
      showCollaboratorsSelector={false}
      showMedia={false} 
    />
  );
}
