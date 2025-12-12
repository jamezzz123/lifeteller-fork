const palette = {
  primary: {
    purple: '#7538BA',
    'purple-light': '#9D72CE',
  },
  'primary-tints': {
    purple: {
      '50': '#F8F2FF',
      '100': '#F4EBFF',
      '200': '#844FC2',
      '500': '#7538BA',
    },
  },
  'grey-alpha': {
    '150': '#F3F4F6',
    '250': '#D0D5DD',
    '400': '#4A5564',
    '450': '#3A414E',
    '500': '#252A31',
    '550': '#181B20',
  },
  'grey-plain': {
    '50': '#FFFFFF',
    '100': '#FAFAFA',
    '150': '#F8F8F8',
    '300': '#E8E8E8',
    '350': '#D1D1D1',
    '450': '#D1D1D1',
    '550': '#484848',
  },
  state: {
    red: '#BC1521',
  },
  yellow: {
    '50': '#D97A0D',
  },
  'yellow-tint': {
    '50': '#FEF6EB',
  },
  variant: {
    yellow: {
      '150': '#965408',
    },
  },
};

export default palette;
export const colors = {
  ...palette,
  /**
   * The default color of the screen background.
   */
  background: palette['grey-plain']['50'],
};
