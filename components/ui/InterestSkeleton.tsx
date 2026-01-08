import { View } from 'react-native';
import { colors } from '@/theme/colors';

interface InterestSkeletonProps {
  count?: number;
}

export function InterestSkeleton({ count = 6 }: InterestSkeletonProps) {
  return (
    <View className="flex-row flex-wrap gap-3">
      {Array.from({ length: count }).map((_, index) => (
        <View
          key={index}
          className="h-9 rounded-xl px-3"
          style={{
            backgroundColor: colors['grey-alpha']['150'],
            width: Math.random() * 60 + 80, // Random width between 80-140
          }}
        />
      ))}
    </View>
  );
}
