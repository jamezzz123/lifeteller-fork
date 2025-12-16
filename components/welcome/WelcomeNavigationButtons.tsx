import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { Button } from '@/components/ui/Button';
import { TextButton } from '@/components/ui/TextButton';
import { IconButton } from '@/components/ui/IconButton';
import { colors } from '@/theme/colors';

interface WelcomeNavigationButtonsProps {
  isFirstSlide: boolean;
  isLastSlide: boolean;
  onSkip: () => void;
  onNext: () => void;
  onBack: () => void;
}

export function WelcomeNavigationButtons({
  isFirstSlide,
  isLastSlide,
  onSkip,
  onNext,
  onBack,
}: WelcomeNavigationButtonsProps) {
  return (
    <SafeAreaView edges={['bottom']} className="w-full">
      <View className="flex-row items-center px-6 ">
        <TextButton title="Skip" onPress={onSkip} />

        {isFirstSlide ? (
          <View className="flex-1" />
        ) : (
          <>
            <View className="flex-1" />
            <IconButton
              icon={
                <ArrowLeft
                  size={20}
                  color={colors['grey-alpha']['500']}
                  strokeWidth={2.5}
                />
              }
              onPress={onBack}
              size={48}
              accessibilityLabel="Go to previous slide"
            />
            <View className="w-4" />
          </>
        )}

        <Button
          title={isLastSlide ? 'Get started' : 'Next'}
          onPress={onNext}
          className={`${isLastSlide ? 'px-8' : ''}`}
          variant="primary"
          size="medium"
        />
      </View>
    </SafeAreaView>
  );
}
