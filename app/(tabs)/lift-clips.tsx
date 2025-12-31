import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useIsFocused } from '@react-navigation/native';
import { LiftClipsFeed } from '@/components/clips/LiftClipsFeed';
import { LiftClipData } from '@/components/clips/LiftClipItem';
import { ClipOptionsBottomSheet } from '@/components/clips/ClipOptionsBottomSheet';
import { BottomSheetRef } from '@/components/ui/BottomSheet';

// Sample data - Replace with actual data from your API/backend
const SAMPLE_CLIPS: LiftClipData[] = [
  {
    id: '1',
    videoUri:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    user: {
      id: 'user1',
      name: 'Nadin Tollelier',
      username: 'nadintollelier',
      profileImage: undefined,
    },
    caption:
      'Raising funds for our community garden project! Every contribution helps us grow fresh produce for local families in need. Join us in making a difference! 🌱',
    location: 'Event in Main Lodge',
    liftDetails: 'Community Garden Initiative',
    likes: 737,
    comments: 746,
    isLiked: false,
    isSaved: false,
  },
  {
    id: '2',
    videoUri:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    user: {
      id: 'user2',
      name: 'Sarah Johnson',
      username: 'sarahjohnson',
      profileImage: undefined,
    },
    caption:
      'Supporting local education initiatives. Help us provide school supplies and resources to underserved communities. Together we can make education accessible to all!',
    location: 'Downtown Community Center',
    liftDetails: 'Education Support Program',
    likes: 1205,
    comments: 892,
    isLiked: false,
    isSaved: false,
  },
  {
    id: '3',
    videoUri:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    user: {
      id: 'user3',
      name: 'Michael Chen',
      username: 'michaelchen',
      profileImage: undefined,
    },
    caption:
      "Emergency relief fund for families affected by recent floods. Every dollar counts in helping rebuild homes and lives. Let's come together! 🤝",
    location: 'Riverside Community',
    liftDetails: 'Flood Relief Fund',
    likes: 2341,
    comments: 1523,
    isLiked: false,
    isSaved: false,
  },
];

export default function LiftClipsScreen() {
  const isFocused = useIsFocused();
  const [isTabFocused, setIsTabFocused] = useState(true);
  const clipOptionsBottomSheetRef = useRef<BottomSheetRef>(null);
  const [selectedClipId, setSelectedClipId] = useState<string | null>(null);

  useEffect(() => {
    setIsTabFocused(isFocused);
  }, [isFocused]);

  const handleLike = (clipId: string) => {
    console.log('Like clip:', clipId);
    // TODO: Implement like functionality
  };

  const handleComment = (clipId: string) => {
    console.log('Comment on clip:', clipId);
    // TODO: Implement comment functionality
  };

  const handleShare = (clipId: string) => {
    console.log('Share clip:', clipId);
    // TODO: Implement share functionality
  };

  const handleSave = (clipId: string) => {
    console.log('Save clip:', clipId);
    // TODO: Implement save functionality
  };

  const handleJoinLift = (clipId: string) => {
    console.log('Join lift:', clipId);
    // TODO: Implement join lift functionality
  };

  const handleViewLiftDetails = (clipId: string) => {
    console.log('View lift details:', clipId);
    // TODO: Implement view lift details functionality
  };

  const handleOpenClipOptions = (clipId: string) => {
    setSelectedClipId(clipId);
    clipOptionsBottomSheetRef.current?.expand();
  };

  // Clip Options Menu Handlers
  const handleBecomeCollaborator = () => {
    console.log('Become collaborator for clip:', selectedClipId);
    // TODO: Implement become collaborator functionality
  };

  const handleJoinAsBeneficiary = () => {
    console.log('Join as beneficiary for clip:', selectedClipId);
    // TODO: Implement join as beneficiary functionality
  };

  const handleUnfollow = () => {
    console.log('Unfollow user from clip:', selectedClipId);
    // TODO: Implement unfollow functionality
  };

  const handleAboutAccount = () => {
    console.log('View about account for clip:', selectedClipId);
    // TODO: Implement about account functionality
  };

  const handleHideClip = () => {
    console.log('Hide clip:', selectedClipId);
    // TODO: Implement hide clip functionality
  };

  const handleWhySeeing = () => {
    console.log('Why seeing clip:', selectedClipId);
    // TODO: Implement why seeing functionality
  };

  const handleSaveForLater = () => {
    console.log('Save for later:', selectedClipId);
    // TODO: Implement save for later functionality
  };

  const handleGetQRCode = () => {
    console.log('Get QR code for clip:', selectedClipId);
    // TODO: Implement QR code functionality
  };

  const handleReportClip = () => {
    console.log('Report clip:', selectedClipId);
    // TODO: Implement report clip functionality
  };

  const handleReportAndBlock = () => {
    console.log('Report and block user from clip:', selectedClipId);
    // TODO: Implement report and block functionality
  };

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']}>
      <LiftClipsFeed
        clips={SAMPLE_CLIPS}
        isTabFocused={isTabFocused}
        onLike={handleLike}
        onComment={handleComment}
        onShare={handleShare}
        onSave={handleSave}
        onJoinLift={handleJoinLift}
        onViewLiftDetails={handleViewLiftDetails}
        onOpenClipOptions={handleOpenClipOptions}
      />

      <ClipOptionsBottomSheet
        ref={clipOptionsBottomSheetRef}
        onBecomeCollaborator={handleBecomeCollaborator}
        onJoinAsBeneficiary={handleJoinAsBeneficiary}
        onUnfollow={handleUnfollow}
        onAboutAccount={handleAboutAccount}
        onHideClip={handleHideClip}
        onWhySeeing={handleWhySeeing}
        onSaveForLater={handleSaveForLater}
        onGetQRCode={handleGetQRCode}
        onReportClip={handleReportClip}
        onReportAndBlock={handleReportAndBlock}
      />
    </SafeAreaView>
  );
}
