import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { View, Text, Pressable, Linking, Alert, GestureResponderEvent } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import * as WebBrowser from 'expo-web-browser';
import {
  BottomSheetComponent,
  BottomSheetRef,
} from '@/components/ui/BottomSheet';
import { colors } from '@/theme/colors';
import { appConfig } from '@/config/app.config';
import * as Haptics from 'expo-haptics';
import { Phone, Mail, Check } from 'lucide-react-native';
import XIcon from '@/assets/icons/x.svg';

interface ContactInfo {
  id: string;
  type: 'phone' | 'email' | 'x' | 'threads';
  label: string;
  value: string;
}

const CONTACT_INFO: ContactInfo[] = [
  {
    id: 'phone',
    type: 'phone',
    label: 'Phone',
    value: appConfig.contact.phone,
  },
  {
    id: 'email',
    type: 'email',
    label: 'Email',
    value: appConfig.contact.email,
  },
  {
    id: 'x',
    type: 'x',
    label: 'X (Twitter)',
    value: appConfig.contact.x,
  },
  {
    id: 'threads',
    type: 'threads',
    label: 'Threads',
    value: appConfig.contact.threads,
  },
];

function getContactIcon(type: string): React.ReactNode {
  switch (type) {
    case 'phone':
      return (
        <Phone size={20} color={colors['grey-alpha']['500']} strokeWidth={2} />
      );
    case 'email':
      return (
        <Mail size={20} color={colors['grey-alpha']['500']} strokeWidth={2} />
      );
    case 'x':
      return <XIcon width={20} height={20} />;
    case 'threads':
      return <Text className="text-lg">@</Text>;
    default:
      return null;
  }
}

function getLinkUrl(type: string, value: string): string {
  switch (type) {
    case 'phone':
      return `tel:${value.replace(/\s/g, '')}`;
    case 'email':
      return `mailto:${value}`;
    case 'x':
      return `https://${value}`;
    case 'threads':
      return `https://${value}`;
    default:
      return value;
  }
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface ContactUsSheetProps {}

export interface ContactUsSheetRef {
  open: () => void;
  close: () => void;
}

export const ContactUsSheet = forwardRef<
  ContactUsSheetRef,
  ContactUsSheetProps
>((_props, ref) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const bottomSheetRef = React.useRef<BottomSheetRef>(null);

  useImperativeHandle(ref, () => ({
    open: () => {
      bottomSheetRef.current?.expand();
    },
    close: () => {
      bottomSheetRef.current?.close();
    },
  }));

  async function handleCopy(id: string, value: string, e?: GestureResponderEvent) {
    e?.stopPropagation();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await Clipboard.setStringAsync(value);
    setCopiedId(id);

    // Reset copied state after 2 seconds
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  }

  async function handleOpenLink(type: string, value: string) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const url = getLinkUrl(type, value);

    try {
      if (type === 'phone' || type === 'email') {
        // Use Linking for phone and email
        const canOpen = await Linking.canOpenURL(url);
        if (canOpen) {
          await Linking.openURL(url);
        } else {
          Alert.alert('Error', 'Unable to open this link');
        }
      } else {
        // Use WebBrowser for web URLs (X, Threads)
        await WebBrowser.openBrowserAsync(url);
      }
    } catch (error) {
      console.error('Error opening link:', error);
      Alert.alert('Error', 'Unable to open this link');
    }
  }

  return (
    <BottomSheetComponent
      ref={bottomSheetRef}
      title="Contact us"
      onClose={() => bottomSheetRef.current?.close()}
    >
      <View className="px-6">
        <View className="mb-6">
          {CONTACT_INFO.map((contact) => {
            const isCopied = copiedId === contact.id;
            return (
              <Pressable
                key={contact.id}
                className="mb-4 flex-row items-center justify-between rounded-lg border border-grey-plain-300 bg-transparent px-4 py-3"
              >
                <Pressable
                  onPress={() => handleOpenLink(contact.type, contact.value)}
                  className="flex-1 flex-row items-center"
                >
                  <View className="mr-3">{getContactIcon(contact.type)}</View>
                  <Text
                    className="flex-1 text-base text-grey-alpha-500 underline"
                    style={{ textDecorationLine: 'underline' }}
                  >
                    {contact.value}
                  </Text>
                </Pressable>
                <Pressable
                  onPress={(e) => {
                    e.stopPropagation();
                    handleCopy(contact.id, contact.value);
                  }}
                  className={`
                    ml-3 rounded-lg px-4 py-2
                    ${isCopied ? 'bg-grey-plain-450' : 'bg-grey-plain-300'}
                  `}
                >
                  {isCopied ? (
                    <View className="flex-row items-center">
                      <Check
                        size={14}
                        color={colors['grey-alpha']['500']}
                        strokeWidth={3}
                      />
                      <Text className="ml-1 text-sm font-medium text-grey-alpha-500">
                        Copied
                      </Text>
                    </View>
                  ) : (
                    <Text className="text-sm font-medium text-grey-alpha-500">
                      Copy
                    </Text>
                  )}
                </Pressable>
              </Pressable>
            );
          })}
        </View>
      </View>
    </BottomSheetComponent>
  );
});

ContactUsSheet.displayName = 'ContactUsSheet';
