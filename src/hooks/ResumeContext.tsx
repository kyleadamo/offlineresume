/* Resume context provider */
import React, { createContext, useContext, ReactNode } from 'react';
import { Resume } from '@/schema/resume';
import { useResumeStore } from '@/hooks/useResumeStore';

interface ResumeContextValue {
  resumes: Resume[];
  activeResume: Resume | null;
  activeId: string | null;
  createResume: (base?: Partial<Resume>) => Resume;
  updateResume: (id: string, updates: Partial<Resume>) => void;
  duplicateResume: (id: string) => void;
  deleteResume: (id: string) => void;
  setActive: (id: string) => void;
}

const ResumeContext = createContext<ResumeContextValue | null>(null);

export function ResumeProvider({ children }: { children: ReactNode }) {
  const store = useResumeStore();
  return <ResumeContext.Provider value={store}>{children}</ResumeContext.Provider>;
}

export function useResume() {
  const ctx = useContext(ResumeContext);
  if (!ctx) throw new Error('useResume must be used within ResumeProvider');
  return ctx;
}
