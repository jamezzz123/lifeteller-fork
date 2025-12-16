import React, { createContext, useContext, useState } from 'react';

interface OfferLiftContextType {
  headerTitle: string;
  setHeaderTitle: (title: string) => void;
}

const OfferLiftContext = createContext<OfferLiftContextType | undefined>(
  undefined
);

export function OfferLiftProvider({ children }: { children: React.ReactNode }) {
  const [headerTitle, setHeaderTitle] = useState('Offer lift');

  return (
    <OfferLiftContext.Provider
      value={{
        headerTitle,
        setHeaderTitle,
      }}
    >
      {children}
    </OfferLiftContext.Provider>
  );
}

export function useOfferLift() {
  const context = useContext(OfferLiftContext);
  if (context === undefined) {
    throw new Error('useOfferLift must be used within OfferLiftProvider');
  }
  return context;
}

