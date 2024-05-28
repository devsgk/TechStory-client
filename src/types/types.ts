export interface UserType {
  _id: string;
  email: string;
  photoURL: string;
  displayName: string;
  refreshToken: string;
  authoredArticles: string[];
  reviewedArticles: string[];
}

export interface UserStore {
  identity: string;
  isLoggedIn: boolean;
  user: UserType | null;
  setIdentity: (identity: string) => void;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  setUser: (user: UserType) => void;
}

export const defaultUser: UserType = {
  _id: "",
  email: "",
  photoURL: "",
  displayName: "",
  refreshToken: "",
  authoredArticles: [],
  reviewedArticles: [],
};
