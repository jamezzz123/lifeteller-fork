import { View, Text, ImageBackground, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowRight } from 'lucide-react-native';

type ImpactCardProps = {
  handlePress: () => void;
};

export default function ImpactCard({ handlePress }: ImpactCardProps) {
  return (
    <View className="">
      <ImageBackground
        source={require('../../assets/images/impact-image.jpg')}
        className="overflow-hidden rounded-xl"
        imageStyle={{ borderRadius: 16 }}
        resizeMode="cover"
      >
        {/* Gradient Overlay */}
        <LinearGradient
          colors={['#7538BA', 'rgba(207, 37, 134, 0)']}
          locations={[0.6972, 1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <View className="flex-row items-center justify-between p-4">
            <View className="flex-1">
              <Text className="text-base font-semibold text-white">
                Multiply your impact. Reach more people
              </Text>
              <Text className="mt-1 text-sm text-white/90">
                Offer lift to more people at the same time.
              </Text>
            </View>

            <View>
              <TouchableOpacity
                onPress={handlePress}
                className="h-10 w-10 items-center justify-center rounded-full bg-white"
              >
                <ArrowRight size={20} color="#7C3AED" />
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
}
