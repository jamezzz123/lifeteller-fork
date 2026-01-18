import { Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Image } from 'expo-image';
import { X, Trash2 } from 'lucide-react-native';

import { colors } from '@/theme/colors';
import { Button } from '@/components/ui/Button';
import { Contact } from './types';

type ReviewContactsModalProps = {
  visible: boolean;
  contacts: Contact[];
  onRemove: (contactId: string) => void;
  onProceed: () => void;
  onClose: () => void;
};

export function ReviewContactsModal({
  visible,
  contacts,
  onRemove,
  onProceed,
  onClose,
}: ReviewContactsModalProps) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="overFullScreen"
      transparent
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end bg-black/50">
        <View
          className="bg-background"
          style={{
            height: '60%',
            borderTopLeftRadius: 30,
            borderTopRightRadius: 24,
          }}
        >
          {/* Header */}
          <View className="flex-row items-center justify-between rounded-t-3xl border-b border-grey-plain-450/20 bg-grey-alpha-150 px-4 py-4">
            <Text className="text-lg font-inter-semibold text-grey-alpha-500">
              Request from
            </Text>
            <TouchableOpacity
              onPress={onClose}
              hitSlop={10}
              accessibilityLabel="Close"
            >
              <X
                size={24}
                color={colors['grey-alpha']['500']}
                strokeWidth={2.6}
              />
            </TouchableOpacity>
          </View>

          {/* Contacts List */}
          <ScrollView
            className="flex-1"
            contentContainerStyle={{ paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
          >
            {contacts.map((contact, index) => (
              <View
                key={contact.id}
                className="flex-row items-center justify-between border-b border-grey-plain-450/20 px-4 py-4"
              >
                <View className="flex-1 flex-row items-center gap-3">
                  <Image
                    source={contact.avatar}
                    style={{ width: 48, height: 48, borderRadius: 24 }}
                    contentFit="cover"
                  />
                  <View className="flex-1">
                    <View className="flex-row items-center gap-2">
                      <Text className="text-base font-inter-medium text-grey-alpha-500">
                        {contact.name}
                      </Text>
                      {contact.verified && (
                        <View className="size-4 items-center justify-center rounded-full bg-primary">
                          <Text className="text-[10px] text-white">✓</Text>
                        </View>
                      )}
                    </View>
                    <Text className="text-sm text-grey-alpha-400">
                      @{contact.username}
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  onPress={() => onRemove(contact.id)}
                  hitSlop={10}
                  accessibilityLabel="Remove contact"
                >
                  <Trash2
                    size={20}
                    color={colors['grey-alpha']['400']}
                    strokeWidth={2}
                  />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>

          {/* Proceed Button */}
          <View className="absolute bottom-0 left-0 right-0 bg-grey-alpha-150 px-4 pb-8 pt-4">
            <View className="flex w-1/2 items-end justify-end self-end">
              <Button
                title="Proceed"
                onPress={onProceed}
                disabled={contacts.length === 0}
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}
