import { Contact } from './types';

export const CONTACTS: Contact[] = [
  {
    id: '1',
    name: 'Isaac Tolulope',
    username: 'dareytemy',
    location: 'Lagos, Nigeria',
    verified: true,
    avatar: { uri: 'https://i.pravatar.cc/150?img=1' },
  },
  {
    id: '2',
    name: 'Don Jay',
    username: 'donjay',
    location: 'Abuja, Nigeria',
    verified: true,
    avatar: require('../../assets/images/welcome/collage-2.png'),
  },
  {
    id: '3',
    name: 'Amara Obi',
    username: 'amaraobi',
    location: 'Kigali, Rwanda',
    avatar: require('../../assets/images/welcome/collage-3.jpg'),
  },
  {
    id: '4',
    name: 'Tomiwa Ade',
    username: 'tomiwaa',
    location: 'Cape Town, South Africa',
    avatar: require('../../assets/images/welcome/collage-4.jpg'),
  },
  {
    id: '5',
    name: 'Chinwe Nwosu',
    username: 'chinwen',
    location: 'Nairobi, Kenya',
    verified: true,
    avatar: require('../../assets/images/welcome/collage-5.jpg'),
  },
  {
    id: '6',
    name: 'Ayo Martins',
    username: 'ayomartins',
    location: 'Accra, Ghana',
    avatar: require('../../assets/images/welcome/collage-6.jpg'),
  },
];

export const CATEGORIES = [
  'Food',
  'Clothing',
  'Shelter',
  'Transportation',
  'Upskill',
  'Retirement',
];

export const LOCATIONS = [
  'Victoria Island, Lagos',
  'Obanikoro, Lagos',
  'Ilupeju, Lagos',
];
