import { useMutation, useQueryClient } from '@tanstack/react-query';

interface AddBankAccountRequest {
  account_number: string;
  bank_code: string;
  account_name: string;
}

interface AddBankAccountResponse {
  success: boolean;
  data: {
    id: string;
    account_name: string;
    account_number: string;
    bank_name: string;
    bank_code: string;
  };
  message?: string;
}

export function useAddBankAccount() {
  const queryClient = useQueryClient();

  return useMutation<AddBankAccountResponse, Error, AddBankAccountRequest>({
    mutationFn: async (payload) => {
      // TODO: Replace with actual API endpoint
      // Mock implementation for now - simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      return {
        success: true,
        data: {
          id: `bank-${Date.now()}`,
          account_name: payload.account_name,
          account_number: payload.account_number,
          bank_name: 'Mock Bank', // Would come from API
          bank_code: payload.bank_code,
        },
        message: 'Bank account added successfully',
      };
    },
    onSuccess: () => {
      // Invalidate bank accounts list
      queryClient.invalidateQueries({ queryKey: ['bankAccounts'] });
    },
  });
}
