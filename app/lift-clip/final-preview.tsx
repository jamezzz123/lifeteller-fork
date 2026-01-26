import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  StatusBar,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import {
  CornerUpLeft,
  BadgeCheck,
  Music2,
  Calendar,
  Link2,
  Globe,
  ScanEye,
  Hand,
  HandHelping,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { BlurView } from 'expo-blur';

import { colors } from '@/theme/colors';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { useRequestLift } from '@/context/request-lift';
import { SuccessBottomSheet } from '@/components/ui/SuccessBottomSheet';
import { CancelBottomSheet } from '@/components/lift';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function FinalPreviewScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  const videoUri = params.videoUri as string;
  const linkedLiftName = params.name as string;
  const description = params.description as string;

  const { audienceOfferType, location, liftAmount } = useRequestLift();

  const [showCancelSheet, setShowCancelSheet] = useState(false);
  const [showSuccessSheet, setShowSuccessSheet] = useState(false);

  // Mock user data - replace with actual user data
  const user = {
    name: 'Isaac Tolulope',
    username: 'dareytemy',
    avatar: 'https://i.pravatar.cc/150?img=12',
    verified: true,
  };

  // Mock schedule date - replace with actual data from context
  const scheduleDate = new Date('2026-12-12T13:15:00');

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowCancelSheet(true);
  };

  const handleSaveAsDraft = () => {
    setShowCancelSheet(false);
    router.back();
  };

  const handleDiscard = () => {
    setShowCancelSheet(false);
    router.back();
  };

  const handleContinueEditing = () => {
    setShowCancelSheet(false);
  };

  const handleEditDetails = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  const handlePostClip = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setShowSuccessSheet(true);
  };

  const handleGoToFeeds = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowSuccessSheet(false);
    router.push('/(tabs)/lift-clips');
  };

  const handleShareClip = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowSuccessSheet(false);
    router.push('/(tabs)/lift-clips');
  };

  const getAudienceLabel = () => {
    switch (audienceOfferType) {
      case 'everyone':
        return 'Everyone';
      case 'friends':
        return 'Friends';
      case 'selected-people':
        return 'Selected people';
      case 'my-list':
        return 'My list';
      case 'private':
        return 'Private';
      default:
        return 'Everyone';
    }
  };

  const formatScheduleDate = (date: Date) => {
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }) + ', ' + date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).toLowerCase();
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      {/* <StatusBar barStyle="dark-content" backgroundColor="white" /> */}

      {/* Header Overlay */}
      <View
        //  className="absolute top-0 left-0 right-0 justify-between bg-white px-2 z-10"
        className="absolute left-4 z-10"
        style={{ top: insets.top + 10 }}
      >
        <BlurView
          intensity={30}
          tint="light"
          className="overflow-hidden rounded-full"
        >
          <TouchableOpacity
            onPress={handleBack}
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.65)' }}
            className="flex-row items-center gap-2 px-5 py-3"
          >
            <CornerUpLeft size={20} color="black" />
            <Text className="font-inter-medium text-base text-black">
              Preview lift clip
            </Text>
          </TouchableOpacity>
        </BlurView>
      </View>

      {/* Full-screen Background Image/Video */}
      <Image
        source={
          videoUri
            ? { uri: videoUri }
            : require('../../assets/images/welcome/collage-1.jpg')
        }
        style={{
          position: 'absolute',
          width: '100%',
          height: SCREEN_HEIGHT,
        }}
        resizeMode="cover"
      />

      {/* Bottom Content Overlay */}
      <View
        className="absolute bottom-0 left-0 right-0"
        style={{ paddingBottom: insets.bottom + 80 }}
      >
       <View className="flex-1 gap-2 px-3 py-1.5">
        <View className="flex-row justify-between items-center">
          <View className=" flex-1 flex-row items-center gap-3">
              <Avatar
                profileImage={user.avatar}
                name={user.name}
                size={40}
              />
              <View className="flex-1">
                <View className="flex-row items-center gap-1">
                  <Text className="font-inter-medium text-base text-grey-plain-50">
                    {user.name}
                  </Text>
                  {user.verified && (
                    <BadgeCheck
                      size={16}
                      color={colors['grey-plain']['50']}
                      fill={colors.primary.purple}
                    />
                  )}
                </View>
                <View className="flex-row items-center gap-1">
                  <Text className="text-sm text-white/80">
                    @{user.username}
                  </Text>
                  {location && (
                    <>
                      <View
                        style={{
                          height: 4,
                          width: 4,
                          backgroundColor: 'rgba(255,255,255,0.6)',
                          borderRadius: 2,
                        }}
                      />
                      <Text className="text-sm text-white/80">{location}</Text>
                    </>
                  )}
                </View>
              </View>
          </View>
          <View
            className="flex-row items-center gap-1 rounded-full"
          >
            <ScanEye size={14} color={colors['grey-plain']['200']} />
            <Text className="text-xs text-grey-plain-50">
              {getAudienceLabel()}
            </Text>
          </View>
        </View>
        <View>
          <Text
              className="text-sm leading-5 text-grey-plain-50"
              numberOfLines={3}
            >
              {description ||
                "Our local community garden is expanding, but we desperately need a simple online presence to organize volunteers, share meeting dates, and collect sign-up..."}
            </Text>
        </View>
         <View className="flex-row justify-between items-center gap-2">
         {/* Music Info */}
            <View className="flex-row items-center gap-2">
              <Music2 size={14} color={colors['grey-plain']['50']} />
              <Text className="text-xs text-grey-plain-50">
                Temi ni Temi • Brymo
              </Text>
            </View>

            {/* Schedule Date */}
            <View className="flex-row items-center gap-2">
              <Calendar size={14} color={colors['grey-plain']['50']} />
              <Text className="text-xs text-grey-plain-50">
                {formatScheduleDate(scheduleDate)}
              </Text>
            </View>
        </View>
        <View>
           <View className="flex-row items-center gap-2">
                <HandHelping size={14} color={colors['grey-plain']['50']} />
                <Text className="font-inter-semibold text-sm text-grey-plain-50">
                  ₦{liftAmount.toLocaleString()}
                </Text>
              </View>
        </View>
       </View>   
      </View>

      {/* Fixed Bottom Buttons */}
      <View
        className="absolute bottom-0 left-0 right-0 flex-row items-center justify-between gap-4 bg-white px-4"
        style={{
          paddingBottom: Math.max(insets.bottom, 16),
          paddingTop: 16,
        }}
      >
        <TouchableOpacity onPress={handleEditDetails}>
          <Text className="font-inter-semibold text-base text-grey-alpha-500">
            Edit details
          </Text>
        </TouchableOpacity>
        <View style={{ width: 140 }}>
          <Button title="Post clip" onPress={handlePostClip} />
        </View>
      </View>

      <SuccessBottomSheet
        visible={showSuccessSheet}
        title="Lift clip posted"
        description="We have posted your lift clip."
        primaryActionText="Share clip"
        secondaryActionText="Go to feeds"
        onPrimaryAction={handleShareClip}
        onSecondaryAction={handleGoToFeeds}
      />

      <CancelBottomSheet
        visible={showCancelSheet}
        onSaveAsDraft={handleSaveAsDraft}
        onDiscard={handleDiscard}
        onContinueEditing={handleContinueEditing}
      />
    </SafeAreaView>
  );
}
