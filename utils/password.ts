/**
 * Calculates password strength based on various criteria
 * Returns a strength level from 0-3 (weak, fair, good, strong)
 */
export function calculatePasswordStrength(password: string): {
  strength: number; // 0-3
  label: string;
  color: string;
} {
  if (!password || password.length === 0) {
    return { strength: 0, label: '', color: '' };
  }

  let strength = 0;
  const checks = {
    length: password.length >= 8,
    hasLowercase: /[a-z]/.test(password),
    hasUppercase: /[A-Z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  // Strength levels (0-3):
  // 0 = Weak (< 8 chars) - 0 bars
  // 1 = Fair (8+ chars, basic) - 1 bar
  // 2 = Good (8+ chars, 2+ character types) - 2 bars (matches design)
  // 3 = Strong (8+ chars, 3+ character types or 12+ chars) - 3 bars

  if (!checks.length) {
    strength = 0; // Weak - less than 8 characters
  } else {
    // Count character variety
    const varietyCount =
      (checks.hasLowercase ? 1 : 0) +
      (checks.hasUppercase ? 1 : 0) +
      (checks.hasNumber ? 1 : 0) +
      (checks.hasSpecialChar ? 1 : 0);

    if (varietyCount >= 3 || password.length >= 12) {
      strength = 3; // Strong
    } else if (varietyCount >= 2) {
      strength = 2; // Good (matches design - 2 bars filled)
    } else {
      strength = 1; // Fair
    }
  }

  const labels = ['Weak', 'Fair', 'Good', 'Strong'];
  // Using colors that match the design - orange-brown for medium/good strength
  const colors = [
    '#EF4444', // red-500 - weak
    '#D97706', // amber-600 - fair (orange-brown)
    '#D97706', // amber-600 - good (orange-brown, matches design)
    '#10B981', // green-500 - strong
  ];

  return {
    strength,
    label: labels[strength] || '',
    color: colors[strength] || colors[0],
  };
}
