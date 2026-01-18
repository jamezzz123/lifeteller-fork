import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Pressable,
  TextInput as RNTextInput,
  Alert,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
import {
  CornerUpLeft,
  MoreVertical,
  Camera,
  UserCircle,
  Settings,
  Phone,
  Mail,
  SquareMousePointer,
  CalendarHeart,
  CheckCircle2,
  ChevronRight,
  Info,
} from 'lucide-react-native';
import { colors } from '@/theme/colors';
import { useAuth } from '@/context/auth';
import { InterestChip } from '@/components/ui/InterestChip';
import { Button } from '@/components/ui/Button';
import { useUploadAvatar } from '@/lib/hooks/mutations/useUploadAvatar';
import { getInitials, getFullName } from '@/utils/user';

interface ProfileSectionProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  onPress?: () => void;
  showArrow?: boolean;
}

function ProfileSection({
  icon,
  title,
  children,
  onPress,
  showArrow = false,
}: ProfileSectionProps) {
  const content = (
    <View
      className="mx-4 rounded-xl bg-white p-4"
      style={{ backgroundColor: '#FAFBFC' }}
    >
      <View className="mb-3 flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          {icon}
          <Text className="text-sm font-inter-semibold text-grey-alpha-500">
            {title}
          </Text>
        </View>
        {showArrow && (
          <ChevronRight
            color={colors['grey-plain']['550']}
            size={20}
            strokeWidth={2}
          />
        )}
      </View>
      <View className="border-t border-grey-plain-300 pt-3">{children}</View>
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7} className="mt-4">
        {content}
      </TouchableOpacity>
    );
  }

  return <View className="mt-4">{content}</View>;
}

