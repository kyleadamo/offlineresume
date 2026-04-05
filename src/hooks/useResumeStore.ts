import { useState, useCallback, useEffect } from 'react';
import { Resume, createBlankResume, DEFAULT_SECTION_ORDER } from '@/schema/resume';

const STORAGE_KEY = 'resume-studio-resumes';
const ACTIVE_KEY = 'resume-studio-active';

function loadResumes(): Resume[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map((r: Resume) => {
      let sectionOrder = r.sectionOrder ?? DEFAULT_SECTION_ORDER.map(s => ({ ...s }));
      for (const def of DEFAULT_SECTION_ORDER) {
        if (!sectionOrder.find(s => s.id === def.id)) {
          sectionOrder = [...sectionOrder, { ...def }];
        }
      }
      return {
        ...r,
        references: r.references ?? [],
        sectionOrder,
        languages: r.languages ?? [],
        awards: r.awards ?? [],
        volunteer: r.volunteer ?? [],
        publications: r.publications ?? [],
        affiliations: r.affiliations ?? [],
        patents: r.patents ?? [],
        interests: r.interests ?? [],
      };
    });
  } catch {
    return [];
  }
}

function saveResumes(resumes: Resume[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(resumes));
}

function loadActiveId(): string | null {
  return localStorage.getItem(ACTIVE_KEY);
}

function saveActiveId(id: string | null) {
  if (id) localStorage.setItem(ACTIVE_KEY, id);
  else localStorage.removeItem(ACTIVE_KEY);
}

export function useResumeStore() {
  const [resumes, setResumes] = useState<Resume[]>(loadResumes);
  const [activeId, setActiveId] = useState<string | null>(loadActiveId);

  const activeResume = resumes.find((r) => r.id === activeId) ?? null;

  useEffect(() => {
    saveResumes(resumes);
  }, [resumes]);

  useEffect(() => {
    saveActiveId(activeId);
  }, [activeId]);

  const createResume = useCallback((base?: Partial<Resume>) => {
    const newResume: Resume = { ...createBlankResume(), ...base };
    setResumes((prev) => [...prev, newResume]);
    setActiveId(newResume.id);
    return newResume;
  }, []);

  const updateResume = useCallback((id: string, updates: Partial<Resume>) => {
    setResumes((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, ...updates, lastEdited: new Date().toISOString() } : r
      )
    );
  }, []);

  const duplicateResume = useCallback((id: string) => {
    const source = resumes.find((r) => r.id === id);
    if (!source) return;
    const dup: Resume = {
      ...source,
      id: crypto.randomUUID(),
      title: `Copy of ${source.title}`,
      lastEdited: new Date().toISOString(),
    };
    setResumes((prev) => [...prev, dup]);
    setActiveId(dup.id);
  }, [resumes]);

  const deleteResume = useCallback((id: string) => {
    setResumes((prev) => prev.filter((r) => r.id !== id));
    if (activeId === id) setActiveId(null);
  }, [activeId]);

  const setActive = useCallback((id: string) => {
    setActiveId(id);
  }, []);

  return {
    resumes,
    activeResume,
    activeId,
    createResume,
    updateResume,
    duplicateResume,
    deleteResume,
    setActive,
  };
}
