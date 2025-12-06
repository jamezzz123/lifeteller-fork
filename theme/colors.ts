const palette = {
  primary: {
    purple: '#7538BA',
    'purple-light': '#9D72CE',
  },
  'primary-tints': {
    purple: {
      '100': '#F4EBFF',
      '200': '#844FC2',
      '500': '#7538BA',
    },
  },
  'grey-alpha': {
    '250': '#D0D5DD',
    '400': '#4A5564',
    '450': '#3A414E',
    '500': '#252A31',
  },
  'grey-plain': {
    '50': '#FFFFFF',
    '450': '#D1D1D1',
    '550': '#484848',
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
