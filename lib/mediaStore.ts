'use client';

import { create } from 'zustand';

interface MediaState {
  activeMediaId: string | null;
  isSoundEnabled: boolean;
  userInteractedAudio: boolean;
  setActiveMedia: (id: string | null) => void;
  setSoundEnabled: (enabled: boolean) => void;
  toggleSound: () => void;
}

export const useMediaStore = create<MediaState>((set) => ({
  activeMediaId: null,
  isSoundEnabled: false,
  userInteractedAudio: false,
  setActiveMedia: (id) =>
    set(() => ({
      activeMediaId: id,
    })),
  setSoundEnabled: (enabled) => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('thiago_sound_enabled', enabled ? 'true' : 'false');
      } catch {}
    }
    set({ isSoundEnabled: enabled, userInteractedAudio: true });
  },
  toggleSound: () =>
    set((state) => {
      const next = !state.isSoundEnabled;
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('thiago_sound_enabled', next ? 'true' : 'false');
        } catch {}
      }
      return { isSoundEnabled: next, userInteractedAudio: true };
    }),
}));
