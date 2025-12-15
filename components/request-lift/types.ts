import { ImageSource } from 'expo-image';

export type Contact = {
  id: string;
  name: string;
  username: string;
  location: string;
  verified?: boolean;
  avatar: ImageSource;
};

export const MAX_SELECTION = 5;
