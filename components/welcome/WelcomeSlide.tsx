import { View, Text, Dimensions, ImageSourcePropType } from 'react-native';
import { Image } from 'expo-image';
import { CollageCarousel } from './CollageCarousel';
import { PageIndicator } from './PageIndicator';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface WelcomeSlideProps {
  title: string;
  description: string;
  imageType: 'collage' | 'illustration';
  images?: ImageSourcePropType[];
  image?: ImageSourcePropType;
  currentIndex: number;
  totalSlides: number;
}

export function WelcomeSlide({
  title,
  description,
  imageType,
  images,
  image,
  currentIndex,
  totalSlides,
}: WelcomeSlideProps) {
  return (
    <View
      className="flex-1 pt-3 items-center justify-start px-6 pt-4"
      style={{ width: SCREEN_WIDTH }}
    >
      <View className="w-full flex-1 items-center justify-center">
        {imageType === 'collage' ? (
          <CollageCarousel images={images || []} />
        ) : (
          <View className="h-[24rem] w-full items-center justify-center overflow-hidden rounded-2xl bg-primary-tints-100">
            {image && (
              <Image
                source={image}
                style={{ width: '100%', height: '100%' }}
                contentFit="cover"
                transition={200}
              />
            )}
          </View>
        )}
      </View>

      <View className="w-full mt-6">
        <PageIndicator currentIndex={currentIndex} totalSlides={totalSlides} />
      </View>

      <View className="w-full pb-4 mt-2">
        <Text className="mb-2 text-2xl font-bold text-grey-alpha-450">
          {title}
        </Text>
        <Text className="font-medium text-grey-alpha-400">{description}</Text>
      </View>
    </View>
  );
}
