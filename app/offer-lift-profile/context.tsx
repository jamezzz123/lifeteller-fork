import { createContext, useContext, useState, useRef, ReactNode } from 'react';
import { Contact } from '@/components/request-lift';

type OfferLiftProfileContextType = {
  // Step 1: Selected recipient (only one person)
  selectedRecipient: Contact | null;
  setSelectedRecipient: (contact: Contact | null) => void;

  // Step 2: Offer details
  offerMessage: string;
  setOfferMessage: (message: string) => void;
  offerAmount: number;
  setOfferAmount: (amount: number) => void;
  isAnonymous: boolean;
  setIsAnonymous: (anonymous: boolean) => void;

  // Header customization (for layout header)
  headerTitle: string;
  setHeaderTitle: (title: string) => void;
  nextButtonLabel: string;
  setNextButtonLabel: (label: string) => void;

  // Next button management (for layout header)
  canProceed: boolean;
  setCanProceed: (can: boolean) => void;
  onNextRef: React.MutableRefObject<(() => void) | null>;

  // Helper to reset the flow
  reset: () => void;
};

const OfferLiftProfileContext = createContext<
  OfferLiftProfileContextType | undefined
>(undefined);

export function OfferLiftProfileProvider({ children }: { children: ReactNode }) {
  const [selectedRecipient, setSelectedRecipient] = useState<Contact | null>(
    null
  );
  const [offerMessage, setOfferMessage] = useState('');
  const [offerAmount, setOfferAmount] = useState(0);
  const [isAnonymous, setIsAnonymous] = useState(false);

  // Header customization
  const [headerTitle, setHeaderTitle] = useState('Offer lift');
  const [nextButtonLabel, setNextButtonLabel] = useState('Next');

  // Next button state
  const [canProceed, setCanProceed] = useState(false);
  const onNextRef = useRef<(() => void) | null>(null);

  const reset = () => {
    setSelectedRecipient(null);
    setOfferMessage('');
    setOfferAmount(0);
    setIsAnonymous(false);
    setHeaderTitle('Offer lift');
    setNextButtonLabel('Next');
    setCanProceed(false);
    onNextRef.current = null;
  };

  return (
    <OfferLiftProfileContext.Provider
      value={{
        selectedRecipient,
        setSelectedRecipient,
        offerMessage,
        setOfferMessage,
        offerAmount,
        setOfferAmount,
        isAnonymous,
        setIsAnonymous,
        headerTitle,
        setHeaderTitle,
        nextButtonLabel,
        setNextButtonLabel,
        canProceed,
        setCanProceed,
        onNextRef,
        reset,
      }}
    >
      {children}
    </OfferLiftProfileContext.Provider>
  );
}

export function useOfferLiftProfile() {
  const context = useContext(OfferLiftProfileContext);
  if (context === undefined) {
    throw new Error(
      'useOfferLiftProfile must be used within a OfferLiftProfileProvider'
    );
  }
  return context;
}

// Expo Router treats files inside app/ as routes; provide a stub default export
// so this utility module does not throw route resolution errors.
export default function OfferLiftProfileContextRouteStub() {
  return null;
}
