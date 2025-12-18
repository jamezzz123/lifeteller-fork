import { Lift } from '@/types/lift';

export const mockLifts: Lift[] = [
  {
    id: '1',
    owner: {
      id: 'user1',
      name: 'Isaac Tolulope',
      handle: 'dareytemy',
      avatar: 'https://i.pravatar.cc/150?img=12',
      verified: true,
    },
    title: 'Help Isaac build his workspace',
    description:
      'This is a snapshot of the lift story as entered by person who owns or raised the lift.',
    liftType: 'monetary',
    cardType: 'lift-request',
    status: 'pending',
    timestamp: '10 seconds ago',
    monetary: {
      currentAmount: 0,
      targetAmount: 10000,
    },
    likes: 56,
    comments: 12,
    shares: 12,
  },
  {
    id: '2',
    owner: {
      id: 'user2',
      name: 'Jane Doe',
      handle: 'janedoe',
      avatar: 'https://i.pravatar.cc/150?img=10',
      verified: false,
    },
    title: 'Medical bills assistance',
    description:
      'I need help with my medical bills for my surgery next month.',
    liftType: 'monetary',
    cardType: 'lift-request',
    status: 'pending',
    timestamp: '5 minutes ago',
    monetary: {
      currentAmount: 25000,
      targetAmount: 50000,
    },
    likes: 23,
    comments: 5,
    shares: 3,
  },
  {
    id: '3',
    owner: {
      id: 'user3',
      name: 'John Smith',
      handle: 'johnsmith',
      avatar: 'https://i.pravatar.cc/150?img=15',
      verified: true,
    },
    title: 'School fees for my kids',
    description: 'Short clip about school fees needed.',
    liftType: 'monetary',
    cardType: 'lift-raised',
    status: 'active',
    timestamp: '1 hour ago',
    monetary: {
      currentAmount: 15000,
      targetAmount: 25000,
      coRaisers: [
        {
          id: 'raiser1',
          name: 'Mary Johnson',
          avatar: 'https://i.pravatar.cc/150?img=9',
          amount: 10000,
        },
        {
          id: 'raiser2',
          name: 'Peter Williams',
          avatar: 'https://i.pravatar.cc/150?img=8',
          amount: 5000,
        },
      ],
    },
    likes: 45,
    comments: 8,
    shares: 15,
  },
  {
    id: '4',
    owner: {
      id: 'user4',
      name: 'Sarah Johnson',
      handle: 'sarahj',
      avatar: 'https://i.pravatar.cc/150?img=12',
      verified: false,
    },
    title: 'Start a small business',
    description:
      'I want to start a small food business to support my family.',
    liftType: 'monetary',
    cardType: 'lift-raised',
    status: 'active',
    timestamp: '2 hours ago',
    monetary: {
      currentAmount: 50000,
      targetAmount: 75000,
      coRaisers: [
        {
          id: 'raiser1',
          name: 'David Brown',
          avatar: 'https://i.pravatar.cc/150?img=12',
          amount: 25000,
        },
        {
          id: 'raiser2',
          name: 'Emily Davis',
          avatar: 'https://i.pravatar.cc/150?img=15',
          amount: 15000,
        },
        {
          id: 'raiser3',
          name: 'Michael Wilson',
          avatar: 'https://i.pravatar.cc/150?img=18',
          amount: 10000,
        },
      ],
    },
    likes: 89,
    comments: 23,
    shares: 34,
  },
  // Example: Non-monetary lift
  {
    id: '5',
    owner: {
      id: 'user5',
      name: 'Michael Chen',
      handle: 'michaelc',
      avatar: 'https://i.pravatar.cc/150?img=19',
      verified: true,
    },
    title: 'Need school supplies',
    description:
      'My children need these supplies for the upcoming school term.',
    liftType: 'non-monetary',
    cardType: 'lift-request',
    status: 'pending',
    timestamp: '3 hours ago',
    nonMonetary: {
      items: [
        { id: 'item1', name: 'Textbooks', quantity: 3 },
        { id: 'item2', name: 'School bags', quantity: 2 },
        { id: 'item3', name: 'Uniforms', quantity: 2 },
      ],
    },
    likes: 34,
    comments: 7,
    shares: 5,
  },
  // Example: Lift offer with both monetary and non-monetary
  {
    id: '6',
    owner: {
      id: 'user6',
      name: 'Linda Martinez',
      handle: 'lindamz',
      avatar: 'https://i.pravatar.cc/150?img=90',
      verified: false,
    },
    title: 'Setting up home office',
    description: 'Need help setting up a home office for remote work.',
    liftType: 'both',
    cardType: 'lift-offer',
    status: 'accepted',
    timestamp: '5 hours ago',
    offer: {
      monetaryAmount: 15000,
      items: [
        { id: 'item1', name: 'Laptop' },
        { id: 'item2', name: 'Monitor' },
        { id: 'item3', name: 'Keyboard' },
        { id: 'item4', name: 'Mouse' },
      ],
    },
    likes: 67,
    comments: 15,
    shares: 20,
  },
  // Example: Completed lift
  {
    id: '7',
    owner: {
      id: 'user7',
      name: 'Robert Taylor',
      handle: 'robertt',
      avatar: 'https://i.pravatar.cc/150?img=17',
      verified: true,
    },
    collaborators: [
      {
        id: 'collab1',
        name: 'Alice Green',
        avatar: 'https://i.pravatar.cc/150?img=16',
      },
      {
        id: 'collab2',
        name: 'Bob White',
        avatar: 'https://i.pravatar.cc/150?img=15',
      },
    ],
    title: 'Community health center',
    description: 'Building a health center for our community with donations.',
    liftType: 'monetary',
    cardType: 'lift-raised',
    status: 'completed',
    timestamp: '1 day ago',
    monetary: {
      currentAmount: 500000,
      targetAmount: 500000,
      coRaisers: [
        {
          id: 'raiser1',
          name: 'Jennifer Anderson',
          avatar: 'https://i.pravatar.cc/150?img=17',
          amount: 100000,
        },
        {
          id: 'raiser2',
          name: 'William Thompson',
          avatar: 'https://i.pravatar.cc/150?img=22',
          amount: 80000,
        },
        // ... more raisers
        ...Array.from({ length: 10 }, (_, i) => ({
          id: `raiser${i + 3}`,
          name: `Raiser ${i + 3}`,
          avatar: 'https://i.pravatar.cc/150?img=24',
          amount: 35000,
        })),
      ],
    },
    likes: 234,
    comments: 89,
    shares: 56,
  },
];
