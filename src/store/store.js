import { create } from "zustand";

const useUserStore = create((set) => ({
  identity: "unAuthorized",
  isLoggedIn: false,
  user: {},
  setIdentity: (identity) => set({ identity }),
  setIsLoggedIn: (isLoggedIn) =>
    set({
      isLoggedIn,
    }),
  setUser: (user) => set({ user }),
}));

export default useUserStore;
