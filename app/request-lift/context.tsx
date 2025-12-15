import { createContext, useContext, useState, useRef, ReactNode } from 'react';
import { Contact, CONTACTS } from '@/components/lift';
import { LiftType } from '@/components/lift/LiftTypeSelector';

export type LiftItem = {
  id: string;
  name: string;
  quantity: number;
};

export type MediaItem = {
  id: string;
  uri: string;
  type: 'image' | 'video';
  fileName?: string;
};

export type AudienceOfferType =
  | 'everyone'
  | 'friends'
  | 'selected-people'
  | 'chat-direct'
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
  selectedMedia: MediaItem[];
  setSelectedMedia: (media: MediaItem[]) => void;

  // Step 3: Category and Location
  category: string;
  setCategory: (category: string) => void;
  location: string;
  setLocation: (location: string) => void;
  collaborators: Contact[];
  setCollaborators: (collaborators: Contact[]) => void;

  // Audience settings
  audienceOfferType: AudienceOfferType;
  setAudienceOfferType: (type: AudienceOfferType) => void;
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
  const [selectedContacts, setSelectedContacts] = useState<Contact[]>([
    CONTACTS[0],
  ]);
  const [liftTitle, setLiftTitle] = useState('');
  const [liftDescription, setLiftDescription] = useState('');
  const [liftType, setLiftType] = useState<LiftType>(null);
  const [liftAmount, setLiftAmount] = useState(0);
  const [liftItems, setLiftItems] = useState<LiftItem[]>([]);
  const [selectedMedia, setSelectedMedia] = useState<MediaItem[]>([]);
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [collaborators, setCollaborators] = useState<Contact[]>([]);

  // Audience settings
  const [audienceOfferType, setAudienceOfferType] =
    useState<AudienceOfferType>('chat-direct');
  const [selectedPeopleForAudience, setSelectedPeopleForAudience] = useState<
    Contact[]
  >([]);
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
    setSelectedMedia([]);
    setCategory('');
    setLocation('');
    setCollaborators([]);
    setAudienceOfferType('chat-direct');
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
        selectedMedia,
        setSelectedMedia,
        category,
        setCategory,
        location,
        setLocation,
        collaborators,
        setCollaborators,
        audienceOfferType,
        setAudienceOfferType,
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
