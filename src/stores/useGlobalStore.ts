import { create } from 'zustand';

type Store = {
  // States
  creating: boolean;
  setCreating: (creating: boolean) => void;
};

export const useGlobalStore = create<Store>((set) => ({
  creating: false,
  setCreating: (creating) => set(() => ({ creating }))
}));
