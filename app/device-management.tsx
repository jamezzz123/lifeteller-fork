import React, { useState, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { CornerUpLeft, ChevronUp, ChevronDown } from 'lucide-react-native';
import { colors } from '@/theme/colors';
import { BottomSheetRef } from '@/components/ui/BottomSheet';
import { VerifyPasswordBottomSheet } from '@/components/settings/VerifyPasswordBottomSheet';

interface Device {
  id: string;
  name: string;
  isCurrent: boolean;
  dateEnrolled: string;
  lastActive: string;
}

const mockDevices: Device[] = [
  {
    id: '1',
    name: 'Google Pixel 9 Pro',
    isCurrent: true,
    dateEnrolled: '12/12/2021 • 10:09pm',
    lastActive: '12/12/2021 • 10:09pm',
  },
  {
    id: '2',
    name: 'Samsun Galaxy 25 Ultra',
    isCurrent: false,
    dateEnrolled: '12/12/2021 • 10:09pm',
    lastActive: '12/12/2021 • 10:09pm',
  },
  {
    id: '3',
    name: 'Oppo 5G+ Modern Device',
    isCurrent: false,
    dateEnrolled: '12/12/2021 • 10:09pm',
    lastActive: '12/12/2021 • 10:09pm',
  },
];

function DeviceItem({
  device,
  onRemoveDevice,
}: {
  device: Device;
  onRemoveDevice: (deviceId: string) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(device.id === '2'); // Second device expanded by default

  const handleRemoveDevice = () => {
    onRemoveDevice(device.id);
  };

  return (
    <View
      className="mb-2 rounded-xl"
      style={{ backgroundColor: '#FAFBFC' }}
    >
      {/* Device Header */}
      <TouchableOpacity
        onPress={() => setIsExpanded(!isExpanded)}
        className="flex-row items-center justify-between px-4 py-4"
        activeOpacity={0.7}
      >
        <View className="flex-1 flex-row items-center gap-3">
          <View className="flex-1">
            <View className="mb-1 flex-row items-center gap-2">
              <Text className="text-[15px] font-semibold text-grey-alpha-500">
                {device.name}
              </Text>
              {device.isCurrent && (
                <View
                  className="rounded-full px-2 py-0.5"
                  style={{ backgroundColor: colors.primary.purple }}
                >
                  <Text className="text-xs font-medium text-white">
                    Current device
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
        {!device.isCurrent && (
          <View>
            {isExpanded ? (
              <ChevronUp
                color={colors['grey-plain']['550']}
                size={20}
                strokeWidth={2}
              />
            ) : (
              <ChevronDown
                color={colors['grey-plain']['550']}
                size={20}
                strokeWidth={2}
              />
            )}
          </View>
        )}
      </TouchableOpacity>

      {/* Expanded Content */}
      {isExpanded && !device.isCurrent && (
        <View className="border-t border-grey-plain-150 px-4 pb-4 pt-3">
          <Text className="mb-1 text-sm text-grey-plain-550">
            Date enrolled: {device.dateEnrolled}
          </Text>
          <Text className="mb-4 text-sm text-grey-plain-550">
            Last active: {device.lastActive}
          </Text>
          <TouchableOpacity
            onPress={handleRemoveDevice}
            className="self-start"
            activeOpacity={0.7}
          >
            <Text
              className="text-sm font-medium"
              style={{ color: colors.state.red }}
            >
              Remove device
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Current Device Details (Always Visible) */}
      {device.isCurrent && (
        <View className="border-t border-grey-plain-150 px-4 pb-4 pt-3">
          <Text className="mb-1 text-sm text-grey-plain-550">
            Date enrolled: {device.dateEnrolled}
          </Text>
          <Text className="text-sm text-grey-plain-550">
            Last active: {device.lastActive}
          </Text>
        </View>
      )}
    </View>
  );
}

export default function DeviceManagementScreen() {
  const verifyPasswordSheetRef = useRef<BottomSheetRef>(null);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);

  const handleRemoveDevice = (deviceId: string) => {
    setSelectedDeviceId(deviceId);
    verifyPasswordSheetRef.current?.expand();
  };

  const handleVerifyPassword = (password: string) => {
    // TODO: Verify password and remove device
    console.log('Verifying password for device:', selectedDeviceId);
    verifyPasswordSheetRef.current?.close();
    setSelectedDeviceId(null);
    // TODO: Remove device from list after successful verification
  };

  const handleCancelVerification = () => {
    verifyPasswordSheetRef.current?.close();
    setSelectedDeviceId(null);
  };

  const selectedDevice = mockDevices.find((d) => d.id === selectedDeviceId);

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
          Device management
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        <View className="px-4 pt-6">
          {mockDevices.map((device) => (
            <DeviceItem
              key={device.id}
              device={device}
              onRemoveDevice={handleRemoveDevice}
            />
          ))}
        </View>
      </ScrollView>

      {/* Verify Password Bottom Sheet */}
      <VerifyPasswordBottomSheet
        ref={verifyPasswordSheetRef}
        deviceName={selectedDevice?.name}
        onVerify={handleVerifyPassword}
        onCancel={handleCancelVerification}
      />
    </SafeAreaView>
  );
}

