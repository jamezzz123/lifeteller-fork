import { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { X, BadgeCheck } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

import { colors } from '@/theme/colors';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { UserChip } from '@/components/ui/UserChip';
import { useLiftDraft } from '@/context/LiftDraftContext';
import { User } from '@/hooks/useUser';
import { ReviewContactsModal } from './ReviewContactsModal';

// Mock user data for testing
const MOCK_USERS: User[] = [
  {
    id: '1',
    username: 'isaac_tolulope',
    handle: 'dareytemy',
    fullName: 'Isaac Tolulope',
    email: 'isaac@example.com',
    profileImage: require('@/assets/images/user.png'),
    isVerified: true,
  },
  {
    id: '2',
    username: 'sarah_johnson',
    handle: 'sjohnson',
    fullName: 'Sarah Johnson',
    email: 'sarah@example.com',
    profileImage: { uri: 'https://i.pravatar.cc/150?img=5' },
    isVerified: true,
  },
  {
    id: '3',
    username: 'mike_chen',
    handle: 'mikechen',
    fullName: 'Mike Chen',
    email: 'mike@example.com',
    profileImage: { uri: 'https://i.pravatar.cc/150?img=12' },
    isVerified: false,
  },
  {
    id: '4',
    username: 'emily_davis',
    handle: 'emilyd',
    fullName: 'Emily Davis',
    email: 'emily@example.com',
    profileImage: { uri: 'https://i.pravatar.cc/150?img=9' },
    isVerified: true,
  },
  {
    id: '5',
    username: 'alex_wilson',
    handle: 'awilson',
    fullName: 'Alex Wilson',
    email: 'alex@example.com',
    profileImage: { uri: 'https://i.pravatar.cc/150?img=8' },
    isVerified: false,
  },
  {
    id: '6',
    username: 'lisa_brown',
    handle: 'lisab',
    fullName: 'Lisa Brown',
    email: 'lisa@example.com',
    profileImage: { uri: 'https://i.pravatar.cc/150?img=16' },
    isVerified: true,
  },
];

interface UserListItemProps {
  user: User;
  isSelected: boolean;
  onToggle: (user: User) => void;
}

function UserListItem({ user, isSelected, onToggle }: UserListItemProps) {
  return (
    <TouchableOpacity
      className="flex-row items-center border-b border-grey-plain-150 px-4 py-3"
      onPress={() => onToggle(user)}
      activeOpacity={0.7}
    >
      {/* Profile Picture */}
      <View className="mr-3">
        <Avatar
          profileImage={user.profileImage as string}
          name={user.fullName}
          size={48}
          showBadge={true}
          userId={user.id}
        />
      </View>

      {/* User Info */}
      <View className="flex-1">
        <View className="mb-0.5 flex-row items-center gap-1.5">
          <Text className="text-[15px] font-semibold text-grey-alpha-500">
            {user.fullName}
          </Text>
          {user.isVerified && (
            <BadgeCheck color={colors.primary.purple} size={16} />
          )}
        </View>
        <Text className="text-[13px] text-grey-plain-550">@{user.handle}</Text>
      </View>

      {/* Already Added Indicator */}
      {isSelected && (
        <View>
          <Text className="text-[13px] text-grey-plain-550">Already added</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

export default function AddCollaboratorsScreen() {
  const { collaborators, setCollaborators } = useLiftDraft();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<User[]>(collaborators);
  const [showReviewModal, setShowReviewModal] = useState(false);

  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) {
      return MOCK_USERS;
    }

    const query = searchQuery.toLowerCase();
    return MOCK_USERS.filter(
      (user) =>
        user.fullName.toLowerCase().includes(query) ||
        user.handle.toLowerCase().includes(query) ||
        user.username.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const handleToggleUser = (user: User) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    setSelectedUsers((prev) => {
      const isAlreadySelected = prev.some((u) => u.id === user.id);
      if (isAlreadySelected) {
        return prev.filter((u) => u.id !== user.id);
      } else {
        return [...prev, user];
      }
    });
  };

  const handleRemoveUser = (userId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedUsers((prev) => prev.filter((u) => u.id !== userId));
  };

  const handleNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    console.log('Selected Users:', selectedUsers);
    setCollaborators(selectedUsers);
    router.back();
  };

  const handleClose = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        {/* Header */}
        <View className="flex-row items-center justify-between border-b border-grey-plain-150 bg-white px-4 py-3">
          <View className="flex-row items-center gap-3">
            <TouchableOpacity onPress={handleClose}>
              <X
                color={colors['grey-plain']['550']}
                size={24}
                strokeWidth={2}
              />
            </TouchableOpacity>
            <Text className="text-lg font-semibold text-grey-alpha-500">
              Add collaborators
            </Text>
          </View>

          <Button
            title="Next"
            onPress={() => setShowReviewModal(true)}
            variant="primary"
            size="small"
            className="rounded-full px-6"
          />
        </View>

        {/* Search Section */}
        <View className="border-b border-grey-plain-150 bg-white px-4 py-4">
          <Text className="mb-3 text-sm text-grey-alpha-400">
            Search by username or name of user
          </Text>

          {/* Selected User Chips */}
          {selectedUsers.length > 0 && (
            <View className="mb-3 flex-row flex-wrap gap-2">
              {selectedUsers.map((user) => (
                <UserChip
                  key={user.id}
                  user={user}
                  onRemove={handleRemoveUser}
                />
              ))}
            </View>
          )}

          <View className="border-b border-grey-plain-450/40 pb-2">
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder=""
              placeholderTextColor={colors['grey-plain']['300']}
              autoCapitalize="none"
              autoCorrect={false}
              className="text-base text-grey-alpha-450"
              style={{
                fontSize: 16,
                color: colors['grey-alpha']['450'],
                padding: 0,
                margin: 0,
              }}
            />
          </View>
        </View>

        {/* User List */}
        <FlatList
          data={filteredUsers}
          renderItem={({ item }) => (
            <UserListItem
              user={item}
              isSelected={selectedUsers.some((u) => u.id === item.id)}
              onToggle={handleToggleUser}
            />
          )}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={
            <View className="px-4 py-8">
              <Text className="text-center text-sm text-grey-alpha-400">
                No users found
              </Text>
            </View>
          }
        />
      </KeyboardAvoidingView>

      <ReviewContactsModal
        title="Collaborators"
        visible={showReviewModal}
        contacts={selectedUsers.map((user) => ({
          id: user.id,
          name: user.fullName,
          username: user.handle,
          location: '', // Add location if available in User type
          verified: user.isVerified,
          avatar: user.profileImage,
        }))}
        onRemove={handleRemoveUser}
        onProceed={handleNext}
        onClose={() => {
          setShowReviewModal(false);
          handleClose();
        }}
      />
    </SafeAreaView>
  );
}
