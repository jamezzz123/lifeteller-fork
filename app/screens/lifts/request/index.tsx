import LiftCreationScreen from '@/components/lift/LiftCreationScreen';
import { router } from 'expo-router';

export default function RaiseLiftScreen() {
  return (
    <LiftCreationScreen
      showCollaboratorsSelector={false}
      headerTitle="Request Lift"
      actionButtonText="Request lift"
      collaboratorsRoute="/screens/lifts/request/add-collaborators"
      moreOptionsRoute="/screens/lifts/request/more-options"
      addItemsRoute="/screens/lifts/request/add-lift-items"
      onSubmit={() => router.push('/screens/lifts/request/preview' as any)}
      showVisibilitySelector={true}
      usedAs={'Request'}
    />
  );
}
