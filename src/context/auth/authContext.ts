import { IUser } from "@/types/auth";
import { createContext, Dispatch, SetStateAction } from "react";

export interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: IUser | null;
  setUser: Dispatch<SetStateAction<IUser | null>>;
  setIsAuthenticated: Dispatch<SetStateAction<boolean>>;
  login: (token: string) => void;
  logout: () => void;
}

const defaultUser: AuthContextType = {
  isAuthenticated: false,
  isLoading: true,
  setIsAuthenticated: () => {},
  user: null,
  setUser: () => {},
  login: () => {},
  logout: () => {},
};

// auth context
const AuthContext = createContext<AuthContextType>(defaultUser);

export default AuthContext;
