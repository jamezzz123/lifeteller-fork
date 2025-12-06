import type { Config } from 'tailwindcss';
import { colors } from './theme/colors';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const nativewindPreset = require('nativewind/preset');

const config: Config = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  presets: [nativewindPreset],
  theme: {
    extend: {
      colors: {
        primary: colors.primary.purple,
        'primary-tints': colors['primary-tints'].purple,
        'grey-alpha': colors['grey-alpha'],
        'grey-plain': colors['grey-plain'],
        background: colors.background,
      },
    },
  },
  plugins: [],
};

export default config;
