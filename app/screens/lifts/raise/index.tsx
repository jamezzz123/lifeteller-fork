import LiftCreationScreen from '@/components/lift/LiftCreationScreen';
import { router } from 'expo-router';

export default function RaiseLiftScreen() {
  return (
    <LiftCreationScreen
      headerTitle="Raise Lift"
      actionButtonText="Raise lift"
      collaboratorsRoute="/screens/lifts/raise/add-collaborators"
      moreOptionsRoute="/screens/lifts/raise/more-options"
      addItemsRoute="/screens/lifts/raise/add-lift-items"
      onSubmit={() => router.push('/screens/lifts/raise/preview' as any)}
      showVisibilitySelector={true}
      audienceBottomSheetTitle={'Who can see this raised lift?'}
    />
  );
}
