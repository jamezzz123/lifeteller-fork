/**
 * Get user initials from a full name
 * @param name - Full name (e.g., "John Doe" or "John")
 * @returns Initials string (e.g., "JD" or "JO")
 */
export function getInitials(name: string): string {
  if (!name || !name.trim()) return '';
  
  const trimmedName = name.trim();
  const parts = trimmedName.split(' ').filter(part => part.length > 0);
  
  if (parts.length >= 2) {
    // Use first letter of first name and first letter of last name
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  
  // If only one name part, use first 2 characters
  if (trimmedName.length >= 2) {
    return trimmedName.substring(0, 2).toUpperCase();
  }
  
  // If name is only 1 character, return it uppercase
  return trimmedName.toUpperCase();
}

/**
 * Get full name from first and last name
 * @param firstName - First name
 * @param lastName - Last name
 * @returns Full name string
 */
export function getFullName(firstName?: string | null, lastName?: string | null): string {
  const first = firstName?.trim() || '';
  const last = lastName?.trim() || '';
  return `${first} ${last}`.trim();
}

