import { create } from "zustand";
import { UserType, UserStore, defaultUser } from "types/types";

const useUserStore = create<UserStore>((set) => ({
  identity: "unAuthorized",
  isLoggedIn: false,
  user: defaultUser,
  setIdentity: (identity: string) => set({ identity }),
  setIsLoggedIn: (isLoggedIn: boolean) =>
    set({
      isLoggedIn,
    }),
  setUser: (user: UserType) => set({ user }),
}));

const useReviewListStore = create((set) => ({
  styleId: "",
  review: "",
  status: "pending",
  setStyleId: (styleId: string) => set({ styleId }),
  setReview: (review: string) => set({ review }),
  setStatus: (status: string) => set({ status }),
}));

export { useUserStore, useReviewListStore };
