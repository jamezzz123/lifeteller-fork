import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import {
  CornerUpLeft,
  Plus,
  Trash2,
  Landmark,
  Info,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import BankAccountIllustration from '@/assets/images/bank-account.svg';
import { Button } from '@/components/ui/Button';
import { ConfirmationModal } from '@/components/ui/ConfirmationModal';
import { colors } from '@/theme/colors';

interface BankAccount {
  id: string;
  account_name: string;
  account_number: string;
  bank_name: string;
  bank_code: string;
}

export default function BankAccountsScreen() {
  // Mock data - replace with actual data fetching
  const bankAccounts: BankAccount[] = [
    {
      id: '1',
      account_name: 'Isaac Akinyemi Freeman',
      account_number: '1209708991',
      bank_name: 'FCMB',
      bank_code: '214',
    },
    {
      id: '2',
      account_name: 'Isaac Akinyemi Freeman',
      account_number: '1209708991',
      bank_name: 'FCMB',
      bank_code: '214',
    },
    {
      id: '3',
      account_name: 'Isaac Akinyemi Freeman',
      account_number: '1209708991',
      bank_name: 'FCMB',
      bank_code: '214',
    },
  ];

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState<string | null>(null);

  const hasBankAccounts = bankAccounts.length > 0;

  const handleAddBankAccount = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/add-bank-account' as any);
  };

  const handleDeleteBankAccount = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setAccountToDelete(id);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // TODO: Implement delete functionality
    console.log('Delete bank account:', accountToDelete);
    setShowDeleteConfirm(false);
    setAccountToDelete(null);
  };

  const handleCancelDelete = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowDeleteConfirm(false);
    setAccountToDelete(null);
  };

  const getBankInitials = (bankName: string): string => {
    return bankName.substring(0, 4).toUpperCase();
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

      {/* Bank Accounts List */}
      <ScrollView
        className="flex-1 bg-grey-plain-50"
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <View
          className="mx-4 mt-6 rounded-2xl p-2"
          style={{ backgroundColor: colors['grey-plain']['150'] }}
        >
          {/* Header */}
          <Text className="mb-4 ml-3 mt-2 text-base font-semibold text-grey-alpha-500">
            {bankAccounts.length} bank account
            {bankAccounts.length !== 1 ? 's' : ''} added
          </Text>

          {/* Bank Account Cards */}
          <View className="gap-1">
            {bankAccounts.map((account) => (
              <View
                key={account.id}
                className="flex-row items-center gap-4 rounded-xl bg-white px-4 py-4"
              >
                {/* Bank Icon */}
                <View className="h-12 w-12 items-center justify-center rounded-full bg-primary">
                  <Text className="text-xs font-bold text-white">
                    {getBankInitials(account.bank_name)}
                  </Text>
                </View>

                {/* Account Details */}
                <View className="flex-1">
                  <Text className="mb-1 text-base font-semibold text-grey-alpha-500">
                    {account.account_name}
                  </Text>
                  <Text className="text-sm text-grey-plain-550">
                    {account.bank_name} • {account.account_number}
                  </Text>
                </View>

                {/* Delete Button */}
                <TouchableOpacity
                  onPress={() => handleDeleteBankAccount(account.id)}
                  hitSlop={8}
                  activeOpacity={0.7}
                >
                  <Trash2
                    size={20}
                    color={colors['grey-plain']['550']}
                    strokeWidth={2}
                  />
                </TouchableOpacity>
              </View>
            ))}

            {/* Add New Account Row */}
            <TouchableOpacity
              onPress={handleAddBankAccount}
              className="flex-row items-center gap-4 rounded-xl bg-white px-4 py-4"
              activeOpacity={0.7}
            >
              <View className="h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Landmark
                  size={24}
                  color={colors.primary.purple}
                  strokeWidth={2}
                />
              </View>
              <View className="flex-1">
                <Text className="text-base font-semibold text-grey-alpha-500">
                  Add a new account details
                </Text>
              </View>
              <Plus
                size={20}
                color={colors['grey-alpha']['500']}
                strokeWidth={2}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer Info */}
        <View className="mx-4 mt-3 flex-row items-center gap-2 pb-6">
          <Info size={16} color={colors['grey-alpha']['500']} strokeWidth={2} />
          <Text className="text-sm text-grey-alpha-500">
            You can only add 5 bank accounts
          </Text>
        </View>
      </ScrollView>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        visible={showDeleteConfirm}
        title="Remove bank account"
        message="Are you sure you want to remove this account?"
        cancelText="No"
        confirmText="Yes, remove"
        destructive
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </SafeAreaView>
  );
}
