import { useQuery } from '@tanstack/react-query';

interface BankSuggestion {
  id: string;
  name: string;
  code: string;
}

interface BankSuggestionsResponse {
  success: boolean;
  data: BankSuggestion[];
  message?: string;
}

export function useBankSuggestions(
  accountNumber: string,
  enabled: boolean = false
) {
  return useQuery<BankSuggestionsResponse>({
    queryKey: ['bankSuggestions', accountNumber],
    queryFn: async () => {
      // TODO: Replace with actual API endpoint
      // Mock implementation for now - simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Mock bank suggestions based on account number
      const mockBanks: BankSuggestion[] = [
        { id: '1', name: 'First City Monument Bank', code: 'FCMB' },
        { id: '2', name: 'Access Bank', code: 'ACCESS' },
        { id: '3', name: 'Guarantee Trust Bank (GTB)', code: 'GTB' },
      ];

      return {
        success: true,
        data: mockBanks,
      };
    },
    enabled: enabled && accountNumber.trim().length >= 10,
    retry: false,
    staleTime: 0,
    gcTime: 0,
  });
}
