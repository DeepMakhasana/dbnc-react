import { FC, ReactNode, useCallback, useEffect, useState } from "react";
import AuthContext from "./authContext";
import { jwtDecode } from "jwt-decode";
import { constants } from "@/lib/constants";
import { IUser } from "@/types/auth";

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);

  const authenticateUser = useCallback(() => {
    const token = getToken();
    if (token) {
      const decodedUser: IUser = jwtDecode(token);
      if (decodedUser.roles.includes("owner")) {
        setIsAuthenticated(true);
        setUser(decodedUser);
      }
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, []);

  const getToken = () => {
    return localStorage.getItem(constants.TOKEN);
  };

  const setToken = (value: string) => {
    return localStorage.setItem(constants.TOKEN, value);
  };

  const login = (token: string) => {
    if (token) {
      setIsAuthenticated(true);
      setToken(token);
      const decodedUser: IUser = jwtDecode(token);
      setUser(decodedUser);
    }
  };

  const logout = () => {
    setToken("");
    setIsAuthenticated(false);
    setUser(null);
  };

  useEffect(() => {
    authenticateUser();
  }, [authenticateUser]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, user, setUser, setIsAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
