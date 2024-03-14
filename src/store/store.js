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

const useReviewListStore = create((set) => ({
  styleId: "",
  review: "",
  status: "pending",
  setStyleId: (styleId) => set({ styleId }),
  setReview: (review) => set({ review }),
  setStatus: (status) => set({ status }),
}));

export { useUserStore, useReviewListStore };
