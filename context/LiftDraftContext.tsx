import { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '@/hooks/useUser';
import { AudienceOfferType } from '@/context/request-lift';

export type MediaItem = {
  id: string;
  uri: string;
  type: 'image' | 'video';
  fileName?: string;
};

export type LiftItem = {
  id: string;
  name: string;
  quantity: number;
};

type LiftDraftContextType = {
  collaborators: User[];
  setCollaborators: (collaborators: User[]) => void;
  liftType: string;
  setLiftType: (type: string) => void;
  audienceType: AudienceOfferType;
  setAudienceType: (type: AudienceOfferType) => void;
  title: string;
  setTitle: (title: string) => void;
  description: string;
  setDescription: (description: string) => void;
  liftAmount: string;
  setLiftAmount: (amount: string) => void;
  selectedMedia: MediaItem[];
  setSelectedMedia: (media: MediaItem[]) => void;
  liftItems: LiftItem[];
  setLiftItems: (items: LiftItem[]) => void;
  category: string;
  setCategory: (category: string) => void;
  location: string;
  setLocation: (location: string) => void;
  reset: () => void;
  numberOfRecipients: string;
  setNumberOfRecipients: (number: string) => void;
};

const LiftDraftContext = createContext<LiftDraftContextType | undefined>(
  undefined
);

export function LiftDraftProvider({ children }: { children: ReactNode }) {
  const [collaborators, setCollaborators] = useState<User[]>([]);
  const [liftType, setLiftType] = useState<string>('monetary');
  const [audienceType, setAudienceType] =
    useState<AudienceOfferType>('everyone');
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [liftAmount, setLiftAmount] = useState<string>('');
  const [selectedMedia, setSelectedMedia] = useState<MediaItem[]>([]);
  const [liftItems, setLiftItems] = useState<LiftItem[]>([]);
  const [category, setCategory] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [numberOfRecipients, setNumberOfRecipients] = useState<string>('');

  const reset = () => {
    setCollaborators([]);
    setLiftType('monetary');
    setAudienceType('everyone');
    setTitle('');
    setDescription('');
    setLiftAmount('');
    setSelectedMedia([]);
    setLiftItems([]);
    setCategory('');
    setLocation('');
    setNumberOfRecipients('');
  };

  return (
    <LiftDraftContext.Provider
      value={{
        collaborators,
        setCollaborators,
        liftType,
        setLiftType,
        audienceType,
        setAudienceType,
        title,
        setTitle,
        description,
        setDescription,
        liftAmount,
        setLiftAmount,
        selectedMedia,
        setSelectedMedia,
        liftItems,
        setLiftItems,
        category,
        setCategory,
        location,
        setLocation,
        numberOfRecipients,
        setNumberOfRecipients,
        reset,
      }}
    >
      {children}
    </LiftDraftContext.Provider>
  );
}

export function useLiftDraft() {
  const context = useContext(LiftDraftContext);
  if (context === undefined) {
    throw new Error('useLiftDraft must be used within a LiftDraftProvider');
  }
  return context;
}
