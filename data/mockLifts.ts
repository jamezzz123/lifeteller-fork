import { Lift } from '@/types/lift';

export const mockLifts: Lift[] = [
  // OFFERED STATUS - Shows date offered, amount offered, and uplifting message
  {
    id: '1',
    owner: {
      id: 'user1',
      name: 'Isaac Tolulope',
      handle: 'dareytemy',
      avatar: 'https://i.pravatar.cc/150?img=12',
      verified: true,
    },
    title: 'School Fees Loan Repayment',
    description:
      'Today, I visited the orphanage home at Yaba, Lagos. I went there with @xyz and @abc. We had a joyful moment with the children of the @fgh orphanage and geared towards what the future will hold...',
    liftType: 'monetary',
    cardType: 'lift-request',
    status: 'offered',
    timestamp: '10 seconds ago',
    category: 'Financial Aid',
    location: 'Ikeja, Lagos',
    timeRemaining: '23 days left',
    monetary: {
      currentAmount: 0,
      targetAmount: 100000,
    },
    offeredData: {
      dateOffered: '12/12/2025 ~ 1:09:01pm',
      amountOffered: 10000,
      upliftingMessage:
        'I hope you get all the good things that you deserve in life. Happy birthday, Eje mi. 🙌',
      offeredBy: {
        id: 'offerer1',
        name: 'Sarah Johnson',
        handle: 'sarahj',
        avatar: 'https://i.pravatar.cc/150?img=5',
      },
    },
    images: [
      'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800',
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800',
      'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800',
    ],
    likes: 56,
    comments: 12,
    shares: 12,
  },
  // PENDING STATUS
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
      'I need help with my medical bills for my surgery next month. The doctors have recommended immediate treatment.',
    liftType: 'monetary',
    cardType: 'lift-request',
    status: 'pending',
    timestamp: '5 minutes ago',
    category: 'Medical',
    location: 'Victoria Island, Lagos',
    timeRemaining: '15 days left',
    monetary: {
      currentAmount: 25000,
      targetAmount: 50000,
    },
    images: [
      'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800',
      'https://images.unsplash.com/photo-1584982751601-97dcc096659c?w=800',
      'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800',
    ],
    likes: 23,
    comments: 5,
    shares: 3,
  },
  // DECLINED STATUS - Shows date declined
  {
    id: '2b',
    owner: {
      id: 'user2b',
      name: 'David Wilson',
      handle: 'davidw',
      avatar: 'https://i.pravatar.cc/150?img=14',
      verified: true,
    },
    title: 'Business startup funding',
    description:
      'Looking to start a small tailoring business. Need funds for equipment and initial stock. I have experience in fashion design and want to serve my community.',
    liftType: 'monetary',
    cardType: 'lift-request',
    status: 'declined',
    timestamp: '2 days ago',
    category: 'Business',
    location: 'Lekki, Lagos',
    timeRemaining: 'Expired',
    monetary: {
      currentAmount: 0,
      targetAmount: 80000,
    },
    declinedData: {
      dateDeclined: '15/12/2025 ~ 3:45:20pm',
      reason: 'Insufficient documentation provided',
    },
    images: [
      'https://images.unsplash.com/photo-1556742400-b5b7f3d89e6a?w=800',
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800',
      'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800',
    ],
    likes: 12,
    comments: 3,
    shares: 1,
  },
  // IN-PROGRESS STATUS
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
    description:
      'My three children need school fees for the upcoming semester. Any help would be greatly appreciated.',
    liftType: 'monetary',
    cardType: 'lift-raised',
    status: 'in-progress',
    timestamp: '1 hour ago',
    category: 'Education',
    location: 'Surulere, Lagos',
    timeRemaining: '10 days left',
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
    images: [
      'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800',
      'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800',
    ],
    likes: 45,
    comments: 8,
    shares: 15,
  },
  // ACCEPTED STATUS
  {
    id: '4',
    owner: {
      id: 'user4',
      name: 'Sarah Johnson',
      handle: 'sarahj',
      avatar: 'https://i.pravatar.cc/150?img=5',
      verified: false,
    },
    title: 'Start a small business',
    description:
      'I want to start a small food business to support my family. Your support will help me buy equipment and initial inventory.',
    liftType: 'monetary',
    cardType: 'lift-request',
    status: 'accepted',
    timestamp: '2 hours ago',
    category: 'Business',
    location: 'Ajah, Lagos',
    timeRemaining: '20 days left',
    monetary: {
      currentAmount: 50000,
      targetAmount: 75000,
    },
    images: [
      'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800',
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800',
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800',
    ],
    likes: 89,
    comments: 23,
    shares: 34,
  },
  // COMPLETED STATUS
  {
    id: '4b',
    owner: {
      id: 'user4b',
      name: 'Michael Brown',
      handle: 'mikeb',
      avatar: 'https://i.pravatar.cc/150?img=13',
      verified: true,
    },
    title: 'Emergency rent assistance',
    description:
      'Successfully received help for emergency rent. Thank you to everyone who contributed and made this possible!',
    liftType: 'monetary',
    cardType: 'lift-request',
    status: 'completed',
    timestamp: '1 week ago',
    category: 'Housing',
    location: 'Yaba, Lagos',
    timeRemaining: 'Completed',
    monetary: {
      currentAmount: 100000,
      targetAmount: 100000,
    },
    images: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
    ],
    likes: 156,
    comments: 45,
    shares: 28,
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
      'My children need these supplies for the upcoming school term. Any help with textbooks, bags, or uniforms would be greatly appreciated.',
    liftType: 'non-monetary',
    cardType: 'lift-request',
    status: 'pending',
    timestamp: '3 hours ago',
    category: 'Education',
    location: 'Maryland, Lagos',
    timeRemaining: '30 days left',
    nonMonetary: {
      items: [
        { id: 'item1', name: 'Textbooks', quantity: 3 },
        { id: 'item2', name: 'School bags', quantity: 2 },
        { id: 'item3', name: 'Uniforms', quantity: 2 },
      ],
    },
    images: [
      'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800',
      'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800',
      'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800',
    ],
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
    description:
      'Need help setting up a home office for remote work. Looking for equipment donations or financial support to purchase necessary items.',
    liftType: 'both',
    cardType: 'lift-offer',
    status: 'accepted',
    timestamp: '5 hours ago',
    category: 'Technology',
    location: 'Ikoyi, Lagos',
    timeRemaining: '12 days left',
    offer: {
      monetaryAmount: 15000,
      items: [
        { id: 'item1', name: 'Laptop' },
        { id: 'item2', name: 'Monitor' },
        { id: 'item3', name: 'Keyboard' },
        { id: 'item4', name: 'Mouse' },
      ],
    },
    images: [
      'https://images.unsplash.com/photo-1593642532842-98d0fd5ebc1a?w=800',
      'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=800',
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800',
    ],
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
    description:
      'Building a health center for our community with donations. Thank you to everyone who contributed to making this dream a reality!',
    liftType: 'monetary',
    cardType: 'lift-raised',
    status: 'completed',
    timestamp: '1 day ago',
    category: 'Healthcare',
    location: 'Gbagada, Lagos',
    timeRemaining: 'Completed',
    images: [
      'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800',
      'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=800',
      'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=800',
    ],
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
