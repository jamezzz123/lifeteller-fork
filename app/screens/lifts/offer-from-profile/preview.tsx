import PreviewOfferLiftScreen from '@/components/lift/PreviewOfferLiftScreen';

export default function Preview() {
  return (
    <PreviewOfferLiftScreen
      visibleSettings={['offerTo', 'liftConfiguration']}
      showProgressBar={false}
      successRoute={'/(tabs)'}
    />
  );
}
