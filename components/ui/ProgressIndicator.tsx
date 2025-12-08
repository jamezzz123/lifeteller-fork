import { View } from 'react-native';
import { colors } from '@/theme/colors';

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  className?: string;
}

export function ProgressIndicator({
  currentStep,
  totalSteps,
  className = '',
}: ProgressIndicatorProps) {
  return (
    <View className={`flex-row items-center gap-2 ${className}`}>
      {Array.from({ length: totalSteps }).map((_, index) => {
        const isCompleted = index + 1 < currentStep;
        const isCurrent = index + 1 === currentStep;

        return (
          <View
            key={index}
            className="h-2 rounded-lg"
            style={{
              width: 24,
              backgroundColor:
                isCurrent || isCompleted
                  ? colors['grey-alpha']['500']
                  : 'transparent',
              borderWidth: isCurrent || isCompleted ? 0 : 1,
              borderColor: colors['grey-plain']['300'],
            }}
          />
        );
      })}
    </View>
  );
}
