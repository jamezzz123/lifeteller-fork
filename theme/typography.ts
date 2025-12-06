import { Platform } from 'react-native';
import {
  Inter_100Thin as interThin,
  Inter_200ExtraLight as interExtraLight,
  Inter_300Light as interLight,
  Inter_400Regular as interRegular,
  Inter_500Medium as interMedium,
  Inter_600SemiBold as interSemiBold,
  Inter_700Bold as interBold,
  Inter_800ExtraBold as interExtraBold,
  Inter_900Black as interBlack,
} from '@expo-google-fonts/inter';

export const customFontsToLoad = {
  interThin,
  interExtraLight,
  interLight,
  interRegular,
  interMedium,
  interSemiBold,
  interBold,
  interExtraBold,
  interBlack,
};

const fonts = {
  inter: {
    thin: 'interThin',
    extraLight: 'interExtraLight',
    light: 'interLight',
    normal: 'interRegular',
    medium: 'interMedium',
    semiBold: 'interSemiBold',
    bold: 'interBold',
    extraBold: 'interExtraBold',
    black: 'interBlack',
  },
  helveticaNeue: {
    // iOS only font.
    thin: 'HelveticaNeue-Thin',
    light: 'HelveticaNeue-Light',
    normal: 'Helvetica Neue',
    medium: 'HelveticaNeue-Medium',
  },
  courier: {
    // iOS only font.
    normal: 'Courier',
  },
  sansSerif: {
    // Android only font.
    thin: 'sans-serif-thin',
    light: 'sans-serif-light',
    normal: 'sans-serif',
    medium: 'sans-serif-medium',
  },
  monospace: {
    // Android only font.
    normal: 'monospace',
  },
};

export const typography = {
  /**
   * The fonts are available to use, but prefer using the semantic name.
   */
  fonts,
  /**
   * The primary font. Used in most places.
   */
  primary: fonts.inter,
  /**
   * An alternate font used for perhaps titles and stuff.
   */
  secondary: Platform.select({
    ios: fonts.helveticaNeue,
    android: fonts.sansSerif,
  }),
  /**
   * Lets get fancy with a monospace font!
   */
  code: Platform.select({ ios: fonts.courier, android: fonts.monospace }),
};

export default typography;
