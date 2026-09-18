import {create} from "zustand";

const useStore = create(() => ({
  UImode : 'light',
})
)

export default useStore;