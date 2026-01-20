import MoreOptionsScreen from '@/components/lift/MoreOptionsScreen';

// export default MoreOptionsScreen;

export default function RequestLiftMoreOptions() {
  return (
    <MoreOptionsScreen
      visibleSettings={[
        'category',
        'location',
        'scheduleLift',
        'requestEndDate',
        // 'allowCollaborators',
        // 'allowRequesters',
      ]}
    />
  );
}
