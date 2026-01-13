import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { CornerUpLeft, Plus } from 'lucide-react-native';
import BankAccountIllustration from '@/assets/images/bank-account.svg';
import { Button } from '@/components/ui/Button';
import { colors } from '@/theme/colors';

export default function BankAccountsScreen() {
  // Mock data - replace with actual data fetching
  const hasBankAccounts = false;

  const handleAddBankAccount = () => {
    // TODO: Navigate to add bank account screen
    console.log('Add bank account');
  };

  // Empty State View
  if (!hasBankAccounts) {
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
            Bank accounts
          </Text>
        </View>

        {/* Empty State Content */}
        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 24,
            paddingBottom: 32,
          }}
          showsVerticalScrollIndicator={false}
        >
          <View className="items-center">
            {/* Illustration */}
            <View className="mb-8">
              <BankAccountIllustration width={150} height={150} />
            </View>

            {/* Title */}
            <Text className="mb-4 text-center text-lg font-semibold text-grey-alpha-500">
              No bank accounts
            </Text>

            {/* Description */}
            <Text className="mb-8 text-center text-sm leading-5 text-grey-plain-550">
              You haven&apos;t added any bank accounts yet. Add a bank account
              to easily withdraw funds from your wallet.
            </Text>

            {/* Add Bank Account Button */}
            <Button
              title="Add bank account"
              onPress={handleAddBankAccount}
              variant="primary"
              size="medium"
              iconLeft={<Plus color="#FFFFFF" size={20} strokeWidth={2.5} />}
              className="min-w-[200px]"
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Bank Accounts List View
  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'bottom']}>
      {/* Header */}
      <View className="flex-row items-center justify-between border-b border-grey-plain-150 bg-white px-4 py-3">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.back()} className="mr-3">
            <CornerUpLeft
              color={colors['grey-plain']['550']}
              size={24}
              strokeWidth={2}
            />
          </TouchableOpacity>
          <Text className="text-lg font-semibold text-grey-alpha-500">
            Bank accounts
          </Text>
        </View>
        <Button
          title="Add new"
          onPress={handleAddBankAccount}
          variant="primary"
          size="small"
          iconLeft={<Plus color="#FFFFFF" size={16} strokeWidth={2.5} />}
        />
      </View>

      {/* Bank Accounts List */}
      <ScrollView
        className="flex-1 bg-grey-plain-50"
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        {/* TODO: Render bank accounts list */}
        <View className="items-center justify-center py-16">
          <Text className="text-sm text-grey-plain-550">
            Bank accounts will appear here
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
