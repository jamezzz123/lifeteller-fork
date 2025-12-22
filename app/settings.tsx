import React, { useState, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import {
  CornerUpLeft,
  Search,
  Lock,
  UserLock,
  RectangleEllipsis,
  ShieldUser,
  ChevronRight,
  Palette,
  Languages,
  Key,
  Smartphone,
  EyeOff,
  CloudDownload,
  Bell,
  Package,
  ListChecks,
  BookmarkCheck,
  CalendarClock,
  MailQuestion,
  LogOut,
  UserX,
  Trash2,
  LockKeyholeOpen,
} from 'lucide-react-native';
import { colors } from '@/theme/colors';
import { BottomSheetRef } from '@/components/ui/BottomSheet';
import { LanguageBottomSheet } from '@/components/settings/LanguageBottomSheet';
import { ConfirmationBottomSheet } from '@/components/ui/ConfirmationBottomSheet';

interface SettingsOption {
  id: string;
  icon: React.ComponentType<{
    color: string;
    size: number;
    strokeWidth: number;
  }>;
  title: string;
  description: string;
  iconColor?: string;
  onPress?: () => void;
}

interface SettingsSection {
  id: string;
  title: string;
  options: SettingsOption[];
}

function SettingsSectionComponent({ section }: { section: SettingsSection }) {
  return (
    <View
      className="mx-4 mt-6 rounded-2xl p-2"
      style={{ backgroundColor: colors['grey-plain']['150'] }}
    >
      <Text className="mb-4 ml-3 mt-2 text-base font-semibold text-grey-alpha-500">
        {section.title}
      </Text>

      {/* Options */}
      <View className="gap-1">
        {section.options.map((option) => {
          const IconComponent = option.icon;
          const iconColor = option.iconColor || colors.primary.purple;

          return (
            <TouchableOpacity
              key={option.id}
              onPress={option.onPress}
              className="flex-row items-center gap-4 rounded-xl bg-white px-4 py-4"
              activeOpacity={0.7}
            >
              <View
                className="h-12 w-12 items-center justify-center rounded-full"
                style={{
                  backgroundColor: colors['primary-tints'].purple['50'],
                }}
              >
                <IconComponent color={iconColor} size={24} strokeWidth={2} />
              </View>
              <View className="flex-1">
                <Text className="mb-1 text-[15px] font-semibold text-grey-alpha-500">
                  {option.title}
                </Text>
                <Text className="text-sm text-grey-plain-550">
                  {option.description}
                </Text>
              </View>
              <ChevronRight
                color={colors['grey-plain']['550']}
                size={20}
                strokeWidth={2}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

export default function SettingsScreen() {
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);
  const languageSheetRef = useRef<BottomSheetRef>(null);

  const handleSignOut = () => {
    // TODO: Implement actual sign out logic
    console.log('User signed out');
    setShowSignOutConfirm(false);
    // Navigate to login screen
    router.replace('/(auth)/get-started');
  };

  const settingsSections: SettingsSection[] = [
    {
      id: 'account',
      title: 'Account',
      options: [
        {
          id: 'password',
          icon: UserLock,
          title: 'Password',
          description: 'Change or reset your password',
          onPress: () => {
            router.push('/password');
          },
        },
        {
          id: 'wallet-passcode',
          icon: RectangleEllipsis,
          title: 'Wallet passcode',
          description: 'Change or reset your passcode',
          onPress: () => {
            router.push('/wallet-passcode');
          },
        },
        {
          id: 'account-privacy',
          icon: ShieldUser,
          title: 'Account privacy',
          description: 'Control who can view your profile and posts.',
          onPress: () => {
            router.push('/account-privacy');
          },
        },
      ],
    },
    {
      id: 'appearance',
      title: 'Appearance and personalisation',
      options: [
        {
          id: 'theme',
          icon: Palette,
          title: 'Theme',
          description: 'Switch between light, dark, or system mode.',
          onPress: () => {
            router.push('/theme');
          },
        },
        {
          id: 'language',
          icon: Languages,
          title: 'Language',
          description: "Change the app's display language",
          onPress: () => {
            languageSheetRef.current?.expand();
          },
        },
      ],
    },
    {
      id: 'security',
      title: 'Security and privacy',
      options: [
        {
          id: '2fa',
          icon: Key,
          title: 'Two-factor authentication (2FA)',
          description: 'Add an extra layer of protection to your account',
          onPress: () => {
            router.push('/two-factor-auth');
          },
        },
        {
          id: 'device-management',
          icon: Smartphone,
          title: 'Device management',
          description: 'Review and manage your active login sessions',
          onPress: () => {
            router.push('/device-management');
          },
        },
        {
          id: 'hidden-posts',
          icon: EyeOff,
          title: 'Hidden posts',
          description: 'See content you have chosen to hide from your feed',
          onPress: () => {
            router.push('/hidden-posts');
          },
        },
        {
          id: 'request-data',
          icon: CloudDownload,
          title: 'Request/download your data',
          description: 'Request my data information as part of the GDPR law',
          onPress: () => {
            router.push('/data-request');
          },
        },
        {
          id: 'app-permissions',
          icon: Bell,
          title: 'View app permissions',
          description: 'See what we access to on your device',
          onPress: () => {
            router.push('/app-permissions');
          },
        },
      ],
    },
    {
      id: 'content',
      title: 'Content and preferences',
      options: [
        {
          id: 'my-list',
          icon: ListChecks,
          title: 'My list',
          description: 'Manage your lists and members.',
          onPress: () => {
            router.push('/my-list');
          },
        },
        {
          id: 'saved-posts',
          icon: BookmarkCheck,
          title: 'Saved posts',
          description: 'View and manage the content you have bookmarked.',
          onPress: () => {
            router.push('/saved-posts');
          },
        },
        {
          id: 'scheduled-posts',
          icon: CalendarClock,
          title: 'Scheduled posts',
          description: 'View and managed your scheduled posts.',
          onPress: () => {
            router.push('/scheduled-posts');
          },
        },
      ],
    },
    {
      id: 'app-notifications',
      title: 'App and notifications',
      options: [
        {
          id: 'notifications',
          icon: Bell,
          title: 'Notifications',
          description: 'Adjust alerts for activity, messages, and followers',
          onPress: () => {
            router.push('/notifications');
          },
        },
        {
          id: 'app-updates',
          icon: Package,
          title: 'App updates',
          description: 'See the latest version and update information',
          onPress: () => {
            router.push('/app-updates');
          },
        },
      ],
    },
    {
      id: 'support',
      title: 'Support and community',
      options: [
        {
          id: 'help-feedback',
          icon: MailQuestion,
          title: 'Help and feedback',
          description:
            'Find FAQs, contact support, privacy policy, or report a bug',
          onPress: () => {
            router.push('/help-feedback');
          },
        },
      ],
    },
    {
      id: 'others',
      title: 'Others',
      options: [
        {
          id: 'sign-out',
          icon: LogOut,
          title: 'Sign out',
          description: 'Sign out of your account on this device',
          iconColor: colors.state.red,
          onPress: () => {
            setShowSignOutConfirm(true);
          },
        },
        {
          id: 'deactivate-account',
          icon: UserX,
          title: 'Deactivate account',
          description: 'Temporarily disable your account',
          iconColor: colors.state.red,
          onPress: () => {
            router.push('/deactivate-account');
          },
        },
        {
          id: 'delete-account',
          icon: Trash2,
          title: 'Delete account',
          description: 'Permanently remove your profile and data.',
          iconColor: colors.state.red,
          onPress: () => {
            router.push('/delete-account');
          },
        },
      ],
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'bottom']}>
      {/* Header */}
      <View className="flex-row items-center justify-between border-b border-grey-plain-150 bg-white px-4 py-3">
        <View className="flex-row items-center gap-3">
          <TouchableOpacity onPress={() => router.back()} className="mr-3">
            <CornerUpLeft
              color={colors['grey-plain']['550']}
              size={24}
              strokeWidth={2}
            />
          </TouchableOpacity>
          <Text className="text-lg font-semibold text-grey-alpha-500">
            Settings
          </Text>
        </View>
        <TouchableOpacity>
          <Search
            color={colors['grey-alpha']['500']}
            size={24}
            strokeWidth={2}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 16 }}
      >
        {/* Account Protection Banner */}
        <View
          className="mx-4 mt-4 flex-row items-center gap-2 rounded-lg px-4 py-3"
          style={{ backgroundColor: colors['green-tint']['200'] }}
        >
          <Lock
            color={colors['green-shades']['150']}
            size={20}
            strokeWidth={2}
          />
          <Text
            className="flex-1 text-sm font-medium"
            style={{ color: colors['green-shades']['150'] }}
          >
            Your account is fully protected
          </Text>
        </View>

        <View
          className="mx-4 mt-4 flex-row items-center gap-2 rounded-lg px-4 py-3"
          style={{ backgroundColor: colors['yellow-tint']['150'] }}
        >
          <LockKeyholeOpen
            color={colors.state.yellow}
            size={20}
            strokeWidth={2}
          />
          <Text
            className="flex-1 text-sm font-medium"
            style={{ color: colors.state.yellow }}
          >
            Your account is not fully protected. Activate your two-factor
            authentication.
          </Text>
        </View>

        {/* Settings Sections */}
        {settingsSections.map((section) => (
          <SettingsSectionComponent key={section.id} section={section} />
        ))}
      </ScrollView>

      {/* Language Bottom Sheet */}
      <LanguageBottomSheet
        ref={languageSheetRef}
        selectedLanguage={selectedLanguage}
        onSelectLanguage={(language) => {
          setSelectedLanguage(language);
          languageSheetRef.current?.close();
        }}
      />

      {/* Sign Out Confirmation */}
      <ConfirmationBottomSheet
        visible={showSignOutConfirm}
        icon={LogOut}
        title="Sign out"
        description="Are you sure you want to sign out?"
        cancelText="No, go back"
        confirmText="Yes, sign out"
        confirmVariant="destructive"
        onCancel={() => setShowSignOutConfirm(false)}
        onConfirm={handleSignOut}
      />
    </SafeAreaView>
  );
}
