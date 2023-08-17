import type { StateCreator } from 'zustand';
import { persist } from 'zustand/middleware';

export const THEME_STORAGE_KEY = 'theme-storage';

export interface ThemeSlice {
  theme: 'light' | 'dark';
  setLight: () => void;
  setDark: () => void;
}

export const createThemeSlice: StateCreator<ThemeSlice, [], [['zustand/persist', ThemeSlice]]> =
  persist(
    (set) => ({
      theme: 'light',
      setLight: () => set({ theme: 'light' }),
      setDark: () => set({ theme: 'dark' }),
    }),
    {
      name: THEME_STORAGE_KEY,
    },
  );
