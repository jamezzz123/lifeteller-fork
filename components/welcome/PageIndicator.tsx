import { View } from 'react-native';

interface PageIndicatorProps {
  currentIndex: number;
  totalSlides: number;
}

export function PageIndicator({
  currentIndex,
  totalSlides,
}: PageIndicatorProps) {
  return (
    <View className="flex-row items-center gap-2">
      {Array.from({ length: totalSlides }).map((_, index) => {
        const isActive = index === currentIndex;
        return (
          <View
            key={index}
            className={`w-1.5 rounded-full ${
              isActive ? 'h-6 bg-primary' : 'bg-grey-alpha-250 h-3'
            }`}
          />
        );
      })}
    </View>
  );
}
