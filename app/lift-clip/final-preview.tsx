import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import {
  MapPin,
  Banknote,
  CornerUpLeft,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

import { colors } from '@/theme/colors';
import { Button } from '@/components/ui/Button';
import { useRequestLift } from '@/context/request-lift';
import { SuccessBottomSheet } from '@/components/ui/SuccessBottomSheet';

export default function FinalPreviewScreen() {
  const params = useLocalSearchParams();
  const videoUri = params.videoUri as string;
  const linkedLiftName = params.name as string;
  const description = params.description as string;

  const { audienceOfferType, location, collaborators, liftAmount } =
    useRequestLift();

  const [allowCollaborators] = useState(true);
  const [allowRequesters] = useState(true);
  const [maxRequesters] = useState(10);

  const handleBack = () => {
    router.back();
  };

  const handleEditDetails = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };
  const [showSuccessSheet, setShowSuccessSheet] = useState(false);

  const handlePostClip = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // TODO: Submit the lift clip
    console.log('Post lift clip:', {
      videoUri,
      linkedLiftName,
      description,
      location,
      audienceOfferType,
      collaborators,
      allowCollaborators,
      allowRequesters,
    });
    setShowSuccessSheet(true);
  };

  const handleGoToFeeds = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowSuccessSheet(false);
    router.push('/(tabs)/lift-clips');
  };

  const handleShareClip = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // TODO: Implement share functionality
    console.log('Share clip');
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

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      {/* Header */}
      <View className="flex-row items-center justify-between border-b border-grey-plain-150 px-4 py-3">
        <TouchableOpacity
          onPress={handleBack}
          className="flex-row items-center gap-2"
        >
          <CornerUpLeft size={24} color={colors['grey-plain']['550']} />
          <Text className="text-lg font-inter-medium text-grey-plain-550">
            Preview lift clip
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Video Thumbnail */}
        {videoUri && (
          <View className="px-4 py-4">
            <Image
              source={{ uri: videoUri }}
              style={{
                width: 160,
                height: 220,
                borderRadius: 12,
              }}
              resizeMode="cover"
            />
          </View>
        )}

        {/* Description */}
        <View className="px-4 py-2">
          <Text className="text-sm text-grey-alpha-500">
            {description ||
              "Our local community garden is expanding, but we desperately need a simple web presence to organize volunteers, share meeting dates, and collect sign-ups. Right now, we're relying on paper sign-up sheets, which is chaotic."}
          </Text>
        </View>

        {/* Location */}
        {location && (
          <View className="flex-row items-center gap-2 px-4 py-2">
            <MapPin size={16} color={colors['grey-alpha']['500']} />
            <Text className="text-sm text-grey-alpha-500">{location}</Text>
          </View>
        )}

        {/* Amount */}
        {liftAmount > 0 && (
          <View className="flex-row items-center gap-2 px-4 py-2">
            <Banknote size={16} color={colors['grey-alpha']['500']} />
            <Text className="text-sm text-grey-alpha-500">
              ₦{liftAmount.toLocaleString()}
            </Text>
          </View>
        )}

        <View className="my-4 h-2 bg-grey-plain-150" />

        {/* Who can see my request */}
        <View className="px-4 py-3">
          <Text className="mb-2 text-sm font-inter-semibold text-grey-alpha-450">
            Who can see my request?
          </Text>
          <Text className="text-base font-inter-medium text-grey-alpha-550">
            {getAudienceLabel()}
          </Text>
        </View>

        {/* Grid Layout - 2 columns */}
        <View className="flex-row flex-wrap border-t border-grey-plain-150">
          {/* Added collaborators */}
          <View className="w-1/2 border-r border-grey-plain-150 px-4 py-3">
            <Text className="mb-2 text-sm text-grey-alpha-450">
              Added collaborators
            </Text>
            <Text className="text-base font-inter-semibold text-grey-alpha-550">
              {collaborators.length}
            </Text>
          </View>

          {/* Allow collaborators */}
          <View className="w-1/2 px-4 py-3">
            <Text className="mb-2 text-sm text-grey-alpha-450">
              Allow collaborators
            </Text>
            <Text className="text-base font-inter-semibold text-grey-alpha-550">
              {allowCollaborators ? 'Yes' : 'No'} (Unlimited)
            </Text>
          </View>

          {/* Allow requesters */}
          <View className="w-1/2 border-r border-t border-grey-plain-150 px-4 py-3">
            <Text className="mb-2 text-sm text-grey-alpha-450">
              Allow requesters
            </Text>
            <Text className="text-base font-inter-semibold text-grey-alpha-550">
              {allowRequesters ? 'Yes' : 'No'} ({maxRequesters})
            </Text>
          </View>
        </View>

        <View className="h-20" />
      </ScrollView>

      {/* Bottom Buttons */}
      <View className="b flex-row gap-3 border-t border-grey-plain-150 bg-grey-plain-300 px-4 py-4">
        <TouchableOpacity
          onPress={handleEditDetails}
          className="flex-1 items-center justify-center rounded-full border border-grey-plain-300 py-3"
        >
          <Text className="text-base font-inter-semibold text-grey-alpha-550">
            Edit details
          </Text>
        </TouchableOpacity>
        <View className="flex-1">
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
    </SafeAreaView>
  );
}
