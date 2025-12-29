import React from 'react';
import { View } from 'react-native';
import { FeedPost } from './FeedPost';

export function FeedList() {
  // Placeholder data with different post types
  const posts = [
    // Text-only post with mentions and hashtags
    {
      id: '1',
      username: 'Isaac Tolulope',
      handle: 'dareytemy',
      timestamp: '10 seconds ago',
      profileImage: 'https://i.pravatar.cc/150?img=12',
      otherUsersCount: 5,
      content:
        'Today, I visited the orphanage home at Yaba, Lagos. I went there with @xyz and @abc. We had a joyful moment with the children of the @fgh orphanage. Check out #CommunityService #GivingBack https://lifteller.com/help',
      likes: 56,
      comments: 12,
      reposts: 12,
    },
    // Media post (single image)
    {
      id: '2',
      username: 'Sarah Johnson',
      handle: 'sarahj',
      timestamp: '15 minutes ago',
      profileImage: 'https://i.pravatar.cc/150?img=5',
      otherUsersCount: 3,
      content: 'Just completed an amazing community service project! 🌟',
      media: [
        {
          id: 'media-1',
          type: 'image' as const,
          uri: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800',
        },
      ],
      likes: 89,
      comments: 23,
      reposts: 15,
      withUsers: ['fgh', 'xyz', 'abc'],
    },
    // Media post (multiple images)
    {
      id: '3',
      username: 'Emma Williams',
      handle: 'emmaw',
      timestamp: '2 hours ago',
      profileImage: 'https://i.pravatar.cc/150?img=20',
      content: 'Amazing day with the team!',
      media: [
        {
          id: 'media-2',
          type: 'image' as const,
          uri: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400',
        },
        {
          id: 'media-3',
          type: 'image' as const,
          uri: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400',
        },
        {
          id: 'media-4',
          type: 'image' as const,
          uri: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400',
        },
        {
          id: 'media-5',
          type: 'video' as const,
          uri: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400',
        },
      ],
      likes: 124,
      comments: 34,
      reposts: 28,
    },
    // Lift post
    {
      id: '4',
      username: 'David Brown',
      handle: 'davidb',
      timestamp: '1 day ago',
      profileImage: 'https://i.pravatar.cc/150?img=15',
      content:
        'Please help support John with his medical expenses. Every contribution counts! #MedicalSupport #CommunityCare',
      lift: {
        title: 'John Medical Expenses',
        currentAmount: 45000,
        targetAmount: 100000,
      },
      withUsers: ['john', 'medicalteam'],
      likes: 234,
      comments: 45,
      reposts: 67,
    },
    // Text-only post with hashtags
    {
      id: '5',
      username: 'Michael Chen',
      handle: 'mchen',
      timestamp: '2 days ago',
      profileImage: 'https://i.pravatar.cc/150?img=9',
      content:
        'Small acts of kindness can create ripples of change. What will you do today to lift someone up? #Kindness #PayItForward 💜',
      likes: 89,
      comments: 12,
      reposts: 15,
    },
  ];

  return (
    <View>
      {posts.map((post) => (
        <FeedPost
          key={post.id}
          id={post.id}
          username={post.username}
          handle={post.handle}
          timestamp={post.timestamp}
          profileImage={post.profileImage}
          otherUsersCount={post.otherUsersCount}
          content={post.content}
          media={post.media}
          lift={post.lift}
          likes={post.likes}
          comments={post.comments}
          reposts={post.reposts}
          withUsers={post.withUsers}
        />
      ))}
    </View>
  );
}
