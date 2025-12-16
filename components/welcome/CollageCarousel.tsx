import React, { useState, useEffect, useRef } from 'react';
import { View, Image, Animated, ImageSourcePropType } from 'react-native';

interface CollageCarouselProps {
  images: ImageSourcePropType[];
}

export function CollageCarousel({ images }: CollageCarouselProps) {
  const imageCount = Math.max(images.length, 3);
  const [columnIndices, setColumnIndices] = useState([0, 1, 2]);
  const fadeAnims = useRef([
    new Animated.Value(1),
    new Animated.Value(1),
    new Animated.Value(1),
  ]).current;

  useEffect(() => {
    let currentColumn = 0;

    const interval = setInterval(() => {
      const columnIndex = currentColumn % 3;

      Animated.timing(fadeAnims[columnIndex], {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }).start(() => {
        setColumnIndices((prevIndices) => {
          const newIndices = [...prevIndices];
          newIndices[columnIndex] = (prevIndices[columnIndex] + 3) % imageCount;
          return newIndices;
        });

        Animated.timing(fadeAnims[columnIndex], {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }).start();
      });

      currentColumn++;
    }, 2000);

    return () => clearInterval(interval);
  }, [imageCount, fadeAnims]);

  return (
    <View className="h-[24rem] w-full overflow-hidden rounded-3xl">
      <View className="flex-1 flex-row">
        <Animated.View
          className="flex-1 bg-gray-200"
          style={{ opacity: fadeAnims[0] }}
        >
          <Image
            source={images[columnIndices[0] % images.length]}
            className="h-full w-full"
            resizeMode="cover"
          />
        </Animated.View>

        <Animated.View
          className="flex-1 bg-gray-200"
          style={{ opacity: fadeAnims[1] }}
        >
          <Image
            source={images[columnIndices[1] % images.length]}
            className="h-full w-full"
            resizeMode="cover"
          />
        </Animated.View>

        <Animated.View
          className="flex-1 bg-gray-200"
          style={{ opacity: fadeAnims[2] }}
        >
          <Image
            source={images[columnIndices[2] % images.length]}
            className="h-full w-full"
            resizeMode="cover"
          />
        </Animated.View>
      </View>
    </View>
  );
}
