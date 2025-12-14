export const TITLE_SUGGESTIONS = [
  'School Fees Payment',
  'School Fees Repayment',
  'School Fees Loan Payment',
  'School Fees Loan Repayment',
  'Medical Bill Payment',
  'Medical Bill Assistance',
  'Rent Payment',
  'Rent Assistance',
  'Business Loan',
  'Business Startup Capital',
  'Food Assistance',
  'Transportation Fare',
  'Emergency Fund',
  'Utility Bills Payment',
  'Groceries Assistance',
];

export function filterTitleSuggestions(query: string): string[] {
  if (!query.trim()) return [];

  const lowerQuery = query.toLowerCase();
  return TITLE_SUGGESTIONS.filter((suggestion) =>
    suggestion.toLowerCase().includes(lowerQuery)
  );
}
