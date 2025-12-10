import { createContext, useContext, useState, useRef, ReactNode } from 'react';
import { Contact } from '@/components/request-lift';
import { LiftType } from '@/components/request-lift/LiftTypeSelector';

export type LiftItem = {
  id: string;
  name: string;
  quantity: number;
};

export type AudienceType =
  | 'everyone'
  | 'friends'
  | 'selected-people'
  | 'my-list'
  | 'private';

export type List = {
  id: string;
  name: string;
  peopleCount: number;
};

type RequestLiftContextType = {
  // Step 1: Selected contacts
  selectedContacts: Contact[];
  setSelectedContacts: (contacts: Contact[]) => void;

  // Step 2: Lift details
  liftTitle: string;
  setLiftTitle: (title: string) => void;
  liftDescription: string;
  setLiftDescription: (description: string) => void;
  liftType: LiftType;
  setLiftType: (type: LiftType) => void;
  liftAmount: number;
  setLiftAmount: (amount: number) => void;
  liftItems: LiftItem[];
  setLiftItems: (items: LiftItem[]) => void;

  // Step 3: Category and Location
  category: string;
  setCategory: (category: string) => void;
  location: string;
  setLocation: (location: string) => void;
  collaborators: Contact[];
  setCollaborators: (collaborators: Contact[]) => void;

  // Audience settings
  audienceType: AudienceType;
  setAudienceType: (type: AudienceType) => void;
  selectedPeopleForAudience: Contact[];
  setSelectedPeopleForAudience: (people: Contact[]) => void;
  selectedList: List | null;
  setSelectedList: (list: List | null) => void;

  // Add more fields as needed for your 7-8 steps

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

const RequestLiftContext = createContext<RequestLiftContextType | undefined>(
  undefined
);

export function RequestLiftProvider({ children }: { children: ReactNode }) {
  const [selectedContacts, setSelectedContacts] = useState<Contact[]>([]);
  const [liftTitle, setLiftTitle] = useState('');
  const [liftDescription, setLiftDescription] = useState('');
  const [liftType, setLiftType] = useState<LiftType>(null);
  const [liftAmount, setLiftAmount] = useState(0);
  const [liftItems, setLiftItems] = useState<LiftItem[]>([]);
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [collaborators, setCollaborators] = useState<Contact[]>([]);

  // Audience settings
  const [audienceType, setAudienceType] = useState<AudienceType>('everyone');
  const [selectedPeopleForAudience, setSelectedPeopleForAudience] = useState<Contact[]>([]);
  const [selectedList, setSelectedList] = useState<List | null>(null);

  // Header customization
  const [headerTitle, setHeaderTitle] = useState('Request lift');
  const [nextButtonLabel, setNextButtonLabel] = useState('Next');

  // Next button state
  const [canProceed, setCanProceed] = useState(false);
  const onNextRef = useRef<(() => void) | null>(null);

  // Add more state for other steps here
  // const [pickupLocation, setPickupLocation] = useState<Location>();
  // const [dropoffLocation, setDropoffLocation] = useState<Location>();

  const reset = () => {
    setSelectedContacts([]);
    setLiftTitle('');
    setLiftDescription('');
    setLiftType(null);
    setLiftAmount(0);
    setLiftItems([]);
    setCategory('');
    setLocation('');
    setCollaborators([]);
    setAudienceType('everyone');
    setSelectedPeopleForAudience([]);
    setSelectedList(null);
    setHeaderTitle('Request lift');
    setNextButtonLabel('Next');
    setCanProceed(false);
    onNextRef.current = null;
    // Reset other state here
  };

  return (
    <RequestLiftContext.Provider
      value={{
        selectedContacts,
        setSelectedContacts,
        liftTitle,
        setLiftTitle,
        liftDescription,
        setLiftDescription,
        liftType,
        setLiftType,
        liftAmount,
        setLiftAmount,
        liftItems,
        setLiftItems,
        category,
        setCategory,
        location,
        setLocation,
        collaborators,
        setCollaborators,
        audienceType,
        setAudienceType,
        selectedPeopleForAudience,
        setSelectedPeopleForAudience,
        selectedList,
        setSelectedList,
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
    </RequestLiftContext.Provider>
  );
}

export function useRequestLift() {
  const context = useContext(RequestLiftContext);
  if (context === undefined) {
    throw new Error('useRequestLift must be used within a RequestLiftProvider');
  }
  return context;
}

// Expo Router treats files inside app/ as routes; provide a stub default export
// so this utility module does not throw route resolution errors.
export default function RequestLiftContextRouteStub() {
  return null;
}
