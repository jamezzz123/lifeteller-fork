/**
 * Comprehensive Lift Types
 * Defines all data structures for the lift system
 */

export type LiftType = 'monetary' | 'non-monetary' | 'both';

export type LiftStatus =
  | 'pending'
  | 'request-sent'
  | 'offered'
  | 'accepted'
  | 'declined'
  | 'active'
  | 'completed'
  | 'closed';

export type LiftCardType = 'lift-request' | 'lift-raised' | 'lift-offer' | 'lift-offered';

// Non-monetary item
export interface NonMonetaryItem {
  id: string;
  name: string;
  quantity?: number;
}

// Co-raiser (person who contributed to a lift)
export interface CoRaiser {
  id: string;
  name: string;
  avatar: string;
  amount?: number; // Amount they contributed
}

// Monetary lift data
export interface MonetaryLiftData {
  currentAmount: number;
  targetAmount: number;
  coRaisers?: CoRaiser[]; // People who have contributed
}

// Non-monetary lift data
export interface NonMonetaryLiftData {
  items: NonMonetaryItem[];
}

// Main Lift interface
export interface Lift {
  id: string;

  // User who created/owns the lift
  owner: {
    id: string;
    name: string;
    handle: string;
    avatar: string;
    verified?: boolean;
  };

  // Collaborators (for co-raised lifts)
  collaborators?: Array<{
    id: string;
    name: string;
    avatar: string;
    verified?: boolean;
  }>;

  // Lift details
  title: string;
  description: string;
  liftType: LiftType;
  cardType: LiftCardType;
  status: LiftStatus;
  timestamp: string;

  // Monetary data (if applicable)
  monetary?: MonetaryLiftData;

  // Non-monetary data (if applicable)
  nonMonetary?: NonMonetaryLiftData;

  // If this is an offer, what was offered
  offer?: {
    monetaryAmount?: number;
    items?: NonMonetaryItem[];
  };

  // Engagement
  likes: number;
  comments: number;
  shares: number;

  // Media
  images?: string[];
  videos?: string[];
}
