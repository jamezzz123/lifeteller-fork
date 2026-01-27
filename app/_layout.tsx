import 'react-native-reanimated';
import { Stack } from 'expo-router';
import '../app/global.css';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { QueryClientProvider } from '@tanstack/react-query';
import { customFontsToLoad } from '../theme/typography';
import { queryClient } from '@/lib/query-client';
import { AuthProvider } from '@/context/auth';
import { CommentBottomSheetProvider } from '@/context/comment-bottom-sheet';
import { CommentBottomSheet } from '@/components/feed/CommentBottomSheet';
import { BottomToastProvider } from '@/components/ui/BottomToast';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts(customFontsToLoad);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CommentBottomSheetProvider>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <BottomToastProvider>
              <BottomSheetModalProvider>
                <Stack
                  screenOptions={{
                    headerShown: false,
                  }}
                />
                <CommentBottomSheet />
              </BottomSheetModalProvider>
            </BottomToastProvider>
          </GestureHandlerRootView>
        </CommentBottomSheetProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
