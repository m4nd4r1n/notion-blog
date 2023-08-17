import { create } from 'zustand';

import { type ThemeSlice, createThemeSlice } from './theme';

export const useBoundStore = create<ThemeSlice>()((...a) => ({
  ...createThemeSlice(...a),
}));
