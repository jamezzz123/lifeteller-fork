import { ImageSourcePropType } from 'react-native';

export type Contact = {
  id: string;
  name: string;
  username: string;
  location: string;
  verified?: boolean;
  avatar: ImageSourcePropType;
};

export const MAX_SELECTION = 5;
