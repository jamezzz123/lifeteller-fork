import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import {
  CornerUpLeft,
  Camera,
  Mic,
  PhoneCall,
  Contact,
} from 'lucide-react-native';
import LogoColor from '@/assets/images/logo/logo-color.svg';
import { colors } from '@/theme/colors';

interface Permission {
  id: string;
  name: string;
  icon: React.ComponentType<{
    color: string;
    size: number;
    strokeWidth: number;
  }>;
}

const GRANTED_PERMISSIONS: Permission[] = [
  {
    id: 'camera',
    name: 'Camera',
    icon: Camera,
  },
  {
    id: 'microphone',
    name: 'Microphone',
    icon: Mic,
  },
];

const NOT_GRANTED_PERMISSIONS: Permission[] = [
  {
    id: 'call-logs',
    name: 'Call logs',
    icon: PhoneCall,
  },
  {
    id: 'contact',
    name: 'Contact',
    icon: Contact,
  },
];

function PermissionItem({ permission }: { permission: Permission }) {
  const IconComponent = permission.icon;

  return (
    <View className="flex-row items-center gap-3">
      <IconComponent
        color={colors['grey-alpha']['500']}
        size={24}
        strokeWidth={2}
      />
      <Text className="text-base text-grey-alpha-500">{permission.name}</Text>
    </View>
  );
}

export default function AppPermissionsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'bottom']}>
      {/* Header */}
      <View className="flex-row items-center border-b border-grey-plain-150 bg-white px-4 py-3">
        <TouchableOpacity onPress={() => router.back()} className="mr-3">
          <CornerUpLeft
            color={colors['grey-plain']['550']}
            size={24}
            strokeWidth={2}
          />
        </TouchableOpacity>
        <Text className="text-lg font-semibold text-grey-alpha-500">
          App permissions
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* App Branding */}
        <View className="mt-8 items-center">
          <LogoColor width={104} height={30} />
        </View>

        {/* Granted Permissions Section */}
        <View
          className="mx-4 mt-8 rounded-2xl p-2"
          style={{ backgroundColor: colors['grey-plain']['150'] }}
        >
          <Text className="mb-4 ml-3 mt-2 text-base font-semibold text-grey-alpha-500">
            Granted ({GRANTED_PERMISSIONS.length})
          </Text>
          <View className="gap-1">
            {GRANTED_PERMISSIONS.map((permission) => (
              <View
                key={permission.id}
                className="rounded-xl bg-white px-4 py-4"
              >
                <PermissionItem permission={permission} />
              </View>
            ))}
          </View>
        </View>

        {/* Not Granted Permissions Section */}
        <View
          className="mx-4 mt-6 rounded-2xl p-2"
          style={{ backgroundColor: colors['grey-plain']['150'] }}
        >
          <Text className="mb-4 ml-3 mt-2 text-base font-semibold text-grey-alpha-500">
            Not granted ({NOT_GRANTED_PERMISSIONS.length})
          </Text>
          <View className="gap-1">
            {NOT_GRANTED_PERMISSIONS.map((permission) => (
              <View
                key={permission.id}
                className="rounded-xl bg-white px-4 py-4"
              >
                <PermissionItem permission={permission} />
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
