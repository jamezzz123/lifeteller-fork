import MoreOptionsScreen from '@/components/lift/MoreOptionsScreen';

// export default MoreOptionsScreen;

export default function RaiseLiftMoreOptions() {
  return (
    <MoreOptionsScreen
      visibleSettings={[
        'category',
        'location',
        'scheduleLift',
        'liftEndDate',
        'allowCollaborators',
        'allowRequesters',
      ]}
    />
  );
}
