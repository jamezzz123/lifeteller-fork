import { useQuery } from '@tanstack/react-query';

interface AccountNameResponse {
  success: boolean;
  data: {
    account_name: string;
    account_number: string;
    bank_code: string;
  };
  message?: string;
}

export function useAccountName(
  accountNumber: string,
  bankCode: string,
  enabled: boolean = false
) {
  return useQuery<AccountNameResponse>({
    queryKey: ['accountName', accountNumber, bankCode],
    queryFn: async () => {
      // TODO: Replace with actual API endpoint
      // Mock implementation for now - simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock account name
      return {
        success: true,
        data: {
          account_name: 'Isaac Tolulope Fatai',
          account_number: accountNumber,
          bank_code: bankCode,
        },
      };
    },
    enabled:
      enabled && accountNumber.trim().length >= 10 && bankCode.length > 0,
    retry: false,
    staleTime: 0,
    gcTime: 0,
  });
}