export default function EditDetailsScreen() {
  const { user } = useAuth();
  const uploadAvatarMutation = useUploadAvatar();
  const [isEditingName, setIsEditingName] = useState(false);
  const fullName = user ? getFullName(user.first_name, user.last_name) : '';
  const [name, setName] = useState(fullName);
  const [isUpdatingName, setIsUpdatingName] = useState(false);

  // Get user data with fallbacks
  const username = user?.username || '';
  const avatarUrl = user?.avatar_url;
  const initials = getInitials(fullName);
  const bio = user?.bio || '';

  // Extended user data (in real app, this would come from API)
  const [profileData] = useState({
    mobileNumber: user?.phone_number || '+2347091891971',
    mobileVerified: user?.is_phone_verified || false,
    email: user?.email || 'isaac.a@lifteller.com',
    emailVerified: user?.is_email_verified || false,
    bio:
      bio ||
      'Lazy Philanthropist. Touching lives one by one. This is who I am, this is what I am.',
    interests: user?.interests?.map((i: { name: string }) => i.name) || [
      'Religion-based',
      'Education',
      'Faith',
      'Healthcare and Medical',
      'Family',
    ],
    dateOfBirth: '12th December, 2005',
  });

  async function handleChangePhoto() {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      // Request permissions
      if (Platform.OS !== 'web') {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert(
            'Permission Required',
            'Sorry, we need camera roll permissions to upload your profile picture!'
          );
          return;
        }
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];

        // Check file size (5MB = 5242880 bytes)
        if (asset.fileSize && asset.fileSize > 5242880) {
          Alert.alert('Error', 'Image size should be 5MB or less.');
          return;
        }

        // Extract file extension from URI
        const uriParts = asset.uri.split('.');
        const fileExtension = uriParts[uriParts.length - 1] || 'jpg';
        const mimeType = `image/${
          fileExtension === 'jpg' || fileExtension === 'jpeg'
            ? 'jpeg'
            : fileExtension
        }`;

        // Upload avatar
        await uploadAvatarMutation.mutateAsync({
          uri: asset.uri,
          type: mimeType,
          name: `avatar.${fileExtension}`,
        });

        // Wait a bit for the profile to refresh, then show success
        setTimeout(() => {
          Alert.alert('Success', 'Profile picture updated successfully!');
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }, 500);
      }
    } catch (error: any) {
      // Extract error message
      let errorMessage = 'Failed to upload profile picture. Please try again.';
      if (error?.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }

      Alert.alert('Error', errorMessage);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  }

  async function handleUpdateName() {
    if (!name.trim()) {
      return;
    }

    try {
      setIsUpdatingName(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      // TODO: Validate name change frequency (once every 7 days)
      // TODO: Call API to update name
      await new Promise((resolve) => setTimeout(resolve, 500));

      // TODO: Call API to update name
      // For now, just update local state
      setIsEditingName(false);
    } catch (error) {
      console.error('Error updating name:', error);
    } finally {
      setIsUpdatingName(false);
    }
  }

  function handleCancelEditName() {
    setName(fullName);
    setIsEditingName(false);
  }

  return (
    <SafeAreaView className="flex-1 bg-grey-plain-50" edges={['top']}>
      {/* Header */}
      <View className="flex-row items-center justify-between border-b border-grey-plain-150 bg-white px-4 py-3">
        <View className="flex-row items-center gap-3">
          <TouchableOpacity onPress={() => router.back()}>
            <CornerUpLeft
              color={colors['grey-plain']['550']}
              size={24}
              strokeWidth={2}
            />
          </TouchableOpacity>
          <Text className="text-lg font-inter-semibold text-grey-alpha-500">
            Edit details
          </Text>
        </View>
        <TouchableOpacity>
          <MoreVertical
            color={colors['grey-plain']['550']}
            size={24}
            strokeWidth={2}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        {/* Profile Picture Section */}
        <View className="items-center py-8">
          <Pressable
            onPress={handleChangePhoto}
            className="relative"
            disabled={uploadAvatarMutation.isPending}
          >
            <View className="h-24 w-24 overflow-hidden rounded-full bg-grey-plain-300">
              {avatarUrl ? (
                <Image
                  source={{ uri: avatarUrl }}
                  style={{ width: 96, height: 96 }}
                  contentFit="cover"
                />
              ) : initials ? (
                <View className="bg-primary-tints-purple-100 h-full w-full items-center justify-center">
                  <Text
                    className="text-2xl font-inter-bold"
                    style={{ color: colors.primary.purple }}
                  >
                    {initials}
                  </Text>
                </View>
              ) : (
                <View
                  className="h-full w-full"
                  style={{ backgroundColor: colors['grey-plain']['450'] }}
                />
              )}
            </View>
            <View className="absolute bottom-0 right-0 h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-white">
              {uploadAvatarMutation.isPending ? (
                <ActivityIndicator
                  size="small"
                  color={colors['grey-alpha']['500']}
                />
              ) : (
                <Camera
                  color={colors['grey-alpha']['500']}
                  size={14}
                  strokeWidth={2.5}
                />
              )}
            </View>
          </Pressable>
          <Pressable
            onPress={handleChangePhoto}
            className="mt-3"
            disabled={uploadAvatarMutation.isPending}
          >
            <Text
              className="text-sm font-inter-medium"
              style={{ color: colors.primary.purple }}
            >
              {uploadAvatarMutation.isPending ? 'Uploading...' : 'Change photo'}
            </Text>
          </Pressable>
        </View>

        {/* Name/Username Section */}
        <ProfileSection
          icon={
            <UserCircle
              color={colors['grey-alpha']['500']}
              size={18}
              strokeWidth={2}
            />
          }
          title="Name/username"
        >
          {isEditingName ? (
            <>
              {/* Name Input */}
              <View className="mb-4">
                <View className="mb-1.5 flex-row items-center gap-2">
                  <Info
                    color={colors['grey-plain']['550']}
                    size={16}
                    strokeWidth={2}
                  />
                  <Text className="text-sm font-inter-semibold text-grey-alpha-500">
                    Name/username
                  </Text>
                </View>
                <View
                  className="rounded-xl border bg-grey-plain-50 px-4"
                  style={{
                    borderColor: colors['grey-alpha']['250'],
                    minHeight: 48,
                  }}
                >
                  <RNTextInput
                    value={name}
                    onChangeText={setName}
                    placeholder="Enter your name"
                    placeholderTextColor={colors['grey-alpha']['400']}
                    autoCapitalize="words"
                    className="flex-1 text-base text-grey-alpha-500"
                    style={{
                      fontSize: 16,
                      color: colors['grey-alpha']['500'],
                      paddingVertical: 12,
                    }}
                  />
                </View>
              </View>

              {/* Info Message */}
              <View className="mb-6 flex-row items-start gap-2 rounded-lg bg-grey-plain-150 p-3">
                <Info
                  color={colors['grey-plain']['550']}
                  size={16}
                  strokeWidth={2}
                />
                <Text className="flex-1 text-xs text-grey-plain-550">
                  You can change your name once in every 7 days.
                </Text>
              </View>

              {/* Action Buttons */}
              <View className="flex-row gap-3">
                <View className="flex-1">
                  <Button
                    title="Close"
                    onPress={handleCancelEditName}
                    variant="outline"
                    size="small"
                    disabled={isUpdatingName}
                  />
                </View>
                <View className="flex-1">
                  <Button
                    title="Update name"
                    onPress={handleUpdateName}
                    variant="primary"
                    size="small"
                    loading={isUpdatingName}
                    disabled={!name.trim() || isUpdatingName}
                  />
                </View>
              </View>

              {/* Username Section */}
              <View className="mt-6 border-t border-grey-plain-300 pt-6">
                <View className="flex-row items-center justify-between">
                  <Text className="text-sm text-grey-alpha-500">
                    @{username}
                  </Text>
                  <Pressable
                    onPress={() => {
                      // TODO: Navigate to username edit screen
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }}
                    className="px-2"
                  >
                    <Text
                      className="text-sm font-inter-medium underline"
                      style={{ color: colors.primary.purple }}
                    >
                      Edit
                    </Text>
                  </Pressable>
                </View>
              </View>
            </>
          ) : (
            <>
              <View className="mb-3 flex-row items-center justify-between">
                <Text className="text-sm text-grey-alpha-500">
                  {fullName || 'User'}
                </Text>
                <Pressable
                  onPress={() => setIsEditingName(true)}
                  className="px-2"
                >
                  <Text
                    className="text-sm font-inter-medium"
                    style={{ color: colors.primary.purple }}
                  >
                    Edit
                  </Text>
                </Pressable>
              </View>
              <View className="flex-row items-center justify-between">
                <Text className="text-sm text-grey-alpha-500">@{username}</Text>
                <Pressable
                  onPress={() => {
                    // TODO: Navigate to username edit screen
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }}
                  className="px-2"
                >
                  <Text
                    className="text-sm font-inter-medium"
                    style={{ color: colors.primary.purple }}
                  >
                    Edit
                  </Text>
                </Pressable>
              </View>
            </>
          )}
        </ProfileSection>

        {/* Tagline/Bio Section */}
        <ProfileSection
          icon={
            <Settings
              color={colors['grey-alpha']['500']}
              size={18}
              strokeWidth={2}
            />
          }
          title="Tagline/bio"
          onPress={() => {
            // TODO: Navigate to bio edit screen
          }}
          showArrow
        >
          {profileData.bio ? (
            <Text className="text-sm leading-5 text-grey-alpha-500">
              {profileData.bio}
            </Text>
          ) : (
            <>
              <Text className="mb-2 text-sm font-inter-medium text-grey-alpha-500">
                Not added yet
              </Text>
              <Text className="mb-3 text-xs text-grey-plain-550">
                Adding a tagline/bio help us show your posts to those who it
                matters to.
              </Text>
              <Pressable
                onPress={() => {
                  // TODO: Navigate to bio edit screen
                }}
                className="self-center rounded-lg border px-4 py-2"
                style={{
                  borderColor: colors.primary.purple,
                }}
              >
                <Text
                  className="text-sm font-inter-medium"
                  style={{ color: colors.primary.purple }}
                >
                  Add bio/tagline
                </Text>
              </Pressable>
            </>
          )}
        </ProfileSection>

        {/* Mobile Number Section */}
        <ProfileSection
          icon={
            <Phone
              color={colors['grey-alpha']['500']}
              size={18}
              strokeWidth={2}
            />
          }
          title="Mobile number"
          onPress={() => {
            // TODO: Navigate to mobile edit screen
          }}
          showArrow
        >
          {profileData.mobileNumber ? (
            <View className="flex-row items-center justify-between">
              <Text className="text-sm text-grey-alpha-500">
                {profileData.mobileNumber}
              </Text>
              {profileData.mobileVerified && (
                <View className="flex-row items-center gap-1">
                  <CheckCircle2
                    color={colors.state.green}
                    size={16}
                    strokeWidth={2}
                  />
                  <Text
                    className="text-xs font-inter-medium"
                    style={{ color: colors.state.green }}
                  >
                    Verified
                  </Text>
                </View>
              )}
            </View>
          ) : (
            <>
              <Text className="mb-2 text-sm font-inter-medium text-grey-alpha-500">
                Not added yet
              </Text>
              <Text className="mb-3 text-xs text-grey-plain-550">
                Adding a mobile number help protect your account from bad
                actors.
              </Text>
              <Pressable
                onPress={() => {
                  // TODO: Navigate to mobile edit screen
                }}
                className="self-center rounded-lg border px-4 py-2"
                style={{
                  borderColor: colors.primary.purple,
                }}
              >
                <Text
                  className="text-sm font-inter-medium"
                  style={{ color: colors.primary.purple }}
                >
                  Add mobile number
                </Text>
              </Pressable>
            </>
          )}
        </ProfileSection>

        {/* Email Address Section */}
        <ProfileSection
          icon={
            <Mail
              color={colors['grey-alpha']['500']}
              size={18}
              strokeWidth={2}
            />
          }
          title="Email address"
          onPress={() => {
            // TODO: Navigate to email edit screen
          }}
          showArrow
        >
          {profileData.email ? (
            <View className="flex-row items-center justify-between">
              <Text className="text-sm text-grey-alpha-500">
                {profileData.email}
              </Text>
              {profileData.emailVerified && (
                <View className="flex-row items-center gap-1">
                  <CheckCircle2
                    color={colors.state.green}
                    size={16}
                    strokeWidth={2}
                  />
                  <Text
                    className="text-xs font-inter-medium"
                    style={{ color: colors.state.green }}
                  >
                    Verified
                  </Text>
                </View>
              )}
            </View>
          ) : (
            <>
              <Text className="mb-2 text-sm font-inter-medium text-grey-alpha-500">
                Not added yet
              </Text>
              <Text className="mb-3 text-xs text-grey-plain-550">
                Adding an email address help protect your account from bad
                actors.
              </Text>
              <Pressable
                onPress={() => {
                  // TODO: Navigate to email edit screen
                }}
                className="self-center rounded-lg border px-4 py-2"
                style={{
                  borderColor: colors.primary.purple,
                }}
              >
                <Text
                  className="text-sm font-inter-medium"
                  style={{ color: colors.primary.purple }}
                >
                  Add email address
                </Text>
              </Pressable>
            </>
          )}
        </ProfileSection>

        {/* Interests Section */}
        <ProfileSection
          icon={
            <SquareMousePointer
              color={colors['grey-alpha']['500']}
              size={18}
              strokeWidth={2}
            />
          }
          title="Interests"
          onPress={() => router.push('/edit-interests' as any)}
          showArrow
        >
          <View className="flex-row flex-wrap gap-2">
            {profileData.interests.map((interest: string, index: number) => (
              <InterestChip key={index} label={interest} selected />
            ))}
          </View>
        </ProfileSection>

        {/* Date of Birth Section */}
        <ProfileSection
          icon={
            <CalendarHeart
              color={colors['grey-alpha']['500']}
              size={18}
              strokeWidth={2}
            />
          }
          title="Date of birth"
          onPress={() => router.push('/edit-date-of-birth' as any)}
          showArrow
        >
          <Text className="text-sm text-grey-alpha-500">
            {profileData.dateOfBirth}
          </Text>
        </ProfileSection>
      </ScrollView>
    </SafeAreaView>
  );
}
