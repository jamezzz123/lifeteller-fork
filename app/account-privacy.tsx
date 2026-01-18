import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { CornerUpLeft, ShieldUser } from 'lucide-react-native';
import { RadioButton } from '@/components/ui/RadioButton';
import { colors } from '@/theme/colors';

type LiftVisibilityOption =
  | 'decide'
  | 'everyone'
  | 'friends'
  | 'lists'
  | 'private';

type TagOption = 'everyone' | 'friends' | 'list' | 'dont-allow';

export default function AccountPrivacyScreen() {
  const [isPrivateAccount, setIsPrivateAccount] = useState(false);
  const [liftVisibility, setLiftVisibility] =
    useState<LiftVisibilityOption>('decide');
  const [tagOption, setTagOption] = useState<TagOption>('everyone');

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
          Account privacy
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        {/* Account Section */}
        <View
          className="mx-4 mt-6 rounded-2xl p-2"
          style={{ backgroundColor: colors['grey-plain']['150'] }}
        >
          <Text className="mb-4 ml-3 mt-2 text-base font-semibold text-grey-alpha-500">
            Account
          </Text>

          {/* Private Account Toggle */}
          <TouchableOpacity
            onPress={() => setIsPrivateAccount(!isPrivateAccount)}
            className="flex-row items-start gap-3 rounded-xl bg-white px-4 py-4"
            activeOpacity={0.7}
          >
            <View
              className="mt-0.5 h-10 w-10 items-center justify-center rounded-full"
              style={{ backgroundColor: colors['primary-tints'].purple['50'] }}
            >
              <ShieldUser
                color={colors.primary.purple}
                size={20}
                strokeWidth={2}
              />
            </View>
            <View className="flex-1">
              <Text className="mb-1 text-[15px] font-semibold text-grey-alpha-500">
                Private account
              </Text>
              <Text className="text-sm text-grey-plain-550">
                Only users you follow and they follow back can see your posts
                and lifts
              </Text>
            </View>
            <Switch
              value={isPrivateAccount}
              onValueChange={setIsPrivateAccount}
              trackColor={{
                false: colors['grey-plain']['300'],
                true: colors.primary.purple,
              }}
              thumbColor="#FFFFFF"
            />
          </TouchableOpacity>
        </View>

        {/* Who can see my lifts Section */}
        <View
          className="mx-4 mt-6 rounded-2xl p-2"
          style={{ backgroundColor: colors['grey-plain']['150'] }}
        >
          <Text className="mb-4 ml-3 mt-2 text-base font-semibold text-grey-alpha-500">
            Who can see my lifts
          </Text>

          <View className="gap-1">
            <View className="rounded-xl bg-white px-4 py-4">
              <RadioButton
                label="Let me decide when creating a lift"
                checked={liftVisibility === 'decide'}
                onPress={() => setLiftVisibility('decide')}
              />
            </View>
            <View className="rounded-xl bg-white px-4 py-4">
              <RadioButton
                label="Everyone"
                checked={liftVisibility === 'everyone'}
                onPress={() => setLiftVisibility('everyone')}
              />
            </View>
            <View className="rounded-xl bg-white px-4 py-4">
              <RadioButton
                label="Friends (People I follow and they follow back)"
                checked={liftVisibility === 'friends'}
                onPress={() => setLiftVisibility('friends')}
              />
            </View>
            <View className="rounded-xl bg-white px-4 py-4">
              <RadioButton
                label="Lists"
                checked={liftVisibility === 'lists'}
                onPress={() => setLiftVisibility('lists')}
              />
            </View>
            <View className="rounded-xl bg-white px-4 py-4">
              <RadioButton
                label="Private"
                checked={liftVisibility === 'private'}
                onPress={() => setLiftVisibility('private')}
              />
            </View>
          </View>
        </View>

        {/* Who can tag me Section */}
        <View
          className="mx-4 mt-6 rounded-2xl p-2"
          style={{ backgroundColor: colors['grey-plain']['150'] }}
        >
          <Text className="mb-4 ml-3 mt-2 text-base font-semibold text-grey-alpha-500">
            Who can tag me
          </Text>

          <View className="gap-1">
            <View className="rounded-xl bg-white px-4 py-4">
              <RadioButton
                label="Everyone"
                checked={tagOption === 'everyone'}
                onPress={() => setTagOption('everyone')}
              />
            </View>
            <View className="rounded-xl bg-white px-4 py-4">
              <RadioButton
                label="Friends (People I follow and they follow back)"
                checked={tagOption === 'friends'}
                onPress={() => setTagOption('friends')}
              />
            </View>
            <View className="rounded-xl bg-white px-4 py-4">
              <RadioButton
                label="List"
                checked={tagOption === 'list'}
                onPress={() => setTagOption('list')}
              />
            </View>
            <View className="rounded-xl bg-white px-4 py-4">
              <RadioButton
                label="Don't allow"
                checked={tagOption === 'dont-allow'}
                onPress={() => setTagOption('dont-allow')}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

