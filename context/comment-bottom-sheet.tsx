import React, { createContext, useContext, useState, useCallback } from 'react';

interface CommentBottomSheetContextType {
  isOpen: boolean;
  postId: string | null;
  openComments: (postId: string) => void;
  closeComments: () => void;
}

const CommentBottomSheetContext = createContext<CommentBottomSheetContextType | undefined>(undefined);

interface CommentBottomSheetProviderProps {
  children: React.ReactNode;
}

export function CommentBottomSheetProvider({ children }: CommentBottomSheetProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [postId, setPostId] = useState<string | null>(null);

  const openComments = useCallback((id: string) => {
    setPostId(id);
    setIsOpen(true);
  }, []);

  const closeComments = useCallback(() => {
    setIsOpen(false);
    setPostId(null);
  }, []);

  return (
    <CommentBottomSheetContext.Provider
      value={{
        isOpen,
        postId,
        openComments,
        closeComments,
      }}
    >
      {children}
    </CommentBottomSheetContext.Provider>
  );
}

export function useCommentBottomSheet() {
  const context = useContext(CommentBottomSheetContext);
  if (context === undefined) {
    throw new Error('useCommentBottomSheet must be used within a CommentBottomSheetProvider');
  }
  return context;
}
