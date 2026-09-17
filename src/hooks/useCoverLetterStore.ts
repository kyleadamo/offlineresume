import { useState, useCallback, useEffect } from 'react';
import { CoverLetter, createBlankCoverLetter } from '@/schema/coverLetter';

const STORAGE_KEY = 'localcv-cover-letters';
const ACTIVE_KEY = 'localcv-cover-letter-active';

function loadLetters(): CoverLetter[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveLetters(letters: CoverLetter[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(letters));
}

function loadActiveId(): string | null {
  return localStorage.getItem(ACTIVE_KEY);
}

function saveActiveId(id: string | null) {
  if (id) localStorage.setItem(ACTIVE_KEY, id);
  else localStorage.removeItem(ACTIVE_KEY);
}

export function useCoverLetterStore() {
  const [letters, setLetters] = useState<CoverLetter[]>(loadLetters);
  const [activeId, setActiveId] = useState<string | null>(loadActiveId);

  const activeLetter = letters.find((l) => l.id === activeId) ?? null;

  useEffect(() => { saveLetters(letters); }, [letters]);
  useEffect(() => { saveActiveId(activeId); }, [activeId]);

  const createLetter = useCallback((base?: Partial<CoverLetter>) => {
    const newLetter: CoverLetter = { ...createBlankCoverLetter(), ...base };
    setLetters((prev) => [...prev, newLetter]);
    setActiveId(newLetter.id);
    return newLetter;
  }, []);

  const updateLetter = useCallback((id: string, updates: Partial<CoverLetter>) => {
    setLetters((prev) =>
      prev.map((l) =>
        l.id === id ? { ...l, ...updates, lastEdited: new Date().toISOString() } : l
      )
    );
  }, []);

  const duplicateLetter = useCallback((id: string) => {
    const source = letters.find((l) => l.id === id);
    if (!source) return;
    const dup: CoverLetter = {
      ...source,
      id: crypto.randomUUID(),
      title: `${source.title} (Copy)`,
      lastEdited: new Date().toISOString(),
    };
    setLetters((prev) => [...prev, dup]);
    setActiveId(dup.id);
  }, [letters]);

  const deleteLetter = useCallback((id: string) => {
    setLetters((prev) => prev.filter((l) => l.id !== id));
    if (activeId === id) setActiveId(null);
  }, [activeId]);

  const setActive = useCallback((id: string) => {
    setActiveId(id);
  }, []);

  return {
    letters,
    activeLetter,
    activeId,
    createLetter,
    updateLetter,
    duplicateLetter,
    deleteLetter,
    setActive,
  };
}
