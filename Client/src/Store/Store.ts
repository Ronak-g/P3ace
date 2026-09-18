import {create} from "zustand";

interface StoreState {
  UImode: 'light' | 'dark';
  toggleUImode: () => void;
}

const useStore = create<StoreState>()((set) => ({
  UImode: 'light',
  toggleUImode: () => set((state) => ({
    UImode: state.UImode === 'light' ? 'dark' : 'light'
  })),
}));

export default useStore;