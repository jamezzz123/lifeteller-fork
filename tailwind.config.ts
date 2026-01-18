import type { Config } from 'tailwindcss';
import { colors } from './theme/colors';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const nativewindPreset = require('nativewind/preset');

const config: Config = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  presets: [nativewindPreset],
  theme: {
    extend: {
      fontFamily: {
        // Inter font variants - use with font-inter, font-inter-medium, etc.
        'inter': ['interRegular'],
        'inter-thin': ['interThin'],
        'inter-extralight': ['interExtraLight'],
        'inter-light': ['interLight'],
        'inter-medium': ['interMedium'],
        'inter-semibold': ['interSemiBold'],
        'inter-bold': ['interBold'],
        'inter-extrabold': ['interExtraBold'],
        'inter-black': ['interBlack'],
        // Default sans uses Inter Regular
        'sans': ['interRegular'],
      },
      colors: {
        primary: colors.primary.purple,
        'primary-purple-light': colors.primary['purple-light'],
        'primary-tints': colors['primary-tints'].purple,
        'grey-alpha': colors['grey-alpha'],
        'grey-plain': colors['grey-plain'],
        background: colors.background,
        'state-red': colors.state.red,
        'state-green': colors.state.green,
        'state-yellow': colors.state.yellow,
        'variant-yellow-150': colors.variant.yellow['150'],
        // Direct tints for convenience
        'primary-tint-50': colors['primary-tints'].purple['50'],
        'primary-tint-100': colors['primary-tints'].purple['100'],
        'primary-tint-200': colors['primary-tints'].purple['200'],
        'primary-tint-500': colors['primary-tints'].purple['500'],
        'grey-alpha-150': colors['grey-alpha']['150'],
        'grey-alpha-250': colors['grey-alpha']['250'],
        'grey-alpha-400': colors['grey-alpha']['400'],
        'grey-alpha-450': colors['grey-alpha']['450'],
        'grey-alpha-500': colors['grey-alpha']['500'],
        'grey-alpha-550': colors['grey-alpha']['550'],
        'grey-plain-50': colors['grey-plain']['50'],
        'grey-plain-150': colors['grey-plain']['150'],
        'grey-plain-300': colors['grey-plain']['300'],
        'grey-plain-450': colors['grey-plain']['450'],
        'grey-plain-550': colors['grey-plain']['550'],
        'green-tint-200': colors['green-tint']['200'],
        'green-shades-150': colors['green-shades']['150'],
        'green-tint-100': colors['green-tint']['100'],
        'yellow-tint-150': colors['yellow-tint']['150'],
        'red-tint-150': colors['red-tint']['150'],
      },
    },
  },
  plugins: [],
};

export default config;
