import { useState } from 'react';

export interface User {
  id: string;
  username: string;
  handle: string;
  fullName: string;
  email: string;
  profileImage: any;
  bio?: string;
  followersCount?: number;
  followingCount?: number;
  liftsCount?: number;
  isVerified?: boolean;
}

const DEMO_USER: User = {
  id: '1',
  username: 'isaac_tolulope',
  handle: 'dareytemy',
  fullName: 'Isaac Tolulope',
  email: 'isaac@example.com',
  profileImage: require('@/assets/images/user.png'),
  bio: 'Spreading kindness one lift at a time ✨',
  followersCount: 1234,
  followingCount: 567,
  liftsCount: 89,
  isVerified: true,
};

export function useUser() {
  const [user, setUser] = useState<User>(DEMO_USER);

  return {
    user,
    setUser,
  };
}
