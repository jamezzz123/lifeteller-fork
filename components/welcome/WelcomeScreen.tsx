import { useRef, useState } from 'react';
import {
  View,
  FlatList,
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ImageSourcePropType,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import LogoColor from '@/assets/images/logo/logo-color.svg';
import { WelcomeSlide } from './WelcomeSlide';
import { WelcomeNavigationButtons } from './WelcomeNavigationButtons';
import { setOnboardingCompleted } from '@/utils/onboardingStorage';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface WelcomeSlideData {
  id: string;
  title: string;
  description: string;
  imageType: 'collage' | 'illustration';
  images?: ImageSourcePropType[];
  image?: ImageSourcePropType;
}

const WELCOME_SLIDES: WelcomeSlideData[] = [
  {
    id: '1',
    title: 'Every lift changes a life',
    description:
      'Lifteller is the social platform that turns connection into compassion — where every like becomes a Lift, and every Lift changes a life.',
    imageType: 'collage',
    images: [
      require('../../assets/images/welcome/collage-1.jpg'),
      require('../../assets/images/welcome/collage-2.png'),
      require('../../assets/images/welcome/collage-3.jpg'),
      require('../../assets/images/welcome/collage-4.jpg'),
      require('../../assets/images/welcome/collage-5.jpg'),
      require('../../assets/images/welcome/collage-6.jpg'),
      require('../../assets/images/welcome/collage-8.jpg'),
    ],
  },
  {
    id: '2',
    title: 'Give and receive lifts',
    description:
      'You can raise a lift, request a lift, and also offer lifts. Every lift transforms generosity into a lifestyle, community, and movement.',
    imageType: 'illustration',
    image: require('../../assets/images/welcome/illustration-1.png'),
  },
  {
    id: '3',
    title: 'Giving should be natural',
    description:
      'You Giving becomes as natural, joyful, and viral as liking a post, turning connection into compassion and habit-driven generosity.',
    imageType: 'illustration',
    image: require('../../assets/images/welcome/illustration-2.jpg'),
  },
];

export function WelcomeScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const isLastSlide = currentIndex === WELCOME_SLIDES.length - 1;

  function handleScroll(event: NativeSyntheticEvent<NativeScrollEvent>) {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / SCREEN_WIDTH);
    if (index !== currentIndex) {
      setCurrentIndex(index);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }

  function handleNext() {
    if (isLastSlide) {
      handleGetStarted();
      return;
    }

    const nextIndex = currentIndex + 1;
    flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }

  function handleBack() {
    if (currentIndex === 0) return;

    const prevIndex = currentIndex - 1;
    flatListRef.current?.scrollToIndex({ index: prevIndex, animated: true });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }

  function handleSkip() {
    handleGetStarted();
  }

  async function handleGetStarted() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    // Mark onboarding as completed before navigating
    await setOnboardingCompleted();
    router.push('/(auth)/get-started');
  }

  function renderSlide({ item }: { item: WelcomeSlideData }) {
    return (
      <WelcomeSlide
        title={item.title}
        description={item.description}
        imageType={item.imageType}
        images={item.images}
        image={item.image}
        currentIndex={currentIndex}
        totalSlides={WELCOME_SLIDES.length}
      />
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'bottom']}>
      <View className="flex-row items-center justify-start px-6 pt-4">
        <LogoColor width={104} height={30} />
      </View>

      <View className="relative flex-1">
        <FlatList
          ref={flatListRef}
          data={WELCOME_SLIDES}
          renderItem={renderSlide}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          getItemLayout={(_, index) => ({
            length: SCREEN_WIDTH,
            offset: SCREEN_WIDTH * index,
            index,
          })}
          onScrollToIndexFailed={(info) => {
            const wait = new Promise((resolve) => setTimeout(resolve, 500));
            wait.then(() => {
              flatListRef.current?.scrollToIndex({
                index: info.index,
                animated: true,
              });
            });
          }}
        />
      </View>

      <WelcomeNavigationButtons
        isFirstSlide={currentIndex === 0}
        isLastSlide={isLastSlide}
        onSkip={handleSkip}
        onNext={handleNext}
        onBack={handleBack}
      />
      {/* <Button
        title="Go to request lift"
        onPress={handleOpenRequestLift}
      ></Button> */}
    </SafeAreaView>
  );
}
