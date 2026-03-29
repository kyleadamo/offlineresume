import React, { createContext, useContext, ReactNode } from 'react';
import { CoverLetter } from '@/schema/coverLetter';
import { useCoverLetterStore } from '@/hooks/useCoverLetterStore';

interface CoverLetterContextValue {
  letters: CoverLetter[];
  activeLetter: CoverLetter | null;
  activeId: string | null;
  createLetter: (base?: Partial<CoverLetter>) => CoverLetter;
  updateLetter: (id: string, updates: Partial<CoverLetter>) => void;
  duplicateLetter: (id: string) => void;
  deleteLetter: (id: string) => void;
  setActive: (id: string) => void;
}

const CoverLetterContext = createContext<CoverLetterContextValue | null>(null);

export function CoverLetterProvider({ children }: { children: ReactNode }) {
  const store = useCoverLetterStore();
  return <CoverLetterContext.Provider value={store}>{children}</CoverLetterContext.Provider>;
}

export function useCoverLetter() {
  const ctx = useContext(CoverLetterContext);
  if (!ctx) throw new Error('useCoverLetter must be used within CoverLetterProvider');
  return ctx;
}
