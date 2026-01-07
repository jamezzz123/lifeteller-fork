import { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '@/hooks/useUser';
import { AudienceOfferType } from '@/context/request-lift';

export type MediaItem = {
  id: string;
  uri: string;
  type: 'image' | 'video';
  fileName?: string;
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
  category: string;
  setCategory: (category: string) => void;
  location: string;
  setLocation: (location: string) => void;
  reset: () => void;
};

const LiftDraftContext = createContext<LiftDraftContextType | undefined>(
  undefined
);

export function LiftDraftProvider({ children }: { children: ReactNode }) {
  const [collaborators, setCollaborators] = useState<User[]>([]);
  const [liftType, setLiftType] = useState<string>('monetary');
  const [audienceType, setAudienceType] = useState<AudienceOfferType>('everyone');
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [liftAmount, setLiftAmount] = useState<string>('');
  const [selectedMedia, setSelectedMedia] = useState<MediaItem[]>([]);
  const [category, setCategory] = useState<string>('');
  const [location, setLocation] = useState<string>('');

  const reset = () => {
    setCollaborators([]);
    setLiftType('monetary');
    setAudienceType('everyone');
    setTitle('');
    setDescription('');
    setLiftAmount('');
    setSelectedMedia([]);
    setCategory('');
    setLocation('');
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
        category,
        setCategory,
        location,
        setLocation,
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
